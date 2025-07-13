<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { BirthData } from '$lib/types/types';
  import { calculateBirthChart, formatDegrees } from '$lib/chart/browser-chart';
  import { getSignByDegree } from '$lib/astrology/astronomia-service';
  import { searchCities, getCountryName, type CitySearchResult } from '$lib/services/city-service';
  import { getBirthTimezone, formatTimezoneOffset } from '$lib/services/timezone-service';

  const dispatch = createEventDispatcher<{ chartGenerated: string }>();

  let birthDate = '';
  let birthTime = '';
  let selectedCity: CitySearchResult | null = null;
  let loading = false;
  let error: string | null = null;
  let citySearch = '';
  let cityResults: CitySearchResult[] = [];
  let showCityDropdown = false;
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;
  let selectedIndex = -1;
  let timezoneInfo: { timezone: string; offset: number; isDST: boolean } | null = null;

  function onCityInput(e: Event) {
    citySearch = (e.target as HTMLInputElement).value;
    selectedIndex = -1;
    
    // Clear selected city if user starts typing again
    if (selectedCity && citySearch !== selectedCity.fullLocation) {
      selectedCity = null;
      timezoneInfo = null;
    }
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (citySearch.length > 1) {
      // Debounce search to avoid too many searches while typing
      searchTimeout = setTimeout(() => {
        cityResults = searchCities(citySearch, 8);
        showCityDropdown = cityResults.length > 0;
      }, 300);
    } else {
      cityResults = [];
      showCityDropdown = false;
    }
  }

  function onCityKeydown(e: KeyboardEvent) {
    if (!showCityDropdown) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, cityResults.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < cityResults.length) {
          selectCity(cityResults[selectedIndex]);
        }
        break;
      case 'Escape':
        showCityDropdown = false;
        selectedIndex = -1;
        break;
    }
  }

  function selectCity(city: CitySearchResult) {
    citySearch = city.fullLocation;
    selectedCity = city;
    showCityDropdown = false;
    selectedIndex = -1;
    
    // Update timezone info if we have both city and birth date
    updateTimezoneInfo();
  }

  function updateTimezoneInfo() {
    if (selectedCity && birthDate && birthTime) {
      timezoneInfo = getBirthTimezone(
        parseFloat(selectedCity.lat),
        parseFloat(selectedCity.lng),
        birthDate,
        birthTime
      );
    } else {
      timezoneInfo = null;
    }
  }

  // Update timezone info when birth date or time changes
  $: if (selectedCity && birthDate && birthTime) {
    updateTimezoneInfo();
  }

  async function handleSubmit() {
    if (!birthDate || !birthTime || !selectedCity) {
      alert('Please fill in all fields and select a city');
      return;
    }

    loading = true;
    error = null;

    try {
      // Get historical timezone for the birth date and location
      const timezone = getBirthTimezone(
        parseFloat(selectedCity.lat),
        parseFloat(selectedCity.lng),
        birthDate,
        birthTime
      );

      const birthData: BirthData = {
        date: birthDate,
        time: birthTime,
        latitude: parseFloat(selectedCity.lat),
        longitude: parseFloat(selectedCity.lng),
        timezone: timezone.offset
      };

      const chartResult = await calculateBirthChart(birthData);
      
      // Format chart data for visualization
      const lines: string[] = chartResult.planets.map((planet: any) => {
        const degStr = formatDegrees(planet.degree);
        const retro = planet.retrograde ? ',R' : '';
        return `${planet.name},${planet.sign},${degStr}${retro}`;
      });

      // Add ASC and MC
      const ascSign = getSignByDegree(chartResult.ascendant);
      const mcSign = getSignByDegree(chartResult.mc);
      lines.push(`ASC,${ascSign},${formatDegrees(chartResult.ascendant % 30)}`);
      lines.push(`MC,${mcSign},${formatDegrees(chartResult.mc % 30)}`);

      const chartDataString = lines.join('\n');
      dispatch('chartGenerated', chartDataString);
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred while calculating the chart';
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto">
  <h2 class="text-2xl font-semibold text-gray-900 mb-6">Enter Birth Details</h2>
  
  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      <strong>Error:</strong> {error}
    </div>
  {/if}
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <div class="space-y-2 relative">
      <label for="city-search" class="block text-sm font-medium text-gray-700">
        Birth City *
      </label>
      <input
        id="city-search"
        type="text"
        placeholder="Start typing city name..."
        bind:value={citySearch}
        on:input={onCityInput}
        on:keydown={onCityKeydown}
        autocomplete="off"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        required
      />
      {#if showCityDropdown}
        <ul class="absolute z-10 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-48 overflow-auto shadow-lg">
          {#each cityResults as city, index}
            <li
              class="px-4 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors {index === selectedIndex ? 'bg-blue-100' : 'hover:bg-blue-50'}"
              on:click={() => selectCity(city)}
              on:mouseenter={() => selectedIndex = index}
            >
              <div class="font-medium">{city.name}</div>
              <div class="text-sm text-gray-600">
                {#if city.adminName}
                  {city.adminName}, {getCountryName(city.country)}
                {:else}
                  {getCountryName(city.country)}
                {/if}
              </div>
            </li>
          {/each}
        </ul>
      {/if}
      
      {#if selectedCity}
        <div class="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div class="text-sm">
            <div class="font-medium text-green-800">{selectedCity.fullLocation}</div>
            <div class="text-green-600 mt-1">
              <span class="font-medium">Coordinates:</span> {selectedCity.lat}, {selectedCity.lng}
            </div>
            {#if timezoneInfo}
              <div class="text-green-600 mt-1">
                <span class="font-medium">Timezone:</span> {formatTimezoneOffset(timezoneInfo.offset)}
                {#if timezoneInfo.isDST}
                  <span class="text-xs ml-1 px-1 py-0.5 bg-green-200 rounded">DST</span>
                {/if}
              </div>
              <div class="text-xs text-green-500 mt-1">
                Using {timezoneInfo.timezone}
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <div class="space-y-2">
      <label for="birth-date" class="block text-sm font-medium text-gray-700">
        Birth Date *
      </label>
      <input
        id="birth-date"
        type="date"
        bind:value={birthDate}
        required
        max={new Date().toISOString().split('T')[0]}
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
    </div>

    <div class="space-y-2">
      <label for="birth-time" class="block text-sm font-medium text-gray-700">
        Birth Time *
      </label>
      <input
        id="birth-time"
        type="time"
        bind:value={birthTime}
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
      <p class="text-xs text-gray-500">If you don't know your exact birth time, use 12:00 PM</p>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 pt-4">
      <button 
        type="submit" 
        disabled={loading || !selectedCity}
        class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
      >
        {loading ? 'Calculating...' : 'Calculate Chart'}
      </button>
    </div>
  </form>

  <div class="mt-8 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500">
    <h3 class="text-lg font-medium text-gray-900 mb-3">How It Works</h3>
    <ul class="space-y-2 text-sm text-gray-600">
      <li class="flex items-start">
        <span class="font-medium mr-2">Location:</span>
        Select your birth city from the dropdown. Coordinates are automatically determined.
      </li>
      <li class="flex items-start">
        <span class="font-medium mr-2">Historical Timezone:</span>
        The system uses historical timezone data to calculate the correct timezone for your birth date and location, accounting for daylight saving time.
      </li>
      <li class="flex items-start">
        <span class="font-medium mr-2">Birth Time:</span>
        If you don't know your exact birth time, use 12:00 PM. This will give you a noon chart.
      </li>
    </ul>
  </div>
</div> 