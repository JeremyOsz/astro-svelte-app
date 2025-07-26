import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DailyHoroscopeService } from '$lib/services/daily-horoscope';
import type { BirthChart, PlanetPosition } from '$lib/types/types';

function parseChartData(chartData: string): PlanetPosition[] {
  const planets: PlanetPosition[] = [];
  const lines = chartData.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('#') || !line.trim()) continue;
    
    const parts = line.split(',');
    if (parts.length >= 4) {
      const name = parts[0];
      const sign = parts[1];
      const degreeStr = parts[2];
      const house = parseInt(parts[3]) || 1;
      
      // Parse degree (e.g., "17°09'" -> 17.15)
      const degreeMatch = degreeStr.match(/(\d+)°(\d+)'/);
      let degree = 0;
      if (degreeMatch) {
        const degrees = parseInt(degreeMatch[1]);
        const minutes = parseInt(degreeMatch[2]);
        degree = degrees + (minutes / 60);
      }
      
      // Calculate longitude based on sign and degree
      const signLongitudes: Record<string, number> = {
        'Aries': 0, 'Taurus': 30, 'Gemini': 60, 'Cancer': 90,
        'Leo': 120, 'Virgo': 150, 'Libra': 180, 'Scorpio': 210,
        'Sagittarius': 240, 'Capricorn': 270, 'Aquarius': 300, 'Pisces': 330
      };
      
      const longitude = (signLongitudes[sign] || 0) + degree;
      
      planets.push({
        name,
        longitude,
        latitude: 0,
        distance: 1,
        sign,
        degree,
        house,
        retrograde: line.includes(',R')
      });
    }
  }
  
  return planets;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { natalChart, date, location } = await request.json();
    
    console.log('Received natal chart:', JSON.stringify(natalChart, null, 2));
    
    if (!natalChart) {
      return json({ error: 'Missing required field: natalChart' }, { status: 400 });
    }
    
    // Handle different natal chart structures
    let birthDate: string;
    let latitude: number;
    let longitude: number;
    
    if (natalChart.birthData) {
      // Structure from saved charts
      birthDate = natalChart.birthData.date;
      latitude = natalChart.birthData.latitude;
      longitude = natalChart.birthData.longitude;
    } else if (natalChart.date) {
      // Direct structure
      birthDate = natalChart.date;
      latitude = natalChart.latitude || 0;
      longitude = natalChart.longitude || 0;
    } else {
      return json({ error: 'Missing natal chart date' }, { status: 400 });
    }
    
    // Parse planets from chartData if available
    let planets = natalChart.planets || [];
    
    if (natalChart.chartData && !Array.isArray(natalChart.planets)) {
      planets = parseChartData(natalChart.chartData);
    }
    
    if (!Array.isArray(planets)) {
      return json({ error: 'Natal chart planets must be an array' }, { status: 400 });
    }
    
    // Create processed natal chart with proper structure
    const processedNatalChart = {
      ...natalChart,
      date: new Date(birthDate),
      latitude,
      longitude,
      planets
    };
    
    // Validate the processed date
    if (isNaN(processedNatalChart.date.getTime())) {
      return json({ error: 'Invalid natal chart date' }, { status: 400 });
    }
    
    // Parse date if provided, otherwise use current date
    const horoscopeDate = date ? new Date(date) : new Date();
    
    // Validate the horoscope date
    if (isNaN(horoscopeDate.getTime())) {
      return json({ error: 'Invalid horoscope date' }, { status: 400 });
    }
    
    // Generate daily horoscope
    const dailyHoroscope = await DailyHoroscopeService.generateDailyHoroscope(
      processedNatalChart,
      horoscopeDate,
      location
    );
    
    return json({
      success: true,
      dailyHoroscope
    });
    
  } catch (error) {
    console.error('Error generating daily horoscope:', error);
    return json({ 
      error: 'Failed to generate daily horoscope',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}; 