<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { BirthData } from '$lib/types/types';
  import { calculateBirthChart, formatDegrees } from '$lib/chart/browser-chart';
  import { getSignByDegree } from '$lib/astrology/astronomia-service';

  const dispatch = createEventDispatcher<{ chartGenerated: string }>();

  let birthDate = '';
  let birthTime = '';
  let latitude = '';
  let longitude = '';
  let timezone = '';
  let loading = false;
  let error: string | null = null;

  // Common timezone options
  const timezoneOptions = [
    { value: '-12', label: 'UTC-12 (Baker Island)' },
    { value: '-11', label: 'UTC-11 (Samoa)' },
    { value: '-10', label: 'UTC-10 (Hawaii)' },
    { value: '-9', label: 'UTC-9 (Alaska)' },
    { value: '-8', label: 'UTC-8 (Pacific Time)' },
    { value: '-7', label: 'UTC-7 (Mountain Time)' },
    { value: '-6', label: 'UTC-6 (Central Time)' },
    { value: '-5', label: 'UTC-5 (Eastern Time)' },
    { value: '-4', label: 'UTC-4 (Atlantic Time)' },
    { value: '-3', label: 'UTC-3 (Brazil)' },
    { value: '-2', label: 'UTC-2 (South Georgia)' },
    { value: '-1', label: 'UTC-1 (Azores)' },
    { value: '0', label: 'UTC+0 (London)' },
    { value: '1', label: 'UTC+1 (Paris)' },
    { value: '2', label: 'UTC+2 (Cairo)' },
    { value: '3', label: 'UTC+3 (Moscow)' },
    { value: '4', label: 'UTC+4 (Dubai)' },
    { value: '5', label: 'UTC+5 (Mumbai)' },
    { value: '6', label: 'UTC+6 (Dhaka)' },
    { value: '7', label: 'UTC+7 (Bangkok)' },
    { value: '8', label: 'UTC+8 (Beijing)' },
    { value: '9', label: 'UTC+9 (Tokyo)' },
    { value: '10', label: 'UTC+10 (Sydney)' },
    { value: '11', label: 'UTC+11 (Solomon Islands)' },
    { value: '12', label: 'UTC+12 (New Zealand)' }
  ];

  async function handleSubmit() {
    if (!birthDate || !birthTime || !latitude || !longitude || !timezone) {
      alert('Please fill in all fields');
      return;
    }

    loading = true;
    error = null;

    try {
      const birthData: BirthData = {
        date: birthDate,
        time: birthTime,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        timezone: parseInt(timezone)
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

  function setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latitude = position.coords.latitude.toFixed(6);
          longitude = position.coords.longitude.toFixed(6);
          // Set timezone based on current time
          const offset = new Date().getTimezoneOffset() / -60;
          timezone = offset.toString();
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
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

    <div class="space-y-2">
      <label for="latitude" class="block text-sm font-medium text-gray-700">
        Latitude *
      </label>
      <input
        id="latitude"
        type="number"
        bind:value={latitude}
        step="0.000001"
        placeholder="e.g., 40.7128"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
      <p class="text-xs text-gray-500">Positive for North, negative for South</p>
    </div>

    <div class="space-y-2">
      <label for="longitude" class="block text-sm font-medium text-gray-700">
        Longitude *
      </label>
      <input
        id="longitude"
        type="number"
        bind:value={longitude}
        step="0.000001"
        placeholder="e.g., -74.0060"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
      <p class="text-xs text-gray-500">Positive for East, negative for West</p>
    </div>

    <div class="space-y-2">
      <label for="timezone" class="block text-sm font-medium text-gray-700">
        Timezone *
      </label>
      <select 
        id="timezone" 
        bind:value={timezone} 
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        <option value="">Select timezone</option>
        {#each timezoneOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 pt-4">
      <button 
        type="button" 
        on:click={setCurrentLocation}
        class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
      >
        Use Current Location
      </button>
      <button 
        type="submit" 
        disabled={loading}
        class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
      >
        {loading ? 'Calculating...' : 'Calculate Chart'}
      </button>
    </div>
  </form>

  <div class="mt-8 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500">
    <h3 class="text-lg font-medium text-gray-900 mb-3">Need Help?</h3>
    <ul class="space-y-2 text-sm text-gray-600">
      <li class="flex items-start">
        <span class="font-medium mr-2">Birth Time:</span>
        If you don't know your exact birth time, use 12:00 PM. This will give you a noon chart.
      </li>
      <li class="flex items-start">
        <span class="font-medium mr-2">Coordinates:</span>
        You can find your birth location coordinates using Google Maps or other mapping services.
      </li>
      <li class="flex items-start">
        <span class="font-medium mr-2">Timezone:</span>
        Make sure to use the timezone that was in effect at your birth time (accounting for daylight saving time if applicable).
      </li>
    </ul>
  </div>
</div> 