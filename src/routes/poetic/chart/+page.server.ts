import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import {
  BirthChartValidationError,
  calculateBirthChartFromFormData
} from '$lib/server/astrology/birth-chart-calculation';

export const load: PageServerLoad = async () => {
  return {
    chartData: null,
    error: null
  };
};

export const actions: Actions = {
  calculate: async ({ request }) => {
    const formData = await request.formData();

    try {
      return await calculateBirthChartFromFormData(formData, ['poetic_']);
    } catch (error) {
      console.error('Poetic birth chart calculation failed:', error);

      if (error instanceof BirthChartValidationError) {
        return fail(400, {
          error: error.message,
          chartData: null
        });
      }

      return fail(500, {
        error: 'The ephemeris did not answer. Try again in a moment.',
        chartData: null
      });
    }
  }
};
