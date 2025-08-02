import { planetPositionsCache } from './planet-positions-cache';

export interface CacheStats {
  size: number;
  keys: string[];
  details: Array<{
    date: string;
    timestamp: number;
    source: 'api' | 'fallback';
    age: number;
  }>;
}

export class CacheManager {
  static getStats(): CacheStats {
    const stats = planetPositionsCache.getCacheStats();
    return {
      size: stats.size,
      keys: stats.keys,
      details: stats.details.map(detail => ({
        date: detail.date,
        timestamp: detail.timestamp,
        source: detail.source,
        age: Date.now() - detail.timestamp
      }))
    };
  }

  static clearCache(): void {
    planetPositionsCache.clear();
  }

  static invalidateCache(date: string, time?: string): void {
    planetPositionsCache.invalidate(date, time);
  }

  static getCacheStatus(date: string, time?: string) {
    return planetPositionsCache.getCacheStatus(date, time);
  }

  static formatAge(ageMs: number): string {
    const seconds = Math.floor(ageMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return `${seconds}s ago`;
    }
  }

  static getCacheInfo(): string {
    const stats = this.getStats();
    const totalAge = stats.details.reduce((sum, detail) => sum + detail.age, 0);
    const avgAge = stats.size > 0 ? totalAge / stats.size : 0;
    
    return `Cache: ${stats.size} entries, avg age: ${this.formatAge(avgAge)}`;
  }
} 