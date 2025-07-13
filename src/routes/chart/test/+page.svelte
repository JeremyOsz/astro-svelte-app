<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let chartContainer: HTMLDivElement;
  let chartDataInput: HTMLTextAreaElement;

  // Mock chart data for testing - matches reference format
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

  onMount(() => {
    // Load the D3 chart script directly
    loadD3ChartScript();
  });

  function loadD3ChartScript() {
    // Check if script is already loaded
    if (typeof window !== 'undefined' && (window as any).initChart) {
      initializeChart();
      return;
    }

    // Make D3 available globally for the chart script
    (window as any).d3 = d3;
    
    // Load the chart script
    loadChartScript();
  }

  function loadChartScript() {
    // Create script element for the chart - use the simpler reference implementation
    const script = document.createElement('script');
    script.src = '/chart-reference.js';
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
      // Wait for DOM to be ready
      setTimeout(() => {
        (window as any).initChart();
        // Set up event listeners manually since they might not be attached properly
        setupEventListeners();
      }, 100);
    }
  }

  function setupEventListeners() {
    // Toggle controls
    const toggleDegree = document.getElementById('toggle-degree');
    const toggleExtended = document.getElementById('toggle-extended');
    const toggleAspects = document.getElementById('toggle-aspects');
    const toggleLabels = document.getElementById('toggle-labels');
    
    if (toggleDegree) {
      toggleDegree.addEventListener('change', function(e) {
        (window as any).showDegreeMarkers = (e.target as HTMLInputElement).checked;
        (window as any).createChart();
      });
    }
    
    if (toggleExtended) {
      toggleExtended.addEventListener('change', function(e) {
        (window as any).showExtendedPlanets = (e.target as HTMLInputElement).checked;
        (window as any).createChart();
      });
    }
    
    if (toggleAspects) {
      toggleAspects.addEventListener('change', function(e) {
        (window as any).showAspectLines = (e.target as HTMLInputElement).checked;
        (window as any).createChart();
      });
    }
    
    if (toggleLabels) {
      toggleLabels.addEventListener('change', function(e) {
        (window as any).showPlanetLabels = (e.target as HTMLInputElement).checked;
        (window as any).createChart();
      });
    }
    
    // Zoom controls
    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');
    const zoomReset = document.getElementById('zoom-reset');
    
    if (zoomIn) {
      zoomIn.addEventListener('click', function() {
        const svg = d3.select('#chart-container svg');
        const node = svg.node() as Element;
        if (node) {
          const zoom = d3.zoomTransform(node);
          const newScale = Math.min(3, zoom.k * 1.2);
          svg.transition().duration(300).call(
            d3.zoom().transform as any,
            d3.zoomIdentity.scale(newScale).translate(zoom.x, zoom.y)
          );
          
          // Update zoom level display
          const zoomLevelText = document.getElementById('zoom-level-text');
          if (zoomLevelText) {
            zoomLevelText.textContent = Math.round(newScale * 100) + '%';
          }
        }
      });
    }
    
    if (zoomOut) {
      zoomOut.addEventListener('click', function() {
        const svg = d3.select('#chart-container svg');
        const node = svg.node() as Element;
        if (node) {
          const zoom = d3.zoomTransform(node);
          const newScale = Math.max(0.5, zoom.k / 1.2);
          svg.transition().duration(300).call(
            d3.zoom().transform as any,
            d3.zoomIdentity.scale(newScale).translate(zoom.x, zoom.y)
          );
          
          // Update zoom level display
          const zoomLevelText = document.getElementById('zoom-level-text');
          if (zoomLevelText) {
            zoomLevelText.textContent = Math.round(newScale * 100) + '%';
          }
        }
      });
    }
    
    if (zoomReset) {
      zoomReset.addEventListener('click', function() {
        const svg = d3.select('#chart-container svg');
        svg.transition().duration(300).call(
          d3.zoom().transform as any,
          d3.zoomIdentity
        );
        
        // Update zoom level display
        const zoomLevelText = document.getElementById('zoom-level-text');
        if (zoomLevelText) {
          zoomLevelText.textContent = '100%';
        }
      });
    }
    
    // Update chart button
    const updateChartBtn = document.getElementById('update-chart-btn');
    if (updateChartBtn) {
      updateChartBtn.addEventListener('click', function() {
        if (typeof window !== 'undefined' && (window as any).parseDataAndGenerateHouses) {
          (window as any).parseDataAndGenerateHouses();
          (window as any).calculateAspects();
          (window as any).createChart();
        }
      });
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