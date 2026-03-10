import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEphemerisConfig } from '$lib/server/ephemeris';
import { fetchWithRetry } from '$lib/server/http';
import { BoundedTTLCache } from '$lib/server/bounded-cache';

const serverCache = new BoundedTTLCache<any>(500, 60 * 60 * 1000);

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

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json() as Partial<SynastryRequest>;
    const person1 = body.person1;
    const person2 = body.person2;
    const house_system = body.house_system || 'whole_sign';

    if (!person1 || !person2) {
      return json({ error: 'person1 and person2 are required objects' }, { status: 400 });
    }
    
    // Validate required fields
    if (!person1.date || !isFiniteNumber(person1.latitude) || !isFiniteNumber(person1.longitude)) {
      return json({ error: 'Missing required fields for person1: date, latitude, longitude' }, { status: 400 });
    }
    if (!person2.date || !isFiniteNumber(person2.latitude) || !isFiniteNumber(person2.longitude)) {
      return json({ error: 'Missing required fields for person2: date, latitude, longitude' }, { status: 400 });
    }
    if (Number.isNaN(new Date(person1.date).getTime()) || Number.isNaN(new Date(person2.date).getTime())) {
      return json({ error: 'Invalid date format for person1 or person2' }, { status: 400 });
    }
    
    // Create cache key
    const cacheKey = `synastry_${person1.date}_${person1.time}_${person1.latitude}_${person1.longitude}_${person2.date}_${person2.time}_${person2.latitude}_${person2.longitude}_${house_system}`;
    
    // Check server cache first
    const cached = serverCache.get(cacheKey);
    if (cached) {
      return json(cached);
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
    const { baseUrl, apiKey } = getEphemerisConfig();
    
    const response = await fetchWithRetry(`${baseUrl}/synastry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(apiData)
    }, { timeoutMs: 12_000, retries: 1 });
    
    if (!response.ok) {
      console.error('Synastry API request failed:', response.status, response.statusText);
      throw new Error(`Synastry API request failed: ${response.status} ${response.statusText}`);
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
    serverCache.set(cacheKey, responseData);
    
    return json(responseData);
    
  } catch (error) {
    console.error('Error calculating synastry:', error);
    return json({ 
      error: 'Failed to calculate synastry'
    }, { status: 500 });
  }
}; 
