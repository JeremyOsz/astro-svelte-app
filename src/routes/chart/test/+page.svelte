<script lang="ts">
  import { onMount } from 'svelte';

  let chartContainer: HTMLDivElement;
  let chartDataInput: HTMLTextAreaElement;

  // Mock chart data for testing
  const mockChartData = `Sun,Sagittarius,18°01'
Moon,Aries,28°43'
Mercury,Sagittarius,7°52'
Venus,Virgo,29°37'
Mars,Aries,26°16'
Jupiter,Taurus,5°35'
Saturn,Taurus,17°04'
Uranus,Aquarius,16°39'
Neptune,Aquarius,6°25'
Pluto,Sagittarius,2°42'
Node,Aries,13°06'
Lilith,Aries,28°06'
Chiron,Aries,28°06'
ASC,Aquarius,6°59'
MC,Taurus,6°59'`;

  onMount(() => {
    // Load interpretations first, then the D3 chart script
    loadInterpretations();
  });

  function loadInterpretations() {
    // Load interpretations data first
    const interpretationsScript = document.createElement('script');
    interpretationsScript.src = '/assets/interpretations/interpretations.js';
    interpretationsScript.onload = () => {
      // Then load the D3 chart script
      loadD3ChartScript();
    };
    interpretationsScript.onerror = () => {
      console.error('Failed to load interpretations data');
      // Still try to load the chart script
      loadD3ChartScript();
    };
    document.head.appendChild(interpretationsScript);
  }

  function loadD3ChartScript() {
    // Check if script is already loaded
    if (typeof window !== 'undefined' && (window as any).initChart) {
      initializeChart();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = '/d3chart.js';
    script.onload = () => {
      // Wait a bit for the script to initialize
      setTimeout(() => {
        initializeChart();
      }, 100);
    };
    script.onerror = () => {
      console.error('Failed to load D3 chart script');
    };
    document.head.appendChild(script);
  }

  function initializeChart() {
    if (chartDataInput) {
      chartDataInput.value = mockChartData;
    }
    
    // Initialize the chart if the function exists
    if (typeof window !== 'undefined' && (window as any).initChart) {
      (window as any).initChart();
    }
  }

  function loadTestData() {
    if (chartDataInput) {
      chartDataInput.value = mockChartData;
      if (typeof window !== 'undefined' && (window as any).initChart) {
        (window as any).initChart();
      }
    }
  }

  function clearChart() {
    if (chartDataInput) {
      chartDataInput.value = '';
      if (typeof window !== 'undefined' && (window as any).initChart) {
        (window as any).initChart();
      }
    }
  }
</script>

<svelte:head>
  <title>Chart Test - D3 Visualization</title>
  <meta name="description" content="Test the D3 astrological chart visualization" />
</svelte:head>

<div class="test-page">
  <div class="page-header">
    <h1>D3 Chart Visualization Test</h1>
    <p>Test the astrological chart visualization with mock data</p>
  </div>

  <div class="test-container">
    <div class="controls-section">
      <h2>Controls</h2>
      
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
          <input type="checkbox" id="toggle-degree" checked>
          Show Degree Markers
        </label>
        <label class="checkbox-label">
          <input type="checkbox" id="toggle-extended" checked>
          Show Extended Planets
        </label>
        <label class="checkbox-label">
          <input type="checkbox" id="toggle-aspects" checked>
          Show Aspect Lines
        </label>
        <label class="checkbox-label">
          <input type="checkbox" id="toggle-labels" checked>
          Show Planet Labels
        </label>
      </div>

      <div class="control-group">
        <h3>Zoom Controls</h3>
        <div class="zoom-controls">
          <button id="zoom-in" class="zoom-btn">+</button>
          <button id="zoom-out" class="zoom-btn">−</button>
          <button id="zoom-reset" class="zoom-btn">Reset</button>
        </div>
        <div class="zoom-level">
          Zoom: <span id="zoom-level-text">100%</span>
        </div>
      </div>

      <div class="control-group">
        <h3>Chart Data Input</h3>
        <p class="input-note">Edit the chart data below and click "Update Chart" to see changes:</p>
        <textarea 
          id="chart-data-input" 
          bind:this={chartDataInput}
          placeholder="Enter chart data in format: Planet,Sign,Degree&#10;Example: Sun,Aries,15°30'"
          rows="15"
        ></textarea>
        <button id="update-chart-btn" class="btn btn-primary">
          Update Chart
        </button>
      </div>
    </div>

    <div class="chart-section">
      <h2>Chart Visualization</h2>
      <div id="chart-container" bind:this={chartContainer}></div>
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
    font-size: 14px;
    color: #666;
  }

  #zoom-level-text {
    font-weight: bold;
    color: #333;
  }

  .input-note {
    font-size: 12px;
    color: #666;
    margin-bottom: 10px;
  }

  #chart-data-input {
    width: 100%;
    height: 200px;
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

  #chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 600px;
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fafafa;
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