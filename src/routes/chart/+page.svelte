<script lang="ts">
  import { onMount } from 'svelte';
  import BirthChartForm from './BirthChartForm.svelte';

  let chartData: string = '';
  let showChart = false;

  function handleChartGenerated(event: CustomEvent<string>) {
    chartData = event.detail;
    showChart = true;
  }

  function handleReset() {
    chartData = '';
    showChart = false;
  }
</script>

<svelte:head>
  <title>Astrological Birth Chart - Astro Chart</title>
  <meta name="description" content="Generate and visualize your astrological birth chart" />
</svelte:head>

<div class="chart-page">
  <div class="page-header">
    <h1>Astrological Birth Chart</h1>
    <p>Generate your personalized astrological birth chart with detailed planetary positions and aspects</p>
  </div>

  {#if !showChart}
    <BirthChartForm on:chartGenerated={handleChartGenerated} />
  {:else}
    <div class="chart-section">
      <div class="chart-header">
        <h2>Chart Generated Successfully!</h2>
        <button class="reset-btn" on:click={handleReset}>Generate New Chart</button>
      </div>
      
      <div class="chart-message">
        <p>Your chart data has been generated. To view the interactive chart visualization, please visit:</p>
        <a href="/chart/test" class="test-link">Chart Test Page</a>
        <p class="chart-data-preview">
          <strong>Preview of your chart data:</strong><br>
          <code>{chartData.split('\n').slice(0, 5).join('\n')}...</code>
        </p>
      </div>
    </div>
  {/if}
</div>

<style>
  .chart-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .page-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .page-header h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 10px;
  }

  .page-header p {
    font-size: 1.1rem;
    color: #7f8c8d;
    max-width: 600px;
    margin: 0 auto;
  }

  .chart-section {
    margin-top: 40px;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 2px solid #ecf0f1;
  }

  .chart-header h2 {
    font-size: 1.8rem;
    color: #2c3e50;
    margin: 0;
  }

  .reset-btn {
    padding: 10px 20px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.3s ease;
  }

  .reset-btn:hover {
    background: #c0392b;
  }

  .chart-message {
    text-align: center;
    padding: 40px 20px;
    background: #f8f9fa;
    border-radius: 10px;
    margin-top: 20px;
  }

  .chart-message p {
    margin-bottom: 20px;
    color: #666;
    font-size: 1.1rem;
  }

  .test-link {
    display: inline-block;
    padding: 12px 24px;
    background: #667eea;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
    margin: 20px 0;
    transition: background-color 0.3s ease;
  }

  .test-link:hover {
    background: #5a67d8;
  }

  .chart-data-preview {
    margin-top: 30px;
    padding: 20px;
    background: white;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
  }

  .chart-data-preview code {
    display: block;
    background: #f1f5f9;
    padding: 15px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    color: #374151;
    white-space: pre-wrap;
    text-align: left;
    margin-top: 10px;
  }

  @media (max-width: 768px) {
    .chart-page {
      padding: 15px;
    }

    .page-header h1 {
      font-size: 2rem;
    }

    .chart-header {
      flex-direction: column;
      gap: 15px;
      align-items: flex-start;
    }

    .chart-header h2 {
      font-size: 1.5rem;
    }
  }
</style> 