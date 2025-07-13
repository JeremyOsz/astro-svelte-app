import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PROKERALA_CLIENT_ID, PROKERALA_CLIENT_SECRET } from '$env/static/private';

const PROKERALA_BASE_URL = 'https://api.prokerala.com';

// Token management
let accessToken: string | null = null;
let tokenExpiry: number = 0;

// Get OAuth2 access token
async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await fetch(`${PROKERALA_BASE_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: PROKERALA_CLIENT_ID,
      client_secret: PROKERALA_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;

  return accessToken as string;
}

export const POST: RequestHandler = async () => {
  try {
    const token = await getAccessToken();
    
    // Test date and location
    const testDate = new Date('1990-01-01T12:00:00Z');
    const testLat = 40.7128; // New York
    const testLng = -74.0060;
    
    const formattedDateTime = testDate.toISOString();

    const params = new URLSearchParams({
      ayanamsa: '1',
      'profile[datetime]': formattedDateTime,
      'profile[coordinates]': `${testLat},${testLng}`
    });

    const response = await fetch(`${PROKERALA_BASE_URL}/v2/astrology/natal-planet-position?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return json({
        success: false,
        error: `API Error: ${response.status} ${response.statusText}`,
        errorDetail: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    
    return json({
      success: true,
      message: 'Raw Prokerala API Response',
      request: {
        url: `${PROKERALA_BASE_URL}/v2/astrology/kundli?${params}`,
        datetime: formattedDateTime,
        coordinates: `${testLat},${testLng}`
      },
      response: data
    });

  } catch (error) {
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const GET: RequestHandler = async () => {
  return json({
    message: 'Send a POST request to see the raw Prokerala API response structure'
  });
}; 