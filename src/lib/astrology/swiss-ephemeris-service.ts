import type { BirthChart, PlanetPosition } from './astronomia-service';

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
const API_BASE_URL = process.env.EPHEMERIS_API_URL || 'http://127.0.0.1:8001';
const API_KEY = process.env.EPHEMERIS_API_KEY;

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

      const response = await this.makeRequest('/birth-chart', requestData);
      
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
    // This transformation will need to be updated based on the actual API response structure
    // For now, I'll create a basic structure that you can adjust
    
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
    }

    // Extract houses, ascendant, and MC from the response
    const houses = response.houses || [];
    const ascendant = response.ascendant || 0;
    const mc = response.mc || 0;

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
    houseSystem: 'whole_sign' | 'placidus' = 'whole_sign'
  ): Promise<any> {
    try {
      const requestData = {
        natal_date: natalChart.date.toISOString().split('T')[0],
        natal_time: natalChart.date.toTimeString().split(' ')[0],
        natal_latitude: natalChart.latitude,
        natal_longitude: natalChart.longitude,
        transit_date: transitDate.toISOString().split('T')[0],
        house_system: houseSystem,
      };

      return await this.makeRequest('/transits', requestData);
    } catch (error) {
      console.error('Error calculating transits:', error);
      throw new Error(`Failed to calculate transits: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 