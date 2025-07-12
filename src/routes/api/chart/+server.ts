import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { calculateBirthChart } from '$lib/chart/mock-chart';
import type { BirthData } from '$lib/types/types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const birthData: BirthData = await request.json();
    
    // Validate input
    if (!birthData.date || !birthData.time || 
        birthData.latitude === undefined || birthData.longitude === undefined || 
        birthData.timezone === undefined) {
      return json({ error: 'Missing required birth data fields' }, { status: 400 });
    }
    
    // Calculate birth chart
    const birthChart = calculateBirthChart(birthData);
    
    return json(birthChart);
  } catch (error) {
    console.error('Error calculating birth chart:', error);
    
    return json(
      { error: 'Failed to calculate birth chart' }, 
      { status: 500 }
    );
  }
}; 