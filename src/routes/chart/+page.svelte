<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import D3Chart from '../../lib/chart/D3Chart.svelte';
  import BirthChartForm from './BirthChartForm.svelte';

  let chartComponent: D3Chart;
  let chartData: string = '';
  let showChart = false;

  // Chart settings
  let showDegreeMarkers = true;
  let showExtendedPlanets = true;
  let showAspectLines = true;
  let showPlanetLabels = true;
  let zoomLevel = 1;

  // Mock chart data for testing
  const mockChartData = `Sun,Sagittarius,17°09'
Moon,Capricorn,26°20'
Mercury,Sagittarius,14°28',R
Venus,Scorpio,4°00'
Mars,Sagittarius,7°36'
Jupiter,Virgo,13°55',R
Saturn,Aquarius,3°32'
Uranus,Capricorn,12°23'
Neptune,Capricorn,15°24'
Pluto,Scorpio,21°20'
Node,Capricorn,10°59',R
Lilith,Capricorn,25°14'
Chiron,Leo,9°20',R
Fortune,Libra,22°29'
Vertex,Aries,29°44'
ASC,Sagittarius,1°40'
MC,Leo,10°14'`;
  
  const chartDataStore = writable(mockChartData);

  onMount(() => {
    // Load test data by default
    loadTestData();
  });

  function handleChartGenerated(event: CustomEvent<string>) {
    chartData = event.detail;
    chartDataStore.set(chartData);
    showChart = true;
  }

  function loadTestData() {
    chartDataStore.set(mockChartData);
    showChart = true;
  }

  function clearChart() {
    chartDataStore.set('');
    showChart = false;
  }

  function handleZoomIn() {
    if (chartComponent) {
      chartComponent.zoomIn();
    }
  }

  function handleZoomOut() {
    if (chartComponent) {
      chartComponent.zoomOut();
    }
  }

  function handleZoomReset() {
    if (chartComponent) {
      chartComponent.zoomReset();
    }
  }
</script>

<svelte:head>
  <title>Astrological Birth Chart - Astro Chart</title>
  <meta name="description" content="Generate and visualize your astrological birth chart" />
</svelte:head>

<div class="max-w-7xl mx-auto p-5">
  <div class="text-center mb-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-3">Astrological Birth Chart</h1>
    <p class="text-gray-600 text-base">Generate your personalized astrological birth chart with detailed planetary positions and aspects</p>
  </div>

  <div class="flex flex-col-reverse md:grid md:grid-cols-[350px_1fr] gap-8">
    <!-- Controls section: left on desktop, bottom on mobile -->
    <div class="grid-span-1 bg-white rounded-lg shadow-md p-5 h-fit">
      <h2 class="text-xl font-semibold text-gray-800 mb-5 pb-3 border-b-2 border-green-500">Controls</h2>
      
      <div class="mb-6 pb-5 border-b border-gray-200">
        <h3 class="text-base font-medium text-gray-700 mb-4">Birth Data Calculator</h3>
        <BirthChartForm on:chartGenerated={handleChartGenerated} />
      </div>

      <div class="mb-6 pb-5 border-b border-gray-200">
        <h3 class="text-base font-medium text-gray-700 mb-4">Test Data</h3>
        <button on:click={loadTestData} class="px-4 py-2 bg-green-500 text-white rounded-md text-sm mr-3 mb-3 hover:bg-green-600 transition-colors">
          Load Test Data
        </button>
        <button on:click={clearChart} class="px-4 py-2 bg-red-500 text-white rounded-md text-sm mr-3 mb-3 hover:bg-red-600 transition-colors">
          Clear Chart
        </button>
      </div>

      <div class="mb-6 pb-5 border-b border-gray-200">
        <h3 class="text-base font-medium text-gray-700 mb-4">Chart Options</h3>
        <label class="flex items-center mb-3 cursor-pointer text-sm">
          <input type="checkbox" bind:checked={showDegreeMarkers} class="mr-3">
          Show Degree Markers
        </label>
        <label class="flex items-center mb-3 cursor-pointer text-sm">
          <input type="checkbox" bind:checked={showExtendedPlanets} class="mr-3">
          Show Extended Planets
        </label>
        <label class="flex items-center mb-3 cursor-pointer text-sm">
          <input type="checkbox" bind:checked={showAspectLines} class="mr-3">
          Show Aspect Lines
        </label>
        <label class="flex items-center mb-3 cursor-pointer text-sm">
          <input type="checkbox" bind:checked={showPlanetLabels} class="mr-3">
          Show Planet Labels
        </label>
      </div>

      <div class="mb-6 pb-5 border-b border-gray-200">
        <h3 class="text-base font-medium text-gray-700 mb-4">Zoom Controls</h3>
        <div class="flex gap-2 mb-3">
          <button on:click={handleZoomIn} class="bg-green-500 text-white border-none px-3 py-2 rounded text-base font-bold min-w-10 hover:bg-green-600 active:bg-green-700 transition-colors">+</button>
          <button on:click={handleZoomOut} class="bg-green-500 text-white border-none px-3 py-2 rounded text-base font-bold min-w-10 hover:bg-green-600 active:bg-green-700 transition-colors">−</button>
          <button on:click={handleZoomReset} class="bg-green-500 text-white border-none px-3 py-2 rounded text-base font-bold min-w-10 hover:bg-green-600 active:bg-green-700 transition-colors">Reset</button>
        </div>
        <div class="text-center mt-2 text-sm text-gray-600">
          Zoom: <span class="font-bold text-gray-800">{Math.round(zoomLevel * 100)}%</span>
        </div>
      </div>

      <div class="mb-0">
        <h3 class="text-base font-medium text-gray-700 mb-4">Chart Data Input</h3>
        <p class="text-xs text-gray-600 mb-3">Edit the chart data below to see changes:</p>
        <textarea 
          class="w-full h-64 font-mono text-xs border border-gray-300 rounded-md p-3 resize-y mb-3"
          bind:value={$chartDataStore}
          placeholder="Enter chart data in format: Planet,Sign,Degree&#10;Example: Sun,Aries,15°30'"
          rows="15"
        ></textarea>
      </div>
    </div>
    
    <!-- Chart section: right on desktop, top on mobile -->
    <div class="grid-span-1 bg-white rounded-lg shadow-md p-5 mb-8 lg:mb-0">
      <h2 class="text-xl font-semibold text-gray-800 mb-5 pb-3 border-b-2 border-green-500">Chart Visualization</h2>
      {#if showChart}
        <D3Chart 
          bind:this={chartComponent}
          chartData={$chartDataStore}
          {showDegreeMarkers}
          {showExtendedPlanets}
          {showAspectLines}
          {showPlanetLabels}
          bind:zoomLevel={zoomLevel}
        />
      {:else}
        <div class="flex items-center justify-center h-96 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-base">
          <p>Enter your birth details or load test data to see the chart visualization</p>
        </div>
      {/if}
    </div>
  </div>

</div> 