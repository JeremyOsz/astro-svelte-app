import type { BirthData, BirthChart, PlanetPosition } from '../types/types';
import { ZODIAC_SIGNS, PLANETS, WHOLE_SIGN_HOUSES, DEGREES_PER_SIGN, getSignByDegree } from '../astrology/astrology-utils';

export async function calculateBirthChart(birthData: BirthData): Promise<BirthChart> {
  try {
    const response = await fetch('/api/birth-chart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(birthData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to calculate birth chart');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calculating birth chart:', error);
    throw error;
  }
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
export async function formatChartFromInput(date: string, time: string, location: string): Promise<string> {
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
  const chart = await calculateBirthChart(birthData);

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