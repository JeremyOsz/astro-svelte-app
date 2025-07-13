import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { calculateBirthChart } from '$lib/astrology/prokerala-service';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const requestData = await request.json();
    const { date, time, latitude, longitude, timezone } = requestData;
    
    if (!date || latitude === undefined || longitude === undefined) {
      return json({ error: 'Missing required fields: date, latitude, longitude' }, { status: 400 });
    }
    
    // For astronomical calculations, we need the Date to represent local solar time
    let birthDate: Date;
    if (time && timezone !== undefined) {
      // Create the date/time string in local format
      const dateTimeString = `${date}T${time}:00`;
      
      // Create a date object and adjust for timezone offset
      // The timezone offset is in hours from UTC (e.g., -5 for EST, +11 for AEDT)
      const localDate = new Date(dateTimeString);
      
      // Adjust for timezone offset to get UTC time, then create the birth date
      // For astrological calculations, we want the local solar time at the birth location
      const utcTime = localDate.getTime() - (timezone * 60 * 60 * 1000);
      birthDate = new Date(utcTime);
    } else {
      // If no time provided, use noon local time
      birthDate = new Date(`${date}T12:00:00`);
    }
    
    const chart = calculateBirthChart(birthDate, latitude, longitude);
    
    return json(chart);
  } catch (error) {
    console.error('Error calculating birth chart:', error);
    return json({ error: 'Failed to calculate birth chart' }, { status: 500 });
  }
}; 