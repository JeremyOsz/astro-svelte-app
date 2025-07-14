import vsop87c from 'vsop87';
import { ZODIAC_SIGNS } from '../data/astrological-data';
import type { BirthChart, PlanetPosition } from '../types/types';

const PLANET_NAMES = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'] as const;

// Convert Date to Julian Day Number
function dateToJulianDay(date: Date): number {
  const a = Math.floor((14 - (date.getUTCMonth() + 1)) / 12);
  const y = date.getUTCFullYear() + 4800 - a;
  const m = (date.getUTCMonth() + 1) + 12 * a - 3;
  
  let jd = date.getUTCDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Add time fraction
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const milliseconds = date.getUTCMilliseconds();
  
  const timeFraction = (hours + minutes / 60 + seconds / 3600 + milliseconds / 3600000) / 24;
  jd += timeFraction - 0.5; // Julian day starts at noon
  
  return jd;
}

// Convert rectangular coordinates to longitude/latitude
function rectangularToSpherical(x: number, y: number, z: number): { lon: number; lat: number; distance: number } {
  const distance = Math.sqrt(x * x + y * y + z * z);
  const lon = Math.atan2(y, x) * 180 / Math.PI;
  const lat = Math.asin(z / distance) * 180 / Math.PI;
  
  return {
    lon: ((lon % 360) + 360) % 360, // Normalize to 0-360
    lat,
    distance
  };
}

// Get zodiac sign from longitude
export function getSignByDegree(longitude: number): string {
  const index = Math.floor(longitude / 30);
  return ZODIAC_SIGNS[index] || ZODIAC_SIGNS[0];
}

// Calculate degree within sign
export function getDegreeInSign(longitude: number): number {
  return longitude % 30;
}

// Calculate planetary positions using VSOP87 with proper geocentric transformation
async function calculatePlanetaryPositions(jd: number): Promise<PlanetPosition[]> {
  const planets: PlanetPosition[] = [];
  
  try {
    // Load VSOP87 module
    const vsop87 = await vsop87c;
    
    // Convert JD to Julian centuries since J2000.0
    const T = (jd - 2451545.0) / 36525.0;
    
    // Get heliocentric coordinates for all planets
    const coords = vsop87(jd);
    
    // Process each planet with proper geocentric transformation
    const planetMapping = {
      mercury: 'Mercury',
      venus: 'Venus', 
      mars: 'Mars',
      jupiter: 'Jupiter',
      saturn: 'Saturn',
      uranus: 'Uranus',
      neptune: 'Neptune'
    };
    
    // Standard heliocentric to geocentric transformation
    // For each planet: geocentric_position = heliocentric_position - earth_position
    for (const [vsopName, planetName] of Object.entries(planetMapping)) {
      if (coords[vsopName as keyof typeof coords] && coords.earth) {
        const planet = coords[vsopName as keyof typeof coords];
        const earth = coords.earth;
        
        // Apply geocentric transformation: P_geocentric = P_heliocentric - E_heliocentric
        const geoX = planet.x - earth.x;
        const geoY = planet.y - earth.y;
        const geoZ = planet.z - earth.z;
        
        // Convert to spherical coordinates
        const spherical = rectangularToSpherical(geoX, geoY, geoZ);
        
        planets.push({
          name: planetName,
          longitude: spherical.lon,
          latitude: spherical.lat,
          distance: spherical.distance,
          sign: getSignByDegree(spherical.lon),
          degree: getDegreeInSign(spherical.lon),
          retrograde: checkRetrograde(jd, planetName, vsopName, coords),
          house: 1 // Will be calculated later
        });
      }
    }
    
    // Add Sun (geocentric position = -Earth_heliocentric)
    // In heliocentric coordinates, Sun is at origin (0,0,0)
    // In geocentric coordinates, Sun appears at -Earth_position
    if (coords.earth) {
      const sunSpherical = rectangularToSpherical(-coords.earth.x, -coords.earth.y, -coords.earth.z);
      
      planets.push({
        name: 'Sun',
        longitude: sunSpherical.lon,
        latitude: sunSpherical.lat,
        distance: sunSpherical.distance,
        sign: getSignByDegree(sunSpherical.lon),
        degree: getDegreeInSign(sunSpherical.lon),
        retrograde: false, // Sun is never retrograde
        house: 1
      });
    }
    
    // Add simplified Moon calculation (geocentric by nature)
    const moonLon = calculateMoonLongitude(T);
    planets.push({
      name: 'Moon',
      longitude: moonLon,
      latitude: 0, // Simplified
      distance: 0.002569, // Average distance in AU
      sign: getSignByDegree(moonLon),
      degree: getDegreeInSign(moonLon),
      retrograde: false, // Moon is never retrograde
      house: 1
    });
    
  } catch (error) {
    console.error('Error calculating planetary positions:', error);
    throw new Error('Failed to calculate planetary positions');
  }
  
  return planets;
}

// Simplified Moon longitude calculation
function calculateMoonLongitude(T: number): number {
  // Simplified calculation based on mean elements
  const L0 = 218.3164477; // Mean longitude at epoch
  const n = 13.17639648; // Mean motion (degrees per day)
  const days = T * 36525; // Days since J2000
  
  let moonLon = L0 + n * days;
  
  // Add some basic perturbations
  const M = 134.9633964 + 13.0649929509 * T; // Mean anomaly
  const F = 93.2720950 + 13.2299096581 * T; // Mean distance from node
  
  // Basic correction terms (simplified)
  moonLon += 6.289 * Math.sin(M * Math.PI / 180);
  moonLon += 1.274 * Math.sin((2 * 218.3164477 + n * days - M) * Math.PI / 180);
  moonLon += 0.658 * Math.sin(2 * 218.3164477 * Math.PI / 180);
  
  return ((moonLon % 360) + 360) % 360;
}

// Check if planet is retrograde (simplified)
function checkRetrograde(jd: number, planetName: string, vsopName: string, coords: any): boolean {
  if (planetName === 'Sun' || planetName === 'Moon') return false;
  
  // This is a placeholder - proper retrograde calculation would need
  // to sample positions over time and check motion direction
  return false;
}

// Calculate sidereal time
function calculateSiderealTime(jd: number, longitude: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  
  // Greenwich Mean Sidereal Time at 0h UT
  let GMST = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000.0;
  
  // Convert to radians and add longitude
  GMST = ((GMST % 360) + 360) % 360;
  const LST = GMST + longitude;
  
  return ((LST % 360) + 360) % 360 * Math.PI / 180;
}

// Calculate Ascendant
function calculateAscendant(jd: number, latitude: number, longitude: number): number {
  const lst = calculateSiderealTime(jd, longitude);
  const lat = latitude * Math.PI / 180;
  
  // Obliquity of the ecliptic
  const T = (jd - 2451545.0) / 36525.0;
  const obliquity = (23.439291 - 0.0130042 * T) * Math.PI / 180;
  
  // Calculate ascendant
  const y = -Math.cos(lst);
  const x = Math.sin(lst) * Math.cos(obliquity) + Math.tan(lat) * Math.sin(obliquity);
  let asc = Math.atan2(y, x) * 180 / Math.PI;
  
  return ((asc % 360) + 360) % 360;
}

// Calculate MC (Midheaven)  
function calculateMC(jd: number, longitude: number): number {
  const lst = calculateSiderealTime(jd, longitude);
  
  // Obliquity of the ecliptic
  const T = (jd - 2451545.0) / 36525.0;
  const obliquity = (23.439291 - 0.0130042 * T) * Math.PI / 180;
  
  let mc = Math.atan2(Math.tan(lst), Math.cos(obliquity)) * 180 / Math.PI;
  return ((mc % 360) + 360) % 360;
}

// Calculate house cusps (simplified Placidus)
function calculateHouses(jd: number, latitude: number, longitude: number, ascendant: number, mc: number): number[] {
  const houses = new Array(12);
  
  // The four angles
  houses[0] = ascendant;              // 1st house
  houses[3] = (mc + 180) % 360;       // 4th house (IC)  
  houses[6] = (ascendant + 180) % 360; // 7th house (Descendant)
  houses[9] = mc;                     // 10th house (MC)
  
  // Intermediate houses (simplified equal division)
  for (let i = 1; i < 12; i++) {
    if (i === 3 || i === 9) continue;
    
    if (i < 3) {
      houses[i] = (ascendant + (i * (houses[3] - ascendant + 360) % 360) / 3) % 360;
    } else if (i < 6) {
      houses[i] = (houses[3] + ((i - 3) * (houses[6] - houses[3] + 360) % 360) / 3) % 360;
    } else if (i < 9) {
      houses[i] = (houses[6] + ((i - 6) * (houses[9] - houses[6] + 360) % 360) / 3) % 360;
    } else {
      houses[i] = (houses[9] + ((i - 9) * (ascendant + 360 - houses[9]) % 360) / 3) % 360;
    }
  }
  
  return houses;
}

// Assign planets to houses
function assignPlanetsToHouses(planets: PlanetPosition[], houses: number[]): PlanetPosition[] {
  return planets.map(planet => {
    let house = 1;
    for (let i = 0; i < 12; i++) {
      const currentHouse = houses[i];
      const nextHouse = houses[(i + 1) % 12];
      
      let inHouse = false;
      if (nextHouse > currentHouse) {
        inHouse = planet.longitude >= currentHouse && planet.longitude < nextHouse;
      } else {
        inHouse = planet.longitude >= currentHouse || planet.longitude < nextHouse;
      }
      
      if (inHouse) {
        house = i + 1;
        break;
      }
    }
    
    return { ...planet, house };
  });
}

// Main birth chart calculation function
export async function calculateBirthChart(
  date: Date,
  latitude: number,
  longitude: number
): Promise<BirthChart> {
  try {
    const jd = dateToJulianDay(date);
    
    // Calculate planetary positions
    const planets = await calculatePlanetaryPositions(jd);
    
    // Calculate angles
    const ascendant = calculateAscendant(jd, latitude, longitude);
    const mc = calculateMC(jd, longitude);
    
    // Calculate houses
    const houses = calculateHouses(jd, latitude, longitude, ascendant, mc);
    
    // Assign planets to houses
    const planetsWithHouses = assignPlanetsToHouses(planets, houses);
    
    return {
      date,
      latitude,
      longitude,
      ascendant,
      mc,
      planets: planetsWithHouses,
      houses
    };
    
  } catch (error) {
    console.error('Error in calculateBirthChart:', error);
    throw new Error(`Birth chart calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 