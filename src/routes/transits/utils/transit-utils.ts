import { chartStore } from '$lib/stores/chart-store';
import { ZODIAC_DETAILED } from '$lib/data/astrological-data';

export interface TransitCalculationParams {
  selectedBirthChart: any;
  transitDate: string;
  transitTime: string;
  selectedTransitCityData: any;
}

export interface TransitCalculationResult {
  natalChart: any;
  currentTransits: any;
  transitChartData: string;
  error?: string;
}

export interface NatalChart {
  planets: any[];
  houses: any[];
  ascendant: number;
  mc: number;
  date: Date;
  latitude: number;
  longitude: number;
}

// Calculate house for a planet based on house cusps
function calculateHouseForPlanet(planetLongitude: number, houseCusps: number[]): number {
  if (!houseCusps || houseCusps.length === 0) return 1;
  
  // Normalize longitude to 0-360
  const normalizedLongitude = ((planetLongitude % 360) + 360) % 360;
  
  for (let i = 0; i < houseCusps.length; i++) {
    const currentCusp = ((houseCusps[i] % 360) + 360) % 360;
    const nextCusp = ((houseCusps[(i + 1) % houseCusps.length] % 360) + 360) % 360;
    
    let cuspStart = currentCusp;
    let cuspEnd = nextCusp;
    
    // Handle wrap-around for the 12th house to 1st house transition
    if (cuspEnd <= cuspStart) {
      cuspEnd += 360;
    }
    
    let testLongitude = normalizedLongitude;
    if (testLongitude < cuspStart) {
      testLongitude += 360;
    }
    
    if (testLongitude >= cuspStart && testLongitude < cuspEnd) {
      return i + 1;
    }
  }
  
  return 1; // Default to house 1 if no match found
}

// Convert transit data to CSV format for BiWheelChart
export function convertTransitDataToCSV(transitData: any, natalChart?: any): string {
  if (!transitData) {
    console.log('No transit data to convert');
    return '';
  }
  
  console.log('Converting transit data to CSV:', transitData);
  console.log('Natal chart for house calculations:', natalChart);
  
  // Handle different possible response structures
  let planets: any[] = [];
  
  if (transitData.planets && Array.isArray(transitData.planets)) {
    planets = transitData.planets;
  } else if (transitData.objects && typeof transitData.objects === 'object') {
    // Handle case where planets are stored with numeric IDs as keys
    planets = Object.values(transitData.objects).filter((obj: any) => 
      obj && typeof obj === 'object' && obj.name && obj.longitude !== undefined
    );
    console.log('Extracted planets from objects structure:', planets.length);
  } else if (Array.isArray(transitData)) {
    // Handle case where transitData might be the planets array directly
    planets = transitData;
  } else {
    console.error('Transit data structure:', transitData);
    console.log('No planets found in transit data. Expected planets array or objects structure.');
    return '';
  }
  
  if (planets.length === 0) {
    console.log('No planets found in transit data');
    return '';
  }
  
  const lines: string[] = [];
  
  // Add house cusps if available (use natal chart house cusps for transit calculations)
  let houseCusps: number[] = [];
  if (natalChart && natalChart.houses && natalChart.houses.length > 0) {
    // Use natal chart house cusps for transit house calculations
    houseCusps = natalChart.houses.map((house: any) => 
      typeof house === 'number' ? house : house.longitude || 0
    );
    const houseCuspsStr = houseCusps.join(',');
    lines.push(`#HOUSES:${houseCuspsStr}`);
    console.log('Added natal house cusps for transit calculations:', houseCuspsStr);
  } else if (transitData.houses && transitData.houses.length > 0) {
    // Fallback to transit chart house cusps if natal not available
    houseCusps = transitData.houses.map((house: any) => 
      typeof house === 'number' ? house : house.longitude || 0
    );
    const houseCuspsStr = houseCusps.join(',');
    lines.push(`#HOUSES:${houseCuspsStr}`);
    console.log('Added transit house cusps:', houseCuspsStr);
  }
  
  // Add ASC if available
  if (transitData.ascendant !== undefined) {
    const ascDegree = Math.floor(transitData.ascendant % 30);
    const ascMinute = Math.floor((transitData.ascendant % 1) * 60);
    const ascSignIndex = Math.floor(transitData.ascendant / 30);
    const ascSign = ZODIAC_DETAILED[ascSignIndex]?.name || 'Aries';
    lines.push(`ASC,${ascSign},${ascDegree}°${ascMinute.toString().padStart(2, '0')}',1`);
    console.log('Added ASC line');
  }
  
  // Add planets
  planets.forEach((planet: any) => {
    console.log('Processing planet:', planet);
    
    // Extract longitude - handle both direct values and nested objects
    let longitude: number;
    if (typeof planet.longitude === 'number') {
      longitude = planet.longitude;
    } else if (planet.longitude && typeof planet.longitude === 'object' && planet.longitude.raw !== undefined) {
      longitude = planet.longitude.raw;
    } else {
      longitude = 0;
    }
    
    // Extract sign - handle both direct values and nested objects
    let sign: string;
    if (typeof planet.sign === 'string') {
      sign = planet.sign;
    } else if (planet.sign && typeof planet.sign === 'object' && planet.sign.name) {
      sign = planet.sign.name;
    } else {
      // Calculate sign from longitude if not available
      const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
      const signIndex = Math.floor(longitude / 30);
      sign = signNames[signIndex];
    }
    
    // Calculate degree and minute
    const degree = Math.floor(longitude % 30);
    const minute = Math.floor((longitude % 1) * 60);
    
    // Calculate house for transit planet using natal chart house cusps
    let houseNumber = 1;
    if (longitude !== 0 && houseCusps.length > 0) {
      houseNumber = calculateHouseForPlanet(longitude, houseCusps);
      console.log(`Calculated house for ${planet.name} at ${longitude}°: House ${houseNumber}`);
    } else if (planet.house && planet.house.number) {
      // Use existing house data if available
      houseNumber = planet.house.number;
      console.log(`Using existing house data for ${planet.name}: House ${houseNumber}`);
    }
    
    // Check for retrograde movement
    const retrograde = planet.movement && planet.movement.retrograde ? ',R' : '';
    const house = `,${houseNumber}`;
    
    let planetName = planet.name;
    if (planetName === 'Asc') planetName = 'ASC';
    if (planetName === 'Mc') planetName = 'MC';
    if (planetName === 'Dsc') planetName = 'DSC';
    if (planetName === 'Ic') planetName = 'IC';
    
    const line = `${planetName},${sign},${degree}°${minute.toString().padStart(2, '0')}'${house}${retrograde}`;
    lines.push(line);
    console.log('Added planet line:', line);
  });
  
  const result = lines.join('\n');
  console.log('Final CSV result:', result);
  return result;
}

// Parse natal chart data from stored chart
export function parseNatalChart(selectedBirthChart: any, chartData: string): NatalChart {
  if (!chartData) {
    throw new Error('Failed to load birth chart data');
  }

  console.log('Chart data from store:', chartData);
  
  const natalChart: NatalChart = {
    planets: [],
    houses: [],
    ascendant: 0,
    mc: 0,
    date: new Date(selectedBirthChart.birthData.date + 'T' + selectedBirthChart.birthData.time),
    latitude: selectedBirthChart.birthData.latitude,
    longitude: selectedBirthChart.birthData.longitude
  };
  
  // Parse the chart data string to extract planet positions
  const lines = chartData.split('\n');
  console.log('Parsing chart lines:', lines);
  
  lines.forEach((line: string) => {
    const [name, sign, degree] = line.split(',');
    if (name && sign && degree) {
      const degreeMatch = degree.match(/(\d+)°(\d+)'/);
      if (degreeMatch) {
        const deg = parseInt(degreeMatch[1]);
        const min = parseInt(degreeMatch[2]);
        const decimal = deg + min / 60;
        
        const signIndex = ZODIAC_DETAILED.findIndex(s => s.name === sign);
        const longitude = signIndex * 30 + decimal;
        
        natalChart.planets.push({
          name,
          longitude,
          latitude: 0,
          distance: 1,
          sign,
          degree: decimal,
          retrograde: line.includes(',R')
        });
      }
    }
  });
  
  console.log('Parsed natal chart planets:', natalChart.planets);

  // Calculate ascendant and default houses using Whole Sign
  const asc = natalChart.planets.find((p: any) => p.name === 'ASC' || p.name === 'Asc');
  if (asc) {
    natalChart.ascendant = asc.longitude;
  }

  if (!natalChart.houses || natalChart.houses.length === 0) {
    const ascSignIndex = Math.floor((natalChart.ascendant || 0) / 30);
    natalChart.houses = Array.from({ length: 12 }, (_, i) => ({
      house: i + 1,
      longitude: ((ascSignIndex + i) % 12) * 30,
    }));
  }

  return natalChart;
}

// Main transit calculation function
export async function calculateTransits(params: TransitCalculationParams): Promise<TransitCalculationResult> {
  const { selectedBirthChart, transitDate, transitTime, selectedTransitCityData } = params;
  
  try {
    // Load the selected chart data
    chartStore.loadChart(selectedBirthChart.id);
    
    // Wait a moment for the store to update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Get the chart data from the store
    let chartData: string | null = null;
    chartStore.subscribe(state => {
      chartData = state.chartData;
    })();
    
    if (!chartData) {
      throw new Error('Failed to load birth chart data');
    }
    
    const natalChart = parseNatalChart(selectedBirthChart, chartData);
    
    // Create transit date with time
    const transitDateTime = new Date(`${transitDate}T${transitTime}:00`);
    
    // Calculate transits using the transits API
    console.log('ABOUT TO FETCH FROM /api/transits');
    const response = await fetch('/api/transits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        natalChart: natalChart,
        transitDate: transitDateTime.toISOString(),
        transitLocation: {
          latitude: selectedTransitCityData.lat,
          longitude: selectedTransitCityData.lng,
          name: selectedTransitCityData.fullLocation
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to calculate transits');
    }

    const currentTransits = await response.json();
    console.log('Transit data received:', currentTransits);
    const transitChartData = convertTransitDataToCSV(currentTransits);
    console.log('Converted CSV data:', transitChartData);
    
    return {
      natalChart,
      currentTransits,
      transitChartData
    };
    
  } catch (err) {
    console.error('Transit calculation error:', err);
    
    let errorMessage = 'An error occurred while calculating transits';
    
    if (err instanceof Error) {
      if (err.message.includes('ECONNREFUSED')) {
        errorMessage = 'Unable to connect to ephemeris service. Please ensure the service is running on port 8001.';
      } else if (err.message.includes('fetch failed')) {
        errorMessage = 'Network error: Unable to reach the ephemeris service. Please check your connection and ensure the service is running.';
      } else {
        errorMessage = err.message;
      }
    }
    
    throw new Error(errorMessage);
  }
} 