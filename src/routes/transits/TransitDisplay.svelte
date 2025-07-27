<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { formatDegrees } from '$lib/utils/chart-utils';
  import { getSignByDegree } from '$lib/astrology/astrology';
  import type { NatalChart, TransitChart, TransitAspect, Planet } from '$lib/types/types';
  import { ASPECT_DEFINITIONS, ZODIAC_SYMBOLS, PLANET_SYMBOLS } from '$lib/data/astrological-data';
  import { getTransitInterpretation, MAJOR_ASPECTS } from '$lib/transit-interpretations';

  export let natalChart: NatalChart;
  export let currentTransits: TransitChart;

  // Lifecycle
  onMount(() => {
    // Component mounted
  });

  onDestroy(() => {
    // Component destroyed
  });

  $: transitAspects = calculateTransitAspects();

  function calculateTransitAspects(): TransitAspect[] {
    if (!natalChart || !currentTransits) return [];

    const aspects: TransitAspect[] = [];

    currentTransits.planets.forEach((transitPlanet) => {
      natalChart.planets.forEach((natalPlanet) => {
        if (natalPlanet.name === 'Vertex' || transitPlanet.name === 'Vertex') return;
        
        const angleDiff = Math.abs(transitPlanet.longitude - natalPlanet.longitude);
        const diff = Math.min(angleDiff, 360 - angleDiff);

        let closestAspect: (TransitAspect & { defOrb: number }) | null = null;

        for (const aspectName in ASPECT_DEFINITIONS) {
            const aspectDef = ASPECT_DEFINITIONS[aspectName as keyof typeof ASPECT_DEFINITIONS];
            const orb = Math.abs(diff - aspectDef.angle);

            if (orb <= aspectDef.orb) {
                if (!closestAspect || orb < closestAspect.orb) {
                    closestAspect = { 
                        transitPlanet, 
                        natalPlanet, 
                        type: aspectName, 
                        orb: orb, 
                        color: aspectDef.color, 
                        style: aspectDef.style,
                        defOrb: aspectDef.orb
                    };
                }
            }
        }

        if (closestAspect && closestAspect.orb < 3) {
            aspects.push(closestAspect);
        }
      });
    });

    return aspects.sort((a, b) => a.orb - b.orb);
  }

  function getPlanetSymbol(planetName: string): string {
    return PLANET_SYMBOLS[planetName] || planetName;
  }

  function getSignSymbol(signName: string): string {
    return ZODIAC_SYMBOLS[signName] || signName;
  }

  // Import centralized symbols
  import { ASPECT_SYMBOLS } from '$lib/data/symbols';

  function getAspectSymbol(aspectType: string): string {
    return ASPECT_SYMBOLS[aspectType] || aspectType;
  }

  function formatOrb(orb: number, transitLongitude: number, natalLongitude: number): string {
    const degrees = Math.floor(orb);
    const minutes = Math.floor((orb - degrees) * 60);
    
    const angleDiff = Math.abs(transitLongitude - natalLongitude);
    const diff = Math.min(angleDiff, 360 - angleDiff);
    
    const isApplying = diff < orb;
    const direction = isApplying ? '+' : '-';
    const status = isApplying ? 'A' : 's';
    
    return `${direction}${degrees}°${minutes}'${status}`;
  }

  function getMainPlanetAspects() {
    if (!natalChart || !currentTransits) return [];
    
    const aspects: Array<{
      transitPlanet: string;
      aspect: string;
      birthPlanet: string;
      orb: number;
      transitSymbol: string;
      birthSymbol: string;
      aspectSymbol: string;
      transitLongitude: number;
      natalLongitude: number;
    }> = [];
    const mainPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    
    currentTransits.planets.forEach((transitPlanet) => {
      if (!mainPlanets.includes(transitPlanet.name)) return;
      
      natalChart.planets.forEach((natalPlanet) => {
        if (!mainPlanets.includes(natalPlanet.name)) return;
        
        const angleDiff = Math.abs(transitPlanet.longitude - natalPlanet.longitude);
        const diff = Math.min(angleDiff, 360 - angleDiff);

        for (const [aspectName, aspectDef] of Object.entries(ASPECT_DEFINITIONS)) {
          const orb = Math.abs(diff - aspectDef.angle);
          if (orb <= aspectDef.orb && orb < 3) {
            aspects.push({
              transitPlanet: transitPlanet.name,
              aspect: aspectName,
              birthPlanet: natalPlanet.name,
              orb: orb,
              transitSymbol: getPlanetSymbol(transitPlanet.name),
              birthSymbol: getPlanetSymbol(natalPlanet.name),
              aspectSymbol: getAspectSymbol(aspectName),
              transitLongitude: transitPlanet.longitude,
              natalLongitude: natalPlanet.longitude
            });
            break;
          }
        }
      });
    });
    
    const planetOrder = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    return aspects.sort((a, b) => {
      const aIndex = planetOrder.indexOf(a.transitPlanet);
      const bIndex = planetOrder.indexOf(b.transitPlanet);
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      return a.orb - b.orb;
    });
  }

  function getAspectsToObjects() {
    if (!natalChart || !currentTransits) return [];
    
    const aspects: Array<{
      transitPlanet: string;
      aspect: string;
      birthObject: string;
      orb: number;
      transitSymbol: string;
      birthSymbol: string;
      aspectSymbol: string;
      transitLongitude: number;
      natalLongitude: number;
    }> = [];
    const mainPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    const objects = ['ASC', 'MC', 'DSC', 'IC', 'Node', 'S.Node', 'Lilith', 'Chiron', 'Fortune', 'Vertex'];
    
    currentTransits.planets.forEach((transitPlanet) => {
      if (!mainPlanets.includes(transitPlanet.name)) return;
      
      natalChart.planets.forEach((natalPlanet) => {
        if (!objects.includes(natalPlanet.name)) return;
        
        const angleDiff = Math.abs(transitPlanet.longitude - natalPlanet.longitude);
        const diff = Math.min(angleDiff, 360 - angleDiff);

        for (const [aspectName, aspectDef] of Object.entries(ASPECT_DEFINITIONS)) {
          const orb = Math.abs(diff - aspectDef.angle);
          if (orb <= aspectDef.orb && orb < 3) {
            aspects.push({
              transitPlanet: transitPlanet.name,
              aspect: aspectName,
              birthObject: natalPlanet.name,
              orb: orb,
              transitSymbol: getPlanetSymbol(transitPlanet.name),
              birthSymbol: getPlanetSymbol(natalPlanet.name),
              aspectSymbol: getAspectSymbol(aspectName),
              transitLongitude: transitPlanet.longitude,
              natalLongitude: natalPlanet.longitude
            });
            break;
          }
        }
      });
    });
    
    const planetOrder = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    return aspects.sort((a, b) => {
      const aIndex = planetOrder.indexOf(a.transitPlanet);
      const bIndex = planetOrder.indexOf(b.transitPlanet);
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      return a.orb - b.orb;
    });
  }

  function getHouseForPlanet(planet: Planet, houses: any[]): number {
    if (!houses || houses.length === 0) return 1;
    
    const planetLongitude = planet.longitude;
    
    for (let i = 0; i < houses.length; i++) {
      const currentCusp = houses[i].longitude;
      const nextCusp = houses[(i + 1) % houses.length].longitude;
      
      if (nextCusp > currentCusp) {
        if (planetLongitude >= currentCusp && planetLongitude < nextCusp) {
          return i + 1;
        }
      } else {
        if (planetLongitude >= currentCusp || planetLongitude < nextCusp) {
          return i + 1;
        }
      }
    }
    
    return 1;
  }

  function getPlanetHouseData() {
    if (!currentTransits || !natalChart) return [];
    
    const mainPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    const houseData: Array<{
      planet: string;
      planetSymbol: string;
      transitPosition: string;
      transitHouse: number;
      natalPosition: string;
      natalHouse: number | null;
      movement: string;
      transitSign: string;
      natalSign: string;
    }> = [];
    
    currentTransits.planets.forEach((transitPlanet) => {
      if (mainPlanets.includes(transitPlanet.name)) {
        const transitHouse = getHouseForPlanet(transitPlanet, natalChart.houses);
        const natalPlanet = natalChart.planets.find(p => p.name === transitPlanet.name);
        const natalHouse = natalPlanet ? getHouseForPlanet(natalPlanet, natalChart.houses) : null;
        const transitSign = getSignByDegree(transitPlanet.longitude);
        const natalSign = natalPlanet ? getSignByDegree(natalPlanet.longitude) : '';
        
        houseData.push({
          planet: transitPlanet.name,
          planetSymbol: getPlanetSymbol(transitPlanet.name),
          transitPosition: `${formatDegrees(transitPlanet.longitude % 30)} ${getSignSymbol(transitSign)}`,
          transitHouse: transitHouse,
          natalPosition: natalPlanet ? `${formatDegrees(natalPlanet.longitude % 30)} ${getSignSymbol(natalSign)}` : 'N/A',
          natalHouse: natalHouse,
          movement: natalPlanet ? Math.abs(transitPlanet.longitude - natalPlanet.longitude).toFixed(1) : 'N/A',
          transitSign: transitSign,
          natalSign: natalSign
        });
      }
    });
    
    const planetOrder = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    return houseData.sort((a, b) => planetOrder.indexOf(a.planet) - planetOrder.indexOf(b.planet));
  }

  $: mainPlanetAspects = getMainPlanetAspects();
  $: planetHouseData = getPlanetHouseData();
  $: aspectsToObjects = getAspectsToObjects();
</script>

<div class="transit-display">
  <!-- Planet House Placement Table -->
  {#if planetHouseData.length > 0}
    <div class="house-placement-section">
      <h3 class="text-xl font-semibold mb-4">Current vs. Natal House Positions</h3>
      <div class="house-placement-table">
        <div class="table-header">
          <span>Planet</span>
          <span>Current Position</span>
          <span>Current House</span>
          <span>Natal Position</span>
          <span>Natal House</span>
          <span>Movement</span>
        </div>
        {#each planetHouseData as planet}
          <div class="table-row">
            <span class="planet-name">
              <span class="planet-symbol">{planet.planetSymbol}</span>
              {planet.planet}
            </span>
            <span class="current-position">
              {planet.transitPosition.split(' ')[0]} 
              <span class="sign-symbol">{planet.transitPosition.split(' ')[1]}</span>
            </span>
            <span class="current-house">
              H{planet.transitHouse}
            </span>
            <span class="natal-position">
              {planet.natalPosition !== 'N/A' ? planet.natalPosition.split(' ')[0] : 'N/A'} 
              {#if planet.natalPosition !== 'N/A'}
                <span class="sign-symbol">{planet.natalPosition.split(' ')[1]}</span>
              {/if}
            </span>
            <span class="natal-house">
              H{planet.natalHouse || 'N/A'}
            </span>
            <span class="movement">
              {planet.movement}°
            </span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="transit-aspects">
    <h3 class="text-xl font-semibold mb-4">Transit Aspects</h3>
    
    <!-- Main planet aspects -->
    {#if mainPlanetAspects.length > 0}
      <div class="aspects-section">
        <h4 class="section-title">Main Planet Aspects:</h4>
        <div class="aspects-table">
          <div class="table-header">
            <span>Transit Planet</span>
            <span>Aspect</span>
            <span>Birth Planet</span>
            <span>Orb*</span>
            <span>Interpretation</span>
          </div>
          <div class="orb-note">* &lt; 3°</div>
          {#each mainPlanetAspects as aspect}
            <div class="table-row">
              <span class="transit-planet">
                {aspect.transitSymbol} {aspect.transitPlanet}
              </span>
              <span class="aspect">
                {aspect.aspectSymbol} {aspect.aspect}
              </span>
              <span class="birth-planet">
                {aspect.birthSymbol} {aspect.birthPlanet}
              </span>
              <span class="orb">
                {formatOrb(aspect.orb, aspect.transitLongitude, aspect.natalLongitude)}
              </span>
              <span class="interpretation">
                {getTransitInterpretation(aspect.aspect, aspect.transitPlanet, aspect.birthPlanet)}
              </span>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Aspects to objects -->
    {#if aspectsToObjects.length > 0}
      <div class="aspects-section">
        <h4 class="section-title">Aspects to Objects:</h4>
        <div class="aspects-table">
          <div class="table-header">
            <span>Transit Planet</span>
            <span>Aspect</span>
            <span>Birth Object</span>
            <span>Orb</span>
            <span>Interpretation</span>
          </div>
          {#each aspectsToObjects as aspect}
            <div class="table-row">
              <span class="transit-planet">
                {aspect.transitSymbol} {aspect.transitPlanet}
              </span>
              <span class="aspect">
                {aspect.aspectSymbol} {aspect.aspect}
              </span>
              <span class="birth-object">
                {aspect.birthSymbol} {aspect.birthObject}
              </span>
              <span class="orb">
                {formatOrb(aspect.orb, aspect.transitLongitude, aspect.natalLongitude)}
              </span>
              <span class="interpretation">
                {getTransitInterpretation(aspect.aspect, aspect.transitPlanet, aspect.birthObject)}
              </span>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if mainPlanetAspects.length === 0 && aspectsToObjects.length === 0}
      <div class="no-aspects">
        <p>No notable transits with an orb of less than 3 degrees are currently active.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .transit-display {
    font-size: 0.9rem;
    padding: 1rem;
    background-color: white;
    border-radius: 0.5rem;
  }

  .house-placement-section {
    margin-bottom: 2rem;
  }

  .house-placement-section h3 {
    color: #333;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .house-placement-table {
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    margin-bottom: 1.5rem;
  }

  .house-placement-table .table-header,
  .house-placement-table .table-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f3f4f6;
    align-items: center;
  }

  .house-placement-table .table-header {
    background: #f8f9fa;
    font-weight: 600;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
  }

  .house-placement-table .table-row:hover {
    background: #f9fafb;
  }

  .planet-name {
    font-weight: 500;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .planet-symbol {
    font-family: 'Noto Sans Symbols', Arial, sans-serif;
    font-size: 1.1em;
  }

  .sign-symbol {
    font-family: 'Noto Sans Symbols', Arial, sans-serif;
    font-size: 1.2em;
    margin-left: 0.25rem;
  }

  .current-position,
  .natal-position {
    color: #6b7280;
    font-family: monospace;
  }

  .current-house,
  .natal-house {
    font-weight: 500;
    color: #059669;
  }

  .movement {
    font-family: monospace;
    color: #6b7280;
    font-size: 0.85rem;
  }

  .transit-aspects {
    margin-bottom: 3rem;
  }

  .transit-aspects h3 {
    color: #333;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .aspects-section {
    margin-bottom: 2rem;
  }

  .section-title {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.75rem;
    font-size: 1rem;
  }

  .no-aspects {
    text-align: center;
    padding: 2rem;
    color: #666;
    background: #f8f9fa;
    border-radius: 0.5rem;
    border: 1px dashed #d1d5db;
  }

  .aspects-table {
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    margin-bottom: 1.5rem;
  }

  .aspects-table .table-header,
  .aspects-table .table-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f3f4f6;
    align-items: center;
  }

  .aspects-table .table-header {
    background: #f8f9fa;
    font-weight: 600;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
  }

  .aspects-table .table-row:hover {
    background: #f9fafb;
  }

  .orb-note {
    padding: 0.5rem 1rem;
    background: #f3f4f6;
    font-size: 0.8rem;
    color: #6b7280;
    border-bottom: 1px solid #e5e7eb;
  }

  .transit-planet,
  .transit-object,
  .birth-planet,
  .birth-object {
    font-weight: 500;
    color: #374151;
  }

  .aspect {
    color: #059669;
    font-weight: 500;
  }

  .orb {
    font-family: monospace;
    color: #6b7280;
    font-size: 0.85rem;
  }

  .interpretation {
    font-size: 0.85rem;
    color: #374151;
    line-height: 1.4;
    max-width: 200px;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .house-placement-table .table-header,
    .house-placement-table .table-row {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
      padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
    }

    .aspects-table .table-header,
    .aspects-table .table-row {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
    }

    .section-title {
      font-size: 0.9rem;
    }

    .orb-note {
      padding: 0.4rem 0.75rem;
      font-size: 0.75rem;
    }
  }
</style> 