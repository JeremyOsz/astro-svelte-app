import { BoundedTTLCache } from '$lib/server/bounded-cache';

interface RateRecord {
  count: number;
  resetAt: number;
}

const windows = new BoundedTTLCache<RateRecord>(20_000, 60 * 60 * 1000);

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const current = windows.get(key);

  if (!current || now >= current.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  windows.set(key, { ...current, count: current.count + 1 });
  return { allowed: true, retryAfterSeconds: 0 };
}
