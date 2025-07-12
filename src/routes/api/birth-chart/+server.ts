import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { calculateBirthChart } from '$lib/astrology/astronomia-service';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { date, latitude, longitude } = await request.json();
    
    if (!date || latitude === undefined || longitude === undefined) {
      return json({ error: 'Missing required fields: date, latitude, longitude' }, { status: 400 });
    }
    
    const birthDate = new Date(date);
    const chart = calculateBirthChart(birthDate, latitude, longitude);
    
    return json(chart);
  } catch (error) {
    console.error('Error calculating birth chart:', error);
    return json({ error: 'Failed to calculate birth chart' }, { status: 500 });
  }
}; 