<script lang="ts">
  import { formatDegrees } from '$lib/chart/browser-chart';
  import { getSignByDegree } from '$lib/astrology/astrology';
  import type { NatalChart, TransitChart, TransitAspect } from '$lib/types/types';

  export let natalChart: NatalChart;
  export let currentTransits: TransitChart;

  $: transitAspects = calculateTransitAspects();

  function calculateTransitAspects(): TransitAspect[] {
    if (!natalChart || !currentTransits) return [];

    const aspects: TransitAspect[] = [];
    const orb = 8; // Orb for aspect detection

    currentTransits.planets.forEach((transitPlanet) => {
      natalChart.planets.forEach((natalPlanet) => {
        const angleDiff = Math.abs(transitPlanet.longitude - natalPlanet.longitude);
        const diff = Math.min(angleDiff, 360 - angleDiff);

        if (diff <= orb) {
            aspects.push({ transitPlanet, natalPlanet, type: 'Conjunction', orb: diff, color: '#228B22', style: 'solid' });
        } else if (Math.abs(diff - 60) <= orb) {
            aspects.push({ transitPlanet, natalPlanet, type: 'Sextile', orb: Math.abs(diff - 60), color: '#0000FF', style: 'dotted' });
        } else if (Math.abs(diff - 90) <= orb) {
            aspects.push({ transitPlanet, natalPlanet, type: 'Square', orb: Math.abs(diff - 90), color: '#FF0000', style: 'solid' });
        } else if (Math.abs(diff - 120) <= orb) {
            aspects.push({ transitPlanet, natalPlanet, type: 'Trine', orb: Math.abs(diff - 120), color: '#0000FF', style: 'solid' });
        } else if (Math.abs(diff - 180) <= orb) {
            aspects.push({ transitPlanet, natalPlanet, type: 'Opposition', orb: Math.abs(diff - 180), color: '#FF0000', style: 'solid' });
        }
      });
    });

    return aspects.sort((a, b) => a.orb - b.orb);
  }

  function getAspectColor(aspectType: string) {
    switch (aspectType) {
      case 'Conjunction': return '#228B22';
      case 'Opposition': return '#FF0000';
      case 'Square': return '#FF0000';
      case 'Trine': return '#0000FF';
      case 'Sextile': return '#0000FF';
      default: return '#666';
    }
  }

  function getAspectDescription(aspectType: string) {
    switch (aspectType) {
      case 'Conjunction': return 'New beginnings, activation of natal potential';
      case 'Opposition': return 'Awareness, relationships, external challenges';
      case 'Square': return 'Tension, conflict, growth through challenge';
      case 'Trine': return 'Harmony, ease, natural flow';
      case 'Sextile': return 'Opportunity, cooperation, gentle growth';
      default: return '';
    }
  }
</script>

<div class="transit-display">
  <div class="transit-comparison">
    <h3 class="text-xl font-semibold mb-4">Current vs. Natal Positions</h3>
    <div class="comparison-table">
      <div class="table-header">
        <span>Planet</span>
        <span>Current Position</span>
        <span>Natal Position</span>
        <span>Movement</span>
      </div>
      {#if currentTransits}
        {#each currentTransits.planets as transitPlanet}
          {@const natalPlanet = natalChart.planets.find(p => p.name === transitPlanet.name)}
          {#if natalPlanet}
            <div class="table-row">
              <span class="planet-name">{transitPlanet.name}</span>
              <span class="current-pos">
                {formatDegrees(transitPlanet.longitude % 30)} {getSignByDegree(transitPlanet.longitude)}
                {#if transitPlanet.retrograde}<span class="retrograde">R</span>{/if}
              </span>
              <span class="natal-pos">
                {formatDegrees(natalPlanet.longitude % 30)} {getSignByDegree(natalPlanet.longitude)}
                {#if natalPlanet.retrograde}<span class="retrograde">R</span>{/if}
              </span>
              <span class="movement">
                {#if transitPlanet.retrograde !== natalPlanet.retrograde}
                  <span class="direction-change">
                    {transitPlanet.retrograde ? 'Now Retrograde' : 'Now Direct'}
                  </span>
                {:else}
                  <span class="degree-diff">
                    {Math.abs(transitPlanet.longitude - natalPlanet.longitude).toFixed(1)}°
                  </span>
                {/if}
              </span>
            </div>
          {/if}
        {/each}
      {/if}
    </div>
  </div>

  {#if transitAspects.length > 0}
    <div class="transit-aspects">
      <h3 class="text-xl font-semibold mb-4">Active Transit Aspects</h3>
      <div class="aspects-grid">
        {#each transitAspects as aspect}
          <div class="aspect-card" style="border-left-color: {getAspectColor(aspect.type)}">
            <div class="aspect-header">
              <span class="aspect-type" style="color: {getAspectColor(aspect.type)}">
                {aspect.type}
              </span>
              <span class="aspect-orb">±{aspect.orb.toFixed(1)}°</span>
            </div>
            <div class="aspect-planets">
              <span class="transit-planet">{aspect.transitPlanet.name}</span>
              <span class="aspect-symbol">→</span>
              <span class="natal-planet">{aspect.natalPlanet.name}</span>
            </div>
            <div class="aspect-description">
              {getAspectDescription(aspect.type)}
            </div>
            <div class="aspect-positions">
              <small>
                {aspect.transitPlanet.name}: {formatDegrees(aspect.transitPlanet.longitude % 30)} {getSignByDegree(aspect.transitPlanet.longitude)} | 
                {aspect.natalPlanet.name}: {formatDegrees(aspect.natalPlanet.longitude % 30)} {getSignByDegree(aspect.natalPlanet.longitude)}
              </small>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="no-aspects">
      <p>No major transits are currently active.</p>
    </div>
  {/if}
</div>

<style>
  .transit-display {
    font-size: 0.9rem;
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
  }

  .transit-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .transit-header h2 {
    margin-bottom: 0.5rem;
    color: #333;
  }

  .transit-header p {
    color: #666;
  }

  .transit-aspects {
    margin-bottom: 3rem;
  }

  .transit-aspects h3 {
    color: #333;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.75rem;
  }

  .aspects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  .aspect-card {
    background: #ffffff;
    border-radius: 0.5rem;
    padding: 1rem;
    border-left: 4px solid;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .aspect-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .aspect-type {
    font-weight: 600;
    font-size: 1.1rem;
  }

  .aspect-orb {
    background: #666;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.8rem;
  }

  .aspect-planets {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .aspect-symbol {
    color: #666;
  }

  .aspect-description {
    color: #666;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }

  .aspect-positions {
    color: #999;
    font-size: 0.8rem;
  }

  .no-aspects {
    text-align: center;
    padding: 2rem;
    color: #666;
    background: #f8f9fa;
    border-radius: 0.5rem;
    border: 1px dashed #d1d5db;
  }

  .transit-comparison {
    margin-bottom: 2rem;
  }

  .transit-comparison h3 {
    margin-bottom: 1rem;
    color: #333;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.75rem;
  }

  .comparison-table {
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid #ddd;
  }

  .table-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    background: #f8f9fa;
    padding: 1rem;
    font-weight: 600;
    color: #333;
    border-bottom: 1px solid #ddd;
  }

  .table-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .planet-name {
    font-weight: 600;
    color: #333;
  }

  .current-pos,
  .natal-pos {
    color: #666;
  }

  .retrograde {
    background: #e74c3c;
    color: white;
    padding: 0.1rem 0.3rem;
    border-radius: 0.2rem;
    font-size: 0.7rem;
    margin-left: 0.5rem;
  }

  .movement {
    font-size: 0.85rem;
  }

  .direction-change {
    color: #e74c3c;
    font-weight: 500;
  }

  .degree-diff {
    color: #666;
  }

  @media (max-width: 768px) {
    .aspects-grid {
      grid-template-columns: 1fr;
    }
    
    .table-header,
    .table-row {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
    
    .table-header {
      display: none;
    }
    
    .table-row {
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
    }
  }
</style> 