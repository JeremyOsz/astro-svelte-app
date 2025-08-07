// Lazy loading service for interpretation data
// This service manages the loading and caching of large interpretation files

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  loading: boolean;
}

class InterpretationLoader {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Load planet interpretations
  async loadPlanetInterpretations() {
    const cacheKey = 'planet-interpretations';
    const cached = this.cache.get(cacheKey);
    
    if (cached && !this.isExpired(cached.timestamp)) {
      return cached.data;
    }

    if (cached?.loading) {
      // Wait for the ongoing load to complete
      return new Promise((resolve) => {
        const checkCache = () => {
          const updated = this.cache.get(cacheKey);
          if (updated && !updated.loading) {
            resolve(updated.data);
          } else {
            setTimeout(checkCache, 50);
          }
        };
        checkCache();
      });
    }

    // Mark as loading
    this.cache.set(cacheKey, { data: null, timestamp: Date.now(), loading: true });

    try {
      const module = await import('../data/interpretations/planets');
      const data = {
        PLANET_INTERPRETATIONS: module.PLANET_INTERPRETATIONS,
        PLANET_IN_SIGN_INTERPRETATIONS: module.PLANET_IN_SIGN_INTERPRETATIONS
      };
      
      this.cache.set(cacheKey, { data, timestamp: Date.now(), loading: false });
      return data;
    } catch (error) {
      this.cache.delete(cacheKey);
      throw error;
    }
  }

  // Load aspect interpretations
  async loadAspectInterpretations() {
    const cacheKey = 'aspect-interpretations';
    const cached = this.cache.get(cacheKey);
    
    if (cached && !this.isExpired(cached.timestamp)) {
      return cached.data;
    }

    if (cached?.loading) {
      return new Promise((resolve) => {
        const checkCache = () => {
          const updated = this.cache.get(cacheKey);
          if (updated && !updated.loading) {
            resolve(updated.data);
          } else {
            setTimeout(checkCache, 50);
          }
        };
        checkCache();
      });
    }

    this.cache.set(cacheKey, { data: null, timestamp: Date.now(), loading: true });

    try {
      const module = await import('../data/interpretations/aspects');
      const data = { ASPECT_INTERPRETATIONS: module.ASPECT_INTERPRETATIONS };
      
      this.cache.set(cacheKey, { data, timestamp: Date.now(), loading: false });
      return data;
    } catch (error) {
      this.cache.delete(cacheKey);
      throw error;
    }
  }

  // Load synastry interpretations
  async loadSynastryInterpretations() {
    const cacheKey = 'synastry-interpretations';
    const cached = this.cache.get(cacheKey);
    
    if (cached && !this.isExpired(cached.timestamp)) {
      return cached.data;
    }

    if (cached?.loading) {
      return new Promise((resolve) => {
        const checkCache = () => {
          const updated = this.cache.get(cacheKey);
          if (updated && !updated.loading) {
            resolve(updated.data);
          } else {
            setTimeout(checkCache, 50);
          }
        };
        checkCache();
      });
    }

    this.cache.set(cacheKey, { data: null, timestamp: Date.now(), loading: true });

    try {
      const module = await import('../data/interpretations/synastry/synastry');
      const data = { SYNASTRY_ASPECT_INTERPRETATIONS: module.SYNASTRY_ASPECT_INTERPRETATIONS };
      
      this.cache.set(cacheKey, { data, timestamp: Date.now(), loading: false });
      return data;
    } catch (error) {
      this.cache.delete(cacheKey);
      throw error;
    }
  }

  // Load transit interpretations
  async loadTransitInterpretations() {
    const cacheKey = 'transit-interpretations';
    const cached = this.cache.get(cacheKey);
    
    if (cached && !this.isExpired(cached.timestamp)) {
      return cached.data;
    }

    if (cached?.loading) {
      return new Promise((resolve) => {
        const checkCache = () => {
          const updated = this.cache.get(cacheKey);
          if (updated && !updated.loading) {
            resolve(updated.data);
          } else {
            setTimeout(checkCache, 50);
          }
        };
        checkCache();
      });
    }

    this.cache.set(cacheKey, { data: null, timestamp: Date.now(), loading: true });

    try {
      const module = await import('../data/interpretations/transits');
      const data = {
        TRANSIT_INTERPRETATIONS: module.TRANSIT_INTERPRETATIONS,
        getTransitInterpretation: module.getTransitInterpretation
      };
      
      this.cache.set(cacheKey, { data, timestamp: Date.now(), loading: false });
      return data;
    } catch (error) {
      this.cache.delete(cacheKey);
      throw error;
    }
  }

  // Load house interpretations
  async loadHouseInterpretations() {
    const cacheKey = 'house-interpretations';
    const cached = this.cache.get(cacheKey);
    
    if (cached && !this.isExpired(cached.timestamp)) {
      return cached.data;
    }

    if (cached?.loading) {
      return new Promise((resolve) => {
        const checkCache = () => {
          const updated = this.cache.get(cacheKey);
          if (updated && !updated.loading) {
            resolve(updated.data);
          } else {
            setTimeout(checkCache, 50);
          }
        };
        checkCache();
      });
    }

    this.cache.set(cacheKey, { data: null, timestamp: Date.now(), loading: true });

    try {
      const module = await import('../data/interpretations/houses');
      const data = { SIGN_IN_HOUSE_INTERPRETATIONS: module.SIGN_IN_HOUSE_INTERPRETATIONS };
      
      this.cache.set(cacheKey, { data, timestamp: Date.now(), loading: false });
      return data;
    } catch (error) {
      this.cache.delete(cacheKey);
      throw error;
    }
  }

  // Load interpretations page data
  async loadInterpretationsPageData() {
    const cacheKey = 'interpretations-page-data';
    const cached = this.cache.get(cacheKey);
    
    if (cached && !this.isExpired(cached.timestamp)) {
      return cached.data;
    }

    if (cached?.loading) {
      return new Promise((resolve) => {
        const checkCache = () => {
          const updated = this.cache.get(cacheKey);
          if (updated && !updated.loading) {
            resolve(updated.data);
          } else {
            setTimeout(checkCache, 50);
          }
        };
        checkCache();
      });
    }

    this.cache.set(cacheKey, { data: null, timestamp: Date.now(), loading: true });

    try {
      const module = await import('../data/interpretations-page-data');
      const data = {
        PLANETS_DATA: module.PLANETS_DATA,
        SIGNS_DATA: module.SIGNS_DATA,
        HOUSES_DATA: module.HOUSES_DATA,
        ASPECTS_DATA: module.ASPECTS_DATA,
        OTHER_OBJECTS_DATA: module.OTHER_OBJECTS_DATA
      };
      
      this.cache.set(cacheKey, { data, timestamp: Date.now(), loading: false });
      return data;
    } catch (error) {
      this.cache.delete(cacheKey);
      throw error;
    }
  }

  // Preload all interpretation data (for when user explicitly wants to load everything)
  async preloadAllInterpretations() {
    const promises = [
      this.loadPlanetInterpretations(),
      this.loadAspectInterpretations(),
      this.loadSynastryInterpretations(),
      this.loadTransitInterpretations(),
      this.loadHouseInterpretations(),
      this.loadInterpretationsPageData()
    ];

    try {
      await Promise.all(promises);
      console.log('All interpretation data preloaded successfully');
    } catch (error) {
      console.error('Error preloading interpretation data:', error);
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Check if cache entry is expired
  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.CACHE_DURATION;
  }

  // Get cache status
  getCacheStatus() {
    const status: Record<string, { cached: boolean; loading: boolean; expired: boolean }> = {};
    
    for (const [key, entry] of this.cache.entries()) {
      status[key] = {
        cached: true,
        loading: entry.loading,
        expired: this.isExpired(entry.timestamp)
      };
    }
    
    return status;
  }
}

// Export singleton instance
export const interpretationLoader = new InterpretationLoader(); 