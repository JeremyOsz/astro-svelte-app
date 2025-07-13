import { PROKERALA_CLIENT_ID, PROKERALA_CLIENT_SECRET } from '$env/static/private';
import { getSignByDegree, getDegreeInSign } from './astrology-utils';

// Types that match the existing astronomia service interface
export interface PlanetPosition {
  name: string;
  longitude: number;
  latitude: number;
  distance: number;
  sign: string;
  degree: number;
  house?: number;
  retrograde?: boolean;
}

export interface BirthChart {
  planets: PlanetPosition[];
  houses: number[];
  ascendant: number;
  mc: number;
  date: Date;
  latitude: number;
  longitude: number;
}

export interface TransitData {
  planet: string;
  currentLongitude: number;
  currentSign: string;
  currentDegree: number;
  natalLongitude: number;
  natalSign: string;
  natalDegree: number;
  aspect?: {
    type: string;
    orb: number;
    exact: boolean;
  };
}

// Prokerala API response interfaces
interface ProkeralaLocation {
  latitude: number;
  longitude: number;
  timezone: string;
  place: string;
}

interface ProkeralaPlanet {
  name: string;
  longitude: number;
  latitude: number;
  distance: number;
  is_retrograde: boolean;
  house: number;
}

interface ProkeralaHouse {
  house: number;
  longitude: number;
}

interface ProkeralaChart {
  planets: ProkeralaPlanet[];
  houses: ProkeralaHouse[];
  ascendant: number;
  mc: number;
}

interface ProkeralaResponse {
  data: {
    chart: ProkeralaChart;
    location: ProkeralaLocation;
  };
}

// Base URL for Prokerala API
const PROKERALA_BASE_URL = 'https://api.prokerala.com';

// Token management
let accessToken: string | null = null;
let tokenExpiry: number = 0;

// Re-export utility functions for convenience
export { getSignByDegree, getDegreeInSign } from './astrology-utils';

// Get OAuth2 access token
async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  if (!PROKERALA_CLIENT_ID || !PROKERALA_CLIENT_SECRET) {
    throw new Error('Prokerala API credentials not configured. Please set PROKERALA_CLIENT_ID and PROKERALA_CLIENT_SECRET environment variables.');
  }

  const response = await fetch(`${PROKERALA_BASE_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: PROKERALA_CLIENT_ID,
      client_secret: PROKERALA_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute before expiry

  return accessToken as string;
}

// Calculate birth chart using Prokerala API
export async function calculateBirthChart(
  date: Date,
  latitude: number,
  longitude: number
): Promise<BirthChart> {
  const token = await getAccessToken();
  
  // Format date for API in ISO 8601 format with timezone
  const formattedDateTime = date.toISOString(); // This gives us YYYY-MM-DDTHH:MM:SS.sssZ format

  // Use GET request with query parameters for Western astrology natal chart
  const params = new URLSearchParams({
    ayanamsa: '1', // Lahiri ayanamsa
    'profile[datetime]': formattedDateTime,
    'profile[coordinates]': `${latitude},${longitude}`
  });

  const response = await fetch(`${PROKERALA_BASE_URL}/v2/astrology/natal-planet-position?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Prokerala API Error Response:', errorText);
    throw new Error(`Prokerala API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  console.log('Prokerala API Response:', JSON.stringify(data, null, 2));
  
  // Transform Prokerala Western astrology response to match our interface
  const allPlanets = data.data?.planet_positions || [];
  const allAngles = data.data?.angles || [];
  
  // Filter out the main planets (exclude Ascendant, Descendant, Mid Heaven, etc.)
  const planets: PlanetPosition[] = allPlanets
    .filter((planet: any) => !['Ascendant', 'Descendant', 'Mid Heaven', 'Imum Coeli'].includes(planet.name))
    .map((planet: any) => ({
      name: planet.name,
      longitude: planet.longitude,
      latitude: 0, // Not provided in Western astrology response
      distance: 0, // Not provided in Western astrology response  
      sign: planet.zodiac?.name || getSignByDegree(planet.longitude),
      degree: planet.degree,
      house: planet.house_number,
      retrograde: planet.is_retrograde || false,
    }));

  // Extract house cusps from the houses array (start_cusp longitude)
  const houses: number[] = data.data?.houses?.map((house: any) => house.start_cusp?.longitude || 0) || [];

  // Find Ascendant and MC from the angles array
  const ascendant = allAngles.find((p: any) => p.name === 'Ascendant')?.longitude || 0;
  const mc = allAngles.find((p: any) => p.name === 'Mid Heaven')?.longitude || 0;

  return {
    planets,
    houses,
    ascendant,
    mc,
    date,
    latitude,
    longitude,
  };
}

// Calculate transits using Prokerala API
export async function calculateTransits(
  natalChart: BirthChart,
  transitDate: Date
): Promise<TransitData[]> {
  const token = await getAccessToken();
  
  // Format date for API
  const formattedDate = transitDate.toISOString().split('T')[0];
  const formattedTime = transitDate.toTimeString().split(' ')[0].substring(0, 5);

  const response = await fetch(`${PROKERALA_BASE_URL}/v2/astrology/western-astrology/transit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      datetime: `${formattedDate}T${formattedTime}:00`,
      coordinates: `${natalChart.latitude},${natalChart.longitude}`,
      natal_datetime: natalChart.date.toISOString(),
      ayanamsa: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Prokerala API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const transits: TransitData[] = [];

  // Process transit data (this structure may need adjustment based on actual API response)
  if (data.data && data.data.transits) {
    data.data.transits.forEach((transit: any) => {
      const natalPlanet = natalChart.planets.find(p => p.name === transit.planet);
      
      if (natalPlanet) {
        const aspect = calculateAspect(transit.longitude, natalPlanet.longitude);
        
        transits.push({
          planet: transit.planet,
          currentLongitude: transit.longitude,
          currentSign: getSignByDegree(transit.longitude),
          currentDegree: getDegreeInSign(transit.longitude),
          natalLongitude: natalPlanet.longitude,
          natalSign: natalPlanet.sign,
          natalDegree: natalPlanet.degree,
          aspect,
        });
      }
    });
  }

  return transits;
}

// Calculate aspects between two longitudes
function calculateAspect(long1: number, long2: number): { type: string; orb: number; exact: boolean } | undefined {
  const diff = Math.abs(long1 - long2);
  const orb = Math.min(diff, 360 - diff);
  
  const aspects = [
    { type: 'Conjunction', degrees: 0, orb: 8 },
    { type: 'Sextile', degrees: 60, orb: 4 },
    { type: 'Square', degrees: 90, orb: 8 },
    { type: 'Trine', degrees: 120, orb: 8 },
    { type: 'Opposition', degrees: 180, orb: 8 }
  ];
  
  for (const aspect of aspects) {
    if (Math.abs(orb - aspect.degrees) <= aspect.orb) {
      return {
        type: aspect.type,
        orb: Math.abs(orb - aspect.degrees),
        exact: Math.abs(orb - aspect.degrees) <= 1
      };
    }
  }
  
  return undefined;
}

// Get current planetary positions
export async function getCurrentPlanetaryPositions(): Promise<PlanetPosition[]> {
  const now = new Date();
  // Use a default location for current positions (can be made configurable)
  const defaultLat = 40.7128; // New York
  const defaultLng = -74.0060;
  
  const chart = await calculateBirthChart(now, defaultLat, defaultLng);
  return chart.planets;
} 