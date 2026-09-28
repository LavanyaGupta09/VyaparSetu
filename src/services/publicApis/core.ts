export type DataSource = 'live' | 'cache' | 'demo-fallback';

export interface ApiResponse<T> {
  data: T;
  source: DataSource;
  fetchedAt: string;
  error?: string;
}

interface FetchOptions {
  timeoutMs?: number;
  retries?: number;
  cacheTtlMs?: number;
}

const memoryCache = new Map<string, { data: any; expiry: number }>();

export async function fetchWithResilience<T>(
  key: string,
  fetcher: () => Promise<T>,
  fallbackData: T,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { timeoutMs = 8000, retries = 1, cacheTtlMs = 1000 * 60 * 60 } = options;
  const now = Date.now();

  // 1. Check Memory Cache
  const cached = memoryCache.get(key);
  if (cached && cached.expiry > now) {
    return { data: cached.data, source: 'cache', fetchedAt: new Date().toISOString() };
  }

  // 2. Check LocalStorage Cache
  try {
    const lsRaw = localStorage.getItem(`api_cache_${key}`);
    if (lsRaw) {
      const lsCached = JSON.parse(lsRaw);
      if (lsCached.expiry > now) {
        memoryCache.set(key, lsCached);
        return { data: lsCached.data, source: 'cache', fetchedAt: new Date().toISOString() };
      }
    }
  } catch (e) {
    // Ignore localStorage errors
  }

  // 3. Live Fetch with Retry & Timeout
  let attempts = 0;
  while (attempts <= retries) {
    attempts++;
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      
      const data = await Promise.race([
        fetcher().then(res => { clearTimeout(id); return res; }),
        new Promise<never>((_, reject) => {
          const timeoutId = setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs);
          // If the fetch resolves first, we need to clear this timeout too, but handled implicitly.
        })
      ]);

      // Save to caches
      const cachePayload = { data, expiry: now + cacheTtlMs };
      memoryCache.set(key, cachePayload);
      try { localStorage.setItem(`api_cache_${key}`, JSON.stringify(cachePayload)); } catch (e) {}

      return { data, source: 'live', fetchedAt: new Date().toISOString() };
    } catch (error: any) {
      if (attempts > retries) {
        console.warn(`[API] Failed to fetch ${key}, using fallback. Error: ${error.message}`);
        return { data: fallbackData, source: 'demo-fallback', fetchedAt: new Date().toISOString(), error: error.message };
      }
    }
  }

  return { data: fallbackData, source: 'demo-fallback', fetchedAt: new Date().toISOString(), error: 'Max retries exceeded' };
}
