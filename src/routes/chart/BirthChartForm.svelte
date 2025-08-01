<script lang="ts">
  import { enhance } from '$app/forms';
  import { searchCities, getCountryName, type CitySearchResult } from '$lib/services/city-service';
  import { chartStore } from '$lib/stores/chart-store';
 
  // Props to differentiate mobile vs desktop forms
  export let formPrefix: string = '';
  
  // Subscribe to the chart store
  $: ({ chartData, error } = $chartStore);

  let citySearch = '';
  let cityResults: CitySearchResult[] = [];
  let showCityDropdown = false;
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;
  let selectedIndex = -1;
  // Removed timezoneInfo
  
  // Form state to preserve values
  let birthDate = '';
  let birthTime = '';
  let selectedCityData: any = null;
  let formError = ''; // Client-side form validation error
  let cityInputBlurred = false;
  
  function onCityInput(e: Event) {
    citySearch = (e.target as HTMLInputElement).value;
    selectedIndex = -1;
    
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
    showCityDropdown = false;
    selectedIndex = -1;
    
    // Store city data
    selectedCityData = {
      name: city.name,
      fullLocation: city.fullLocation,
      lat: city.lat,
      lng: city.lng,
      country: city.country,
      adminName: city.adminName
    };
    
    // Update hidden input with city data
    const cityInput = document.getElementById(`${formPrefix}city-data`) as HTMLInputElement;
    if (cityInput) {
      cityInput.value = JSON.stringify(selectedCityData);
      console.log('City selected:', selectedCityData);
    }
    
    // Removed timezone update
  }

  // Removed updateTimezoneInfo and onDateTimeChange
</script>

<div class="p-4 mx-auto">
  <form 
    method="POST" 
    use:enhance={() => {
      return async ({ result }) => {
        if (result.type === 'success') {
          // Form submitted successfully
          console.log('Form submitted successfully');
        } else if (result.type === 'failure') {
          // Form submission failed
          console.error('Form submission failed:', result);
        }
      };
    }}
    class="space-y-6 max-w-2xl mx-auto"
  >
    <!-- Mobile-optimized form layout -->
    <div class="space-y-4">
      <!-- Birth Date Input -->
      <div class="space-y-2">
        <label for="{formPrefix}birth-date" class="block text-sm font-medium text-gray-700">
          Birth Date
        </label>
        <input
          type="date"
          id="{formPrefix}birth-date"
          name="birthDate"
          bind:value={birthDate}
          required
          class="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white shadow-sm"
          style="min-height: 48px; -webkit-appearance: none;"
        />
      </div>

      <!-- Birth Time Input -->
      <div class="space-y-2">
        <label for="{formPrefix}birth-time" class="block text-sm font-medium text-gray-700">
          Birth Time
        </label>
        <input
          type="time"
          id="{formPrefix}birth-time"
          name="birthTime"
          bind:value={birthTime}
          required
          class="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white shadow-sm"
          style="min-height: 48px; -webkit-appearance: none;"
        />
        <p class="text-xs text-gray-500">
          If you don't know your exact birth time, use 12:00 PM
        </p>
      </div>

      <!-- City Search Input -->
      <div class="space-y-2">
        <label for="{formPrefix}city" class="block text-sm font-medium text-gray-700">
          Birth City
        </label>
        <div class="relative">
          <input
            type="text"
            id="{formPrefix}city"
            name="city"
            bind:value={citySearch}
            on:input={onCityInput}
            on:keydown={onCityKeydown}
            on:blur={() => {
              cityInputBlurred = true;
              setTimeout(() => {
                if (cityInputBlurred) {
                  showCityDropdown = false;
                }
              }, 200);
            }}
            on:focus={() => {
              cityInputBlurred = false;
              if (cityResults.length > 0) {
                showCityDropdown = true;
              }
            }}
            placeholder="Start typing your birth city..."
            required
            class="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white shadow-sm"
            style="min-height: 48px;"
          />
          
          <!-- City Dropdown -->
          {#if showCityDropdown && cityResults.length > 0}
            <div class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {#each cityResults as city, index}
                <button
                  type="button"
                  class="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors {selectedIndex === index ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900'}"
                  on:click={() => selectCity(city)}
                  on:mouseenter={() => selectedIndex = index}
                >
                  <div class="font-medium">{city.name}</div>
                  <div class="text-sm text-gray-500">{city.fullLocation}</div>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- Hidden input for city data -->
      <input type="hidden" id="{formPrefix}city-data" name="cityData" />

      <!-- Submit Button -->
      <div class="pt-4">
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 transform hover:scale-105 active:scale-95"
          style="min-height: 56px;"
        >
          Calculate Birth Chart
        </button>
      </div>

      <!-- Error Display -->
      {#if formError}
        <div class="bg-red-50 border border-red-200 rounded-xl p-4">
          <p class="text-red-700 text-sm">{formError}</p>
        </div>
      {/if}
    </div>
  </form>
</div> 