import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// Simple in-memory cache for server-side caching
const serverCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { date, time, latitude, longitude, house_system } = await request.json();
    
    // Create cache key
    const cacheKey = `${date}_${time}_${latitude}_${longitude}_${house_system}`;
    
    // Check server cache first
    const cached = serverCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('Server cache hit for planet positions');
      return json(cached.data);
    }
    
    // Format the data for the external API
    const apiData = {
      date: date,
      time: time,
      place: "London, UK", // Default place name
      latitude: latitude || 51.5074, // London coordinates
      longitude: longitude || -0.1278,
      house_system: house_system || 'whole_sign'
    };
    
    console.log('Sending API request with data:', JSON.stringify(apiData, null, 2));
    
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
    
    console.log('API Response Status:', response.status);
    console.log('Raw API response:', JSON.stringify(chartResult, null, 2));
    
    // Prepare response data
    const responseData = {
      success: true,
      objects: chartResult.objects,
      native: chartResult.native
    };
    
    // Cache the successful response
    serverCache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });
    
    // Return the raw API response for planet positions
    return json(responseData);
    
  } catch (error) {
    console.error('Error fetching current positions:', error);
    return json({ 
      error: 'Failed to fetch current planet positions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}; 