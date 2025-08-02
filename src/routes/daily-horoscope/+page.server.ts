import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { SwissEphemerisService } from '$lib/astrology/swiss-ephemeris-service';
import { DailyHoroscopeService } from '$lib/services/daily-horoscope';
import type { BirthChart } from '$lib/types/types';
import { ZODIAC_DETAILED } from '$lib/data/astrological-data';

// Parse natal chart data from stored chart (copied from transit-utils.ts)
function parseNatalChart(selectedBirthChart: any, chartData: string): BirthChart {
  if (!chartData) {
    throw new Error('Failed to load birth chart data');
  }

  const natalChart: BirthChart = {
    planets: [],
    houses: [],
    ascendant: 0,
    mc: 0,
    date: new Date(selectedBirthChart.birthData.date + 'T' + selectedBirthChart.birthData.time),
    latitude: selectedBirthChart.birthData.latitude,
    longitude: selectedBirthChart.birthData.longitude
  };
  
  // Parse the chart data string to extract planet positions
  const lines = chartData.split('\n');
  
  lines.forEach((line: string) => {
    const [name, sign, degree] = line.split(',');
    if (name && sign && degree) {
      const degreeMatch = degree.match(/(\d+)°(\d+)'/);
      if (degreeMatch) {
        const deg = parseInt(degreeMatch[1]);
        const min = parseInt(degreeMatch[2]);
        const decimal = deg + min / 60;
        
        const signIndex = ZODIAC_DETAILED.findIndex(s => s.name === sign);
        const longitude = signIndex * 30 + decimal;
        
        natalChart.planets.push({
          name,
          longitude,
          latitude: 0,
          distance: 1,
          sign,
          degree: decimal,
          retrograde: line.includes(',R')
        });
      }
    }
  });

  // Calculate ascendant and default houses using Whole Sign
  const asc = natalChart.planets.find((p: any) => p.name === 'ASC' || p.name === 'Asc');
  if (asc) {
    natalChart.ascendant = asc.longitude;
  }

  if (!natalChart.houses || natalChart.houses.length === 0) {
    const ascSignIndex = Math.floor((natalChart.ascendant || 0) / 30);
    natalChart.houses = Array.from({ length: 12 }, (_, i) => ((ascSignIndex + i) % 12) * 30);
  }

  return natalChart;
}

export const actions = {
  generateHoroscope: async ({ request }) => {
    try {
      const formData = await request.formData();
      
      const natalChartJson = formData.get('natalChart') as string;
      const date = formData.get('date') as string;



      // Validation
      if (!natalChartJson || !date) {
        return fail(400, { 
          error: 'Missing required fields: natal chart data or date' 
        });
      }

      // Parse natal chart from form
      let selectedBirthChart: any;
      try {
        selectedBirthChart = JSON.parse(natalChartJson);
      } catch (error) {
        return fail(400, { error: 'Invalid natal chart data format' });
      }

      // Parse the natal chart data properly like the transits page does
      const natalChart = parseNatalChart(selectedBirthChart, selectedBirthChart.chartData);

      // Validate the date
      const horoscopeDate = new Date(date);
      if (isNaN(horoscopeDate.getTime())) {
        return fail(400, { error: 'Invalid date format' });
      }

      // Generate daily horoscope using the service (which will call Swiss Ephemeris Service)
      const dailyHoroscope = await DailyHoroscopeService.generateDailyHoroscope(
        natalChart,
        horoscopeDate
      );

      return {
        success: true,
        dailyHoroscope
      };
      
    } catch (error) {
      console.error('Server action error:', error);
      
      let errorMessage = 'An error occurred while generating the horoscope';
      
      if (error instanceof Error) {
        if (error.message.includes('ECONNREFUSED')) {
          errorMessage = 'Unable to connect to ephemeris service. Please ensure the service is running.';
        } else if (error.message.includes('fetch failed')) {
          errorMessage = 'Network error: Unable to reach the ephemeris service. Please check your connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return fail(500, { error: errorMessage });
    }
  }
} satisfies Actions; 