import type { BirthChart, PlanetPosition } from "$lib/types/types";
import { env } from '$env/dynamic/private';

interface SwissEphemerisBirthData {
  date: string;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
  house_system?: 'whole_sign' | 'placidus';
}

interface SwissEphemerisResponse {
  // This will be populated based on the actual API response
  [key: string]: any;
}

// Use local server for development, but use the production API URL if set in environment
const API_BASE_URL = env.EPHEMERIS_API_URL || 'http://127.0.0.1:8001';
const API_KEY = env.EPHEMERIS_API_KEY;

// Ensure this service is only used on the server side
if (typeof window !== 'undefined') {
  throw new Error('SwissEphemerisService should only be used on the server side');
}

export class SwissEphemerisService {
  private static async makeRequest(endpoint: string, data: any): Promise<any> {
    if (!API_KEY) {
      throw new Error('EPHEMERIS_API_KEY environment variable is not set');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorData.detail || 'Unknown error'}`);
    }

    return response.json();
  }

  static async calculateBirthChart(
    date: Date,
    latitude: number,
    longitude: number,
    place: string = 'Unknown Location',
    houseSystem: 'whole_sign' | 'placidus' = 'whole_sign'
  ): Promise<BirthChart> {
    try {
      // Format date and time for the API
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeStr = date.toTimeString().split(' ')[0]; // HH:MM:SS

      const requestData: SwissEphemerisBirthData = {
        date: dateStr,
        time: timeStr,
        place,
        latitude,
        longitude,
        house_system: houseSystem,
      };

      console.log('=== SWISS EPHEMERIS API REQUEST ===');
      console.log('URL:', `${API_BASE_URL}/birth-chart`);
      console.log('Request Data:', JSON.stringify(requestData, null, 2));
      console.log('API Key:', API_KEY ? 'Present' : 'Missing');

      const response = await this.makeRequest('/birth-chart', requestData);
      
      console.log('=== SWISS EPHEMERIS API RESPONSE ===');
      console.log('Response:', JSON.stringify(response, null, 2));
      
      // Transform the response to match your existing BirthChart interface
      return this.transformBirthChartResponse(response, date, latitude, longitude);
    } catch (error) {
      console.error('Error calling Swiss Ephemeris API:', error);
      throw new Error(`Failed to calculate birth chart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static transformBirthChartResponse(
    response: SwissEphemerisResponse,
    originalDate: Date,
    latitude: number,
    longitude: number
  ): BirthChart {
    console.log('=== TRANSFORMING RESPONSE ===');
    console.log('Response keys:', Object.keys(response));
    console.log('Response structure:', JSON.stringify(response, null, 2));
    
    // This transformation will need to be updated based on the actual API response structure
    // For now, I'll create a basic structure that you can adjust
    
    // Extract planets from the response
    const planets: PlanetPosition[] = [];
    
    // The actual response structure will depend on what the Swiss Ephemeris API returns
    // You'll need to map the response fields to your PlanetPosition interface
    if (response.planets) {
      console.log('Found planets array with', response.planets.length, 'planets');
      response.planets.forEach((planet: any, index: number) => {
        console.log(`Planet ${index + 1}:`, planet);
        planets.push({
          name: planet.name,
          longitude: planet.longitude,
          latitude: planet.latitude || 0,
          distance: planet.distance || 1,
          sign: planet.sign,
          degree: planet.degree,
          house: planet.house,
        });
      });
    } else if (response.objects) {
      console.log('Found objects with', Object.keys(response.objects).length, 'objects');
      // Look for planets in the objects
      Object.entries(response.objects).forEach(([key, object]: [string, any]) => {
        console.log(`Object ${key}:`, object);
        // Check if this is a planet (you might need to adjust this logic based on the actual structure)
        if (object.type && object.type.name === 'Planet') {
          planets.push({
            name: object.name,
            longitude: object.longitude.raw,
            latitude: object.latitude?.raw || 0,
            distance: object.distance?.raw || 1,
            sign: object.sign.name,
            degree: object.sign_longitude.raw,
            house: object.house?.number || 1,
            retrograde: object.speed?.raw < 0 || false,
          });
        }
      });
    } else {
      console.log('No planets found in response. Available keys:', Object.keys(response));
    }

    // Extract houses, ascendant, and MC from the response
    const houses = response.houses || [];
    
    // Look for ASC and MC in the objects
    let ascendant = 0;
    let mc = 0;
    
    if (response.objects) {
      Object.entries(response.objects).forEach(([key, object]: [string, any]) => {
        if (object.name === 'Ascendant') {
          ascendant = object.longitude.raw;
        } else if (object.name === 'MC' || object.name === 'Midheaven') {
          mc = object.longitude.raw;
        }
      });
    }
    
    // Fallback to direct properties if not found in objects
    if (ascendant === 0) ascendant = response.ascendant || 0;
    if (mc === 0) mc = response.mc || 0;

    return {
      planets,
      houses,
      ascendant,
      mc,
      date: originalDate,
      latitude,
      longitude,
    };
  }

  static async calculateTransits(
    natalChart: BirthChart,
    transitDate: Date,
    houseSystem: 'whole_sign' | 'placidus' = 'whole_sign',
    transitLocation?: { latitude: number; longitude: number; name: string }
  ): Promise<any> {
    try {
      // If external API is available, use it
      if (API_KEY) {
        const requestData = {
          natal_date: natalChart.date.toISOString().split('T')[0],
          natal_time: natalChart.date.toTimeString().split(' ')[0],
          natal_latitude: natalChart.latitude,
          natal_longitude: natalChart.longitude,
          transit_date: transitDate.toISOString().split('T')[0],
          transit_time: transitDate.toTimeString().split(' ')[0],
          house_system: houseSystem,
          ...(transitLocation && {
            transit_latitude: transitLocation.latitude,
            transit_longitude: transitLocation.longitude,
            transit_place: transitLocation.name
          })
        };

        return await this.makeRequest('/transits', requestData);
      } else {
        // Mock implementation for development/testing
        return this.generateMockTransits(natalChart, transitDate);
      }
    } catch (error) {
      console.error('Error calculating transits:', error);
      // Fallback to mock implementation if external API fails
      return this.generateMockTransits(natalChart, transitDate);
    }
  }

  private static generateMockTransits(natalChart: BirthChart, transitDate: Date): any {
    // Generate realistic transit data based on the natal chart
    const transitPlanets = [
      { name: 'Sun', baseSpeed: 0.985556 }, // ~1 degree per day
      { name: 'Moon', baseSpeed: 13.176389 }, // ~13 degrees per day
      { name: 'Mercury', baseSpeed: 1.383333 },
      { name: 'Venus', baseSpeed: 1.2 },
      { name: 'Mars', baseSpeed: 0.524167 },
      { name: 'Jupiter', baseSpeed: 0.083333 },
      { name: 'Saturn', baseSpeed: 0.034167 },
      { name: 'Uranus', baseSpeed: 0.011667 },
      { name: 'Neptune', baseSpeed: 0.006667 },
      { name: 'Pluto', baseSpeed: 0.004167 }
    ];

    // Calculate days difference between natal and transit date
    const daysDiff = (transitDate.getTime() - natalChart.date.getTime()) / (1000 * 60 * 60 * 24);
    
    // Generate transit planet positions
    const planets = transitPlanets.map(planet => {
      // Find natal position of this planet
      const natalPlanet = natalChart.planets.find(p => p.name === planet.name);
      let baseLongitude = 0;
      
      if (natalPlanet) {
        baseLongitude = natalPlanet.longitude;
      } else {
        // If planet not in natal chart, use a random starting position
        baseLongitude = Math.random() * 360;
      }
      
      // Calculate transit position based on time difference
      const transitLongitude = (baseLongitude + (planet.baseSpeed * daysDiff)) % 360;
      const signIndex = Math.floor(transitLongitude / 30);
      const degreeInSign = transitLongitude % 30;
      
      // Get sign name
      const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
      const sign = signNames[signIndex];
      
      return {
        name: planet.name,
        longitude: transitLongitude,
        latitude: 0,
        distance: 1,
        sign,
        degree: degreeInSign,
        retrograde: Math.random() < 0.1 // 10% chance of retrograde
      };
    });

    // Generate aspects between transit and natal planets
    const aspects: Array<{
      transitPlanet: string;
      natalPlanet: string;
      aspect: string;
      orb: number;
      transitLongitude: number;
      natalLongitude: number;
    }> = [];
    const aspectTypes = [
      { name: 'Conjunction', angle: 0, orb: 8 },
      { name: 'Opposition', angle: 180, orb: 8 },
      { name: 'Square', angle: 90, orb: 8 },
      { name: 'Trine', angle: 120, orb: 6 },
      { name: 'Sextile', angle: 60, orb: 4 }
    ];

    planets.forEach(transitPlanet => {
      natalChart.planets.forEach(natalPlanet => {
        const diff = Math.abs(transitPlanet.longitude - natalPlanet.longitude);
        const actualDiff = Math.min(diff, 360 - diff);
        
        for (const aspect of aspectTypes) {
          if (Math.abs(actualDiff - aspect.angle) <= aspect.orb) {
            aspects.push({
              transitPlanet: transitPlanet.name,
              natalPlanet: natalPlanet.name,
              aspect: aspect.name,
              orb: Math.abs(actualDiff - aspect.angle),
              transitLongitude: transitPlanet.longitude,
              natalLongitude: natalPlanet.longitude
            });
            break; // Only count the closest aspect
          }
        }
      });
    });

    return {
      planets,
      aspects: aspects.sort((a, b) => a.orb - b.orb), // Sort by orb (closest first)
      transitDate: transitDate.toISOString(),
      natalDate: natalChart.date.toISOString()
    };
  }
} 