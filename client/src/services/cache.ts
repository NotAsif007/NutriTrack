import { api } from "./api";

const CACHE_PREFIX = "nutritrack_cache:";
const DEFAULT_TTL_MS = 2 * 60 * 1000;

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();

function storageKey(key: string): string {
  return `${CACHE_PREFIX}${key}`;
}

function readStored<T>(key: string): CacheEntry<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(storageKey(key));
    return raw ? (JSON.parse(raw) as CacheEntry<T>) : null;
  } catch {
    return null;
  }
}

function writeStored<T>(key: string, entry: CacheEntry<T>): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(storageKey(key), JSON.stringify(entry));
  } catch {
    // Caching is an optimization; storage limits must never break the app.
  }
}

export function clearPageCache(): void {
  memoryCache.clear();
  if (typeof window === "undefined") return;
  try {
    Object.keys(window.sessionStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .forEach((key) => window.sessionStorage.removeItem(key));
  } catch {
    // Ignore unavailable storage.
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("nutritrack:cache-invalidate", clearPageCache);
}

export async function cachedGet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = DEFAULT_TTL_MS
): Promise<T> {
  const now = Date.now();
  const inMemory = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (inMemory && inMemory.expiresAt > now) return inMemory.value;

  const stored = readStored<T>(key);
  if (stored && stored.expiresAt > now) {
    memoryCache.set(key, stored);
    return stored.value;
  }

  const value = await fetcher();
  const entry = { value, expiresAt: now + ttlMs };
  memoryCache.set(key, entry);
  writeStored(key, entry);
  return value;
}

export { api };
