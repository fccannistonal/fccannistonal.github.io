import { registerPrivateCacheClearer } from './memberPortalCache';
import {
  getCurrentMemberUid,
  getMemberIdToken,
  invalidateMemberPortalReads,
} from './memberPortalFirebase';

const workerUrl = (import.meta.env.VITE_photoBucket_WORKER_URL ?? '').replace(/\/$/, '');
const avatarUrls = new Map<string, { url: string | null; expiresAt: number }>();
const AVATAR_CACHE_NAME = 'fccanniston-member-avatars-v1';
const APPROVED_AVATAR_TTL = 6 * 60 * 60_000;
const PENDING_AVATAR_TTL = 2 * 60_000;

class PhotoRequestError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

export function isPhotoWorkerConfigured() {
  return workerUrl.length > 0;
}

async function authorizedFetch(path: string, init: RequestInit = {}) {
  if (!workerUrl) {
    throw new Error('The profile photo service is not configured.');
  }
  const token = await getMemberIdToken();
  const response = await fetch(`${workerUrl}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...init.headers },
  });
  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new PhotoRequestError(
      message || `Photo request failed (${response.status}).`,
      response.status
    );
  }
  return response;
}

export async function prepareAvatar(file: File) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Choose a JPEG, PNG, or WebP image.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Choose an image smaller than 5 MB.');
  }

  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  if (bitmap.width * bitmap.height > 24_000_000) {
    bitmap.close();
    throw new Error('This image is too large to process safely.');
  }
  const size = Math.min(bitmap.width, bitmap.height);
  const sourceX = Math.floor((bitmap.width - size) / 2);
  const sourceY = Math.floor((bitmap.height - size) / 2);
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Image processing is unavailable in this browser.');
  }
  context.drawImage(bitmap, sourceX, sourceY, size, size, 0, 0, 256, 256);
  bitmap.close();

  let quality = 0.82;
  let blob: Blob | null = null;
  while (quality >= 0.45) {
    blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    if (blob && blob.size <= 100 * 1024) {
      break;
    }
    quality -= 0.08;
  }
  if (!blob || blob.type !== 'image/webp' || blob.size > 100 * 1024) {
    throw new Error('The cropped image could not be reduced below 100 KB.');
  }
  return new File([blob], 'avatar.webp', { type: 'image/webp' });
}

export async function fetchAvatar(uid: string, variant: 'approved' | 'pending' = 'approved') {
  const viewerUid = getCurrentMemberUid();
  const memoryKey = `${viewerUid}:${uid}:${variant}`;
  const ttl = variant === 'pending' ? PENDING_AVATAR_TTL : APPROVED_AVATAR_TTL;
  const memory = avatarUrls.get(memoryKey);
  if (memory && memory.expiresAt > Date.now()) {
    return memory.url;
  }
  if (memory?.url) {
    URL.revokeObjectURL(memory.url);
  }
  avatarUrls.delete(memoryKey);
  const persistentKey = new Request(
    `https://member-cache.fccanniston.invalid/avatar/${encodeURIComponent(viewerUid)}/${encodeURIComponent(uid)}/${variant}`
  );
  const cache = typeof caches === 'undefined' ? null : await caches.open(AVATAR_CACHE_NAME);
  const cached = await cache?.match(persistentKey);
  const storedAt = Number(cached?.headers.get('x-fcc-cache-stored-at') ?? 0);
  if (cached && storedAt > Date.now() - ttl) {
    if (cached.status === 404) {
      avatarUrls.set(memoryKey, { url: null, expiresAt: storedAt + ttl });
      return null;
    }
    const url = URL.createObjectURL(await cached.blob());
    avatarUrls.set(memoryKey, { url, expiresAt: storedAt + ttl });
    return url;
  }
  try {
    const response = await authorizedFetch(
      `/v1/avatars/${encodeURIComponent(uid)}?variant=${variant}`
    );
    const blob = await response.blob();
    await cache?.put(
      persistentKey,
      new Response(blob, {
        headers: {
          'Content-Type': blob.type || 'image/webp',
          'x-fcc-cache-stored-at': String(Date.now()),
        },
      })
    );
    const url = URL.createObjectURL(blob);
    avatarUrls.set(memoryKey, { url, expiresAt: Date.now() + ttl });
    return url;
  } catch (error) {
    if (error instanceof PhotoRequestError && error.status === 404) {
      const storedAt = Date.now();
      await cache?.put(
        persistentKey,
        new Response('', {
          status: 404,
          headers: { 'x-fcc-cache-stored-at': String(storedAt) },
        })
      );
      avatarUrls.set(memoryKey, { url: null, expiresAt: storedAt + ttl });
    }
    return null;
  }
}

function avatarForm(file: File, consentConfirmed = false) {
  const form = new FormData();
  form.set('photo', file);
  if (consentConfirmed) {
    form.set('consentConfirmed', 'true');
  }
  return form;
}

export async function uploadMyAvatar(file: File) {
  await authorizedFetch('/v1/avatars/me', { method: 'PUT', body: avatarForm(file) });
  await clearAvatarCache();
  invalidateMemberPortalReads(['admin:', 'audit:']);
}

export async function deleteMyAvatar() {
  await authorizedFetch('/v1/avatars/me', { method: 'DELETE' });
  await clearAvatarCache();
  invalidateMemberPortalReads(['admin:', 'audit:']);
}

export async function moderateAvatar(uid: string, decision: 'approve' | 'reject') {
  await authorizedFetch(`/v1/admin/avatars/${encodeURIComponent(uid)}/${decision}`, {
    method: 'POST',
  });
  await clearAvatarCache();
  invalidateMemberPortalReads(['admin:', 'audit:']);
}

export async function uploadMemberAvatar(uid: string, file: File) {
  await authorizedFetch(`/v1/admin/avatars/${encodeURIComponent(uid)}`, {
    method: 'PUT',
    body: avatarForm(file, true),
  });
  await clearAvatarCache();
  invalidateMemberPortalReads(['admin:', 'audit:']);
}

export async function removeMemberAvatar(uid: string) {
  await authorizedFetch(`/v1/admin/avatars/${encodeURIComponent(uid)}`, { method: 'DELETE' });
  await clearAvatarCache();
  invalidateMemberPortalReads(['admin:', 'audit:']);
}

export async function clearAvatarCache() {
  avatarUrls.forEach(({ url }) => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  });
  avatarUrls.clear();
  if (typeof caches !== 'undefined') {
    await caches.delete(AVATAR_CACHE_NAME);
  }
}

registerPrivateCacheClearer(clearAvatarCache);
