import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async () => {
  return {
    synastryData: null,
    error: null
  };
};

export const actions: Actions = {
  calculate: async ({ request }) => {
    const formData = await request.formData();
    
    try {
      // Extract form data for both people
      const person1Date = formData.get('person1Date') as string;
      const person1Time = formData.get('person1Time') as string;
      const person1CityDataStr = formData.get('person1CityData') as string;
      
      const person2Date = formData.get('person2Date') as string;
      const person2Time = formData.get('person2Time') as string;
      const person2CityDataStr = formData.get('person2CityData') as string;
      
      const relationshipType = formData.get('relationshipType') as string || 'romance';
      const houseSystem = formData.get('houseSystem') as string || 'whole_sign';
      
      if (!person1Date || !person1Time || !person1CityDataStr || 
          !person2Date || !person2Time || !person2CityDataStr) {
        return fail(400, {
          error: 'Please fill in all required fields for both people',
          synastryData: null
        });
      }
      
      const person1CityData = JSON.parse(person1CityDataStr);
      const person2CityData = JSON.parse(person2CityDataStr);
      
      // Format the data for the external API
      const apiData = {
        person1: {
          date: person1Date,
          time: person1Time,
          place: person1CityData.fullLocation,
          latitude: parseFloat(person1CityData.lat),
          longitude: parseFloat(person1CityData.lng)
        },
        person2: {
          date: person2Date,
          time: person2Time,
          place: person2CityData.fullLocation,
          latitude: parseFloat(person2CityData.lat),
          longitude: parseFloat(person2CityData.lng)
        },
        house_system: houseSystem,
        relationship_type: relationshipType
      };
      
      // Call the external API for both birth charts
      const API_BASE_URL = 'https://immanuel-astro.onrender.com';
      const API_KEY = env.EPHEMERIS_API_KEY || '';
      
      // Calculate birth charts for both people
      const [person1Response, person2Response] = await Promise.all([
        fetch(`${API_BASE_URL}/birth-chart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY
          },
          body: JSON.stringify({
            date: person1Date,
            time: person1Time,
            place: person1CityData.fullLocation,
            latitude: parseFloat(person1CityData.lat),
            longitude: parseFloat(person1CityData.lng),
            house_system: houseSystem
          })
        }),
        fetch(`${API_BASE_URL}/birth-chart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY
          },
          body: JSON.stringify({
            date: person2Date,
            time: person2Time,
            place: person2CityData.fullLocation,
            latitude: parseFloat(person2CityData.lat),
            longitude: parseFloat(person2CityData.lng),
            house_system: houseSystem
          })
        })
      ]);
      
      if (!person1Response.ok || !person2Response.ok) {
        const errorText1 = await person1Response.text();
        const errorText2 = await person2Response.text();
        throw new Error(`Birth chart API request failed: Person1(${person1Response.status}) Person2(${person2Response.status})`);
      }
      
      const person1Chart = await person1Response.json();
      const person2Chart = await person2Response.json();
      
      // Calculate synastry aspects locally
      const synastryResult = calculateSynastryAspects(person1Chart, person2Chart);
      
      // Transform the response to the expected format
      const person1ChartData = transformChartData(person1Chart);
      const person2ChartData = transformChartData(person2Chart);
      
      // Create synastry data object
      const synastryData = {
        person1_chart: person1Chart,
        person2_chart: person2Chart,
        person1_chart_data: person1ChartData,
        person2_chart_data: person2ChartData,
        aspects: synastryResult.aspects || [],
        house_overlays: synastryResult.house_overlays || [],
        composite_points: synastryResult.composite_points || [],
        relationship_type: relationshipType
      };
      
      // Return success with the synastry data
      return {
        synastryData,
        error: null
      };
      
    } catch (error) {
      console.error('=== SYNASTRY CALCULATION ERROR ===');
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
        error: error instanceof Error ? error.message : 'An error occurred while calculating the synastry',
        synastryData: null
      });
    }
  }
};

function transformChartData(apiResponse: any): string {
  if (!apiResponse || !apiResponse.objects) {
    return '';
  }
  
  const planetLines: string[] = [];
  
  // Name mappings for the chart component
  const nameMappings: Record<string, string> = {
    'North Node': 'Node',
    'Part of Fortune': 'Fortune'
  };
  
  // Extract planets from the objects
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
  
  // Add ASC and MC if they exist in the response
  if (apiResponse.ascendant) {
    const ascLongitude = apiResponse.ascendant;
    const signIndex = Math.floor(ascLongitude / 30);
    const degreeInSign = ascLongitude % 30;
    const degrees = Math.floor(degreeInSign);
    const minutes = Math.floor((degreeInSign - degrees) * 60);
    
    const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const sign = zodiacSigns[signIndex];
    
    const ascLine = `ASC,${sign},${degrees}°${minutes.toString().padStart(2, '0')}'`;
    planetLines.push(ascLine);
  }
  
  if (apiResponse.mc) {
    const mcLongitude = apiResponse.mc;
    const signIndex = Math.floor(mcLongitude / 30);
    const degreeInSign = mcLongitude % 30;
    const degrees = Math.floor(degreeInSign);
    const minutes = Math.floor((degreeInSign - degrees) * 60);
    
    const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const sign = zodiacSigns[signIndex];
    
    const mcLine = `MC,${sign},${degrees}°${minutes.toString().padStart(2, '0')}'`;
    planetLines.push(mcLine);
  }
  
  // Combine planets and angles
  return planetLines.join('\n');
}

function calculateSynastryAspects(person1Chart: any, person2Chart: any): any {
  const aspects: any[] = [];
  const houseOverlays: any[] = [];
  
  if (!person1Chart.objects || !person2Chart.objects) {
    return { aspects, house_overlays: houseOverlays, composite_points: [] };
  }
  
  // Get planets from both charts
  const person1Planets = Object.entries(person1Chart.objects)
    .filter(([key, object]: [string, any]) => 
      object.name && object.longitude && !object.name.includes('House'))
    .map(([key, object]: [string, any]) => ({
      name: object.name,
      longitude: object.longitude.raw,
      latitude: object.latitude?.raw || 0,
      house: object.house?.number || 1
    }));
  
  const person2Planets = Object.entries(person2Chart.objects)
    .filter(([key, object]: [string, any]) => 
      object.name && object.longitude && !object.name.includes('House'))
    .map(([key, object]: [string, any]) => ({
      name: object.name,
      longitude: object.longitude.raw,
      latitude: object.latitude?.raw || 0,
      house: object.house?.number || 1
    }));
  
  // Calculate aspects between planets
  for (const p1 of person1Planets) {
    for (const p2 of person2Planets) {
      const angleDiff = Math.abs(p1.longitude - p2.longitude);
      const minAngle = Math.min(angleDiff, 360 - angleDiff);
      
      // Check for major aspects
      const aspectOrbs = {
        'Conjunction': 10,
        'Opposition': 8,
        'Trine': 8,
        'Square': 8,
        'Sextile': 6
      };
      
      for (const [aspectName, orb] of Object.entries(aspectOrbs)) {
        let aspectAngle = 0;
        switch (aspectName) {
          case 'Conjunction': aspectAngle = 0; break;
          case 'Opposition': aspectAngle = 180; break;
          case 'Trine': aspectAngle = 120; break;
          case 'Square': aspectAngle = 90; break;
          case 'Sextile': aspectAngle = 60; break;
        }
        
        const orbDiff = Math.abs(minAngle - aspectAngle);
        if (orbDiff <= orb) {
          aspects.push({
            person1Planet: p1.name,
            person2Planet: p2.name,
            aspect: aspectName,
            orb: parseFloat(orbDiff.toFixed(2))
          });
          break; // Only count the closest aspect
        }
      }
    }
  }
  
  // Calculate house overlays (Person 2's planets in Person 1's houses)
  const person1Asc = person1Chart.ascendant || 0;
  for (const p2 of person2Planets) {
    const angleDiff = (p2.longitude - person1Asc + 360) % 360;
    const house = Math.floor(angleDiff / 30) + 1;
    
    if (house >= 1 && house <= 12) {
      houseOverlays.push({
        person2Planet: p2.name,
        person1House: house
      });
    }
  }
  
  return { aspects, house_overlays: houseOverlays, composite_points: [] };
} 