import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { calculateTransits, type BirthChart } from '$lib/astrology/astronomia-service';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { natalChart, transitDate } = await request.json();
    
    if (!natalChart || !transitDate) {
      return json({ error: 'Missing required fields: natalChart, transitDate' }, { status: 400 });
    }
    
    const transitDateObj = new Date(transitDate);
    const transits = calculateTransits(natalChart as BirthChart, transitDateObj);
    
    return json(transits);
  } catch (error) {
    console.error('Error calculating transits:', error);
    return json({ error: 'Failed to calculate transits' }, { status: 500 });
  }
}; 