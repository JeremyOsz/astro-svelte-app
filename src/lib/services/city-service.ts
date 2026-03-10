export interface City {
  name: string;
  lat: string;
  lng: string;
  country: string;
  admin1: string;
  admin2?: string;
}

export interface CitySearchResult extends City {
  displayName: string;
  fullLocation: string;
  adminName?: string;
}

interface CacheEntry {
  results: CitySearchResult[];
  expiresAt: number;
}

const searchCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function searchCities(query: string, limit: number = 10): Promise<CitySearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const normalizedQuery = query.trim().toLowerCase();
  const normalizedLimit = Math.min(50, Math.max(1, limit));
  const cacheKey = `${normalizedQuery}_${normalizedLimit}`;

  const cached = searchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.results;
  }

  const params = new URLSearchParams({ q: normalizedQuery, limit: String(normalizedLimit) });
  const response = await fetch(`/api/cities?${params.toString()}`);

  if (!response.ok) {
    return [];
  }

  const body = await response.json();
  const results = Array.isArray(body?.results) ? body.results as CitySearchResult[] : [];

  searchCache.set(cacheKey, { results, expiresAt: Date.now() + CACHE_TTL_MS });
  return results;
}

export function getCountryName(countryCode: string): string {
  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return displayNames.of(countryCode) || countryCode;
  } catch {
    return countryCode;
  }
}

export function getCityByNameAndCountry(_name: string, _country: string): City | null {
  return null;
}

export function clearSearchCache(): void {
  searchCache.clear();
}
