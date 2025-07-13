import type { BirthData, BirthChart, PlanetPosition } from '../types/types';
import { ZODIAC_DETAILED, PLANETS, WHOLE_SIGN_HOUSES, DEGREES_PER_SIGN, getSignByDegree } from '../data/astrological-data';

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

  // Mock calculations - in a real implementation, this would use Swiss Ephemeris
  const ascendant = 45.5; // Mock ascendant at 15° Taurus
  
  // Generate mock planet positions based on the birth date
  const planets: PlanetPosition[] = ZODIAC_DETAILED.map((planet, index) => {
    // Create somewhat realistic positions based on the birth date
    const baseLongitude = (year * 0.1 + month * 2.5 + day * 0.08 + index * 30) % 360;
    const longitude = (baseLongitude + (hour * 15) + (minute * 0.25)) % 360;
    const sign = getSignByDegree(longitude);
    
    // Determine house in Whole Sign system
    const ascendantSign = getSignByDegree(ascendant);
    const ascendantIndex = ZODIAC_DETAILED.findIndex(s => s.name === ascendantSign);
    const planetIndex = ZODIAC_DETAILED.findIndex(s => s.name === sign);
    let house = ((planetIndex - ascendantIndex + 12) % 12) + 1;
    
    // Some planets are occasionally retrograde
    const retrograde = Math.random() < 0.2; // 20% chance of retrograde
    
    return {
      name: planet.name,
      longitude,
      latitude: 0, // Mock latitude
      distance: 1, // Mock distance
      sign: sign,
      degree: longitude % 30, // Degree within the sign
      house,
      retrograde
    };
  });
  
  return {
    ascendant,
    mc: ascendant + 90, // In Whole Sign, MC is 90° from Ascendant
    houses: [...WHOLE_SIGN_HOUSES], // Use the static Whole Sign house array
    planets,
    date,
    latitude: birthData.latitude,
    longitude: birthData.longitude
  };
}

// Helper to format degrees as 17°09'
export function formatDegrees(decimal: number): string {
  const deg = Math.floor(decimal);
  const min = Math.round((decimal - deg) * 60);
  return `${deg}°${min.toString().padStart(2, '0')}'`;
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
  const mcSign = getSignByDegree(chart.mc);
  lines.push(`ASC,${ascSign},${formatDegrees(chart.ascendant % 30)}`);
  lines.push(`MC,${mcSign},${formatDegrees(chart.mc % 30)}`);

  // Stub for Lilith, Chiron, Fortune, Vertex (not calculated)
  lines.push('Lilith,Capricorn,25°14 7');
  lines.push('Chiron,Leo,9°20 7,R');
  lines.push('Fortune,Libra,22°29 7');
  lines.push('Vertex,Aries,29°44 7');

  return lines.join('\n');
} 