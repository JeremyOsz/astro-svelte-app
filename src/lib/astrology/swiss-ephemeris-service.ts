import type { BirthChart, PlanetPosition } from "$lib/types/types";
import { getEphemerisConfig } from '$lib/server/ephemeris';
import { fetchWithRetry } from '$lib/server/http';

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

interface LocalDateTimeInput {
  date: string;
  time: string;
}

interface TransitCalculationOptions {
  natalDateTime?: LocalDateTimeInput;
  transitDateTime?: LocalDateTimeInput;
}

// Ensure this service is only used on the server side
if (typeof window !== 'undefined') {
  throw new Error('SwissEphemerisService should only be used on the server side');
}

export class SwissEphemerisService {
  private static async makeRequest(endpoint: string, data: any): Promise<any> {
    const { baseUrl, apiKey } = getEphemerisConfig();
    const url = `${baseUrl}${endpoint}`;
    const response = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(data)
    }, { timeoutMs: 12_000, retries: 1 });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ephemeris API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  }

  private static toDateString(input: Date): string {
    return input.toISOString().split('T')[0];
  }

  private static toTimeString(input: Date): string {
    return input.toTimeString().split(' ')[0];
  }

  private static normalizeTimeString(time: string): string {
    return /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time;
  }

  private static getLocalDateTimeParts(
    input: Date | LocalDateTimeInput,
    fallback?: LocalDateTimeInput
  ): LocalDateTimeInput {
    if (fallback?.date && fallback?.time) {
      return {
        date: fallback.date,
        time: this.normalizeTimeString(fallback.time)
      };
    }

    if (input instanceof Date) {
      return {
        date: this.toDateString(input),
        time: this.toTimeString(input)
      };
    }

    return {
      date: input.date,
      time: this.normalizeTimeString(input.time)
    };
  }

  static async calculateBirthChart(
    date: Date,
    latitude: number,
    longitude: number,
    place: string = 'Unknown Location',
    houseSystem: 'whole_sign' | 'placidus' = 'whole_sign'
  ): Promise<BirthChart> {
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
    // Extract planets from the response
    const planets: PlanetPosition[] = [];
    
    // The actual response structure will depend on what the Swiss Ephemeris API returns
    // You'll need to map the response fields to your PlanetPosition interface
    if (response.planets) {
      response.planets.forEach((planet: any) => {
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
      // Look for planets in the objects
      Object.entries(response.objects).forEach(([key, object]: [string, any]) => {
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
    transitLocation?: { latitude: number; longitude: number; name: string },
    options?: TransitCalculationOptions
  ): Promise<any> {
    // Validate dates
    if (!natalChart.date || isNaN(natalChart.date.getTime())) {
      throw new Error('Invalid natal chart date');
    }
    if (!transitDate || isNaN(transitDate.getTime())) {
      throw new Error('Invalid transit date');
    }

    const natalDateTime = this.getLocalDateTimeParts(natalChart.date, options?.natalDateTime);
    const transitDateTime = this.getLocalDateTimeParts(transitDate, options?.transitDateTime);

    const requestData = {
      natal_date: natalDateTime.date,
      natal_time: natalDateTime.time,
      natal_latitude: natalChart.latitude,
      natal_longitude: natalChart.longitude,
      transit_date: transitDateTime.date,
      transit_time: transitDateTime.time,
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
