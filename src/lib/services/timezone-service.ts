import { DateTime } from 'luxon';

// Simplified timezone boundaries for common regions
// This is a curated list of major timezone boundaries
interface TimezoneRegion {
  name: string; // IANA timezone name
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  countries?: string[]; // Optional country codes for better matching
}

// Curated timezone regions covering major populated areas
const TIMEZONE_REGIONS: TimezoneRegion[] = [
  // North America
  { name: 'America/New_York', bounds: { north: 49, south: 25, east: -67, west: -85 } },
  { name: 'America/Chicago', bounds: { north: 49, south: 25, east: -85, west: -104 } },
  { name: 'America/Denver', bounds: { north: 49, south: 25, east: -104, west: -117 } },
  { name: 'America/Los_Angeles', bounds: { north: 49, south: 25, east: -117, west: -125 } },
  { name: 'America/Anchorage', bounds: { north: 71, south: 54, east: -130, west: -180 } },
  { name: 'Pacific/Honolulu', bounds: { north: 29, south: 18, east: -154, west: -162 } },
  
  // Europe
  { name: 'Europe/London', bounds: { north: 61, south: 49, east: 2, west: -11 } },
  { name: 'Europe/Paris', bounds: { north: 55, south: 42, east: 10, west: -5 } },
  { name: 'Europe/Berlin', bounds: { north: 55, south: 47, east: 24, west: 6 } },
  { name: 'Europe/Rome', bounds: { north: 47, south: 36, east: 19, west: 6 } },
  { name: 'Europe/Madrid', bounds: { north: 44, south: 36, east: 4, west: -10 } },
  { name: 'Europe/Moscow', bounds: { north: 67, south: 41, east: 170, west: 19 } },
  
  // Asia
  { name: 'Asia/Tokyo', bounds: { north: 46, south: 24, east: 146, west: 129 } },
  { name: 'Asia/Shanghai', bounds: { north: 54, south: 18, east: 135, west: 73 } },
  { name: 'Asia/Kolkata', bounds: { north: 37, south: 6, east: 97, west: 68 } },
  { name: 'Asia/Bangkok', bounds: { north: 21, south: 5, east: 108, west: 97 } },
  { name: 'Asia/Dubai', bounds: { north: 26, south: 22, east: 56, west: 51 } },
  { name: 'Asia/Tehran', bounds: { north: 40, south: 25, east: 63, west: 44 } },
  { name: 'Asia/Jakarta', bounds: { north: 6, south: -11, east: 141, west: 95 } },
  
  // Australia/Oceania
  { name: 'Australia/Sydney', bounds: { north: -28, south: -37, east: 154, west: 140 } },
  { name: 'Australia/Melbourne', bounds: { north: -34, south: -39, east: 150, west: 140 } },
  { name: 'Australia/Perth', bounds: { north: -26, south: -35, east: 129, west: 113 } },
  { name: 'Pacific/Auckland', bounds: { north: -34, south: -47, east: 179, west: 166 } },
  
  // South America
  { name: 'America/Sao_Paulo', bounds: { north: 5, south: -34, east: -34, west: -74 } },
  { name: 'America/Argentina/Buenos_Aires', bounds: { north: -22, south: -55, east: -53, west: -73 } },
  { name: 'America/Lima', bounds: { north: 0, south: -18, east: -68, west: -81 } },
  { name: 'America/Bogota', bounds: { north: 13, south: -4, east: -66, west: -79 } },
  
  // Africa
  { name: 'Africa/Cairo', bounds: { north: 32, south: 22, east: 37, west: 25 } },
  { name: 'Africa/Lagos', bounds: { north: 14, south: 4, east: 15, west: 3 } },
  { name: 'Africa/Johannesburg', bounds: { north: -22, south: -35, east: 32, west: 16 } },
  { name: 'Africa/Nairobi', bounds: { north: 5, south: -5, east: 42, west: 34 } },
  
  // Middle East
  { name: 'Asia/Jerusalem', bounds: { north: 33, south: 29, east: 36, west: 34 } },
  { name: 'Asia/Riyadh', bounds: { north: 32, south: 16, east: 50, west: 34 } },
];

/**
 * Find the most likely timezone for given coordinates
 */
export function findTimezoneForCoordinates(latitude: number, longitude: number): string {
  // Find regions that contain this point
  const candidates = TIMEZONE_REGIONS.filter(region => {
    const { bounds } = region;
    return latitude >= bounds.south && 
           latitude <= bounds.north && 
           longitude >= bounds.west && 
           longitude <= bounds.east;
  });
  
  if (candidates.length === 0) {
    // Fallback to UTC-based estimation
    const offset = Math.round(longitude / 15);
    const clampedOffset = Math.max(-12, Math.min(12, offset));
    return `Etc/GMT${clampedOffset >= 0 ? '-' : '+'}${Math.abs(clampedOffset)}`;
  }
  
  // If multiple candidates, prefer the one with smallest bounding box (most specific)
  const bestCandidate = candidates.reduce((best, current) => {
    const bestArea = (best.bounds.north - best.bounds.south) * (best.bounds.east - best.bounds.west);
    const currentArea = (current.bounds.north - current.bounds.south) * (current.bounds.east - current.bounds.west);
    return currentArea < bestArea ? current : best;
  });
  
  return bestCandidate.name;
}

/**
 * Get the timezone offset for a specific date and location using historical data
 */
export function getHistoricalTimezoneOffset(
  latitude: number, 
  longitude: number, 
  dateTime: string
): number {
  const timezone = findTimezoneForCoordinates(latitude, longitude);
  
  try {
    // Parse the datetime in the target timezone
    const dt = DateTime.fromISO(dateTime, { zone: timezone });
    
    if (!dt.isValid) {
      console.warn('Invalid datetime, falling back to longitude estimation');
      return Math.round(longitude / 15);
    }
    
    // Return the offset in hours
    return dt.offset / 60;
  } catch (error) {
    console.warn('Error getting historical timezone offset:', error);
    // Fallback to simple longitude-based estimation
    return Math.round(longitude / 15);
  }
}

/**
 * Get timezone information for a birth chart calculation
 */
export function getBirthTimezone(
  latitude: number,
  longitude: number,
  birthDate: string,
  birthTime: string
): {
  timezone: string;
  offset: number;
  isDST: boolean;
} {
  const timezone = findTimezoneForCoordinates(latitude, longitude);
  const dateTimeString = `${birthDate}T${birthTime}`;
  
  try {
    const dt = DateTime.fromISO(dateTimeString, { zone: timezone });
    
    if (!dt.isValid) {
      const fallbackOffset = Math.round(longitude / 15);
      return {
        timezone: `UTC${fallbackOffset >= 0 ? '+' : ''}${fallbackOffset}`,
        offset: fallbackOffset,
        isDST: false
      };
    }
    
    return {
      timezone: timezone,
      offset: dt.offset / 60,
      isDST: dt.isInDST || false
    };
  } catch (error) {
    console.warn('Error getting birth timezone:', error);
    const fallbackOffset = Math.round(longitude / 15);
    return {
      timezone: `UTC${fallbackOffset >= 0 ? '+' : ''}${fallbackOffset}`,
      offset: fallbackOffset,
      isDST: false
    };
  }
}

/**
 * Format timezone offset for display
 */
export function formatTimezoneOffset(offset: number): string {
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset);
  const minutes = Math.round((absOffset - hours) * 60);
  
  if (minutes === 0) {
    return `UTC${sign}${hours}`;
  } else {
    return `UTC${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
  }
} 