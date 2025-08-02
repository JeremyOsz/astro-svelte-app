import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// Simple in-memory cache for server-side caching
const serverCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { date, time, latitude, longitude, place, house_system } = await request.json();
    
    // Validate required fields
    if (!date || latitude === undefined || longitude === undefined) {
      return json({ error: 'Missing required fields: date, latitude, longitude' }, { status: 400 });
    }
    
    // Create cache key
    const cacheKey = `${date}_${time || ''}_${latitude}_${longitude}_${place || ''}_${house_system || 'whole_sign'}`;
    
    // Check server cache first
    const cached = serverCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return json(cached.data);
    }
    
    // Format the data for the external API
    const apiData = {
      date: date,
      time: time,
      place: place || 'Unknown Location',
      latitude: latitude,
      longitude: longitude,
      house_system: house_system || 'whole_sign'
    };
    
    // Call the external ephemeris API
    const API_BASE_URL = 'https://immanuel-astro.onrender.com';
    const API_KEY = env.EPHEMERIS_API_KEY || '';
    
    const response = await fetch(`${API_BASE_URL}/birth-chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify(apiData)
    });
    
    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Response body:', errorText);
      
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const chartResult = await response.json();
    
    // Prepare response data
    const responseData = {
      ascendant: chartResult.ascendant,
      mc: chartResult.mc,
      houses: chartResult.houses,
      planets: chartResult.planets,
      latitude: chartResult.latitude,
      longitude: chartResult.longitude,
      date: chartResult.date
    };
    
    // Cache the successful response
    serverCache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });
    
    return json(responseData);
    
  } catch (error) {
    console.error('Error calculating birth chart:', error);
    return json({ 
      error: 'Failed to calculate birth chart',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}; 