// @vitest-environment node
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleRequest } from './index.js';

const encoder = new TextEncoder();
let privateKey;
let publicJwk;

const base64Url = (input) => {
  const bytes = typeof input === 'string' ? encoder.encode(input) : new Uint8Array(input);
  return Buffer.from(bytes).toString('base64url');
};

async function token(uid, expiresIn = 3600) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', kid: 'test-key', typ: 'JWT' }));
  const payload = base64Url(
    JSON.stringify({
      aud: 'fcc-anniston-members',
      iss: 'https://securetoken.google.com/fcc-anniston-members',
      sub: uid,
      exp: now + expiresIn,
      iat: now - 10,
      auth_time: now - 10,
    })
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    encoder.encode(`${header}.${payload}`)
  );
  return `${header}.${payload}.${base64Url(signature)}`;
}

function firestoreDocument(data) {
  return {
    fields: Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value instanceof Date ? { timestampValue: value.toISOString() } : { stringValue: value },
      ])
    ),
  };
}

function createEnv() {
  const objects = new Map([
    ['avatars/target/approved.webp', new Blob(['approved'], { type: 'image/webp' })],
    ['avatars/target/pending.webp', new Blob(['pending'], { type: 'image/webp' })],
  ]);
  return {
    FIREBASE_PROJECT_ID: 'fcc-anniston-members',
    ALLOWED_ORIGINS: 'https://fccanniston.com',
    photoBucket: {
      async put(key, body) {
        objects.set(key, await new Response(body).blob());
      },
      async get(key) {
        const body = objects.get(key);
        return body
          ? { body: body.stream(), httpMetadata: { contentType: 'image/webp' }, httpEtag: '"etag"' }
          : null;
      },
      async delete(key) {
        objects.delete(key);
      },
      objects,
    },
  };
}

beforeAll(async () => {
  const keys = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify']
  );
  privateKey = keys.privateKey;
  publicJwk = {
    ...(await crypto.subtle.exportKey('jwk', keys.publicKey)),
    kid: 'test-key',
    alg: 'RS256',
    use: 'sig',
  };
});

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input) => {
      const url = String(input);
      if (url.includes('/service_accounts/v1/jwk/')) {
        return new Response(JSON.stringify({ keys: [publicJwk] }), {
          headers: { 'cache-control': 'max-age=3600' },
        });
      }
      if (url.includes('memberAccess/admin'))
        return Response.json(
          firestoreDocument({ status: 'approved', role: 'admin', displayName: 'Admin' })
        );
      if (url.includes('memberAccess/member'))
        return Response.json(
          firestoreDocument({ status: 'approved', role: 'member', displayName: 'Member' })
        );
      if (url.includes('avatarDirectory/target'))
        return Response.json(firestoreDocument({ approvedKey: 'avatars/target/approved.webp' }));
      if (url.includes('avatarMetadata/target'))
        return Response.json(
          firestoreDocument({
            pendingKey: 'avatars/target/pending.webp',
            approvedKey: 'avatars/target/approved.webp',
          })
        );
      if (url.endsWith('documents:commit')) return Response.json({ writeResults: [] });
      return new Response('Not found', { status: 404 });
    })
  );
});

describe('fccphotos worker', () => {
  it('exposes only health without authentication and applies exact CORS', async () => {
    const response = await handleRequest(
      new Request('https://worker.test/health', {
        headers: { Origin: 'https://fccanniston.com' },
      }),
      createEnv()
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('access-control-allow-origin')).toBe('https://fccanniston.com');

    const protectedResponse = await handleRequest(
      new Request('https://worker.test/v1/avatars/member'),
      createEnv()
    );
    expect(protectedResponse.status).toBe(401);
  });

  it('rejects unapproved origins before processing a token', async () => {
    const response = await handleRequest(
      new Request('https://worker.test/health', {
        headers: { Origin: 'https://evil.example' },
      }),
      createEnv()
    );
    expect(response.status).toBe(403);
  });

  it('allows approved members to read only approved cross-user photos', async () => {
    const authorization = `Bearer ${await token('member')}`;
    const approved = await handleRequest(
      new Request('https://worker.test/v1/avatars/target', {
        headers: { authorization },
      }),
      createEnv()
    );
    expect(approved.status).toBe(200);
    expect(await approved.text()).toBe('approved');

    const pending = await handleRequest(
      new Request('https://worker.test/v1/avatars/target?variant=pending', {
        headers: { authorization },
      }),
      createEnv()
    );
    expect(pending.status).toBe(403);
  });

  it('enforces processed WebP and the admin role', async () => {
    const form = new FormData();
    form.set('photo', new File(['png'], 'avatar.png', { type: 'image/png' }));
    const invalidUpload = await handleRequest(
      new Request('https://worker.test/v1/avatars/me', {
        method: 'PUT',
        headers: { authorization: `Bearer ${await token('member')}` },
        body: form,
      }),
      createEnv()
    );
    expect(invalidUpload.status).toBe(415);

    const moderation = await handleRequest(
      new Request('https://worker.test/v1/admin/avatars/target/approve', {
        method: 'POST',
        headers: { authorization: `Bearer ${await token('member')}` },
      }),
      createEnv()
    );
    expect(moderation.status).toBe(403);
  });

  it('lets admins approve pending photos and cleans the previous object', async () => {
    const env = createEnv();
    const response = await handleRequest(
      new Request('https://worker.test/v1/admin/avatars/target/approve', {
        method: 'POST',
        headers: { authorization: `Bearer ${await token('admin')}` },
      }),
      env
    );
    expect(response.status).toBe(200);
    expect(env.photoBucket.objects.has('avatars/target/approved.webp')).toBe(false);
  });
});
