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
      const birthDate = formData.get('birthDate') as string;
      const birthTime = formData.get('birthTime') as string;
      const cityDataStr = formData.get('cityData') as string;
      
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
      
      // Call the external API
      const response = await fetch('http://127.0.0.1:8001/birth-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': env.EPHEMERIS_API_KEY || ''
        },
        body: JSON.stringify(apiData)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const chartResult = await response.json();
      
      console.log('Raw API response:', JSON.stringify(chartResult, null, 2));
      console.log('API response keys:', Object.keys(chartResult));
      
      if (chartResult.objects) {
        console.log('Objects keys:', Object.keys(chartResult.objects));
        console.log('First object example:', Object.values(chartResult.objects)[0]);
      }
      
      // Transform the response to the expected format
      const chartData = transformChartData(chartResult);
      
      console.log('Transformed chart data:', chartData);
      
      // Return success with the chart data
      return {
        success: true,
        chartData,
        error: null
      };
      
    } catch (error) {
      console.error('Error calculating birth chart:', error);
      return fail(500, {
        error: error instanceof Error ? error.message : 'An error occurred while calculating the chart',
        chartData: null
      });
    }
  }
};

function transformChartData(apiResponse: any): string {
  console.log('Transforming API response:', apiResponse);
  const lines: string[] = [];
  
  // Name mappings for the chart component
  const nameMappings: Record<string, string> = {
    'North Node': 'Node',
    'Part of Fortune': 'Fortune'
  };
  

  
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
        
        // Format: Planet,Sign,Degree°Minutes'
        let line = `${name},${sign},${degrees}°${minutes.toString().padStart(2, '0')}'`;
        
        // Add retrograde indicator if applicable
        if (object.movement && object.movement.retrograde) {
          line += ',R';
        }
        
        lines.push(line);
        console.log('Added line:', line);
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
    lines.push(ascLine);
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
    lines.push(mcLine);
    console.log('Added MC line:', mcLine);
  }
  
  console.log('Final chart data lines:', lines);
  return lines.join('\n');
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