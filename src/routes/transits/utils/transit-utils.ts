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

// Convert transit data to CSV format for BiWheelChart
export function convertTransitDataToCSV(transitData: any): string {
  if (!transitData || !transitData.planets) {
    console.log('No transit data or planets to convert');
    return '';
  }
  
  console.log('Converting transit data to CSV:', transitData);
  
  const lines: string[] = [];
  
  // Add house cusps if available
  if (transitData.houses && transitData.houses.length > 0) {
    const houseCusps = transitData.houses.map((house: any) => house.longitude).join(',');
    lines.push(`#HOUSES:${houseCusps}`);
    console.log('Added house cusps:', houseCusps);
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
  transitData.planets.forEach((planet: any) => {
    console.log('Processing planet:', planet);
    
    let degree: number, minute: number;
    
    if (typeof planet.degree === 'number') {
      degree = Math.floor(planet.degree);
      minute = Math.floor((planet.degree - degree) * 60);
    } else if (planet.longitude !== undefined) {
      const totalDegrees = planet.longitude;
      degree = Math.floor(totalDegrees % 30);
      minute = Math.floor((totalDegrees % 1) * 60);
    } else {
      degree = 0;
      minute = 0;
    }
    
    const retrograde = planet.retrograde ? ',R' : '';
    const house = planet.house ? `,${planet.house}` : '';
    
    let planetName = planet.name;
    if (planetName === 'Asc') planetName = 'ASC';
    if (planetName === 'Mc') planetName = 'MC';
    if (planetName === 'Dsc') planetName = 'DSC';
    if (planetName === 'Ic') planetName = 'IC';
    
    const line = `${planetName},${planet.sign},${degree}°${minute.toString().padStart(2, '0')}'${house}${retrograde}`;
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