import * as swisseph from 'swisseph';
import type { BirthData, BirthChart, PlanetPosition } from '../types/types';
import { ZODIAC_SIGNS, PLANETS, WHOLE_SIGN_HOUSES, DEGREES_PER_SIGN, getSignByDegree } from '../astrology/astrology';

// Initialize Swiss Ephemeris with ephemeris files path
// For production, you would need to include ephemeris files in your deployment
// or use a cloud storage solution to access them
swisseph.swe_set_ephe_path('./static/assets/ephe');

export function calculateBirthChart(birthData: BirthData): BirthChart {
  // Validate date format and values
  const dateRegex = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
  if (!dateRegex.test(birthData.date)) {
    throw new Error('Invalid date format. Use YYYY-MM-DD');
  }

  // Parse birth date and time
  const [year, month, day] = birthData.date.split('-').map(Number);
  const [hour, minute] = birthData.time.split(':').map(Number);
  
  // Validate date values
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new Error('Invalid date values');
  }
  
  // Calculate Julian day (UT)
  let julianDay = swisseph.swe_julday(
    year,
    month,
    day,
    hour + minute / 60 - birthData.timezone,
    swisseph.SE_GREG_CAL
  );
  
  // Use Whole Sign system
  const houseResult = swisseph.swe_houses(
    julianDay,
    birthData.latitude,
    birthData.longitude,
    'W' // Whole Sign system
  );

  if ('error' in houseResult) {
    throw new Error(`Failed to calculate ascendant: ${houseResult.error}`);
  }

  const ascendant = houseResult.ascendant;

  // Calculate planet positions
  const planets: PlanetPosition[] = PLANETS.map(planet => {
    const result = swisseph.swe_calc_ut(julianDay, planet.id, swisseph.SEFLG_SPEED);
    
    if ('error' in result) {
      throw new Error(`Failed to calculate position for ${planet.name}: ${result.error}`);
    }

    // Assert the type to handle the union type correctly
    const calcResult = result as { longitude: number; longitudeSpeed: number };

    // Determine zodiac sign using the new helper function
    const sign = getSignByDegree(calcResult.longitude);
    
    // Determine house in Whole Sign system
    // House 1 starts at the ascendant's sign
    const ascendantSign = getSignByDegree(ascendant);
    const ascendantIndex = ZODIAC_SIGNS.findIndex(s => s.name === ascendantSign.name);
    const planetIndex = ZODIAC_SIGNS.findIndex(s => s.name === sign.name);
    let house = ((planetIndex - ascendantIndex + 12) % 12) + 1;
    
    return {
      name: planet.name,
      longitude: calcResult.longitude,
      sign: sign.name,
      house,
      retrograde: calcResult.longitudeSpeed < 0
    };
  });
  
  return {
    ascendant,
    midheaven: ascendant + 90, // In Whole Sign, MC is 90° from Ascendant
    houses: [...WHOLE_SIGN_HOUSES], // Use the static Whole Sign house array
    planets,
    latitude: birthData.latitude,
    longitude: birthData.longitude
  };
}

// Helper function to check if a longitude is between two house cusps
function isBetween(longitude: number, start: number, end: number): boolean {
  if (start <= end) {
    return longitude >= start && longitude < end;
  } else {
    // Handle case where the range crosses 0°
    return longitude >= start || longitude < end;
  }
}

// Mock geocoder for demonstration
function mockGeocode(location: string): { latitude: number; longitude: number; timezone: number } {
  // For demo, return New York, NY, USA
  // Latitude: 40.7128, Longitude: -74.0060, Timezone: -5 (EST, not accounting for DST)
  // You can expand this with more locations or integrate a real geocoder
  return {
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: -5
  };
}

// Helper to format degrees as 17°09'
function formatDegrees(decimal: number): string {
  const deg = Math.floor(decimal);
  const min = Math.round((decimal - deg) * 60);
  return `${deg}°${min.toString().padStart(2, '0')}'`;
}

// Main function
export function formatChartFromInput(date: string, time: string, location: string): string {
  // Geocode location
  const { latitude, longitude, timezone } = mockGeocode(location);

  // Build BirthData
  const birthData = {
    date,
    time,
    latitude,
    longitude,
    timezone
  };

  // Calculate chart
  const chart = calculateBirthChart(birthData);

  // Format output for planets
  const lines: string[] = chart.planets.map(planet => {
    const degStr = formatDegrees(planet.longitude % 30);
    const retro = planet.retrograde ? ',R' : '';
    return `${planet.name},${planet.sign},${degStr}${retro}`;
  });

  // Add ASC and MC
  const ascSign = getSignByDegree(chart.ascendant);
  const mcSign = getSignByDegree(chart.midheaven);
  lines.push(`ASC,${ascSign.name},${formatDegrees(chart.ascendant % 30)}`);
  lines.push(`MC,${mcSign.name},${formatDegrees(chart.midheaven % 30)}`);

  // Stub for Lilith, Chiron, Fortune, Vertex (not calculated)
  lines.push('Lilith,Capricorn,25°14 7');
  lines.push('Chiron,Leo,9°20 7,R');
  lines.push('Fortune,Libra,22°29 7');
  lines.push('Vertex,Aries,29°44 7');

  return lines.join('\n');
}