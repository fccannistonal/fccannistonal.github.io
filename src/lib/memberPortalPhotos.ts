import { getMemberIdToken } from './memberPortalFirebase';

const workerUrl = (import.meta.env.VITE_photoBucket_WORKER_URL ?? '').replace(/\/$/, '');
const avatarUrls = new Map<string, string | null>();

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
    throw new Error(message || `Photo request failed (${response.status}).`);
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
  const key = `${uid}:${variant}`;
  if (avatarUrls.has(key)) {
    return avatarUrls.get(key) ?? null;
  }
  try {
    const response = await authorizedFetch(
      `/v1/avatars/${encodeURIComponent(uid)}?variant=${variant}`
    );
    const url = URL.createObjectURL(await response.blob());
    avatarUrls.set(key, url);
    return url;
  } catch {
    avatarUrls.set(key, null);
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
  clearAvatarCache();
}

export async function deleteMyAvatar() {
  await authorizedFetch('/v1/avatars/me', { method: 'DELETE' });
  clearAvatarCache();
}

export async function moderateAvatar(uid: string, decision: 'approve' | 'reject') {
  await authorizedFetch(`/v1/admin/avatars/${encodeURIComponent(uid)}/${decision}`, {
    method: 'POST',
  });
  clearAvatarCache();
}

export async function uploadMemberAvatar(uid: string, file: File) {
  await authorizedFetch(`/v1/admin/avatars/${encodeURIComponent(uid)}`, {
    method: 'PUT',
    body: avatarForm(file, true),
  });
  clearAvatarCache();
}

export async function removeMemberAvatar(uid: string) {
  await authorizedFetch(`/v1/admin/avatars/${encodeURIComponent(uid)}`, { method: 'DELETE' });
  clearAvatarCache();
}

export function clearAvatarCache() {
  avatarUrls.forEach((url) => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  });
  avatarUrls.clear();
}
