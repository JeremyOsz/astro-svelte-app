<script lang="ts">
  import { onMount } from 'svelte';
  import type { BirthData } from '$lib/types/types';
  import D3BiWheelChart from '$lib/chart/D3BiWheelChart.svelte';
  import TransitDisplay from './TransitDisplay.svelte';
  import { chartStore } from '$lib/stores/chart-store';
  import { searchCities, type CitySearchResult } from '$lib/services/city-service';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Card from '$lib/components/ui/card';
  import * as Label from '$lib/components/ui/label';
  import * as Alert from '$lib/components/ui/alert';
  import { Calendar, MapPin, Clock, User, BookOpen, AlertCircle } from 'lucide-svelte';
  import SavedChartsList from '$lib/components/SavedChartsList.svelte';
  import { ZODIAC_DETAILED } from '$lib/data/astrological-data';

  // Core data
  let selectedBirthChart: any = null;
  let natalChart: any = null;
  let currentTransits: any = null;
  let loading = false;
  let error: string | null = null;

  // Transit settings
  let transitDate = new Date().toISOString().split('T')[0];
  let transitTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  let transitCitySearch = '';
  let transitCityResults: CitySearchResult[] = [];
  let showTransitCityDropdown = false;
  let selectedTransitCityData: any = null;
  let transitSearchTimeout: ReturnType<typeof setTimeout> | null = null;

  // Chart display
  let transitChartData: string | null = null;
  let chartReady = false;

  // Form validation
  let formError = '';

  onMount(async () => {
    await getCurrentLocation();
    
    // Auto-select the first saved chart if available
    if ($chartStore.savedCharts.length > 0 && !selectedBirthChart) {
      handleChartSelect($chartStore.savedCharts[0]);
    }
  });

  async function getCurrentLocation() {
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: false
          });
        });
        
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        
        if (response.ok) {
          const data = await response.json();
          const cityName = data.city || data.locality || 'Unknown City';
          const countryName = data.countryName || '';
          const fullLocation = `${cityName}, ${countryName}`;
          
          transitCitySearch = fullLocation;
          selectedTransitCityData = {
            name: cityName,
            fullLocation: fullLocation,
            lat: latitude,
            lng: longitude,
            country: countryName,
            adminName: data.principalSubdivision || ''
          };
        }
      } catch (error) {
        console.log('Could not get current location:', error);
        // Set default location
        transitCitySearch = 'New York, United States';
        selectedTransitCityData = {
          name: 'New York',
          fullLocation: 'New York, United States',
          lat: 40.7128,
          lng: -74.0060,
          country: 'United States',
          adminName: 'New York'
        };
      }
    }
  }

  // City search functions
  function onTransitCityInput(e: Event) {
    transitCitySearch = (e.target as HTMLInputElement).value;
    
    if (transitSearchTimeout) {
      clearTimeout(transitSearchTimeout);
    }
    
    if (transitCitySearch.length > 1) {
      transitSearchTimeout = setTimeout(() => {
        transitCityResults = searchCities(transitCitySearch, 8);
        showTransitCityDropdown = transitCityResults.length > 0;
      }, 300);
    } else {
      transitCityResults = [];
      showTransitCityDropdown = false;
    }
  }

  function selectTransitCity(city: CitySearchResult) {
    transitCitySearch = city.fullLocation;
    showTransitCityDropdown = false;
    selectedTransitCityData = {
      name: city.name,
      fullLocation: city.fullLocation,
      lat: city.lat,
      lng: city.lng,
      country: city.country,
      adminName: city.adminName
    };
  }

  function handleChartSelect(chart: any) {
    selectedBirthChart = chart;
    currentTransits = null;
    transitChartData = null;
    error = null;
  }

  // Convert transit data to CSV format for BiWheelChart
  function convertTransitDataToCSV(transitData: any): string {
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

  async function calculateTransits() {
    formError = '';
    
    if (!selectedBirthChart) {
      formError = 'Please select a birth chart first';
      return;
    }
    
    if (!transitDate) {
      formError = 'Please select a transit date';
      return;
    }
    
    if (!selectedTransitCityData) {
      formError = 'Please select a transit location';
      return;
    }

    loading = true;
    error = null;
    
    try {
      // Load the selected chart data
      chartStore.loadChart(selectedBirthChart.id);
      
      // Wait a moment for the store to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if ($chartStore.chartData) {
        console.log('Chart data from store:', $chartStore.chartData);
        
        natalChart = {
          planets: [],
          houses: [],
          ascendant: 0,
          mc: 0,
          date: new Date(selectedBirthChart.birthData.date + 'T' + selectedBirthChart.birthData.time),
          latitude: selectedBirthChart.birthData.latitude,
          longitude: selectedBirthChart.birthData.longitude
        };
        
        // Parse the chart data string to extract planet positions
        const lines = $chartStore.chartData.split('\n');
        console.log('Parsing chart lines:', lines);
        
        lines.forEach(line => {
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
      } else {
        throw new Error('Failed to load birth chart data');
      }
      
      // Create transit date with time
      const transitDateTime = new Date(`${transitDate}T${transitTime}:00`);
      
      // Calculate transits using the transits API
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

      currentTransits = await response.json();
      console.log('Transit data received:', currentTransits);
      transitChartData = convertTransitDataToCSV(currentTransits);
      console.log('Converted CSV data:', transitChartData);
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        chartReady = true;
      }, 100);
      
    } catch (err) {
      console.error('Transit calculation error:', err);
      
      if (err instanceof Error && err.message.includes('ECONNREFUSED')) {
        error = 'Unable to connect to ephemeris service. Please ensure the service is running on port 8001.';
      } else if (err instanceof Error && err.message.includes('fetch failed')) {
        error = 'Network error: Unable to reach the ephemeris service. Please check your connection and ensure the service is running.';
      } else {
        error = err instanceof Error ? err.message : 'An error occurred while calculating transits';
      }
    } finally {
      loading = false;
    }
  }

  function clearTransits() {
    currentTransits = null;
    transitChartData = null;
    error = null;
  }

  function useCurrentTimeAndLocation() {
    const now = new Date();
    transitDate = now.toISOString().split('T')[0];
    transitTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    getCurrentLocation();
  }
</script>

<svelte:head>
  <title>Planetary Transits - Astro Chart</title>
  <meta name="description" content="View planetary transits and their effects on your natal chart for any date and location" />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <!-- Page Header -->
  <div class="text-center mb-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">Planetary Transits</h1>
    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
      See how current planetary positions interact with your natal chart to understand their influence on your life.
    </p>
  </div>

  <!-- Error Messages -->
  {#if error}
    <Alert.Root class="mb-6">
      <AlertCircle class="h-4 w-4" />
      <Alert.Title>Error</Alert.Title>
      <Alert.Description>{error}</Alert.Description>
    </Alert.Root>
  {/if}

  {#if formError}
    <Alert.Root class="mb-6">
      <AlertCircle class="h-4 w-4" />
      <Alert.Title>Please fix the following:</Alert.Title>
      <Alert.Description>{formError}</Alert.Description>
    </Alert.Root>
  {/if}

  <div class="grid gap-6 lg:grid-cols-2">
    <!-- Birth Chart Selection -->
    <Card.Root>
      <Card.Header>
        <Card.Title class="flex items-center gap-2">
          <User class="h-5 w-5" />
          Select Birth Chart
        </Card.Title>
      </Card.Header>
      <Card.Content>
        {#if selectedBirthChart}
          <div class="space-y-4">
            <div class="p-4 bg-gray-50 rounded-lg border">
              <div class="space-y-2">
                <h3 class="font-semibold text-lg">{selectedBirthChart.name}</h3>
                <div class="grid grid-cols-1 gap-1 text-sm text-gray-600">
                  <span>Date: {selectedBirthChart.birthData.date}</span>
                  <span>Time: {selectedBirthChart.birthData.time}</span>
                  <span>Location: {selectedBirthChart.birthData.place}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onclick={() => selectedBirthChart = null}>
              Change Chart
            </Button>
          </div>
        {:else}
          <div class="space-y-4">
            {#if $chartStore.savedCharts.length > 0}
              <p class="text-sm text-gray-600">Choose a saved birth chart to analyze:</p>
              <SavedChartsList onChartSelect={handleChartSelect} />
            {:else}
              <div class="text-center py-8">
                <BookOpen class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No Saved Charts</h3>
                <p class="text-gray-600 mb-4">You need to create and save a birth chart first.</p>
                <Button onclick={() => window.location.href = '/chart'}>
                  Create Birth Chart
                </Button>
              </div>
            {/if}
          </div>
        {/if}
      </Card.Content>
    </Card.Root>

    <!-- Transit Settings -->
    <Card.Root>
      <Card.Header>
        <Card.Title class="flex items-center gap-2">
          <Calendar class="h-5 w-5" />
          Transit Settings
        </Card.Title>
      </Card.Header>
      <Card.Content class="space-y-6">
        <!-- Quick Action -->
        <div>
          <Button variant="outline" size="sm" onclick={useCurrentTimeAndLocation}>
            Use Current Time & Location
          </Button>
        </div>

        <!-- Date and Time -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label.Root for="transit-date" class="flex items-center gap-2">
              <Calendar class="h-4 w-4" />
              Transit Date
            </Label.Root>
            <Input 
              id="transit-date"
              type="date" 
              bind:value={transitDate}
            />
          </div>

          <div class="space-y-2">
            <Label.Root for="transit-time" class="flex items-center gap-2">
              <Clock class="h-4 w-4" />
              Transit Time
            </Label.Root>
            <Input 
              id="transit-time"
              type="time" 
              bind:value={transitTime}
            />
          </div>
        </div>

        <!-- Location -->
        <div class="space-y-2">
          <Label.Root for="transit-location" class="flex items-center gap-2">
            <MapPin class="h-4 w-4" />
            Transit Location
          </Label.Root>
          <div class="relative">
            <Input 
              id="transit-location"
              type="text"
              bind:value={transitCitySearch}
              placeholder="Search for a city..."
              oninput={onTransitCityInput}
              onblur={() => setTimeout(() => showTransitCityDropdown = false, 200)}
            />
            
            {#if showTransitCityDropdown}
              <div class="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                {#each transitCityResults as city}
                  <div 
                    class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    role="button"
                    tabindex="0"
                    on:click={() => selectTransitCity(city)}
                    on:keydown={(e) => e.key === 'Enter' && selectTransitCity(city)}
                  >
                    <div class="font-medium">{city.name}</div>
                    <div class="text-sm text-gray-600">{city.fullLocation}</div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <Button 
            onclick={calculateTransits}
            disabled={loading || !selectedBirthChart || !transitDate || !selectedTransitCityData}
            class="w-full"
          >
            {loading ? 'Calculating...' : 'Calculate Transits'}
          </Button>
          
          {#if currentTransits}
            <Button variant="outline" onclick={clearTransits} class="w-full">
              Clear Results
            </Button>
          {/if}
        </div>
      </Card.Content>
    </Card.Root>
  </div>

  <!-- Transit Results -->
  {#if currentTransits && transitChartData && chartReady}
    <Card.Root class="mt-6">
      <Card.Header>
        <Card.Title>Transit Chart</Card.Title>
        <Card.Description>
          <div class="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Date: {new Date(transitDate).toLocaleDateString()}</span>
            <span>Time: {transitTime}</span>
            <span>Location: {selectedTransitCityData?.fullLocation}</span>
          </div>
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="transit-chart-container">
          <D3BiWheelChart 
            transitData={transitChartData}
            showDegreeMarkers={true}
            showExtendedPlanets={false}
            showAspectLines={true}
            showPlanetLabels={true}
          />
        </div>
      </Card.Content>
    </Card.Root>
  {/if}

  <!-- Transit Details -->
  {#if currentTransits}
    <Card.Root class="mt-6">
      <Card.Header>
        <Card.Title>Transit Details</Card.Title>
        <Card.Description>
          Detailed analysis of transit aspects and house positions
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <TransitDisplay {natalChart} {currentTransits} />
      </Card.Content>
    </Card.Root>
  {/if}
</div>

<style>
  .container {
    min-height: calc(100vh - 200px);
  }
  
  .transit-chart-container {
    width: 100%;
    height: 600px;
    min-height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 768px) {
    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    
    .transit-chart-container {
      height: 400px;
      min-height: 400px;
    }
  }
</style> 