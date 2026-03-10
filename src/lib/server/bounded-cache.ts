interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class BoundedTTLCache<T> {
  private readonly cache = new Map<string, CacheEntry<T>>();

  constructor(
    private readonly maxEntries: number,
    private readonly ttlMs: number
  ) {}

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    // Refresh recency for LRU behavior.
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.data;
  }

  set(key: string, data: T): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, { data, timestamp: Date.now() });

    while (this.cache.size > this.maxEntries) {
      const oldestKey = this.cache.keys().next().value;
      if (!oldestKey) break;
      this.cache.delete(oldestKey);
    }
  }
}
