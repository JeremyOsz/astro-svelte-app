<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Card from '$lib/components/ui/card';
  import * as Label from '$lib/components/ui/label';
  import { Calendar, MapPin, Clock } from 'lucide-svelte';
  import { searchCities, type CitySearchResult } from '$lib/services/city-service';
  import TransitLoadingState from '$lib/components/TransitLoadingState.svelte';

  export let transitDate: string;
  export let transitTime: string;
  export let transitCitySearch: string;
  export let selectedTransitCityData: any;
  export let loading: boolean;
  export let onCalculate: (() => void) | undefined = undefined;
  export let onClear: () => void;
  export let hasResults: boolean;

  let transitCityResults: CitySearchResult[] = [];
  let showTransitCityDropdown = false;
  let transitSearchTimeout: ReturnType<typeof setTimeout> | null = null;

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
</script>

{#if loading}
  <TransitLoadingState message="Calculating planetary transits for {transitDate} at {selectedTransitCityData?.fullLocation || 'selected location'}..." />
{:else}
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
          type="submit"
          disabled={loading || !transitDate || !selectedTransitCityData}
          class="w-full"
        >
          {loading ? 'Calculating...' : 'Calculate Transits'}
        </Button>
        
        {#if hasResults}
          <Button variant="outline" onclick={onClear} class="w-full">
            Clear Results
          </Button>
        {/if}
      </div>
    </Card.Content>
  </Card.Root>
{/if} 