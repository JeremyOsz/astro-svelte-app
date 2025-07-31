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
const API_BASE_URL = env.EPHEMERIS_URL || 'http://127.0.0.1:8001';
const API_KEY = env.EPHEMERIS_API_KEY;

// Ensure this service is only used on the server side
if (typeof window !== 'undefined') {
  throw new Error('SwissEphemerisService should only be used on the server side');
}

export class SwissEphemerisService {
  private static async makeRequest(endpoint: string, data: any): Promise<any> {
    if (!API_KEY) {
      throw new Error('EPHEMERIS_API_KEY environment variable is not set. Please configure the ephemeris API.');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ephemeris API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  }

  static async calculateBirthChart(
    date: Date,
    latitude: number,
    longitude: number,
    place: string = 'Unknown Location',
    houseSystem: 'whole_sign' | 'placidus' = 'whole_sign'
  ): Promise<BirthChart> {
    // Check if API is configured
    if (!API_KEY) {
      throw new Error('EPHEMERIS_API_KEY environment variable is not set. Please configure the ephemeris API.');
    }

    const requestData: SwissEphemerisBirthData = {
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().split(' ')[0],
      place,
      latitude,
      longitude,
      house_system: houseSystem
    };

    const response = await this.makeRequest('/birth-chart', requestData);
    return this.transformBirthChartResponse(response, date, latitude, longitude);
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
    // Validate dates
    if (!natalChart.date || isNaN(natalChart.date.getTime())) {
      throw new Error('Invalid natal chart date');
    }
    if (!transitDate || isNaN(transitDate.getTime())) {
      throw new Error('Invalid transit date');
    }

    // Check if API is configured
    if (!API_KEY) {
      throw new Error('EPHEMERIS_API_KEY environment variable is not set. Please configure the ephemeris API.');
    }

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
  }
} 