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
    </div>

    {#if chartResult && chartDataString}
      <div class="results-section">
        <div class="chart-visualization">
          <h2>Your Birth Chart</h2>
          <ChartVisualization chartData={chartDataString} />
        </div>
        
        <div class="chart-data">
          <h2>Chart Data</h2>
          <ChartData {chartResult} />
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .chart-page {
    max-width: 1400px;
    margin: 0 auto;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .page-header h1 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  .page-header p {
    color: #666;
    font-size: 1.1rem;
  }

  .chart-container {
    display: grid;
    gap: 2rem;
  }

  .form-section {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  }

  .loading-container {
    text-align: center;
    padding: 2rem;
  }

  .loading-container p {
    margin-top: 1rem;
    color: #666;
  }

  .results-section {
    display: grid;
    gap: 2rem;
  }

  .chart-visualization {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  }

  .chart-data {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  }

  @media (min-width: 1024px) {
    .chart-container {
      grid-template-columns: 1fr 2fr;
    }
    
    .results-section {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 768px) {
    .page-header {
      margin-bottom: 2rem;
    }
    
    .form-section,
    .chart-visualization,
    .chart-data {
      padding: 1.5rem;
    }
  }
</style> 