const FIREBASE_JWKS =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const MAX_PHOTO_BYTES = 100 * 1024;
const UPLOAD_COOLDOWN_MS = 5 * 60 * 1000;
let cachedKeys = { expiresAt: 0, keys: new Map() };

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const base64UrlBytes = (value) => {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const decodeJson = (value) => JSON.parse(new TextDecoder().decode(base64UrlBytes(value)));

function cacheMaxAge(header) {
  const match = /(?:^|,)\s*max-age=(\d+)/i.exec(header || '');
  return match ? Number(match[1]) : 3600;
}

async function getVerificationKey(kid) {
  if (cachedKeys.expiresAt <= Date.now() || !cachedKeys.keys.has(kid)) {
    const response = await fetch(FIREBASE_JWKS);
    if (!response.ok) throw new HttpError(503, 'Unable to load authentication keys.');
    const body = await response.json();
    cachedKeys = {
      expiresAt: Date.now() + cacheMaxAge(response.headers.get('cache-control')) * 1000,
      keys: new Map(body.keys.map((key) => [key.kid, key])),
    };
  }
  const jwk = cachedKeys.keys.get(kid);
  if (!jwk) throw new HttpError(401, 'Unknown authentication key.');
  return crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );
}

async function verifyFirebaseToken(request, projectId) {
  const authorization = request.headers.get('authorization') || '';
  if (!authorization.startsWith('Bearer ')) throw new HttpError(401, 'Authentication required.');
  const token = authorization.slice(7);
  const parts = token.split('.');
  if (parts.length !== 3) throw new HttpError(401, 'Invalid authentication token.');
  let header;
  let claims;
  try {
    header = decodeJson(parts[0]);
    claims = decodeJson(parts[1]);
  } catch {
    throw new HttpError(401, 'Invalid authentication token.');
  }
  const now = Math.floor(Date.now() / 1000);
  if (
    header.alg !== 'RS256' ||
    !header.kid ||
    claims.aud !== projectId ||
    claims.iss !== `https://securetoken.google.com/${projectId}` ||
    typeof claims.sub !== 'string' ||
    !claims.sub ||
    claims.exp <= now ||
    claims.iat > now ||
    claims.auth_time > now
  ) {
    throw new HttpError(401, 'Invalid authentication claims.');
  }
  const key = await getVerificationKey(header.kid);
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    base64UrlBytes(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
  );
  if (!valid) throw new HttpError(401, 'Invalid authentication signature.');
  return { uid: claims.sub, token };
}

const documentName = (env, path) =>
  `projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${path}`;
const documentUrl = (env, path) => `https://firestore.googleapis.com/v1/${documentName(env, path)}`;

async function firestoreGet(env, token, path, optional = false) {
  const response = await fetch(documentUrl(env, path), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 404 && optional) return null;
  if (response.status === 401) throw new HttpError(401, 'Authentication expired.');
  if (response.status === 403) throw new HttpError(403, 'Not authorized.');
  if (!response.ok) throw new HttpError(502, 'Member data is temporarily unavailable.');
  return response.json();
}

const value = (input) => {
  if (input === null) return { nullValue: null };
  if (typeof input === 'string') return { stringValue: input };
  if (typeof input === 'boolean') return { booleanValue: input };
  if (input instanceof Date) return { timestampValue: input.toISOString() };
  throw new Error('Unsupported Firestore value.');
};
const fields = (data) =>
  Object.fromEntries(
    Object.entries(data)
      .filter(([, item]) => item !== undefined)
      .map(([key, item]) => [key, value(item)])
  );
const readString = (document, key) => document?.fields?.[key]?.stringValue || '';
const readTimestamp = (document, key) => document?.fields?.[key]?.timestampValue || '';

async function firestoreCommit(env, token, writes) {
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents:commit`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ writes }),
    }
  );
  if (response.status === 401) throw new HttpError(401, 'Authentication expired.');
  if (response.status === 403) throw new HttpError(403, 'Not authorized.');
  if (!response.ok) throw new HttpError(502, 'Unable to save photo metadata.');
}

const updateWrite = (env, path, data) => ({
  update: { name: documentName(env, path), fields: fields(data) },
});
const deleteWrite = (env, path) => ({ delete: documentName(env, path) });

function createAuditWrite(env, actor, action, targetId, summary) {
  const id = crypto.randomUUID();
  return {
    id,
    write: updateWrite(env, `auditLogs/${id}`, {
      actorUid: actor.uid,
      actorDisplayName: actor.displayName,
      action,
      entityType: 'avatar',
      targetId,
      summary,
      createdAt: new Date(),
    }),
  };
}

async function requireAccess(env, identity, approved = true) {
  const document = await firestoreGet(env, identity.token, `memberAccess/${identity.uid}`);
  const status = readString(document, 'status');
  if (approved && status !== 'approved')
    throw new HttpError(403, 'Approved member access required.');
  return {
    uid: identity.uid,
    displayName: readString(document, 'displayName'),
    role: readString(document, 'role'),
    status,
  };
}

async function requireAdmin(env, identity) {
  const access = await requireAccess(env, identity, true);
  if (access.role !== 'admin') throw new HttpError(403, 'Portal administrator access required.');
  return access;
}

async function readPhoto(formData) {
  const photo = formData.get('photo');
  if (!(photo instanceof File)) throw new HttpError(400, 'A photo file is required.');
  if (!['image/webp', 'image/jpeg'].includes(photo.type))
    throw new HttpError(415, 'Only processed WebP or JPEG avatars are accepted.');
  if (photo.size <= 0 || photo.size > MAX_PHOTO_BYTES) {
    throw new HttpError(413, 'Avatar files must be no larger than 100 KB.');
  }
  return photo;
}

function metadata(document) {
  return {
    pendingKey: readString(document, 'pendingKey'),
    approvedKey: readString(document, 'approvedKey'),
    updatedAt: readTimestamp(document, 'updatedAt'),
  };
}

async function uploadPending(request, env, identity) {
  const actor = await requireAccess(env, identity, true);
  const existingDocument = await firestoreGet(
    env,
    identity.token,
    `avatarMetadata/${identity.uid}`,
    true
  );
  const existing = metadata(existingDocument);
  if (
    existing.updatedAt &&
    Date.now() - new Date(existing.updatedAt).getTime() < UPLOAD_COOLDOWN_MS
  ) {
    throw new HttpError(429, 'Please wait five minutes before uploading another photo.');
  }
  const photo = await readPhoto(await request.formData());
  const extension = photo.type === 'image/webp' ? 'webp' : 'jpg';
  const key = `avatars/${identity.uid}/${crypto.randomUUID()}.${extension}`;
  const audit = createAuditWrite(
    env,
    actor,
    'avatar.uploaded',
    identity.uid,
    'Profile photo submitted for review'
  );
  await env.photoBucket.put(key, photo.stream(), {
    httpMetadata: { contentType: photo.type },
    customMetadata: { ownerUid: identity.uid, state: 'pending' },
  });
  try {
    await firestoreCommit(env, identity.token, [
      updateWrite(env, `avatarMetadata/${identity.uid}`, {
        uid: identity.uid,
        status: 'pending',
        pendingKey: key,
        approvedKey: existing.approvedKey || undefined,
        uploadedBy: identity.uid,
        updatedAt: new Date(),
        lastAuditId: audit.id,
      }),
      audit.write,
    ]);
  } catch (error) {
    await env.photoBucket.delete(key);
    throw error;
  }
  if (existing.pendingKey && existing.pendingKey !== key)
    await env.photoBucket.delete(existing.pendingKey);
  return json({ status: 'pending' }, 201);
}

async function readAvatar(request, env, identity, uid) {
  const actor = await requireAccess(env, identity, true);
  const variant = new URL(request.url).searchParams.get('variant') || 'approved';
  let key = '';
  if (variant === 'pending') {
    if (uid !== identity.uid && actor.role !== 'admin') throw new HttpError(403, 'Not authorized.');
    key = readString(
      await firestoreGet(env, identity.token, `avatarMetadata/${uid}`),
      'pendingKey'
    );
  } else if (uid === identity.uid || actor.role === 'admin') {
    key = readString(
      await firestoreGet(env, identity.token, `avatarMetadata/${uid}`),
      'approvedKey'
    );
  } else {
    key = readString(
      await firestoreGet(env, identity.token, `avatarDirectory/${uid}`),
      'approvedKey'
    );
  }
  if (!key) throw new HttpError(404, 'Photo not found.');
  const object = await env.photoBucket.get(key);
  if (!object) throw new HttpError(404, 'Photo not found.');
  const headers = new Headers({
    'Content-Type': object.httpMetadata?.contentType || 'image/webp',
    'Cache-Control': variant === 'pending' ? 'private, max-age=120' : 'private, max-age=21600',
    ETag: object.httpEtag,
  });
  return new Response(object.body, { headers });
}

async function removeAvatar(env, identity, uid, adminAction) {
  const actor = adminAction
    ? await requireAdmin(env, identity)
    : await requireAccess(env, identity, false);
  if (!adminAction && uid !== identity.uid) throw new HttpError(403, 'Not authorized.');
  const document = await firestoreGet(env, identity.token, `avatarMetadata/${uid}`, true);
  if (!document) return new Response(null, { status: 204 });
  const existing = metadata(document);
  const audit = createAuditWrite(
    env,
    actor,
    adminAction ? 'avatar.adminRemoved' : 'avatar.removed',
    uid,
    'Profile photo removed'
  );
  await firestoreCommit(env, identity.token, [
    deleteWrite(env, `avatarMetadata/${uid}`),
    deleteWrite(env, `avatarDirectory/${uid}`),
    audit.write,
  ]);
  await Promise.all(
    [existing.pendingKey, existing.approvedKey]
      .filter(Boolean)
      .map((key) => env.photoBucket.delete(key))
  );
  return new Response(null, { status: 204 });
}

async function moderate(env, identity, uid, decision) {
  const actor = await requireAdmin(env, identity);
  const document = await firestoreGet(env, identity.token, `avatarMetadata/${uid}`);
  const existing = metadata(document);
  if (!existing.pendingKey) throw new HttpError(409, 'No pending photo exists.');
  const now = new Date();
  const audit = createAuditWrite(
    env,
    actor,
    `avatar.${decision}d`,
    uid,
    `Profile photo ${decision}d`
  );
  const writes = [];
  if (decision === 'approve') {
    writes.push(
      updateWrite(env, `avatarMetadata/${uid}`, {
        uid,
        status: 'approved',
        approvedKey: existing.pendingKey,
        approvedBy: identity.uid,
        approvedAt: now,
        updatedAt: now,
        lastAuditId: audit.id,
      }),
      updateWrite(env, `avatarDirectory/${uid}`, {
        uid,
        approvedKey: existing.pendingKey,
        approvedAt: now,
        lastAuditId: audit.id,
      })
    );
  } else {
    writes.push(
      updateWrite(env, `avatarMetadata/${uid}`, {
        uid,
        status: existing.approvedKey ? 'approved' : 'rejected',
        approvedKey: existing.approvedKey || undefined,
        rejectedBy: identity.uid,
        rejectedAt: now,
        updatedAt: now,
        lastAuditId: audit.id,
      })
    );
  }
  writes.push(audit.write);
  await firestoreCommit(env, identity.token, writes);
  if (
    decision === 'approve' &&
    existing.approvedKey &&
    existing.approvedKey !== existing.pendingKey
  ) {
    await env.photoBucket.delete(existing.approvedKey);
  }
  if (decision === 'reject') await env.photoBucket.delete(existing.pendingKey);
  return json({ status: decision === 'approve' ? 'approved' : 'rejected' });
}

async function adminUpload(request, env, identity, uid) {
  const actor = await requireAdmin(env, identity);
  const form = await request.formData();
  if (form.get('consentConfirmed') !== 'true')
    throw new HttpError(400, 'Member consent confirmation is required.');
  const photo = await readPhoto(form);
  await firestoreGet(env, identity.token, `memberAccess/${uid}`);
  const existing = metadata(await firestoreGet(env, identity.token, `avatarMetadata/${uid}`, true));
  const extension = photo.type === 'image/webp' ? 'webp' : 'jpg';
  const key = `avatars/${uid}/${crypto.randomUUID()}.${extension}`;
  const audit = createAuditWrite(
    env,
    actor,
    'avatar.adminUploaded',
    uid,
    'Administrator uploaded a member-consented photo'
  );
  await env.photoBucket.put(key, photo.stream(), {
    httpMetadata: { contentType: photo.type },
    customMetadata: { ownerUid: uid, state: 'approved', uploadedBy: identity.uid },
  });
  const now = new Date();
  try {
    await firestoreCommit(env, identity.token, [
      updateWrite(env, `avatarMetadata/${uid}`, {
        uid,
        status: 'approved',
        approvedKey: key,
        uploadedBy: identity.uid,
        approvedBy: identity.uid,
        approvedAt: now,
        consentConfirmed: true,
        updatedAt: now,
        lastAuditId: audit.id,
      }),
      updateWrite(env, `avatarDirectory/${uid}`, {
        uid,
        approvedKey: key,
        approvedAt: now,
        lastAuditId: audit.id,
      }),
      audit.write,
    ]);
  } catch (error) {
    await env.photoBucket.delete(key);
    throw error;
  }
  await Promise.all(
    [existing.pendingKey, existing.approvedKey]
      .filter(Boolean)
      .map((oldKey) => env.photoBucket.delete(oldKey))
  );
  return json({ status: 'approved' }, 201);
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

function withCors(response, origin) {
  if (!origin) return response;
  const next = new Response(response.body, response);
  next.headers.set('Access-Control-Allow-Origin', origin);
  next.headers.set('Vary', 'Origin');
  return next;
}

function validateOrigin(request, env) {
  const origin = request.headers.get('origin');
  if (!origin) return '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((item) => item.trim());
  if (!allowed.includes(origin)) throw new HttpError(403, 'Origin not allowed.');
  return origin;
}

async function route(request, env) {
  const url = new URL(request.url);
  if ((url.pathname === '/' || url.pathname === '/health') && request.method === 'GET') {
    return json({ ok: true, service: 'fccphotos' });
  }
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization,Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  const identity = await verifyFirebaseToken(request, env.FIREBASE_PROJECT_ID);
  if (url.pathname === '/v1/avatars/me' && request.method === 'PUT')
    return uploadPending(request, env, identity);
  if (url.pathname === '/v1/avatars/me' && request.method === 'DELETE')
    return removeAvatar(env, identity, identity.uid, false);
  const avatarMatch = /^\/v1\/avatars\/([^/]+)$/.exec(url.pathname);
  if (avatarMatch && request.method === 'GET')
    return readAvatar(request, env, identity, decodeURIComponent(avatarMatch[1]));
  const moderationMatch = /^\/v1\/admin\/avatars\/([^/]+)\/(approve|reject)$/.exec(url.pathname);
  if (moderationMatch && request.method === 'POST')
    return moderate(env, identity, decodeURIComponent(moderationMatch[1]), moderationMatch[2]);
  const adminMatch = /^\/v1\/admin\/avatars\/([^/]+)$/.exec(url.pathname);
  if (adminMatch && request.method === 'PUT')
    return adminUpload(request, env, identity, decodeURIComponent(adminMatch[1]));
  if (adminMatch && request.method === 'DELETE')
    return removeAvatar(env, identity, decodeURIComponent(adminMatch[1]), true);
  throw new HttpError(404, 'Route not found.');
}

export async function handleRequest(request, env) {
  let origin = '';
  try {
    origin = validateOrigin(request, env);
    return withCors(await route(request, env), origin);
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof HttpError ? error.message : 'Unexpected photo service error.';
    return withCors(json({ error: message }, status), origin);
  }
}

export default { fetch: handleRequest };

export const __testing = { base64UrlBytes, decodeJson, cacheMaxAge, validateOrigin };
