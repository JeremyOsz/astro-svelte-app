<script lang="ts">
  import { enhance } from '$app/forms';
  import { searchCities, getCountryName, type CitySearchResult } from '$lib/services/city-service';
  import { getBirthTimezone, formatTimezoneOffset } from '$lib/services/timezone-service';
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
  let timezoneInfo: { timezone: string; offset: number; isDST: boolean } | null = null;
  
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
    
    // Update timezone info
    updateTimezoneInfo(city);
  }

  function updateTimezoneInfo(city: CitySearchResult) {
    if (birthDate && birthTime) {
      timezoneInfo = getBirthTimezone(
        parseFloat(city.lat),
        parseFloat(city.lng),
        birthDate,
        birthTime
      );
    }
  }

  // Update timezone info when birth date or time changes
  function onDateTimeChange() {
    if (selectedCityData && birthDate && birthTime) {
      updateTimezoneInfo(selectedCityData);
    }
  }
</script>

<div class="p-4 mx-auto">
  <h2 class="text-2xl font-semibold text-gray-900 mb-6">Enter Birth Details</h2>
  
  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      <strong>Error:</strong> {error}
    </div>
  {/if}

  {#if formError}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      <strong>Please fix the following:</strong> {formError}
    </div>
  {/if}

  {#if chartData}
    <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
      <strong>Success!</strong> Birth chart calculated successfully.
    </div>
  {/if}
  
  <form 
    method="POST" 
    action="?/calculate"
    on:submit={(e) => {
      // Clear previous errors
      formError = '';
      
      console.log('Form submission validation:', {
        birthDate,
        birthTime,
        selectedCityData,
        citySearch
      });
      
      // Validate all required fields
      if (!birthDate) {
        formError = 'Please select your birth date';
        e.preventDefault();
        return;
      }
      
      if (!birthTime) {
        formError = 'Please select your birth time';
        e.preventDefault();
        return;
      }
      
      if (!selectedCityData) {
        formError = 'Please select a city from the dropdown';
        e.preventDefault();
        return;
      }
      
      // Update the hidden city data input
      const cityInput = document.getElementById(`${formPrefix}city-data`) as HTMLInputElement;
      if (cityInput) {
        cityInput.value = JSON.stringify(selectedCityData);
        console.log('Updated city data input:', cityInput.value);
      }
      
      console.log('Form validation passed, proceeding with submission');
    }}
    use:enhance={({ formData }) => {
      console.log('=== ENHANCE FUNCTION DEBUG ===');
      console.log('Form data entries:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      // Get the correct field names based on prefix
      const birthDateField = formPrefix ? `${formPrefix}birthDate` : 'birthDate';
      const birthTimeField = formPrefix ? `${formPrefix}birthTime` : 'birthTime';
      const cityDataField = formPrefix ? `${formPrefix}cityData` : 'cityData';
      
      console.log('Form submitted with data:', {
        birthDate: formData.get(birthDateField),
        birthTime: formData.get(birthTimeField),
        cityData: formData.get(cityDataField)
      });
      // Set loading state when form submission starts
      chartStore.setLoading(true);
      
      return async ({ result, update }) => {
        console.log('Form result:', result);
        if (result.type === 'success' && result.data) {
          console.log('Form action data:', result.data);
          
          // Update the store with the chart data
          if (result.data && typeof result.data === 'object') {
            const data = result.data as { chartData?: string; error?: string };
            if (data.chartData) {
              chartStore.setChartData(data.chartData);
              console.log('Updated chart store with data:', data.chartData);
            } else if (data.error) {
              chartStore.setError(data.error);
            }
          }
          
          // Update the page data
          await update();
          console.log('Page updated with new data');
        } else if (result.type === 'failure') {
          console.error('Form failed:', result.data);
          if (result.data && typeof result.data === 'object' && 'error' in result.data) {
            const data = result.data as { error?: string };
            if (data.error) {
              chartStore.setError(data.error);
            }
          }
        }
        // Loading state is automatically cleared by setChartData or setError
      };
    }}
    class="space-y-6"
  >
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
        on:blur={() => cityInputBlurred = true}
        autocomplete="off"
        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors {selectedCityData ? 'border-green-300 bg-green-50' : citySearch ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'}"
        required
      />
      {#if citySearch && !selectedCityData && !showCityDropdown && cityInputBlurred}
        <p class="text-sm text-yellow-600 mt-1">Please select a city from the dropdown above</p>
      {/if}
      <input 
        id="{formPrefix}city-data" 
        type="hidden" 
        name="{formPrefix}cityData" 
        required
        value=""
      />
      
      {#if showCityDropdown}
        <ul class="absolute z-10 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-48 overflow-auto shadow-lg">
          {#each cityResults as city, index}
            <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
            <li
              class="px-4 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors {index === selectedIndex ? 'bg-blue-100' : 'hover:bg-blue-50'}"
              role="button"
              tabindex="0"
              on:click={() => selectCity(city)}
              on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectCity(city)}
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
      
      {#if citySearch && !showCityDropdown && citySearch.length > 1}
        <div class="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div class="text-sm">
            <div class="font-medium text-green-800">{citySearch}</div>
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
        name="{formPrefix}birthDate"
        bind:value={birthDate}
        on:change={onDateTimeChange}
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
        name="{formPrefix}birthTime"
        bind:value={birthTime}
        on:change={onDateTimeChange}
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
      <p class="text-xs text-gray-500">If you don't know your exact birth time, use 12:00 PM</p>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 pt-4">
      <button 
        type="submit" 
        class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium cursor-pointer"
      >
        Calculate Chart
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