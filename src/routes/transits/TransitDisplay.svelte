<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { formatDegrees } from '$lib/utils/chart-utils';
  import { getSignByDegree } from '$lib/astrology/astrology';
  import type { NatalChart, TransitChart, TransitAspect, Planet } from '$lib/types/types';
  import { ASPECT_DEFINITIONS, ZODIAC_SYMBOLS, PLANET_SYMBOLS } from '$lib/data/astrological-data';
  import { getTransitInterpretation, MAJOR_ASPECTS } from '$lib/transit-interpretations';
  import { createTooltip, handleMouseOver, handleMouseOut, handleClick, unpinTooltip } from '$lib/chart/tooltip';

  export let natalChart: NatalChart;
  export let currentTransits: TransitChart;

  // Lifecycle
  onMount(() => {
    createTooltip();
  });

  onDestroy(() => {
    unpinTooltip();
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

  function isPlanet(name: string): boolean {
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    return planets.includes(name);
  }

  function isObject(name: string): boolean {
    const objects = ['ASC', 'MC', 'DSC', 'IC', 'Node', 'S.Node', 'Lilith', 'Chiron', 'Fortune', 'Vertex'];
    return objects.includes(name);
  }

  function getPlanetSymbol(planetName: string): string {
    return PLANET_SYMBOLS[planetName] || planetName;
  }

  function getSignSymbol(signName: string): string {
    return ZODIAC_SYMBOLS[signName] || signName;
  }

  function getAspectSymbol(aspectType: string): string {
    const aspectSymbols: Record<string, string> = {
      'Conjunction': '☌',
      'Opposition': '☍', 
      'Square': '□',
      'Trine': '△',
      'Sextile': '✳',
      'Quincunx': '⚻'
    };
    return aspectSymbols[aspectType] || aspectType;
  }



  function formatOrb(orb: number, transitLongitude: number, natalLongitude: number): string {
    const degrees = Math.floor(orb);
    const minutes = Math.floor((orb - degrees) * 60);
    
    // Determine if aspect is applying or separating
    const angleDiff = Math.abs(transitLongitude - natalLongitude);
    const diff = Math.min(angleDiff, 360 - angleDiff);
    
    // For applying aspects, the transit planet is moving toward the exact aspect
    // For separating aspects, the transit planet has passed the exact aspect
    const isApplying = diff < orb; // If the actual difference is less than orb, it's applying
    const direction = isApplying ? '+' : '-';
    const status = isApplying ? 'A' : 's'; // A for applying, s for separating
    
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
            break; // Only count the closest aspect
          }
        }
      });
    });
    
    // Sort by transit planet order (Sun to Pluto) then by orb
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
    
    // Sort by transit planet order (Sun to Pluto) then by orb
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

  function getOtherAspects() {
    if (!natalChart || !currentTransits) return [];
    
    const aspects: Array<{
      transitObject: string;
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
    const objects = ['ASC', 'MC', 'DSC', 'IC', 'Node', 'S.Node', 'Lilith', 'Chiron', 'Fortune', 'Vertex'];
    
    currentTransits.planets.forEach((transitPlanet) => {
      if (!objects.includes(transitPlanet.name)) return;
      
      natalChart.planets.forEach((natalPlanet) => {
        if (!mainPlanets.includes(natalPlanet.name)) return;
        
        const angleDiff = Math.abs(transitPlanet.longitude - natalPlanet.longitude);
        const diff = Math.min(angleDiff, 360 - angleDiff);

        for (const [aspectName, aspectDef] of Object.entries(ASPECT_DEFINITIONS)) {
          const orb = Math.abs(diff - aspectDef.angle);
          if (orb <= aspectDef.orb && orb < 3) {
            aspects.push({
              transitObject: transitPlanet.name,
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
    
    // Sort by transit object order (Sun to Pluto, then other objects) then by orb
    const planetOrder = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    const objectOrder = ['Node', 'S.Node', 'Lilith', 'Chiron', 'Fortune', 'Vertex', 'ASC', 'MC', 'DSC', 'IC'];
    return aspects.sort((a, b) => {
      const aPlanetIndex = planetOrder.indexOf(a.transitObject);
      const bPlanetIndex = planetOrder.indexOf(b.transitObject);
      const aObjectIndex = objectOrder.indexOf(a.transitObject);
      const bObjectIndex = objectOrder.indexOf(b.transitObject);
      
      // If both are planets, sort by planet order
      if (aPlanetIndex !== -1 && bPlanetIndex !== -1) {
        if (aPlanetIndex !== bPlanetIndex) {
          return aPlanetIndex - bPlanetIndex;
        }
      }
      // If both are objects, sort by object order
      else if (aObjectIndex !== -1 && bObjectIndex !== -1) {
        if (aObjectIndex !== bObjectIndex) {
          return aObjectIndex - bObjectIndex;
        }
      }
      // Planets come before objects
      else if (aPlanetIndex !== -1 && bObjectIndex !== -1) {
        return -1;
      }
      else if (aObjectIndex !== -1 && bPlanetIndex !== -1) {
        return 1;
      }
      
      return a.orb - b.orb;
    });
  }

  function getAspectTooltipData(aspect: string, transitPlanet: string, natalPlanet: string) {
    return {
      aspect: aspect,
      planet1: transitPlanet,
      planet2: natalPlanet,
      orb: 0 // We'll get the actual orb from the aspect data
    };
  }

  function getHouseForPlanet(planet: Planet, houses: any[]): number {
    if (!houses || houses.length === 0) return 1;
    
    const planetLongitude = planet.longitude;
    
    // Find which house the planet falls into based on house cusps
    for (let i = 0; i < houses.length; i++) {
      const currentCusp = houses[i].longitude;
      const nextCusp = houses[(i + 1) % houses.length].longitude;
      
      // Handle the case where we cross 0 degrees
      if (nextCusp > currentCusp) {
        // Normal case: next cusp is greater than current
        if (planetLongitude >= currentCusp && planetLongitude < nextCusp) {
          return i + 1;
        }
      } else {
        // We've crossed 0 degrees (next cusp is less than current)
        if (planetLongitude >= currentCusp || planetLongitude < nextCusp) {
          return i + 1;
        }
      }
    }
    
    // Fallback: if we can't determine, return house 1
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
    
    // Sort by planet order (Sun to Pluto)
    const planetOrder = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    return houseData.sort((a, b) => planetOrder.indexOf(a.planet) - planetOrder.indexOf(b.planet));
  }

  function getPlanetTooltipData(planet: string, sign: string, house: number) {
    return {
      planet: planet,
      sign: sign,
      house: house
    };
  }

  $: mainPlanetAspects = getMainPlanetAspects();
  $: planetHouseData = getPlanetHouseData();
  $: aspectsToObjects = getAspectsToObjects();
  $: otherAspects = getOtherAspects();
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
            <span 
              class="planet-name"
              on:mouseover={(e) => handleMouseOver(e, getPlanetTooltipData(planet.planet, planet.transitSign, planet.transitHouse))}
              on:mouseout={handleMouseOut}
              on:click={(e) => handleClick(e, getPlanetTooltipData(planet.planet, planet.transitSign, planet.transitHouse))}
            >
              <span class="planet-symbol">{planet.planetSymbol}</span>
              {planet.planet}
            </span>
            <span class="current-position">
              {planet.transitPosition.split(' ')[0]} 
              <span class="sign-symbol">{planet.transitPosition.split(' ')[1]}</span>
            </span>
            <span 
              class="current-house"
              on:mouseover={(e) => handleMouseOver(e, { sign: planet.transitSign, house: planet.transitHouse })}
              on:mouseout={handleMouseOut}
              on:click={(e) => handleClick(e, { sign: planet.transitSign, house: planet.transitHouse })}
            >
              H{planet.transitHouse}
            </span>
            <span class="natal-position">
              {planet.natalPosition !== 'N/A' ? planet.natalPosition.split(' ')[0] : 'N/A'} 
              {#if planet.natalPosition !== 'N/A'}
                <span class="sign-symbol">{planet.natalPosition.split(' ')[1]}</span>
              {/if}
            </span>
            <span 
              class="natal-house"
              on:mouseover={(e) => handleMouseOver(e, { sign: planet.natalSign, house: planet.natalHouse })}
              on:mouseout={handleMouseOut}
              on:click={(e) => handleClick(e, { sign: planet.natalSign, house: planet.natalHouse })}
            >
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
    <h3 class="text-xl font-semibold mb-4">Transit aspects interpretations »</h3>
    
    <!-- Main planet aspects -->
    {#if mainPlanetAspects.length > 0}
      <div class="aspects-section">
        <h4 class="section-title">Main planet aspects:</h4>
        <div class="aspects-table">
          <div class="table-header">
            <span>Transit planet</span>
            <span>Aspect</span>
            <span>Birth planet</span>
            <span>Orb*</span>
            <span>Interpretation</span>
          </div>
          <div class="orb-note">* &lt; 3°</div>
          {#each mainPlanetAspects as aspect}
            <div class="table-row">
              <span class="transit-planet">
                {aspect.transitSymbol} {aspect.transitPlanet}
              </span>
              <span 
                class="aspect" 
                on:mouseover={(e) => handleMouseOver(e, getAspectTooltipData(aspect.aspect, aspect.transitPlanet, aspect.birthPlanet))}
                on:mouseout={handleMouseOut}
                on:click={(e) => handleClick(e, getAspectTooltipData(aspect.aspect, aspect.transitPlanet, aspect.birthPlanet))}
              >
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
        <h4 class="section-title">Aspects to objects:</h4>
        <div class="aspects-table">
          <div class="table-header">
            <span>Transit planet</span>
            <span>Aspect</span>
            <span>Birth object</span>
            <span>Orb</span>
            <span>Interpretation</span>
          </div>
          {#each aspectsToObjects as aspect}
            <div class="table-row">
              <span class="transit-planet">
                {aspect.transitSymbol} {aspect.transitPlanet}
              </span>
              <span 
                class="aspect" 
                on:mouseover={(e) => handleMouseOver(e, getAspectTooltipData(aspect.aspect, aspect.transitPlanet, aspect.birthObject))}
                on:mouseout={handleMouseOut}
                on:click={(e) => handleClick(e, getAspectTooltipData(aspect.aspect, aspect.transitPlanet, aspect.birthObject))}
              >
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

    <!-- Other aspects -->
    {#if otherAspects.length > 0}
      <div class="aspects-section">
        <h4 class="section-title">Other aspects:</h4>
        <div class="aspects-table">
          <div class="table-header">
            <span>Transit object</span>
            <span>Aspect</span>
            <span>Birth planet</span>
            <span>Orb</span>
            <span>Interpretation</span>
          </div>
          {#each otherAspects as aspect}
            <div class="table-row">
              <span class="transit-object">
                {aspect.transitSymbol} {aspect.transitObject}
              </span>
              <span 
                class="aspect" 
                on:mouseover={(e) => handleMouseOver(e, getAspectTooltipData(aspect.aspect, aspect.transitObject, aspect.birthPlanet))}
                on:mouseout={handleMouseOut}
                on:click={(e) => handleClick(e, getAspectTooltipData(aspect.aspect, aspect.transitObject, aspect.birthPlanet))}
              >
                {aspect.aspectSymbol} {aspect.aspect}
              </span>
              <span class="birth-planet">
                {aspect.birthSymbol} {aspect.birthPlanet}
              </span>
              <span class="orb">
                {formatOrb(aspect.orb, aspect.transitLongitude, aspect.natalLongitude)}
              </span>
              <span class="interpretation">
                {getTransitInterpretation(aspect.aspect, aspect.transitObject, aspect.birthPlanet)}
              </span>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if mainPlanetAspects.length === 0 && aspectsToObjects.length === 0 && otherAspects.length === 0}
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
    cursor: pointer;
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
    cursor: pointer;
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
    cursor: pointer;
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

  /* Tooltip styles - matching D3Chart */
  :global(.chart-tooltip) {
    background: #fcf8ed;
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.10);
    color: #222;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    min-width: 320px;
    max-width: 420px;
    padding: 0;
    z-index: 1001;
    transition: opacity 0.2s ease-in-out;
  }

  :global(.tooltip-header) {
    background-color: #fcf8ed;
    padding: 16px 20px 0 20px;
    font-weight: 700;
    font-size: 22px;
    color: #222;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom: none;
  }

  :global(.tooltip-body) {
    padding: 10px 20px 18px 20px;
    font-size: 14px;
    line-height: 1.7;
    color: #222;
  }

  :global(.interpretation-content h3) {
    margin: 0 0 10px;
    font-size: 16px;
    font-weight: 700;
    color: #222;
  }

  :global(.interpretation-content p) {
    margin: 0 0 10px;
    font-size: 14px;
    color: #222;
  }

  :global(.interpretation-content p:last-child) {
    margin-bottom: 0;
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

    /* Smaller tooltip on mobile */
    :global(.chart-tooltip) {
      min-width: 260px;
      max-width: 320px;
    }

    :global(.tooltip-header) {
      padding: 12px 16px 0 16px;
      font-size: 18px;
    }

    :global(.tooltip-body) {
      padding: 8px 16px 14px 16px;
      font-size: 13px;
      line-height: 1.5;
    }

    :global(.interpretation-content h3) {
      font-size: 14px;
      margin: 0 0 8px;
    }

    :global(.interpretation-content p) {
      font-size: 13px;
      margin: 0 0 8px;
    }
  }
</style> 