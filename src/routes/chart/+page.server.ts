import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { getEphemerisConfig } from '$lib/server/ephemeris';
import { fetchWithRetry } from '$lib/server/http';

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
      const latitude = Number.parseFloat(String(cityData.lat));
      const longitude = Number.parseFloat(String(cityData.lng));

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return fail(400, {
          error: 'Invalid location coordinates',
          chartData: null
        });
      }
      
      // Format the data for the external API
      const apiData = {
        date: birthDate,
        time: birthTime,
        place: cityData.fullLocation,
        latitude,
        longitude,
        house_system: 'whole_sign'
      };
      
      // Call the external API
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
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const chartResult = await response.json();
      
      // Transform the response to the expected format
      const chartData = transformChartData(chartResult);
      
      // Create birth data object
      const birthData = {
        date: birthDate,
        time: birthTime,
        place: cityData.fullLocation,
        latitude,
        longitude
      };
      
      // Return success with the chart data and birth data
      return {
        chartData,
        birthData,
        error: null
      };
      
    } catch (error) {
      console.error('Birth chart calculation failed:', error);
      
      return fail(500, {
        error: 'An error occurred while calculating the chart',
        chartData: null
      });
    }
  }
};

function transformChartData(apiResponse: any): string {
  const planetLines: string[] = [];
  const houseCusps: number[] = [];
  
  // Name mappings for the chart component
  const nameMappings: Record<string, string> = {
    'North Node': 'Node',
    'Part of Fortune': 'Fortune'
  };
  
  // Extract house cusps from the API response
  if (apiResponse.houses && Array.isArray(apiResponse.houses)) {
    houseCusps.push(...apiResponse.houses);
  } else if (apiResponse.native && apiResponse.native.houses) {
    houseCusps.push(...apiResponse.native.houses);
  } else {
    // Look for house cusps in the objects
    if (apiResponse.objects) {
      Object.entries(apiResponse.objects).forEach(([key, object]: [string, any]) => {
        if (object.name && object.name.includes('House')) {
          if (object.longitude && object.longitude.raw !== undefined) {
            houseCusps.push(object.longitude.raw);
          }
        }
      });
    }
    
    // Sort house cusps if we found them
    if (houseCusps.length > 0) {
      houseCusps.sort((a, b) => a - b);
    }
  }
  
  // Extract planets from the objects
  if (apiResponse.objects) {
    Object.entries(apiResponse.objects).forEach(([key, object]: [string, any]) => {
      // Check if this is a planet or celestial object
      if (object.name && object.longitude && object.longitude.raw !== undefined) {
        let name = object.name;
        
        // Skip house cusps - they will be handled separately
        if (name.includes('House')) {
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
      }
    });
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
  }
  
  // Add house cusps line if we have them
  
  if (houseCusps.length === 12) {
    const houseCuspsLine = `#HOUSES:${houseCusps.join(',')}`;
    planetLines.push(houseCuspsLine);
  }
  
  // Combine planets, angles, and house cusps
  const finalData = planetLines.join('\n');
  return finalData;
}
