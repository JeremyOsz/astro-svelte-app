import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { calculateBirthChart } from '$lib/astrology/prokerala-service';
import { PROKERALA_CLIENT_ID, PROKERALA_CLIENT_SECRET } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Debug environment variables using SvelteKit's $env/static/private
    console.log('Environment debug:');
    console.log('CLIENT_ID exists:', !!PROKERALA_CLIENT_ID);
    console.log('CLIENT_SECRET exists:', !!PROKERALA_CLIENT_SECRET);
    console.log('CLIENT_ID length:', PROKERALA_CLIENT_ID?.length || 0);
    console.log('CLIENT_SECRET length:', PROKERALA_CLIENT_SECRET?.length || 0);
    
    if (!PROKERALA_CLIENT_ID || !PROKERALA_CLIENT_SECRET) {
      return json({
        success: false,
        error: 'Environment variables not found',
        debug: {
          clientId: !!PROKERALA_CLIENT_ID,
          clientSecret: !!PROKERALA_CLIENT_SECRET,
          clientIdLength: PROKERALA_CLIENT_ID?.length || 0,
          clientSecretLength: PROKERALA_CLIENT_SECRET?.length || 0
        }
      }, { status: 500 });
    }
    
    // Test with a simple birth chart calculation
    // const melbourneBirthData = {
    //   // Birth time: 1991-12-10 04:59 AEDT (UTC+11)
    //   // UTC time: 1991-12-09 17:59 UTC
    //   date: new Date('1991-12-09T17:59:00.000Z'),
    //   latitude: -37.814,
    //   longitude: 144.96332,
    //   timezone: 11 // UTC+11 (AEDT)
    // };
    const testDate = new Date('1991-12-09T17:59:00.000Z');
    const testLat = -37.814;
    const testLng = 144.96332;

    const chart = await calculateBirthChart(testDate, testLat, testLng);
    console.log(chart);
    return json({
      success: true,
      message: 'Prokerala API integration working!',
      planetsCount: chart.planets.length,
      ascendant: chart.ascendant,
      mc: chart.mc
    });
  } catch (error) {
    console.error('Prokerala API test failed:', error);
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Please check your Prokerala API credentials and ensure they are set in your .env file'
    }, { status: 500 });
  }
};

export const GET: RequestHandler = async () => {
  return json({
    message: 'Send a POST request to test the Prokerala API integration',
    instructions: [
      '1. Set up your Prokerala API credentials in .env file',
      '2. Send a POST request to this endpoint',
      '3. Check the response for integration status'
    ]
  });
}; 