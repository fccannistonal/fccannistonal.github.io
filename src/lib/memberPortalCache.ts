const CACHE_VERSION = 1;
const CACHE_PREFIX = `fccanniston.member-cache.v${CACHE_VERSION}`;
const MAX_ENTRIES = 80;
const MAX_ENTRY_BYTES = 300_000;

type CacheRecord = {
  storedAt: number;
  expiresAt: number;
  value: unknown;
};

const memoryCache = new Map<string, CacheRecord>();
const pendingLoads = new Map<string, Promise<unknown>>();
const privateCacheClearers = new Set<() => void | Promise<void>>();

function storageKey(uid: string, key: string) {
  return `${CACHE_PREFIX}:${uid}:${key}`;
}

function encode(value: unknown): unknown {
  if (value instanceof Date) {
    return { __fccDate: value.toISOString() };
  }
  if (Array.isArray(value)) {
    return value.map(encode);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, encode(item)])
    );
  }
  return value;
}

function decode(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(decode);
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (typeof record.__fccDate === 'string') {
      return new Date(record.__fccDate);
    }
    return Object.fromEntries(Object.entries(record).map(([key, item]) => [key, decode(item)]));
  }
  return value;
}

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function removeKey(key: string) {
  memoryCache.delete(key);
  getStorage()?.removeItem(key);
}

function readRecord(key: string, allowExpired = false) {
  const now = Date.now();
  const memory = memoryCache.get(key);
  if (memory) {
    if (allowExpired || memory.expiresAt > now) {
      return memory;
    }
  }

  const raw = getStorage()?.getItem(key);
  if (!raw) {
    memoryCache.delete(key);
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as CacheRecord;
    const record = { ...parsed, value: decode(parsed.value) };
    if (!allowExpired && record.expiresAt <= now) {
      removeKey(key);
      return null;
    }
    memoryCache.set(key, record);
    return record;
  } catch {
    removeKey(key);
    return null;
  }
}

function pruneStorage() {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  const entries: Array<{ key: string; storedAt: number }> = [];
  const now = Date.now();
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key?.startsWith(`${CACHE_PREFIX}:`)) {
      continue;
    }
    try {
      const record = JSON.parse(storage.getItem(key) ?? '') as CacheRecord;
      if (record.expiresAt <= now - 24 * 60 * 60 * 1000) {
        removeKey(key);
      } else {
        entries.push({ key, storedAt: record.storedAt });
      }
    } catch {
      removeKey(key);
    }
  }
  entries
    .sort((left, right) => right.storedAt - left.storedAt)
    .slice(MAX_ENTRIES)
    .forEach((entry) => removeKey(entry.key));
}

export function readPortalCache<T>(uid: string, key: string) {
  return (readRecord(storageKey(uid, key))?.value as T | undefined) ?? null;
}

export function writePortalCache<T>(uid: string, key: string, value: T, ttlMs: number) {
  const fullKey = storageKey(uid, key);
  const now = Date.now();
  const record: CacheRecord = { storedAt: now, expiresAt: now + ttlMs, value };
  memoryCache.set(fullKey, record);
  const storage = getStorage();
  if (!storage) {
    return;
  }
  try {
    const serialized = JSON.stringify({ ...record, value: encode(value) });
    if (serialized.length <= MAX_ENTRY_BYTES) {
      storage.setItem(fullKey, serialized);
      pruneStorage();
    }
  } catch {
    // A full or disabled storage area should not prevent portal use.
  }
}

export async function getOrLoadPortalCache<T>(
  uid: string,
  key: string,
  ttlMs: number,
  loader: () => Promise<T>,
  forceRefresh = false,
  staleIfErrorMs = 24 * 60 * 60_000
) {
  const fullKey = storageKey(uid, key);
  if (!forceRefresh) {
    const cached = readRecord(fullKey);
    if (cached) {
      return cached.value as T;
    }
  }
  const existingLoad = pendingLoads.get(fullKey);
  if (existingLoad) {
    return existingLoad as Promise<T>;
  }
  const stale = readRecord(fullKey, true);
  const pending = loader()
    .then((value) => {
      writePortalCache(uid, key, value, ttlMs);
      return value;
    })
    .catch((error) => {
      if (stale && staleIfErrorMs > 0 && stale.expiresAt > Date.now() - staleIfErrorMs) {
        return stale.value as T;
      }
      throw error;
    })
    .finally(() => pendingLoads.delete(fullKey));
  pendingLoads.set(fullKey, pending);
  return pending;
}

export function invalidatePortalCache(uid: string, prefixes: string[] = []) {
  const userPrefix = `${CACHE_PREFIX}:${uid}:`;
  const matches = (key: string) =>
    key.startsWith(userPrefix) &&
    (prefixes.length === 0 ||
      prefixes.some((prefix) => key.slice(userPrefix.length).startsWith(prefix)));
  [...memoryCache.keys()].filter(matches).forEach((key) => memoryCache.delete(key));
  const storage = getStorage();
  if (!storage) {
    return;
  }
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key && matches(key)) {
      keys.push(key);
    }
  }
  keys.forEach((key) => storage.removeItem(key));
}

export function clearOtherPortalCaches(activeUid: string) {
  const activePrefix = `${CACHE_PREFIX}:${activeUid}:`;
  [...memoryCache.keys()]
    .filter((key) => key.startsWith(`${CACHE_PREFIX}:`) && !key.startsWith(activePrefix))
    .forEach((key) => memoryCache.delete(key));
  const storage = getStorage();
  if (!storage) {
    return;
  }
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key?.startsWith(`${CACHE_PREFIX}:`) && !key.startsWith(activePrefix)) {
      keys.push(key);
    }
  }
  keys.forEach((key) => storage.removeItem(key));
}

export function clearAllPortalCaches() {
  memoryCache.clear();
  pendingLoads.clear();
  const storage = getStorage();
  if (!storage) {
    return;
  }
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key?.startsWith(`${CACHE_PREFIX}:`)) {
      keys.push(key);
    }
  }
  keys.forEach((key) => storage.removeItem(key));
}

export function registerPrivateCacheClearer(clearer: () => void | Promise<void>) {
  privateCacheClearers.add(clearer);
  return () => privateCacheClearers.delete(clearer);
}

export async function clearRegisteredPrivateCaches() {
  await Promise.all([...privateCacheClearers].map((clearer) => clearer()));
}
