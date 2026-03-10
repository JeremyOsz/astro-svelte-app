import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEphemerisConfig } from '$lib/server/ephemeris';
import { fetchWithRetry } from '$lib/server/http';
import { BoundedTTLCache } from '$lib/server/bounded-cache';

const serverCache = new BoundedTTLCache<any>(500, 60 * 60 * 1000);

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { date, time, latitude, longitude, house_system } = await request.json();

    if (!date || Number.isNaN(new Date(date).getTime())) {
      return json({ error: 'Invalid or missing date' }, { status: 400 });
    }
    if (latitude !== undefined && !isFiniteNumber(latitude)) {
      return json({ error: 'Invalid latitude' }, { status: 400 });
    }
    if (longitude !== undefined && !isFiniteNumber(longitude)) {
      return json({ error: 'Invalid longitude' }, { status: 400 });
    }
    
    // Create cache key
    const cacheKey = `${date}_${time}_${latitude}_${longitude}_${house_system}`;
    
    // Check server cache first
    const cached = serverCache.get(cacheKey);
    if (cached) {
      return json(cached);
    }
    
    // Format the data for the external API
    const apiData = {
      date: date,
      time: time,
      place: 'Current Location',
      latitude: isFiniteNumber(latitude) ? latitude : 51.5074,
      longitude: isFiniteNumber(longitude) ? longitude : -0.1278,
      house_system: house_system || 'whole_sign'
    };
    
    // Call the external ephemeris API
    const { baseUrl, apiKey } = getEphemerisConfig();
    
    const response = await fetchWithRetry(`${baseUrl}/birth-chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(apiData)
    }, { timeoutMs: 12_000, retries: 1 });
    
    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const chartResult = await response.json();
    
    // Prepare response data
    const responseData = {
      success: true,
      objects: chartResult.objects,
      native: chartResult.native
    };
    
    // Cache the successful response
    serverCache.set(cacheKey, responseData);
    
    // Return the raw API response for planet positions
    return json(responseData);
    
  } catch (error) {
    console.error('Error fetching current positions:', error);
    return json({ 
      error: 'Failed to fetch current planet positions'
    }, { status: 500 });
  }
}; 
