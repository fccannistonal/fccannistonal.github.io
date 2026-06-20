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
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;
const MAX_SOURCE_PIXELS = 48_000_000;
const MAX_AVATAR_BYTES = 100 * 1024;
const AVATAR_SIZE = 256;

export type AvatarPosition = { x: number; y: number };

export type AvatarSource = {
  blob: Blob;
  height: number;
  url: string;
  width: number;
};

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

function isHeicFile(file: File) {
  return (
    ['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence'].includes(
      file.type.toLowerCase()
    ) || /\.(?:heic|heif)$/i.test(file.name)
  );
}

function isStandardImageFile(file: File) {
  return (
    ['image/jpeg', 'image/png', 'image/webp'].includes(file.type.toLowerCase()) ||
    /\.(?:jpe?g|png|webp)$/i.test(file.name)
  );
}

function loadImage(blob: Blob) {
  return new Promise<{ image: HTMLImageElement; url: string }>((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => resolve({ image, url });
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('This photo could not be opened in your browser.'));
    };
    image.src = url;
  });
}

export async function createAvatarSource(file: File): Promise<AvatarSource> {
  if (file.size <= 0 || file.size > MAX_SOURCE_BYTES) {
    throw new Error('Choose a photo smaller than 25 MB.');
  }

  let blob: Blob = file;
  if (isHeicFile(file)) {
    try {
      const { heicTo } = await import('heic-to/csp');
      blob = await heicTo({ blob: file, type: 'image/jpeg', quality: 0.92 });
    } catch {
      throw new Error('This HEIC photo could not be opened. Try exporting it as a JPEG.');
    }
  } else if (!isStandardImageFile(file)) {
    throw new Error('Choose a JPEG, PNG, WebP, HEIC, or HEIF photo.');
  }

  const { image, url } = await loadImage(blob);
  if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
    URL.revokeObjectURL(url);
    throw new Error('This photo does not contain a usable image.');
  }
  if (image.naturalWidth * image.naturalHeight > MAX_SOURCE_PIXELS) {
    URL.revokeObjectURL(url);
    throw new Error('This photo is too large to process safely.');
  }

  return { blob, height: image.naturalHeight, url, width: image.naturalWidth };
}

export function releaseAvatarSource(source: AvatarSource | null) {
  if (source) {
    URL.revokeObjectURL(source.url);
  }
}

export function getAvatarCrop(width: number, height: number, position: AvatarPosition) {
  const size = Math.min(width, height);
  const x = Math.max(0, Math.min(100, position.x)) / 100;
  const y = Math.max(0, Math.min(100, position.y)) / 100;
  return {
    size,
    sourceX: Math.round((width - size) * x),
    sourceY: Math.round((height - size) * y),
  };
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

export async function prepareAvatar(source: Blob, position: AvatarPosition = { x: 50, y: 50 }) {
  const { image, url } = await loadImage(source);
  const { size, sourceX, sourceY } = getAvatarCrop(
    image.naturalWidth,
    image.naturalHeight,
    position
  );
  const canvas = document.createElement('canvas');
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  const context = canvas.getContext('2d');
  if (!context) {
    URL.revokeObjectURL(url);
    throw new Error('Image processing is unavailable in this browser.');
  }
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
  context.drawImage(image, sourceX, sourceY, size, size, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
  URL.revokeObjectURL(url);

  let quality = 0.82;
  let blob: Blob | null = null;
  while (quality >= 0.45) {
    blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    if (blob?.type === 'image/webp' && blob.size <= MAX_AVATAR_BYTES) {
      break;
    }
    quality -= 0.08;
  }

  if (!blob || blob.type !== 'image/webp' || blob.size > MAX_AVATAR_BYTES) {
    quality = 0.82;
    while (quality >= 0.37) {
      blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
      if (blob?.type === 'image/jpeg' && blob.size <= MAX_AVATAR_BYTES) {
        break;
      }
      quality -= 0.08;
    }
  }

  if (!blob || !['image/webp', 'image/jpeg'].includes(blob.type) || blob.size > MAX_AVATAR_BYTES) {
    throw new Error('The cropped photo could not be reduced below 100 KB.');
  }
  return new File([blob], blob.type === 'image/webp' ? 'avatar.webp' : 'avatar.jpg', {
    type: blob.type,
  });
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
