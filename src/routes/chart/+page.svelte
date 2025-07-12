<script lang="ts">
  import { onMount } from 'svelte';
  import type { BirthData } from '$lib/types/types';
  import { calculateBirthChart, formatDegrees } from '$lib/chart/browser-chart';
  import { getSignByDegree } from '$lib/astrology/astronomia-service';
  import BirthChartForm from './BirthChartForm.svelte';
  import ChartVisualization from './ChartVisualization.svelte';
  import ChartData from './ChartData.svelte';

  let birthData: BirthData | null = null;
  let chartResult: any = null;
  let loading = false;
  let error: string | null = null;
  let chartDataString = '';
  
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

  let showTestChart = false;

  async function handleCalculateChart(data: BirthData) {
    loading = true;
    error = null;
    
    try {
      birthData = data;
      chartResult = await calculateBirthChart(data);
      
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

      chartDataString = lines.join('\n');
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred while calculating the chart';
    } finally {
      loading = false;
    }
  }

  function loadTestChart() {
    chartDataString = mockChartData;
    showTestChart = true;
  }
</script>

<svelte:head>
  <title>Birth Chart Calculator - Astro Chart</title>
  <meta name="description" content="Calculate your birth chart with precise planetary positions using Swiss Ephemeris" />
</svelte:head>

<div class="chart-page">
  <div class="page-header">
    <h1>Birth Chart Calculator</h1>
    <p>Enter your birth details to calculate your natal chart with precise planetary positions.</p>
  </div>

  {#if error}
    <div class="error">
      <strong>Error:</strong> {error}
    </div>
  {/if}

  <div class="chart-container">
    <div class="form-section">
      <BirthChartForm on:calculate={({ detail }: { detail: BirthData }) => handleCalculateChart(detail)} />
      
      {#if loading}
        <div class="loading-container">
          <div class="loading"></div>
          <p>Calculating your birth chart...</p>
        </div>
      {/if}
      
      <!-- Test Chart Button -->
      <div class="test-section">
        <button on:click={loadTestChart} class="test-btn">
          Load Test Chart Data
        </button>
        <p class="test-note">Click to load mock chart data for testing the visualization</p>
      </div>
    </div>

    {#if chartDataString}
      <div class="results-section">
        <div class="chart-visualization">
          <h2>{showTestChart ? 'Test Chart Visualization' : 'Your Birth Chart'}</h2>
          <ChartVisualization chartData={chartDataString} />
        </div>
        
        {#if chartResult}
          <div class="chart-data">
            <h2>Chart Data</h2>
            <ChartData {chartResult} />
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .chart-page {
    max-width: 1200px;
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

  .error {
    background: #ffebee;
    color: #c62828;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #ffcdd2;
  }

  .chart-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 30px;
  }

  .form-section {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.08);
    padding: 20px;
  }

  .loading-container {
    text-align: center;
    padding: 20px;
  }

  .loading {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #4CAF50;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 0 auto 10px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .test-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }

  .test-btn {
    background: #2196F3;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
  }

  .test-btn:hover {
    background: #1976D2;
  }

  .test-note {
    font-size: 12px;
    color: #666;
    margin-top: 8px;
    text-align: center;
  }

  .results-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .chart-visualization {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.08);
    padding: 20px;
  }

  .chart-visualization h2 {
    margin-bottom: 15px;
    color: #333;
  }

  .chart-data {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.08);
    padding: 20px;
  }

  .chart-data h2 {
    margin-bottom: 15px;
    color: #333;
  }

  @media (max-width: 768px) {
    .chart-container {
      grid-template-columns: 1fr;
    }
  }
</style> 