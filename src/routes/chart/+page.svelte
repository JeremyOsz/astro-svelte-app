<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import D3Chart from '../../lib/chart/D3Chart.svelte';
  import BirthChartForm from './BirthChartForm.svelte';
  import * as Accordion from "$lib/components/ui/accordion";

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

  <!-- Collapsible Inputs Section on Top -->
  <div class="mb-8">
    <Accordion.Root type="single" class="w-full">
      <Accordion.Item value="birth-data">
        <Accordion.Trigger class="bg-white rounded-lg p-4 w-full hover:bg-gray-50 transition-colors cursor-pointer">
          <div class="flex items-center justify-between w-full">
            <h2 class="text-xl font-semibold text-gray-800">Birth Data Calculator</h2>
          </div>
        </Accordion.Trigger>
        <Accordion.Content class="bg-white rounded-lg shadow-md p-5 mt-2">
          <BirthChartForm on:chartGenerated={handleChartGenerated} />
        </Accordion.Content>
      </Accordion.Item>
      
      <Accordion.Item value="test-inputs">
        <Accordion.Trigger class="bg-white rounded-lg shadow-md p-4 w-full hover:bg-gray-50 transition-colors cursor-pointer mt-2">
          <div class="flex items-center justify-between w-full">
            <h2 class="text-xl font-semibold text-gray-800">Test Inputs & Chart Data</h2>
          </div>
        </Accordion.Trigger>
        <Accordion.Content class="bg-white rounded-lg shadow-md p-5 mt-2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-base font-medium text-gray-700 mb-4">Test Data</h3>
              <div class="flex gap-3 mb-4">
                <button on:click={loadTestData} class="px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors">
                  Load Test Data
                </button>
                <button on:click={clearChart} class="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors">
                  Clear Chart
                </button>
              </div>
            </div>
            
            <div>
              <h3 class="text-base font-medium text-gray-700 mb-4">Chart Data Input</h3>
              <p class="text-xs text-gray-600 mb-3">Edit the chart data below to see changes:</p>
              <textarea 
                class="w-full h-32 font-mono text-xs border border-gray-300 rounded-md p-3 resize-y"
                bind:value={$chartDataStore}
                placeholder="Enter chart data in format: Planet,Sign,Degree&#10;Example: Sun,Aries,15°30'"
                rows="8"
              ></textarea>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </div>

  <!-- Chart and Legend Section Side by Side -->
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
    <!-- Chart section: left column -->
    <div class="bg-white rounded-lg shadow-md p-5">
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

    <!-- Legend and Controls section: right column -->
    <div class="bg-white rounded-lg shadow-md p-5 h-fit">
      <h2 class="text-xl font-semibold text-gray-800 mb-5 pb-3 border-b-2 border-green-500">Chart Controls & Legend</h2>
      
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

      <div class="mb-6 pb-5 border-b border-gray-200">
        <h3 class="text-base font-medium text-gray-700 mb-4">Zodiac Signs</h3>
        <div class="text-xs text-gray-600 space-y-1">
          <div class="flex items-center">
            <span class="text-lg mr-2 text-red-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♈</span>
            <span>Aries (Fire)</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2 text-amber-700" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♉</span>
            <span>Taurus (Earth)</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2 text-blue-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♊</span>
            <span>Gemini (Air)</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2 text-indigo-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♋</span>
            <span>Cancer (Water)</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2 text-red-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♌</span>
            <span>Leo (Fire)</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2 text-amber-700" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♍</span>
            <span>Virgo (Earth)</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2 text-blue-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♎</span>
            <span>Libra (Air)</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2 text-indigo-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♏</span>
            <span>Scorpio (Water)</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2 text-red-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♐</span>
            <span>Sagittarius (Fire)</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2 text-amber-700" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♑</span>
            <span>Capricorn (Earth)</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2 text-blue-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♒</span>
            <span>Aquarius (Air)</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2 text-indigo-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♓</span>
            <span>Pisces (Water)</span>
          </div>
        </div>
      </div>

      <div class="mb-6 pb-5 border-b border-gray-200">
        <h3 class="text-base font-medium text-gray-700 mb-4">Planet Symbols</h3>
        <div class="text-xs text-gray-600 space-y-1">
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">☉</span>
            <span>Sun</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">☽</span>
            <span>Moon</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">☿</span>
            <span>Mercury</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♀</span>
            <span>Venus</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♂</span>
            <span>Mars</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♃</span>
            <span>Jupiter</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♄</span>
            <span>Saturn</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♅</span>
            <span>Uranus</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♆</span>
            <span>Neptune</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♇</span>
            <span>Pluto</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">☊</span>
            <span>North Node</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">⚸</span>
            <span>Black Moon Lilith</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">⚷</span>
            <span>Chiron</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">⊗</span>
            <span>Part of Fortune</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">Vx</span>
            <span>Vertex</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">Asc</span>
            <span>Ascendant</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">MC</span>
            <span>Midheaven</span>
          </div>
        </div>
      </div>

      <div class="mb-6 pb-5 border-b border-gray-200">
        <h3 class="text-base font-medium text-gray-700 mb-4">Aspect Lines</h3>
        <div class="text-xs text-gray-600 space-y-1">
          <div class="flex items-center">
            <div class="w-4 h-px bg-red-500 mr-2"></div>
            <span>Conjunction (0°)</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-px bg-red-600 mr-2"></div>
            <span>Opposition (180°)</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-px bg-blue-500 mr-2"></div>
            <span>Square (90°)</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-px bg-blue-600 mr-2"></div>
            <span>Trine (120°)</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-px bg-green-500 mr-2"></div>
            <span>Sextile (60°)</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-px bg-gray-400 mr-2"></div>
            <span>Quincunx (150°)</span>
          </div>
        </div>
      </div>

      <div class="mb-0">
        <h3 class="text-base font-medium text-gray-700 mb-4">Instructions</h3>
        <div class="text-xs text-gray-600 space-y-2">
          <p>Hover over planets and aspects to see detailed interpretations.</p>
          <p>Click the checkboxes to toggle different chart elements.</p>
          <p>Update the chart data in the textarea above to see different charts.</p>
        </div>
      </div>
    </div>
  </div>
</div> 