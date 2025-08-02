import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// Simple in-memory cache for server-side caching
const serverCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

interface SynastryRequest {
  person1: {
    date: string;
    time: string;
    latitude: number;
    longitude: number;
    place?: string;
  };
  person2: {
    date: string;
    time: string;
    latitude: number;
    longitude: number;
    place?: string;
  };
  house_system?: 'whole_sign' | 'placidus';
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { person1, person2, house_system = 'whole_sign' } = await request.json() as SynastryRequest;
    
    // Validate required fields
    if (!person1.date || person1.latitude === undefined || person1.longitude === undefined) {
      return json({ error: 'Missing required fields for person1: date, latitude, longitude' }, { status: 400 });
    }
    if (!person2.date || person2.latitude === undefined || person2.longitude === undefined) {
      return json({ error: 'Missing required fields for person2: date, latitude, longitude' }, { status: 400 });
    }
    
    // Create cache key
    const cacheKey = `synastry_${person1.date}_${person1.time}_${person1.latitude}_${person1.longitude}_${person2.date}_${person2.time}_${person2.latitude}_${person2.longitude}_${house_system}`;
    
    // Check server cache first
    const cached = serverCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return json(cached.data);
    }
    
    // Format the data for the external API
    const apiData = {
      person1: {
        date: person1.date,
        time: person1.time,
        place: person1.place || 'Unknown Location',
        latitude: person1.latitude,
        longitude: person1.longitude
      },
      person2: {
        date: person2.date,
        time: person2.time,
        place: person2.place || 'Unknown Location',
        latitude: person2.latitude,
        longitude: person2.longitude
      },
      house_system: house_system
    };
    
    // Call the external ephemeris API
    const API_BASE_URL = 'https://immanuel-astro.onrender.com';
    const API_KEY = env.EPHEMERIS_API_KEY || '';
    
    const response = await fetch(`${API_BASE_URL}/synastry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify(apiData)
    });
    
    if (!response.ok) {
      console.error('Synastry API request failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Response body:', errorText);
      
      throw new Error(`Synastry API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const synastryResult = await response.json();
    
    // Prepare response data
    const responseData = {
      person1_chart: synastryResult.person1_chart,
      person2_chart: synastryResult.person2_chart,
      aspects: synastryResult.aspects || [],
      house_overlays: synastryResult.house_overlays || [],
      composite_points: synastryResult.composite_points || []
    };
    
    // Cache the successful response
    serverCache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });
    
    return json(responseData);
    
  } catch (error) {
    console.error('Error calculating synastry:', error);
    return json({ 
      error: 'Failed to calculate synastry',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}; 