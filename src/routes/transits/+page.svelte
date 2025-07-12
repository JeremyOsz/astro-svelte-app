<script lang="ts">
  import { onMount } from 'svelte';
  import type { BirthData } from '$lib/types/types';
  import { calculateBirthChart } from '$lib/chart/browser-chart';
  import BirthChartForm from '../chart/BirthChartForm.svelte';
  import TransitDisplay from './TransitDisplay.svelte';

  let birthData: BirthData | null = null;
  let natalChart: any = null;
  let currentTransits: any = null;
  let loading = false;
  let error: string | null = null;

  async function handleCalculateTransits(data: BirthData) {
    loading = true;
    error = null;
    
    try {
      birthData = data;
      
      // Calculate natal chart
      natalChart = await calculateBirthChart(data);
      
      // Calculate current transits using the transits API
      const response = await fetch('/api/transits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          natalChart: natalChart,
          transitDate: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate transits');
      }

      currentTransits = await response.json();
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred while calculating transits';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Planetary Transits - Astro Chart</title>
  <meta name="description" content="View current planetary transits and their effects on your natal chart" />
</svelte:head>

<div class="transits-page">
  <div class="page-header">
    <h1>Planetary Transits</h1>
    <p>View current planetary transits and their effects on your natal chart.</p>
  </div>

  {#if error}
    <div class="error">
      <strong>Error:</strong> {error}
    </div>
  {/if}

  <div class="transits-container">
    <div class="form-section">
      <BirthChartForm on:calculate={({ detail }: { detail: BirthData }) => handleCalculateTransits(detail)} />
      
      {#if loading}
        <div class="loading-container">
          <div class="loading"></div>
          <p>Calculating transits...</p>
        </div>
      {/if}
    </div>

    {#if natalChart && currentTransits}
      <div class="transits-section">
        <TransitDisplay {natalChart} {currentTransits} />
      </div>
    {/if}
  </div>

  <div class="info-section">
    <div class="card">
      <h2>About Transits</h2>
      <p>
        Planetary transits show how current planetary positions interact with your natal chart. 
        These transits can indicate periods of growth, challenge, or change in different areas of your life.
      </p>
      
      <div class="transit-types">
        <h3>Types of Transits</h3>
        <ul>
          <li><strong>Conjunction (0°):</strong> New beginnings, activation of natal potential</li>
          <li><strong>Opposition (180°):</strong> Awareness, relationships, external challenges</li>
          <li><strong>Square (90°):</strong> Tension, conflict, growth through challenge</li>
          <li><strong>Trine (120°):</strong> Harmony, ease, natural flow</li>
          <li><strong>Sextile (60°):</strong> Opportunity, cooperation, gentle growth</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<style>
  .transits-page {
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

  .transits-container {
    display: grid;
    gap: 2rem;
    margin-bottom: 3rem;
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

  .transits-section {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  }

  .info-section {
    margin-top: 3rem;
  }

  .transit-types {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
  }

  .transit-types ul {
    list-style: none;
    padding: 0;
  }

  .transit-types li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .transit-types li:last-child {
    border-bottom: none;
  }

  @media (min-width: 1024px) {
    .transits-container {
      grid-template-columns: 1fr 2fr;
    }
  }

  @media (max-width: 768px) {
    .page-header {
      margin-bottom: 2rem;
    }
    
    .form-section,
    .transits-section {
      padding: 1.5rem;
    }
  }
</style> 