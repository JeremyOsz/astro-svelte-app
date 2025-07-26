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
  import { Calendar, MapPin, Clock, User, CalendarDays, BookOpen } from 'lucide-svelte';
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

<div class="transits-page">
  <div class="page-header">
    <h1>Planetary Transits</h1>
    <p>Compare your saved birth charts with planetary positions for any date and location to see how transits affect you.</p>
  </div>

  {#if error}
    <div class="error-message">
      <strong>Error:</strong> {error}
    </div>
  {/if}

  {#if formError}
    <div class="error-message">
      <strong>Please fix the following:</strong> {formError}
    </div>
  {/if}

  <div class="transits-container">
    <!-- Birth Chart Selection Section -->
    <div class="form-section">
      <div class="section-header">
        <User class="h-5 w-5" />
        <h2>Select Birth Chart</h2>
      </div>
      
      {#if selectedBirthChart}
        <div class="selected-chart-summary">
          <div class="chart-info">
            <h3>{selectedBirthChart.name}</h3>
            <div class="chart-details">
              <span>Date: {selectedBirthChart.birthData.date}</span>
              <span>Time: {selectedBirthChart.birthData.time}</span>
              <span>Location: {selectedBirthChart.birthData.place}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onclick={() => selectedBirthChart = null}>
            Change Chart
          </Button>
        </div>
      {:else}
        <div class="chart-selection">
          {#if $chartStore.savedCharts.length > 0}
            <p class="selection-instruction">Choose a saved birth chart to analyze:</p>
            <SavedChartsList onChartSelect={handleChartSelect} />
          {:else}
            <div class="no-charts-message">
              <BookOpen class="h-12 w-12 text-gray-400 mb-4" />
              <h3>No Saved Charts</h3>
              <p>You need to create and save a birth chart first.</p>
              <Button onclick={() => window.location.href = '/chart'}>
                Create Birth Chart
              </Button>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Transit Settings Section -->
    <div class="form-section">
      <div class="section-header">
        <CalendarDays class="h-5 w-5" />
        <h2>Transit Settings</h2>
      </div>
      
      <div class="transit-settings">
        <div class="quick-actions">
          <Button variant="outline" size="sm" onclick={useCurrentTimeAndLocation}>
            Use Current Time & Location
          </Button>
        </div>

        <div class="setting-group">
          <label class="setting-label">
            <Calendar class="h-4 w-4" />
            Transit Date
          </label>
          <Input 
            type="date" 
            bind:value={transitDate}
            class="w-full"
          />
        </div>

        <div class="setting-group">
          <label class="setting-label">
            <Clock class="h-4 w-4" />
            Transit Time
          </label>
          <Input 
            type="time" 
            bind:value={transitTime}
            class="w-full"
          />
        </div>

        <div class="setting-group">
          <label class="setting-label">
            <MapPin class="h-4 w-4" />
            Transit Location
          </label>
          <div class="relative">
            <Input 
              type="text"
              bind:value={transitCitySearch}
              placeholder="Search for a city..."
              class="w-full"
            />
            <input
              type="text"
              bind:value={transitCitySearch}
              on:input={onTransitCityInput}
              on:keydown={onTransitCityKeydown}
              on:blur={() => setTimeout(() => showTransitCityDropdown = false, 200)}
              placeholder="Search for a city..."
              class="w-full absolute inset-0 opacity-0 pointer-events-none"
            />
            
            {#if showTransitCityDropdown}
              <div class="city-dropdown">
                {#each transitCityResults as city, i}
                  <div 
                    class="city-option"
                    class:selected={i === selectedTransitCityIndex}
                    on:click={() => selectTransitCity(city)}
                  >
                    <div class="city-name">{city.name}</div>
                    <div class="city-location">{city.fullLocation}</div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>

        <div class="action-buttons">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" bind:checked={showAspectLines} />
                Show Aspect Lines
              </label>
              
              <label class="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" bind:checked={showExtendedObjects} />
                Extended Objects
              </label>
              
              <label class="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" bind:checked={showLegend} />
                Show Legend
              </label>
            </div>
            
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">House System:</span>
              <select 
                bind:value={houseSystem} 
                class="px-2 py-1 text-sm border rounded"
                disabled={isAnimating}
              >
                <option value="whole">Whole Sign</option>
                <option value="placidus">Placidus</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <button 
                type="button"
                class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={!selectedBirthChart || !selectedTransitCityData}
                on:click={isAnimating ? stopAnimation : startAnimation}
              >
                {isAnimating ? 'Stop' : 'Animate'}
              </button>
              
              <select 
                bind:value={dateRange} 
                class="px-2 py-1 text-sm border rounded"
                disabled={isAnimating}
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
              </select>
            </div>
          </div>
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

        <!-- Time Slider -->
        <div class="time-slider-section">
          <label class="setting-label">
            <Clock class="h-4 w-4" />
            Time Range: {dateRange} days
          </label>
          <div class="slider-container">
            <input
              type="range"
              min="-{dateRange}"
              max="{dateRange}"
              value="0"
              class="w-full"
              on:input={onDateSliderChange}
              disabled={isAnimating}
            />
            <div class="slider-labels">
              <span>-{dateRange} days</span>
              <span>Today</span>
              <span>+{dateRange} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Transit Results -->
  {#if currentTransits}
    <div class="transits-section">
      <div class="section-header">
        <h2>Transit Results</h2>
        <div class="transit-info">
          <span>Date: {new Date(transitDate).toLocaleDateString()}</span>
          <span>Time: {transitTime}</span>
          <span>Location: {selectedTransitCityData?.fullLocation}</span>
        </div>
      </div>
      
      <TransitDisplay {natalChart} {currentTransits} />
    </div>
  {/if}

  <!-- Transit functionality removed -->
  <div class="transits-section">
    <div class="section-header">
      <h2>Transit Functionality</h2>
    </div>
    <div class="chart-placeholder">
      <p>Transit visualization and biwheel chart functionality has been removed from this application.</p>
      <p>You can still view your birth chart and get interpretations, but transit calculations are no longer available.</p>
    </div>
  </div>

  <!-- Information Section -->
  <div class="info-section">
    <Accordion.Accordion type="single">
      <Accordion.AccordionItem value="about-transits">
        <Accordion.AccordionTrigger>
          <h3>About Planetary Transits</h3>
        </Accordion.AccordionTrigger>
        <Accordion.AccordionContent>
          <div class="info-content">
            <p>
              Planetary transits show how current planetary positions interact with your natal chart. 
              These transits can indicate periods of growth, challenge, or change in different areas of your life.
            </p>
            
            <div class="transit-types">
              <h4>Types of Transits</h4>
              <ul>
                <li><strong>Conjunction (0°):</strong> New beginnings, activation of natal potential</li>
                <li><strong>Opposition (180°):</strong> Awareness, relationships, external challenges</li>
                <li><strong>Square (90°):</strong> Tension, conflict, growth through challenge</li>
                <li><strong>Trine (120°):</strong> Harmony, ease, natural flow</li>
                <li><strong>Sextile (60°):</strong> Opportunity, cooperation, gentle growth</li>
              </ul>
            </div>

            <div class="usage-tips">
              <h4>How to Use This Tool</h4>
              <ul>
                <li>Select a saved birth chart from your collection</li>
                <li>Choose a date and location for the transit calculation</li>
                <li>Use "Current Time & Location" for immediate analysis</li>
                <li>View how current planetary positions aspect your natal planets</li>
              </ul>
            </div>
          </div>
        </Accordion.AccordionContent>
      </Accordion.AccordionItem>
    </Accordion.Accordion>
  </div>
</div>

<style>
  .transits-page {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .page-header h1 {
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 2.5rem;
    font-weight: 700;
  }

  .page-header p {
    color: #666;
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .transits-container {
    display: grid;
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .form-section {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    border: 1px solid #e5e7eb;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .section-header h2 {
    color: #333;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  .selected-chart-summary {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }

  .chart-info h3 {
    color: #1e293b;
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }

  .chart-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: #64748b;
  }

  .chart-selection {
    min-height: 200px;
  }

  .selection-instruction {
    color: #64748b;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  .no-charts-message {
    text-align: center;
    padding: 3rem 1rem;
    color: #64748b;
  }

  .no-charts-message h3 {
    color: #374151;
    margin: 1rem 0 0.5rem 0;
    font-size: 1.25rem;
  }

  .no-charts-message p {
    margin-bottom: 1.5rem;
  }

  .quick-actions {
    margin-bottom: 1rem;
  }

  .transit-settings {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .setting-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .setting-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }

  .relative {
    position: relative;
  }

  .city-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 50;
    max-height: 200px;
    overflow-y: auto;
  }

  .city-option {
    padding: 0.75rem 1rem;
    cursor: pointer;
    border-bottom: 1px solid #f3f4f6;
  }

  .city-option:hover,
  .city-option.selected {
    background: #f9fafb;
  }

  .city-option:last-child {
    border-bottom: none;
  }

  .city-name {
    font-weight: 500;
    color: #111827;
  }

  .city-location {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .transits-section {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    border: 1px solid #e5e7eb;
    margin-bottom: 2rem;
  }

  .transit-info {
    display: flex;
    gap: 2rem;
    font-size: 0.875rem;
    color: #666;
  }

  .info-section {
    margin-top: 3rem;
  }

  .info-content {
    color: #374151;
    line-height: 1.6;
  }

  .transit-types,
  .usage-tips {
    margin-top: 1.5rem;
  }

  .transit-types h4,
  .usage-tips h4 {
    color: #111827;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .transit-types ul,
  .usage-tips ul {
    list-style: none;
    padding: 0;
  }

  .transit-types li,
  .usage-tips li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .transit-types li:last-child,
  .usage-tips li:last-child {
    border-bottom: none;
  }

  .time-slider-section {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .slider-container {
    position: relative;
    margin-top: 0.5rem;
  }

  .slider-labels {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }

  .slider-labels span {
    flex: 1;
    text-align: center;
  }

  .slider-labels span:first-child {
    text-align: left;
  }

  .slider-labels span:last-child {
    text-align: right;
  }

  .legend-panel {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .legend-panel h4 {
    color: #111827;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .legend-content {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: space-around;
  }

  .legend-section {
    flex: 1;
    min-width: 200px;
  }

  .legend-section h5 {
    color: #374151;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .legend-items {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .legend-items span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .interpretation-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .interpretation-panel {
    background: white;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .panel-header h3 {
    color: #111827;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    font-weight: bold;
    color: #6b7280;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s ease;
  }

  .close-btn:hover {
    background-color: #f3f4f6;
  }

  .panel-content {
    flex-grow: 1;
    overflow-y: auto;
  }

  .planet-interpretation h4,
  .aspect-interpretation h4 {
    color: #111827;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .planet-interpretation p,
  .aspect-interpretation p {
    color: #374151;
    line-height: 1.6;
  }

  @media (min-width: 1024px) {
    .transits-container {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 768px) {
    .transits-page {
      padding: 0.5rem;
    }
    
    .page-header h1 {
      font-size: 2rem;
    }
    
    .form-section,
    .transits-section {
      padding: 1.5rem;
    }

    .selected-chart-summary {
      flex-direction: column;
      gap: 1rem;
    }

    .action-buttons {
      flex-direction: column;
    }

    .transit-info {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style> 