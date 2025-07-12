<script lang="ts">
  import { formatDegrees } from '$lib/chart/browser-chart';
  import { getSignByDegree } from '$lib/astrology/astrology';

  export let chartResult: any;

  $: if (chartResult) {
    // Format the chart data for display
  }
</script>

<div class="chart-data">
  <div class="data-section">
    <h3>Planetary Positions</h3>
    <div class="planets-grid">
      {#each chartResult.planets as planet}
        <div class="planet-item">
          <div class="planet-header">
            <span class="planet-name">{planet.name}</span>
            {#if planet.retrograde}
              <span class="retrograde">R</span>
            {/if}
          </div>
          <div class="planet-details">
            <span class="planet-sign">{planet.sign}</span>
            <span class="planet-degree">{formatDegrees(planet.longitude % 30)}</span>
            <span class="planet-house">House {planet.house}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="data-section">
    <h3>Angles</h3>
    <div class="angles-grid">
      <div class="angle-item">
        <span class="angle-name">Ascendant</span>
        <span class="angle-sign">{getSignByDegree(chartResult.ascendant).name}</span>
        <span class="angle-degree">{formatDegrees(chartResult.ascendant % 30)}</span>
      </div>
      <div class="angle-item">
        <span class="angle-name">Midheaven</span>
        <span class="angle-sign">{getSignByDegree(chartResult.midheaven).name}</span>
        <span class="angle-degree">{formatDegrees(chartResult.midheaven % 30)}</span>
      </div>
    </div>
  </div>

  <div class="data-section">
    <h3>Location</h3>
    <div class="location-info">
      <div class="location-item">
        <span class="location-label">Latitude:</span>
        <span class="location-value">{chartResult.latitude}°</span>
      </div>
      <div class="location-item">
        <span class="location-label">Longitude:</span>
        <span class="location-value">{chartResult.longitude}°</span>
      </div>
    </div>
  </div>

  <div class="data-section">
    <h3>Raw Data</h3>
    <div class="raw-data">
      <pre>{JSON.stringify(chartResult, null, 2)}</pre>
    </div>
  </div>
</div>

<style>
  .chart-data {
    font-size: 0.9rem;
  }

  .data-section {
    margin-bottom: 2rem;
  }

  .data-section h3 {
    margin-bottom: 1rem;
    color: #333;
    border-bottom: 2px solid #667eea;
    padding-bottom: 0.5rem;
  }

  .planets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .planet-item {
    background: #f8f9fa;
    border-radius: 0.5rem;
    padding: 1rem;
    border-left: 4px solid #667eea;
  }

  .planet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .planet-name {
    font-weight: 600;
    color: #333;
  }

  .retrograde {
    background: #e74c3c;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .planet-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
  }

  .planet-sign {
    color: #667eea;
    font-weight: 500;
  }

  .planet-degree {
    color: #666;
  }

  .planet-house {
    color: #999;
    font-size: 0.8rem;
  }

  .angles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .angle-item {
    background: #f8f9fa;
    border-radius: 0.5rem;
    padding: 1rem;
    border-left: 4px solid #28a745;
  }

  .angle-name {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .angle-sign {
    color: #28a745;
    font-weight: 500;
    margin-right: 1rem;
  }

  .angle-degree {
    color: #666;
  }

  .location-info {
    background: #f8f9fa;
    border-radius: 0.5rem;
    padding: 1rem;
    border-left: 4px solid #ffc107;
  }

  .location-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .location-item:last-child {
    margin-bottom: 0;
  }

  .location-label {
    font-weight: 600;
    color: #333;
  }

  .location-value {
    color: #666;
  }

  .raw-data {
    background: #f8f9fa;
    border-radius: 0.5rem;
    padding: 1rem;
    border-left: 4px solid #6c757d;
    overflow-x: auto;
  }

  .raw-data pre {
    margin: 0;
    font-size: 0.8rem;
    color: #333;
    white-space: pre-wrap;
    word-break: break-word;
  }

  @media (max-width: 768px) {
    .planets-grid {
      grid-template-columns: 1fr;
    }
    
    .angles-grid {
      grid-template-columns: 1fr;
    }
    
    .planet-details {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }
  }
</style> 