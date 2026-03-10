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
    const { date, time, latitude, longitude, place, house_system } = await request.json();
    
    // Validate required fields
    if (!date || !isFiniteNumber(latitude) || !isFiniteNumber(longitude)) {
      return json({ error: 'Missing required fields: date, latitude, longitude' }, { status: 400 });
    }

    if (Number.isNaN(new Date(date).getTime())) {
      return json({ error: 'Invalid date format' }, { status: 400 });
    }
    
    // Create cache key
    const cacheKey = `${date}_${time || ''}_${latitude}_${longitude}_${place || ''}_${house_system || 'whole_sign'}`;
    
    // Check server cache first
    const cached = serverCache.get(cacheKey);
    if (cached) {
      return json(cached);
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
    
    // Return all the data from the external API, not just a subset
    const responseData = {
      ...chartResult,
      latitude: chartResult.latitude || latitude,
      longitude: chartResult.longitude || longitude,
      date: chartResult.date || date
    };
    
    // Cache the successful response
    serverCache.set(cacheKey, responseData);
    
    return json(responseData);
    
  } catch (error) {
    console.error('Error calculating birth chart:', error);
    return json({ 
      error: 'Failed to calculate birth chart'
    }, { status: 500 });
  }
}; 
