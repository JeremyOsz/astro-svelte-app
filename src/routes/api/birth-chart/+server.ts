import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SwissEphemerisService } from '$lib/astrology/swiss-ephemeris-service';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { date, latitude, longitude, place, house_system } = await request.json();
    
    if (!date || latitude === undefined || longitude === undefined) {
      return json({ error: 'Missing required fields: date, latitude, longitude' }, { status: 400 });
    }
    
    const birthDate = new Date(date);
    
    // Use Swiss Ephemeris API only
    const chart = await SwissEphemerisService.calculateBirthChart(
      birthDate,
      latitude,
      longitude,
      place || 'Unknown Location',
      house_system || 'whole_sign'
    );
    
    return json(chart);
  } catch (error) {
    console.error('Error calculating birth chart:', error);
    return json({ error: 'Failed to calculate birth chart' }, { status: 500 });
  }
}; 