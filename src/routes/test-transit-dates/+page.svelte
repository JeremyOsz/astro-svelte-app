<script lang="ts">
  import { calculateTransitPeriod, formatTransitPeriod, getTransitPeriodDescription } from '$lib/utils/transit-utils';
  import type { Planet } from '$lib/types/types';

  // Mock transit and natal planets for testing
  const mockTransitPlanet: Planet = {
    name: 'Mars',
    longitude: 45.5,
    latitude: 0,
    distance: 1,
    sign: 'Taurus',
    degree: 15,
    house: 2
  };

  const mockNatalPlanet: Planet = {
    name: 'Venus',
    longitude: 47.2,
    latitude: 0,
    distance: 1,
    sign: 'Taurus',
    degree: 17,
    house: 2
  };

  const currentDate = new Date();
  const transitPeriod = calculateTransitPeriod(
    mockTransitPlanet,
    mockNatalPlanet,
    'Conjunction',
    currentDate,
    1.7
  );

  const formattedPeriod = formatTransitPeriod(transitPeriod);
  const periodDescription = getTransitPeriodDescription(transitPeriod);
</script>

<svelte:head>
  <title>Transit Date Test</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <h1 class="text-3xl font-bold text-gray-900 mb-6">Transit Date Functionality Test</h1>
  
  <div class="space-y-6">
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Test Transit Period Calculation</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="font-medium text-gray-900 mb-2">Transit Planet (Mars)</h3>
          <p class="text-sm text-gray-600">Longitude: {mockTransitPlanet.longitude}°</p>
          <p class="text-sm text-gray-600">Sign: {mockTransitPlanet.sign}</p>
          <p class="text-sm text-gray-600">House: {mockTransitPlanet.house}</p>
        </div>
        
        <div>
          <h3 class="font-medium text-gray-900 mb-2">Natal Planet (Venus)</h3>
          <p class="text-sm text-gray-600">Longitude: {mockNatalPlanet.longitude}°</p>
          <p class="text-sm text-gray-600">Sign: {mockNatalPlanet.sign}</p>
          <p class="text-sm text-gray-600">House: {mockNatalPlanet.house}</p>
        </div>
      </div>
      
      <div class="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <h3 class="font-medium text-orange-800 mb-2">Transit Period Results</h3>
        <p class="text-sm text-orange-700 font-medium mb-2">{formattedPeriod}</p>
        <p class="text-xs text-orange-600">{periodDescription}</p>
      </div>
      
      <div class="mt-4">
        <h3 class="font-medium text-gray-900 mb-2">Raw Period Data</h3>
        <pre class="text-xs bg-gray-100 p-3 rounded overflow-auto">{JSON.stringify(transitPeriod, null, 2)}</pre>
      </div>
    </div>
    
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-blue-900 mb-4">How to Test</h2>
      <ol class="list-decimal list-inside space-y-2 text-blue-800">
        <li>Go to the <a href="/transits" class="underline">Transits page</a></li>
        <li>Select a birth chart and calculate transits</li>
        <li>Click on any transit aspect line in the chart</li>
        <li>The dialog should now show the transit period information</li>
      </ol>
    </div>
  </div>
</div>
