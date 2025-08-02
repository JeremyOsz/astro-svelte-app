interface CachedPlanetPositions {
  date: string;
  timestamp: number;
  positions: any[];
  source: 'api' | 'fallback';
}

class PlanetPositionsCache {
  private cache: Map<string, CachedPlanetPositions> = new Map();
  private readonly DAILY_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private readonly HOURLY_CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  private getCacheKey(date: string, time?: string): string {
    if (time) {
      // For hourly caching, include time in the key
      return `planet_positions_${date}_${time.split(':')[0]}`;
    }
    return `planet_positions_${date}`;
  }

  private isCacheValid(cached: CachedPlanetPositions, useHourlyCache: boolean = false): boolean {
    const now = Date.now();
    const cacheDuration = useHourlyCache ? this.HOURLY_CACHE_DURATION : this.DAILY_CACHE_DURATION;
    return (now - cached.timestamp) < cacheDuration;
  }

  get(date: string, time?: string, useHourlyCache: boolean = false): any[] | null {
    const key = this.getCacheKey(date, time);
    const cached = this.cache.get(key);
    
    if (cached && this.isCacheValid(cached, useHourlyCache)) {
      console.log(`Cache hit for planet positions on ${date}${time ? ` at ${time}` : ''}`);
      return cached.positions;
    }
    
    if (cached) {
      console.log(`Cache expired for planet positions on ${date}${time ? ` at ${time}` : ''}`);
      this.cache.delete(key);
    }
    
    return null;
  }

  set(date: string, positions: any[], source: 'api' | 'fallback' = 'api', time?: string): void {
    const key = this.getCacheKey(date, time);
    const cached: CachedPlanetPositions = {
      date,
      timestamp: Date.now(),
      positions,
      source
    };
    
    this.cache.set(key, cached);
    console.log(`Cached planet positions for ${date}${time ? ` at ${time}` : ''} (source: ${source})`);
    
    // Clean up old entries
    this.cleanup();
  }

  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, cached] of this.cache.entries()) {
      if (!this.isCacheValid(cached, false) && !this.isCacheValid(cached, true)) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired cache entries`);
    }
  }

  clear(): void {
    this.cache.clear();
    console.log('Planet positions cache cleared');
  }

  invalidate(date: string, time?: string): void {
    const key = this.getCacheKey(date, time);
    if (this.cache.delete(key)) {
      console.log(`Invalidated cache for ${date}${time ? ` at ${time}` : ''}`);
    }
  }

  getCacheStats(): { size: number; keys: string[]; details: CachedPlanetPositions[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      details: Array.from(this.cache.values())
    };
  }

  // Get cache status for a specific date/time
  getCacheStatus(date: string, time?: string): { exists: boolean; valid: boolean; age: number | null } {
    const key = this.getCacheKey(date, time);
    const cached = this.cache.get(key);
    
    if (!cached) {
      return { exists: false, valid: false, age: null };
    }
    
    const age = Date.now() - cached.timestamp;
    const valid = this.isCacheValid(cached, false) || this.isCacheValid(cached, true);
    
    return { exists: true, valid, age };
  }
}

export const planetPositionsCache = new PlanetPositionsCache(); 