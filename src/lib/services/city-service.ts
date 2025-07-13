import citiesData from 'cities.json';

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

export interface AdminRegion {
  code: string;
  name: string;
  asciiName: string;
}

// Type the cities data properly
const cities = citiesData as City[];

// Load admin1 data for state/region names
let admin1Data: Record<string, AdminRegion> = {};

// Load admin1.json data
async function loadAdmin1Data() {
  try {
    const response = await fetch('/data/admin1.json');
    if (response.ok) {
      const data: AdminRegion[] = await response.json();
      // Convert array to object for faster lookups
      admin1Data = data.reduce((acc, region) => {
        acc[region.code] = region;
        return acc;
      }, {} as Record<string, AdminRegion>);
    }
  } catch (error) {
    console.warn('Could not load admin1 data:', error);
  }
}

// Initialize admin data
loadAdmin1Data();

function getAdminName(country: string, admin1: string): string | undefined {
  const key = `${country}.${admin1}`;
  return admin1Data[key]?.name;
}

export function getCountryName(countryCode: string): string {
  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return displayNames.of(countryCode) || countryCode;
  } catch (error) {
    // Fallback to country code if Intl.DisplayNames fails
    return countryCode;
  }
}

// Cache for search results to improve performance
const searchCache = new Map<string, CitySearchResult[]>();

/**
 * Search for cities by name
 * @param query - Search query (city name)
 * @param limit - Maximum number of results to return (default: 10)
 * @returns Array of matching cities
 */
export function searchCities(query: string, limit: number = 10): CitySearchResult[] {
  if (!query || query.length < 2) {
    return [];
  }

  const cacheKey = `${query.toLowerCase()}_${limit}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  const results: CitySearchResult[] = cities
    .filter((city: City) => 
      city.name.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, limit)
    .map((city: City) => {
      const adminName = getAdminName(city.country, city.admin1);
      const countryName = getCountryName(city.country);
      const displayName = adminName ? `${city.name}, ${adminName}, ${countryName}` : `${city.name}, ${countryName}`;
      const fullLocation = adminName ? `${city.name}, ${adminName}, ${countryName}` : `${city.name}, ${countryName}`;
      
      return {
        ...city,
        displayName,
        fullLocation,
        adminName
      };
    });

  // Cache the results
  searchCache.set(cacheKey, results);
  
  return results;
}

/**
 * Get city by exact name and country
 * @param name - City name
 * @param country - Country code
 * @returns City object or null if not found
 */
export function getCityByNameAndCountry(name: string, country: string): City | null {
  const city = cities.find((c: City) => 
    c.name.toLowerCase() === name.toLowerCase() && 
    c.country.toLowerCase() === country.toLowerCase()
  );
  
  return city || null;
}

/**
 * Get timezone offset estimate based on longitude
 * This is a rough estimate - for production use a proper timezone API
 * @param longitude - Longitude coordinate
 * @returns Estimated timezone offset in hours
 */
export function estimateTimezoneFromLongitude(longitude: number): number {
  // Rough estimation: 15 degrees per hour
  const offset = Math.round(longitude / 15);
  // Clamp to valid timezone range
  return Math.max(-12, Math.min(12, offset));
}

/**
 * Clear the search cache (useful for memory management)
 */
export function clearSearchCache(): void {
  searchCache.clear();
} 