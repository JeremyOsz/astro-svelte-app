<script lang="ts">
  import { onMount } from 'svelte';

  import { Input } from '$lib/components/ui/input';
  import * as Card from '$lib/components/ui/card';
  import * as Label from '$lib/components/ui/label';
  import { Calendar, MapPin, Clock, User, Globe, ChevronDown, ChevronUp, Settings } from 'lucide-svelte';
  import { searchCities, type CitySearchResult } from '$lib/services/city-service';
  import SavedChartsList from '$lib/components/SavedChartsList.svelte';
  import TransitLoadingState from '$lib/components/TransitLoadingState.svelte';
  import { chartStore } from '$lib/stores/chart-store';

  export let selectedBirthChart: any;
  export let transitDate: string;
  export let transitTime: string;
  export let transitCitySearch: string;
  export let selectedTransitCityData: any;
  export let loading: boolean;
  export let onChartSelect: (chart: any) => void;
  export let onClearSelection: () => void;
  export let onCalculate: (() => void) | undefined = undefined;
  export let onClear: () => void;
  export let hasResults: boolean;

  let transitCityResults: CitySearchResult[] = [];
  let showTransitCityDropdown = false;
  let transitSearchTimeout: ReturnType<typeof setTimeout> | null = null;
  let isCollapsed = false;

  onMount(async () => {
    await getCurrentLocation();
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

  function toggleCollapse() {
    isCollapsed = !isCollapsed;
  }
</script>

{#if loading}
  <TransitLoadingState message="Calculating planetary transits for {transitDate} at {selectedTransitCityData?.fullLocation || 'selected location'}..." />
{:else}
  <Card.Root>
    <Card.Header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Globe class="h-5 w-5" />
          <Card.Title>Transit Calculator</Card.Title>
        </div>
        {#if hasResults}
          <button 
            type="button"
            on:click={toggleCollapse}
            class="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings class="h-4 w-4" />
            {isCollapsed ? 'Show Form' : 'Hide Form'}
            {#if isCollapsed}
              <ChevronDown class="h-4 w-4" />
            {:else}
              <ChevronUp class="h-4 w-4" />
            {/if}
          </button>
        {/if}
      </div>
      <Card.Description>
        Select your birth chart and transit parameters to calculate planetary influences
      </Card.Description>
    </Card.Header>
    
    {#if hasResults && isCollapsed}
      <!-- Collapsed Summary View -->
      <Card.Content class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <User class="h-4 w-4 text-gray-600" />
              <span class="font-medium text-gray-900">Birth Chart</span>
            </div>
            <div class="text-sm text-gray-600">
              <div class="font-medium">{selectedBirthChart?.name}</div>
              <div>{selectedBirthChart?.birthData?.date} • {selectedBirthChart?.birthData?.place}</div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <Calendar class="h-4 w-4 text-gray-600" />
              <span class="font-medium text-gray-900">Transit Settings</span>
            </div>
            <div class="text-sm text-gray-600">
              <div>{transitDate} at {transitTime}</div>
              <div>{selectedTransitCityData?.fullLocation}</div>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <button 
            type="button"
            on:click={toggleCollapse}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-gray-300 transition-colors"
          >
            Edit Settings
          </button>
          <button 
            type="button"
            on:click={onClear}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-gray-300 transition-colors"
          >
            Clear Results
          </button>
        </div>
      </Card.Content>
    {:else}
      <!-- Full Form View -->
      <Card.Content class="space-y-6">
        <!-- Birth Chart Selection Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <User class="h-4 w-4 text-gray-600" />
            <h3 class="font-medium text-gray-900">Birth Chart</h3>
          </div>
          
          {#if selectedBirthChart}
            <div class="p-4 bg-gray-50 rounded-lg border">
              <div class="space-y-2">
                <h4 class="font-semibold text-lg">{selectedBirthChart.name}</h4>
                <div class="grid grid-cols-1 gap-1 text-sm text-gray-600">
                  <span>Date: {selectedBirthChart.birthData.date}</span>
                  <span>Time: {selectedBirthChart.birthData.time}</span>
                  <span>Location: {selectedBirthChart.birthData.place}</span>
                </div>
              </div>
              <button 
                type="button"
                on:click={onClearSelection} 
                class="mt-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-gray-300 transition-colors"
              >
                Change Chart
              </button>
            </div>
          {:else}
            <div class="space-y-4">
              {#if $chartStore.savedCharts.length > 0}
                <p class="text-sm text-gray-600">Choose a saved birth chart:</p>
                <SavedChartsList onChartSelect={onChartSelect} />
              {:else}
                <div class="text-center py-8">
                  <User class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">No Saved Charts</h3>
                  <p class="text-gray-600 mb-4">You need to create and save a birth chart first.</p>
                  <button 
                    type="button"
                    on:click={() => window.location.href = '/chart'}
                    class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    Create Birth Chart
                  </button>
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <!-- Transit Settings Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <Calendar class="h-4 w-4 text-gray-600" />
            <h3 class="font-medium text-gray-900">Transit Settings</h3>
          </div>
          
          <!-- Quick Action -->
          <div>
            <button 
              type="button"
              on:click={useCurrentTimeAndLocation}
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              Use Current Time & Location
            </button>
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
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading || !selectedBirthChart || !transitDate || !selectedTransitCityData}
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style="min-height: 56px;"
          >
            {loading ? 'Calculating...' : 'Calculate Transits'}
          </button>
          
          {#if hasResults}
                      <button
            type="button"
            on:click={onClear}
            class="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl shadow-lg hover:bg-gray-50 hover:border-gray-400 focus:ring-4 focus:ring-gray-300 transition-all duration-200 transform hover:scale-105 active:scale-95"
            style="min-height: 56px;"
          >
            Clear Results
          </button>
          {/if}
        </div>
      </Card.Content>
    {/if}
  </Card.Root>
{/if} 

<style>
  /* Ensure all buttons and interactive elements have pointer cursor */
  button, 
  [role="button"],
  .cursor-pointer {
    cursor: pointer;
  }

  /* Make sure all clickable elements show pointer */
  input[type="checkbox"] + span,
  label[class*="cursor-pointer"] {
    cursor: pointer;
  }
</style>