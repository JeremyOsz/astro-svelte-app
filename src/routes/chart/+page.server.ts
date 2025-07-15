import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async () => {
  return {
    chartData: null,
    error: null
  };
};

export const actions: Actions = {
  calculate: async ({ request }) => {
    const formData = await request.formData();
    
    try {
      // Handle both prefixed and non-prefixed field names
      const birthDate = (formData.get('birthDate') || formData.get('mobile_birthDate') || formData.get('desktop_birthDate')) as string;
      const birthTime = (formData.get('birthTime') || formData.get('mobile_birthTime') || formData.get('desktop_birthTime')) as string;
      const cityDataStr = (formData.get('cityData') || formData.get('mobile_cityData') || formData.get('desktop_cityData')) as string;
      
      if (!birthDate || !birthTime || !cityDataStr) {
        return fail(400, {
          error: 'Please fill in all required fields',
          chartData: null
        });
      }
      
      const cityData = JSON.parse(cityDataStr);
      
      // Format the data for the external API
      const apiData = {
        date: birthDate,
        time: birthTime,
        place: cityData.fullLocation,
        latitude: parseFloat(cityData.lat),
        longitude: parseFloat(cityData.lng),
        house_system: 'whole_sign'
      };
      
      console.log('Sending API request with data:', JSON.stringify(apiData, null, 2));
      
      // Call the external API
      const API_BASE_URL = 'https://immanuel-astro.onrender.com';
      const API_KEY = env.EPHEMERIS_API_KEY || '';
      
      // Debug logs for API configuration
      console.log('=== API CONFIGURATION DEBUG ===');
      console.log('API Base URL:', API_BASE_URL);
      console.log('API Key present:', !!API_KEY);
      console.log('API Key length:', API_KEY.length);
      console.log('API Key preview:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT SET');
      console.log('Full request URL:', `${API_BASE_URL}/birth-chart`);
      
      const response = await fetch(`${API_BASE_URL}/birth-chart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify(apiData)
      });
      
      if (!response.ok) {
        console.error('=== API REQUEST FAILED ===');
        console.error('Response status:', response.status);
        console.error('Response status text:', response.statusText);
        console.error('API Base URL:', API_BASE_URL);
        console.error('API Key present:', !!API_KEY);
        console.error('API Key length:', API_KEY.length);
        console.error('API Key preview:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT SET');
        
        const errorText = await response.text();
        console.error('Response body:', errorText);
        
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const chartResult = await response.json();
      
      console.log('API Response Status:', response.status);
      console.log('Raw API response:', JSON.stringify(chartResult, null, 2));
      console.log('API response keys:', Object.keys(chartResult));
      
      if (chartResult.objects) {
        console.log('Objects keys:', Object.keys(chartResult.objects));
        console.log('First object example:', Object.values(chartResult.objects)[0]);
      }
      
      // Transform the response to the expected format
      const chartData = transformChartData(chartResult);
      
      console.log('Transformed chart data:', chartData);
      
      // Create birth data object
      const birthData = {
        date: birthDate,
        time: birthTime,
        place: cityData.fullLocation,
        latitude: parseFloat(cityData.lat),
        longitude: parseFloat(cityData.lng)
      };
      
      // Return success with the chart data and birth data
      return {
        chartData,
        birthData,
        error: null
      };
      
    } catch (error) {
      console.error('=== BIRTH CHART CALCULATION ERROR ===');
      console.error('Error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Log API configuration on error
      const API_BASE_URL = 'https://immanuel-astro.onrender.com';
      const API_KEY = env.EPHEMERIS_API_KEY || '';
      console.error('API Base URL:', API_BASE_URL);
      console.error('API Key present:', !!API_KEY);
      console.error('API Key length:', API_KEY.length);
      console.error('API Key preview:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT SET');
      
      return fail(500, {
        error: error instanceof Error ? error.message : 'An error occurred while calculating the chart',
        chartData: null
      });
    }
  }
};

function transformChartData(apiResponse: any): string {
  console.log('Transforming API response:', apiResponse);
  const planetLines: string[] = [];
  const houseCusps: number[] = [];
  
  // Name mappings for the chart component
  const nameMappings: Record<string, string> = {
    'North Node': 'Node',
    'Part of Fortune': 'Fortune'
  };
  
  // Extract house cusps from the API response
  console.log('=== SEARCHING FOR HOUSE CUSPS ===');
  console.log('API response keys:', Object.keys(apiResponse));
  
  if (apiResponse.houses && Array.isArray(apiResponse.houses)) {
    console.log('Found houses array:', apiResponse.houses);
    houseCusps.push(...apiResponse.houses);
  } else if (apiResponse.native && apiResponse.native.houses) {
    console.log('Found houses in native:', apiResponse.native.houses);
    houseCusps.push(...apiResponse.native.houses);
  } else {
    console.log('No house cusps found in expected locations');
    console.log('Checking for house cusps in objects...');
    
    // Look for house cusps in the objects
    if (apiResponse.objects) {
      Object.entries(apiResponse.objects).forEach(([key, object]: [string, any]) => {
        if (object.name && object.name.includes('House')) {
          console.log('Found house cusp object:', key, object);
          if (object.longitude && object.longitude.raw !== undefined) {
            houseCusps.push(object.longitude.raw);
            console.log('Added house cusp:', object.longitude.raw);
          }
        }
      });
    }
    
    // Sort house cusps if we found them
    if (houseCusps.length > 0) {
      houseCusps.sort((a, b) => a - b);
      console.log('Sorted house cusps:', houseCusps);
    } else {
      console.log('No house cusps found in API response, will use fallback calculation');
    }
  }
  
  // Extract planets from the objects
  if (apiResponse.objects) {
    console.log('Found objects, processing...');
    Object.entries(apiResponse.objects).forEach(([key, object]: [string, any]) => {
      console.log('Processing object:', key, object);
      console.log('Object keys:', Object.keys(object));
      
      // Check if this is a planet or celestial object
      if (object.name && object.longitude && object.longitude.raw !== undefined) {
        console.log('Valid object found:', object.name);
        let name = object.name;
        
        // Skip house cusps - they will be handled separately
        if (name.includes('House')) {
          console.log('Skipping house cusp:', name);
          return;
        }
        
        // Apply name mapping if needed
        if (nameMappings[name]) {
          name = nameMappings[name];
        }
        
        const longitude = object.longitude.raw;
        
        // Convert longitude to sign and degree
        const signIndex = Math.floor(longitude / 30);
        const degreeInSign = longitude % 30;
        const degrees = Math.floor(degreeInSign);
        const minutes = Math.floor((degreeInSign - degrees) * 60);
        
        const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
        const sign = zodiacSigns[signIndex];
        
        // Get house number from API if available
        const houseNumber = object.house?.number || object.house || '';
        
        // Format: Planet,Sign,Degree°Minutes',House
        let line = `${name},${sign},${degrees}°${minutes.toString().padStart(2, '0')}'`;
        
        // Add house number if available
        if (houseNumber !== '') {
          line += `,${houseNumber}`;
        }
        
        // Add retrograde indicator if applicable
        if (object.movement && object.movement.retrograde) {
          line += ',R';
        }
        
        planetLines.push(line);
        console.log('Added planet line:', line);
      } else {
        console.log('Skipping object - missing required fields:', {
          hasName: !!object.name,
          hasLongitude: !!(object.longitude && object.longitude.raw !== undefined)
        });
      }
    });
  } else {
    console.log('No objects found in API response');
  }
  
  // Add ASC and MC if they exist in the response
  if (apiResponse.native && apiResponse.native.ascendant) {
    const ascLongitude = apiResponse.native.ascendant.longitude;
    const signIndex = Math.floor(ascLongitude / 30);
    const degreeInSign = ascLongitude % 30;
    const degrees = Math.floor(degreeInSign);
    const minutes = Math.floor((degreeInSign - degrees) * 60);
    
    const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const sign = zodiacSigns[signIndex];
    
    const ascLine = `ASC,${sign},${degrees}°${minutes.toString().padStart(2, '0')}'`;
    planetLines.push(ascLine);
    console.log('Added ASC line:', ascLine);
  }
  
  if (apiResponse.native && apiResponse.native.mc) {
    const mcLongitude = apiResponse.native.mc.longitude;
    const signIndex = Math.floor(mcLongitude / 30);
    const degreeInSign = mcLongitude % 30;
    const degrees = Math.floor(degreeInSign);
    const minutes = Math.floor((degreeInSign - degrees) * 60);
    
    const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const sign = zodiacSigns[signIndex];
    
    const mcLine = `MC,${sign},${degrees}°${minutes.toString().padStart(2, '0')}'`;
    planetLines.push(mcLine);
    console.log('Added MC line:', mcLine);
  }
  
  // Add house cusps line if we have them
  console.log('=== HOUSE CUSPS SUMMARY ===');
  console.log('House cusps found:', houseCusps.length);
  console.log('House cusps:', houseCusps);
  
  if (houseCusps.length === 12) {
    const houseCuspsLine = `#HOUSES:${houseCusps.join(',')}`;
    planetLines.push(houseCuspsLine);
    console.log('Added house cusps line:', houseCuspsLine);
  } else {
    console.log('WARNING: Expected 12 house cusps, but found', houseCusps.length);
  }
  
  // Combine planets, angles, and house cusps
  console.log('=== FINAL CHART DATA ===');
  console.log('Total lines:', planetLines.length);
  console.log('Final chart data lines:', planetLines);
  const finalData = planetLines.join('\n');
  console.log('Final chart data string:', finalData);
  return finalData;
}



function formatDegrees(decimal: number): string {
  const deg = Math.floor(decimal);
  const min = Math.round((decimal - deg) * 60);
  return `${deg}°${min.toString().padStart(2, '0')}'`;
}

function getSignByDegree(longitude: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  const signIndex = Math.floor(longitude / 30);
  return signs[signIndex % 12];
} 