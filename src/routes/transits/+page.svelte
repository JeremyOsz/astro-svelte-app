<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import type { BirthData } from '$lib/types/types';
  import TransitDisplay from './TransitDisplay.svelte';
  import { chartStore } from '$lib/stores/chart-store';
  import { searchCities, type CitySearchResult } from '$lib/services/city-service';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Accordion from '$lib/components/ui/accordion';
  import * as Card from '$lib/components/ui/card';
  import * as Label from '$lib/components/ui/label';
  import * as Separator from '$lib/components/ui/separator';
  import * as Alert from '$lib/components/ui/alert';
  import { Badge } from '$lib/components/ui/badge';
  import { Calendar, MapPin, Clock, User, CalendarDays, BookOpen, AlertCircle, Info } from 'lucide-svelte';
  import SavedChartsList from '$lib/components/SavedChartsList.svelte';
  import { ZODIAC_DETAILED } from '$lib/data/astrological-data';

  import type { Planet } from '$lib/types/types';

  // Transit-specific data
  let transitDate = new Date().toISOString().split('T')[0]; // Today's date
  let transitTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  }); // Current time
  let transitCitySearch = '';
  let transitCityResults: CitySearchResult[] = [];
  let showTransitCityDropdown = false;
  let selectedTransitCityData: any = null;
  let transitSearchTimeout: ReturnType<typeof setTimeout> | null = null;
  let selectedTransitCityIndex = -1;

  // Chart data
  let selectedBirthChart: any = null;
  let natalChart: any = null;
  let currentTransits: any = null;
  let loading = false;
  let error: string | null = null;

  // Form validation
  let formError = '';

  // Subscribe to chart store for saved charts
  $: ({ savedCharts } = $chartStore);

  onMount(async () => {
    // Auto-fill current location
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
        
        // Reverse geocode to get city name
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        
        if (response.ok) {
          const data = await response.json();
          const cityName = data.city || data.locality || 'Unknown City';
          const countryName = data.countryName || '';
          const fullLocation = `${cityName}, ${countryName}`;
          
          // Set the current location
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
        // Set a default location
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

  // Transit city search functions
  function onTransitCityInput(e: Event) {
    transitCitySearch = (e.target as HTMLInputElement).value;
    selectedTransitCityIndex = -1;
    
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

  function onTransitCityKeydown(e: KeyboardEvent) {
    if (!showTransitCityDropdown) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedTransitCityIndex = Math.min(selectedTransitCityIndex + 1, transitCityResults.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        selectedTransitCityIndex = Math.max(selectedTransitCityIndex - 1, -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedTransitCityIndex >= 0 && selectedTransitCityIndex < transitCityResults.length) {
          selectTransitCity(transitCityResults[selectedTransitCityIndex]);
        }
        break;
      case 'Escape':
        showTransitCityDropdown = false;
        selectedTransitCityIndex = -1;
        break;
    }
  }

  function selectTransitCity(city: CitySearchResult) {
    transitCitySearch = city.fullLocation;
    showTransitCityDropdown = false;
    selectedTransitCityIndex = -1;
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
    // Clear previous transit results when selecting a new chart
    currentTransits = null;
    error = null;
  }

  async function calculateTransits() {
    // Validate inputs
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

    // Create cache key
    const cacheKey = `${transitDate}-${selectedTransitCityData.lat}-${selectedTransitCityData.lng}` as string;

    // Check cache first
    if (transitCache.has(cacheKey)) {
      currentTransits = transitCache.get(cacheKey);
      return;
    }

    loading = true;
    error = null;
    
    try {
      // Load the selected chart data
      chartStore.loadChart(selectedBirthChart.id);
      
      // Wait a moment for the store to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use the chart data directly from the store instead of recalculating
      if ($chartStore.chartData) {
        // Parse the chart data string to get the chart structure
        // For now, we'll create a basic chart structure from the saved data
        natalChart = {
          planets: [], // This will be populated from the chart data
          houses: [],
          ascendant: 0,
          mc: 0,
          date: new Date(selectedBirthChart.birthData.date + 'T' + selectedBirthChart.birthData.time),
          latitude: selectedBirthChart.birthData.latitude,
          longitude: selectedBirthChart.birthData.longitude
        };
        
        // Parse the chart data string to extract planet positions
        const lines = $chartStore.chartData.split('\n');
        lines.forEach(line => {
          const [name, sign, degree] = line.split(',');
          if (name && sign && degree) {
            // Convert degree string like "17°09'" to decimal
            const degreeMatch = degree.match(/(\d+)°(\d+)'/);
            if (degreeMatch) {
              const deg = parseInt(degreeMatch[1]);
              const min = parseInt(degreeMatch[2]);
              const decimal = deg + min / 60;
              
              // Calculate longitude based on sign and degree
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

        // Calculate ascendant and default houses using Whole Sign if missing
        const asc = natalChart.planets.find((p: Planet) => p.name === 'ASC' || p.name === 'Asc');
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
      
      // Cache the result
      transitCache.set(cacheKey, currentTransits);
      
      // Limit cache size to prevent memory issues
      if (transitCache.size > 100) {
        const firstKey = transitCache.keys().next().value;
        if (firstKey) {
          transitCache.delete(firstKey);
        }
      }
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred while calculating transits';
    } finally {
      loading = false;
    }
  }

  function clearTransits() {
    currentTransits = null;
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

  // Chart visualization settings
  let showAspectLines = true;
  let showExtendedObjects = false;
  let houseSystem = 'whole'; // 'whole' or 'placidus'
  let showLegend = false;
  let isAnimating = false;
  let selectedInterpretation: any = null;
  let showInterpretationPanel = false;
  let animationSpeed = 1000; // ms between frames
  let animationInterval: ReturnType<typeof setInterval> | null = null;
  let dateRange = 30; // days to animate
  let currentAnimationDate = new Date();
  let transitCache = new Map<string, any>();
  let sliderTimeout: ReturnType<typeof setTimeout> | null = null;

  function startAnimation() {
    if (isAnimating) return;
    
    isAnimating = true;
    currentAnimationDate = new Date();
    
    animationInterval = setInterval(() => {
      currentAnimationDate.setDate(currentAnimationDate.getDate() + 1);
      transitDate = currentAnimationDate.toISOString().split('T')[0];
      
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + dateRange);
      
      if (currentAnimationDate.getTime() > endDate.getTime()) {
        stopAnimation();
        return;
      }
      
      // Use cached data if available, otherwise calculate
      const cacheKey = selectedTransitCityData 
        ? `${transitDate}-${selectedTransitCityData.lat}-${selectedTransitCityData.lng}`
        : null;
      if (cacheKey && transitCache.has(cacheKey)) {
        currentTransits = transitCache.get(cacheKey);
      } else {
        calculateTransits();
      }
    }, animationSpeed);
  }

  function stopAnimation() {
    isAnimating = false;
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
    }
  }

  function onDateSliderChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const daysOffset = parseInt(target.value);
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysOffset);
    transitDate = newDate.toISOString().split('T')[0];
    
    // Debounce the API call
    if (sliderTimeout) {
      clearTimeout(sliderTimeout);
    }
    
    sliderTimeout = setTimeout(() => {
      if (selectedBirthChart && selectedTransitCityData) {
        calculateTransits();
      }
    }, 300);
  }

  function showInterpretation(item: any, type: 'planet' | 'aspect') {
    selectedInterpretation = { item, type };
    showInterpretationPanel = true;
  }

  function closeInterpretationPanel() {
    showInterpretationPanel = false;
    selectedInterpretation = null;
  }

  onDestroy(() => {
    stopAnimation();
    if (sliderTimeout) {
      clearTimeout(sliderTimeout);
    }
  });

  function getPlanetMeaning(planetName: string): string {
    const meanings: Record<string, string> = {
      'Sun': 'ego, identity, and life purpose',
      'Moon': 'emotions, intuition, and subconscious',
      'Mercury': 'communication, thinking, and learning',
      'Venus': 'love, beauty, and values',
      'Mars': 'action, energy, and desire',
      'Jupiter': 'expansion, wisdom, and opportunity',
      'Saturn': 'structure, responsibility, and lessons',
      'Uranus': 'innovation, rebellion, and sudden change',
      'Neptune': 'spirituality, dreams, and illusion',
      'Pluto': 'transformation, power, and deep change'
    };
    return meanings[planetName] || 'various life areas';
  }

  function getTransitInfluence(planetName: string): string {
    const influences: Record<string, string> = {
      'Sun': 'personal growth and self-expression',
      'Moon': 'emotional patterns and inner world',
      'Mercury': 'communication and mental processes',
      'Venus': 'relationships and creative expression',
      'Mars': 'energy levels and assertiveness',
      'Jupiter': 'opportunities and personal growth',
      'Saturn': 'challenges and life lessons',
      'Uranus': 'sudden insights and breakthroughs',
      'Neptune': 'spiritual awakening and creativity',
      'Pluto': 'profound transformation and healing'
    };
    return influences[planetName] || 'various life areas';
  }

  function getAspectMeaning(aspectType: string): string {
    const meanings: Record<string, string> = {
      'Conjunction': 'New beginnings, activation of natal potential. This aspect brings intense focus and energy to the areas ruled by the planets involved.',
      'Opposition': 'Awareness, relationships, external challenges. This aspect creates tension that can lead to growth through conflict resolution.',
      'Square': 'Tension, conflict, growth through challenge. This aspect forces action and change through difficult circumstances.',
      'Trine': 'Harmony, ease, natural flow. This aspect brings opportunities and positive energy with minimal effort.',
      'Sextile': 'Opportunity, cooperation, gentle growth. This aspect offers chances for development through cooperation.',
      'Quincunx': 'Adjustment, adaptation, integration. This aspect requires finding balance between seemingly incompatible energies.'
    };
    return meanings[aspectType] || 'This aspect influences various life areas through its unique energy.';
  }
</script>

<svelte:head>
  <title>Planetary Transits - Astro Chart</title>
  <meta name="description" content="View planetary transits and their effects on your natal chart for any date and location" />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-7xl">
  <!-- Page Header -->
  <div class="text-center mb-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">Planetary Transits</h1>
    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
      Compare your saved birth charts with planetary positions for any date and location to see how transits affect you.
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
    <!-- Birth Chart Selection Section -->
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

    <!-- Transit Settings Section -->
    <Card.Root>
      <Card.Header>
        <Card.Title class="flex items-center gap-2">
          <CalendarDays class="h-5 w-5" />
          Transit Settings
        </Card.Title>
      </Card.Header>
      <Card.Content class="space-y-6">
        <!-- Quick Actions -->
        <div>
          <Button variant="outline" size="sm" onclick={useCurrentTimeAndLocation}>
            Use Current Time & Location
          </Button>
        </div>

        <!-- Date and Time Settings -->
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

        <!-- Location Settings -->
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
              onkeydown={onTransitCityKeydown}
              onblur={() => setTimeout(() => showTransitCityDropdown = false, 200)}
            />
            
            {#if showTransitCityDropdown}
              <div class="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                {#each transitCityResults as city, i}
                  <div 
                    class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    class:bg-gray-100={i === selectedTransitCityIndex}
                    on:click={() => selectTransitCity(city)}
                  >
                    <div class="font-medium">{city.name}</div>
                    <div class="text-sm text-gray-600">{city.fullLocation}</div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>

        <!-- Chart Options -->
        <div class="space-y-4">
          <h4 class="font-medium text-sm text-gray-700">Chart Options</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" bind:checked={showAspectLines} class="rounded" />
                Show Aspect Lines
              </label>
              
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" bind:checked={showExtendedObjects} class="rounded" />
                Extended Objects
              </label>
              
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" bind:checked={showLegend} class="rounded" />
                Show Legend
              </label>
            </div>
            
            <div class="space-y-3">
              <div class="space-y-2">
                <Label.Root for="house-system" class="text-sm">House System</Label.Root>
                <select 
                  id="house-system"
                  bind:value={houseSystem} 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  disabled={isAnimating}
                >
                  <option value="whole">Whole Sign</option>
                  <option value="placidus">Placidus</option>
                </select>
              </div>
              
              <div class="space-y-2">
                <Label.Root for="date-range" class="text-sm">Animation Range</Label.Root>
                <select 
                  id="date-range"
                  bind:value={dateRange} 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  disabled={isAnimating}
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <div class="flex gap-2">
            <Button 
              variant="outline"
              size="sm"
              disabled={!selectedBirthChart || !selectedTransitCityData}
              onclick={isAnimating ? stopAnimation : startAnimation}
            >
              {isAnimating ? 'Stop Animation' : 'Start Animation'}
            </Button>
          </div>
          
          <div class="flex gap-2">
            <Button 
              onclick={calculateTransits}
              disabled={loading || !selectedBirthChart || !transitDate || !selectedTransitCityData}
              class="flex-1"
            >
              {loading ? 'Calculating...' : 'Calculate Transits'}
            </Button>
            
            {#if currentTransits}
              <Button variant="outline" onclick={clearTransits} class="flex-1">
                Clear Results
              </Button>
            {/if}
          </div>
        </div>

        <!-- Time Slider -->
        <div class="space-y-3">
          <Label.Root class="flex items-center gap-2 text-sm">
            <Clock class="h-4 w-4" />
            Time Range: {dateRange} days
          </Label.Root>
          <div class="space-y-2">
            <input
              type="range"
              min="-{dateRange}"
              max="{dateRange}"
              value="0"
              class="w-full"
              on:input={onDateSliderChange}
              disabled={isAnimating}
            />
            <div class="flex justify-between text-xs text-gray-500">
              <span>-{dateRange} days</span>
              <span>Today</span>
              <span>+{dateRange} days</span>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </div>

  <!-- Transit Results -->
  {#if currentTransits}
    <Card.Root class="mt-6">
      <Card.Header>
        <Card.Title>Transit Results</Card.Title>
        <Card.Description>
          <div class="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Date: {new Date(transitDate).toLocaleDateString()}</span>
            <span>Time: {transitTime}</span>
            <span>Location: {selectedTransitCityData?.fullLocation}</span>
          </div>
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <TransitDisplay {natalChart} {currentTransits} />
      </Card.Content>
    </Card.Root>
  {/if}

  <!-- Information Section -->
  <Card.Root class="mt-6">
    <Card.Header>
      <Card.Title class="flex items-center gap-2">
        <Info class="h-5 w-5" />
        About Planetary Transits
      </Card.Title>
    </Card.Header>
    <Card.Content>
      <Accordion.Root type="single">
        <Accordion.Item value="about-transits">
          <Accordion.Trigger>
            <span class="text-left">Learn more about transits and how to use this tool</span>
          </Accordion.Trigger>
          <Accordion.Content>
            <div class="space-y-6 text-sm text-gray-700">
              <p>
                Planetary transits show how current planetary positions interact with your natal chart. 
                These transits can indicate periods of growth, challenge, or change in different areas of your life.
              </p>
              
              <div class="space-y-4">
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">Types of Transits</h4>
                                     <div class="grid gap-2">
                     <div class="flex items-center gap-2">
                       <Badge variant="outline" class="text-xs">☌</Badge>
                       <span><strong>Conjunction (0°):</strong> New beginnings, activation of natal potential</span>
                     </div>
                     <div class="flex items-center gap-2">
                       <Badge variant="outline" class="text-xs">☍</Badge>
                       <span><strong>Opposition (180°):</strong> Awareness, relationships, external challenges</span>
                     </div>
                     <div class="flex items-center gap-2">
                       <Badge variant="outline" class="text-xs">□</Badge>
                       <span><strong>Square (90°):</strong> Tension, conflict, growth through challenge</span>
                     </div>
                     <div class="flex items-center gap-2">
                       <Badge variant="outline" class="text-xs">△</Badge>
                       <span><strong>Trine (120°):</strong> Harmony, ease, natural flow</span>
                     </div>
                     <div class="flex items-center gap-2">
                       <Badge variant="outline" class="text-xs">✳</Badge>
                       <span><strong>Sextile (60°):</strong> Opportunity, cooperation, gentle growth</span>
                     </div>
                   </div>
                </div>

                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">How to Use This Tool</h4>
                  <ul class="space-y-1 list-disc list-inside">
                    <li>Select a saved birth chart from your collection</li>
                    <li>Choose a date and location for the transit calculation</li>
                    <li>Use "Current Time & Location" for immediate analysis</li>
                    <li>View how current planetary positions aspect your natal planets</li>
                  </ul>
                </div>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </Card.Content>
  </Card.Root>
</div>

<style>
  /* Custom styles for better hover effects */
  button {
    cursor: pointer;
  }
  
  /* Ensure proper spacing for the grid layout */
  .container {
    min-height: calc(100vh - 200px);
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
</style> 