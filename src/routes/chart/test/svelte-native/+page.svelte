<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import D3Chart from '../../../../lib/chart/D3Chart.svelte';
  import { formatChartFromInput } from '../../../../lib/chart/browser-chart';

  let chartComponent: D3Chart;
  let birthDate: string = '';
  let birthTime: string = '';
  let birthLocation: string = '';

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

  function loadTestData() {
    chartDataStore.set(mockChartData);
  }

  function clearChart() {
    chartDataStore.set('');
  }

  async function calculateFromBirthData() {
    if (!birthDate || !birthTime || !birthLocation) {
      alert('Please fill in all birth data fields');
      return;
    }

    try {
      const formattedData = await formatChartFromInput(birthDate, birthTime, birthLocation);
      chartDataStore.set(formattedData);
    } catch (error) {
      console.error('Error calculating birth chart:', error);
      alert('Error calculating birth chart. Please check your input data.');
    }
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
  <title>Chart Test - Svelte Native D3 Visualization</title>
  <meta name="description" content="Test the Svelte-native D3 astrological chart visualization" />
</svelte:head>

<div class="test-page">
  <div class="page-header">
    <h1>Svelte Native D3 Chart Visualization Test</h1>
    <p>Test the astrological chart visualization with Svelte-native implementation</p>
  </div>

  <div class="test-container">
    <div class="controls-section">
      <h2>Controls</h2>
      
      <div class="control-group">
        <h3>Birth Data Calculator</h3>
        <div class="input-group">
          <label for="birth-date">Birth Date:</label>
          <input type="date" id="birth-date" bind:value={birthDate} />
        </div>
        <div class="input-group">
          <label for="birth-time">Birth Time:</label>
          <input type="time" id="birth-time" bind:value={birthTime} />
        </div>
        <div class="input-group">
          <label for="birth-location">Birth Location:</label>
          <input type="text" id="birth-location" bind:value={birthLocation} placeholder="City, Country" />
        </div>
        <button on:click={calculateFromBirthData} class="btn btn-primary">
          Calculate Chart
        </button>
      </div>

      <div class="control-group">
        <h3>Test Data</h3>
        <button on:click={loadTestData} class="btn btn-primary">
          Load Test Data
        </button>
        <button on:click={clearChart} class="btn btn-secondary">
          Clear Chart
        </button>
      </div>

      <div class="control-group">
        <h3>Chart Options</h3>
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={showDegreeMarkers}>
          Show Degree Markers
        </label>
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={showExtendedPlanets}>
          Show Extended Planets
        </label>
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={showAspectLines}>
          Show Aspect Lines
        </label>
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={showPlanetLabels}>
          Show Planet Labels
        </label>
      </div>

      <div class="control-group">
        <h3>Zoom Controls</h3>
        <div class="zoom-controls">
          <button on:click={handleZoomIn} class="zoom-btn">+</button>
          <button on:click={handleZoomOut} class="zoom-btn">−</button>
          <button on:click={handleZoomReset} class="zoom-btn">Reset</button>
        </div>
        <div class="zoom-level">
          Zoom: <span>{Math.round(zoomLevel * 100)}%</span>
        </div>
      </div>

      <div class="control-group">
        <h3>Chart Data Input</h3>
        <p class="input-note">Edit the chart data below to see changes:</p>
        <textarea 
          class="chart-data-input"
          bind:value={$chartDataStore}
          placeholder="Enter chart data in format: Planet,Sign,Degree&#10;Example: Sun,Aries,15°30'"
          rows="15"
        ></textarea>
      </div>
    </div>

    <div class="chart-section">
      <h2>Chart Visualization</h2>
      <D3Chart 
        bind:this={chartComponent}
        chartData={$chartDataStore}
        {showDegreeMarkers}
        {showExtendedPlanets}
        {showAspectLines}
        {showPlanetLabels}
        bind:zoomLevel={zoomLevel}
      />
    </div>
  </div>
</div>

<style>
  .test-page {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }

  .page-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .page-header h1 {
    color: #333;
    margin-bottom: 10px;
  }

  .page-header p {
    color: #666;
    font-size: 16px;
  }

  .test-container {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 30px;
  }

  .controls-section {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.08);
    padding: 20px;
    height: fit-content;
  }

  .controls-section h2 {
    margin-bottom: 20px;
    color: #333;
    border-bottom: 2px solid #4CAF50;
    padding-bottom: 10px;
  }

  .control-group {
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
  }

  .control-group:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .control-group h3 {
    margin-bottom: 15px;
    color: #555;
    font-size: 16px;
  }

  .input-group {
    margin-bottom: 15px;
  }

  .input-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
  }

  .input-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }

  .btn {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;
    margin-bottom: 10px;
    transition: background-color 0.2s;
  }

  .btn-primary {
    background: #4CAF50;
    color: white;
  }

  .btn-primary:hover {
    background: #45a049;
  }

  .btn-secondary {
    background: #f44336;
    color: white;
  }

  .btn-secondary:hover {
    background: #da190b;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    cursor: pointer;
    font-size: 14px;
  }

  .checkbox-label input[type="checkbox"] {
    margin-right: 10px;
  }

  .zoom-controls {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  }

  .zoom-btn {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    min-width: 40px;
    transition: background-color 0.2s;
  }

  .zoom-btn:hover {
    background: #45a049;
  }

  .zoom-btn:active {
    background: #3d8b40;
  }

  #zoom-reset {
    background: #2196F3;
    font-size: 12px;
    padding: 8px 8px;
  }

  #zoom-reset:hover {
    background: #1976D2;
  }

  .zoom-level {
    text-align: center;
    margin-top: 8px;
    font-size: 14px;
    color: #666;
  }

  .zoom-level span {
    font-weight: bold;
    color: #333;
  }

  .input-note {
    font-size: 12px;
    color: #666;
    margin-bottom: 10px;
  }

  .chart-data-input {
    width: 100%;
    height: 250px;
    font-family: monospace;
    font-size: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    resize: vertical;
    margin-bottom: 10px;
  }

  .chart-section {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.08);
    padding: 20px;
  }

  .chart-section h2 {
    margin-bottom: 20px;
    color: #333;
    border-bottom: 2px solid #4CAF50;
    padding-bottom: 10px;
  }

  @media (max-width: 1024px) {
    .test-container {
      grid-template-columns: 1fr;
    }
    
    .controls-section {
      order: 2;
    }
    
    .chart-section {
      order: 1;
    }
  }

  @media (max-width: 768px) {
    .test-page {
      padding: 10px;
    }
    
    .controls-section,
    .chart-section {
      padding: 15px;
    }
  }
</style> 