<script lang="ts">
  import { formatDegrees } from '$lib/chart/browser-chart';
  import { getSignByDegree } from '$lib/astrology/astrology';

  export let natalChart: any;
  export let currentTransits: any;

  $: transitAspects = calculateTransitAspects();

  function calculateTransitAspects() {
    if (!natalChart || !currentTransits) return [];

    const aspects: any[] = [];
    const orb = 8; // Orb for aspect detection

    currentTransits.planets.forEach((transitPlanet: any) => {
      natalChart.planets.forEach((natalPlanet: any) => {
        const aspect = calculateAspect(transitPlanet.longitude, natalPlanet.longitude, orb);
        if (aspect) {
          aspects.push({
            transitPlanet: transitPlanet.name,
            natalPlanet: natalPlanet.name,
            aspect: aspect.type,
            orb: aspect.orb,
            transitLongitude: transitPlanet.longitude,
            natalLongitude: natalPlanet.longitude
          });
        }
      });
    });

    return aspects.sort((a, b) => Math.abs(a.orb) - Math.abs(b.orb));
  }

  function calculateAspect(long1: number, long2: number, orb: number) {
    const diff = Math.abs(long1 - long2);
    const diff360 = Math.abs(diff - 360);

    const actualDiff = Math.min(diff, diff360);
    
    // Major aspects
    if (actualDiff <= orb) {
      if (actualDiff <= 1) return { type: 'Conjunction', orb: actualDiff };
    }
    if (Math.abs(actualDiff - 60) <= orb) return { type: 'Sextile', orb: Math.abs(actualDiff - 60) };
    if (Math.abs(actualDiff - 90) <= orb) return { type: 'Square', orb: Math.abs(actualDiff - 90) };
    if (Math.abs(actualDiff - 120) <= orb) return { type: 'Trine', orb: Math.abs(actualDiff - 120) };
    if (Math.abs(actualDiff - 180) <= orb) return { type: 'Opposition', orb: Math.abs(actualDiff - 180) };

    return null;
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
  <div class="transit-header">
    <h2>Transit Analysis</h2>
    <p>Showing transits for {new Date().toLocaleDateString()}</p>
  </div>

  {#if transitAspects.length > 0}
    <div class="transit-aspects">
      <h3>Active Aspects</h3>
      <div class="aspects-grid">
        {#each transitAspects as aspect}
          <div class="aspect-card" style="border-left-color: {getAspectColor(aspect.aspect)}">
            <div class="aspect-header">
              <span class="aspect-type" style="color: {getAspectColor(aspect.aspect)}">
                {aspect.aspect}
              </span>
              <span class="aspect-orb">±{aspect.orb.toFixed(1)}°</span>
            </div>
            <div class="aspect-planets">
              <span class="transit-planet">{aspect.transitPlanet}</span>
              <span class="aspect-symbol">→</span>
              <span class="natal-planet">{aspect.natalPlanet}</span>
            </div>
            <div class="aspect-description">
              {getAspectDescription(aspect.aspect)}
            </div>
            <div class="aspect-positions">
              <small>
                {aspect.transitPlanet}: {formatDegrees(aspect.transitLongitude % 30)} {getSignByDegree(aspect.transitLongitude)} | 
                {aspect.natalPlanet}: {formatDegrees(aspect.natalLongitude % 30)} {getSignByDegree(aspect.natalLongitude)}
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

  <div class="transit-comparison">
    <h3>Current vs Natal Positions</h3>
    <div class="comparison-table">
      <div class="table-header">
        <span>Planet</span>
        <span>Current Position</span>
        <span>Natal Position</span>
        <span>Movement</span>
      </div>
      {#each currentTransits.planets as transitPlanet, i}
        {@const natalPlanet = natalChart.planets[i]}
        <div class="table-row">
          <span class="planet-name">{transitPlanet.name}</span>
          <span class="current-pos">
            {formatDegrees(transitPlanet.longitude % 30)} {transitPlanet.sign}
            {#if transitPlanet.retrograde}<span class="retrograde">R</span>{/if}
          </span>
          <span class="natal-pos">
            {formatDegrees(natalPlanet.longitude % 30)} {natalPlanet.sign}
            {#if natalPlanet.retrograde}<span class="retrograde">R</span>{/if}
          </span>
          <span class="movement">
            {#if transitPlanet.retrograde !== natalPlanet.retrograde}
              <span class="direction-change">
                {transitPlanet.retrograde ? 'Retrograde' : 'Direct'}
              </span>
            {:else}
              <span class="degree-diff">
                {Math.abs(transitPlanet.longitude - natalPlanet.longitude).toFixed(1)}°
              </span>
            {/if}
          </span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .transit-display {
    font-size: 0.9rem;
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
    margin-bottom: 1rem;
    color: #333;
  }

  .aspects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  .aspect-card {
    background: #f8f9fa;
    border-radius: 0.5rem;
    padding: 1rem;
    border-left: 4px solid;
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
  }

  .transit-comparison {
    margin-top: 2rem;
  }

  .transit-comparison h3 {
    margin-bottom: 1rem;
    color: #333;
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