import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { SwissEphemerisService } from '$lib/astrology/swiss-ephemeris-service';
import { chartStorageService } from '$lib/services/chart-storage';
import { convertTransitDataToCSV, parseNatalChart } from './utils/transit-utils';

export const actions = {
  calculateTransits: async ({ request }) => {
    try {
      const formData = await request.formData();
      
      const selectedBirthChartId = formData.get('selectedBirthChartId') as string;
      const formChartData = formData.get('chartData') as string;
      const birthDataJson = formData.get('birthData') as string;
      const transitDate = formData.get('transitDate') as string;
      const transitTime = formData.get('transitTime') as string;
      const transitLat = parseFloat(formData.get('transitLat') as string);
      const transitLng = parseFloat(formData.get('transitLng') as string);
      const transitLocationName = formData.get('transitLocationName') as string;

      console.log('Server action - selectedBirthChartId:', selectedBirthChartId);
      console.log('Server action - chartData length:', formChartData?.length || 0);

      // Validation
      if (!selectedBirthChartId || !formChartData || !transitDate || !transitTime) {
        return fail(400, { 
          error: 'Missing required fields: birth chart data, transit date, or transit time' 
        });
      }

      // Parse birth data from form
      let birthData;
      try {
        birthData = JSON.parse(birthDataJson);
      } catch (error) {
        return fail(400, { error: 'Invalid birth data format' });
      }

      // Create chart object from form data
      const selectedBirthChart = {
        id: selectedBirthChartId,
        birthData: birthData,
        chartData: formChartData
      };

      const natalChart = parseNatalChart(selectedBirthChart, formChartData);
      
      // Create transit date with time
      const transitDateTime = new Date(`${transitDate}T${transitTime}:00`);
      
      // Calculate transits using the Swiss Ephemeris Service directly
      const currentTransits = await SwissEphemerisService.calculateTransits(
        natalChart,
        transitDateTime,
        'whole_sign',
        {
          latitude: transitLat,
          longitude: transitLng,
          name: transitLocationName
        }
      );

      const transitChartData = convertTransitDataToCSV(currentTransits);
      
      return {
        success: true,
        natalChart,
        currentTransits,
        transitChartData
      };
      
    } catch (error) {
      console.error('Server action error:', error);
      
      let errorMessage = 'An error occurred while calculating transits';
      
      if (error instanceof Error) {
        if (error.message.includes('ECONNREFUSED')) {
          errorMessage = 'Unable to connect to ephemeris service. Please ensure the service is running on port 8001.';
        } else if (error.message.includes('fetch failed')) {
          errorMessage = 'Network error: Unable to reach the ephemeris service. Please check your connection and ensure the service is running.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return fail(500, { error: errorMessage });
    }
  }
} satisfies Actions; 