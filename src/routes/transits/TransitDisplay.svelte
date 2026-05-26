<script lang="ts">
  import { formatDegrees } from '$lib/utils/chart-utils';
  import { getSignByDegree } from '$lib/astrology/astrology';
  import type { NatalChart, TransitChart, Planet } from '$lib/types/types';
  import { ZODIAC_SYMBOLS, PLANET_SYMBOLS } from '$lib/data/astrological-data';
  import { 
    getEnhancedTransitInterpretation,
    getTransitPlanetInHouseMeaning,
    getTransitPlanetInSignMeaning,
  } from '$lib/data/interpretations/index';
  import {
    calculateTransitAspectRows,
    formatTransitOrb,
    MAJOR_TRANSIT_ASPECTS,
    type TransitAspectRow
  } from '$lib/astrology/transit-aspects';

  export let natalChart: NatalChart;
  export let currentTransits: TransitChart;

  function getPlanetSymbol(planetName: string): string {
    return PLANET_SYMBOLS[planetName] || planetName;
  }

  function getSignSymbol(signName: string): string {
    return ZODIAC_SYMBOLS[signName] || signName;
  }

  function getAspectKey(aspect: TransitAspectRow): string {
    return `${aspect.transitPlanet}|${aspect.aspect}|${aspect.natalPlanet}`;
  }

  function getTransitInterpretationText(aspect: TransitAspectRow): string {
    return getEnhancedTransitInterpretation(
      aspect.aspect,
      aspect.transitPlanet,
      aspect.natalPlanet,
      aspect.transitHouse ?? undefined,
      aspect.transitSign
    );
  }

  function getOrbBadgeClass(strength: string): string {
    if (strength === 'Exact') return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800';
    if (strength === 'Strong') return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-800';
    return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-800';
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
      houseMeaning: string;
      signMeaning: string;
    }> = [];
    
    // Extract planets from the objects structure
    let transitPlanets: any[] = [];
    if (currentTransits.planets && Array.isArray(currentTransits.planets)) {
      transitPlanets = currentTransits.planets;
    } else if (currentTransits.objects && typeof currentTransits.objects === 'object') {
      transitPlanets = Object.values(currentTransits.objects).filter((obj: any) => 
        obj && typeof obj === 'object' && obj.name && obj.longitude !== undefined
      );
    } else {
      return [];
    }
    
    transitPlanets.forEach((transitPlanet) => {
      if (mainPlanets.includes(transitPlanet.name)) {
        // Extract longitude and sign
        let transitLongitude: number;
        if (typeof transitPlanet.longitude === 'number') {
          transitLongitude = transitPlanet.longitude;
        } else if (transitPlanet.longitude && typeof transitPlanet.longitude === 'object' && transitPlanet.longitude.raw !== undefined) {
          transitLongitude = transitPlanet.longitude.raw;
        } else {
          return; // Skip if no valid longitude
        }
        
        let transitSign: string;
        if (typeof transitPlanet.sign === 'string') {
          transitSign = transitPlanet.sign;
        } else if (transitPlanet.sign && typeof transitPlanet.sign === 'object' && transitPlanet.sign.name) {
          transitSign = transitPlanet.sign.name;
        } else {
          const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
          const signIndex = Math.floor(transitLongitude / 30);
          transitSign = signNames[signIndex];
        }
        
        const natalPlanet = natalChart.planets.find(p => p.name === transitPlanet.name);
        const natalLongitude = natalPlanet ? (typeof natalPlanet.longitude === 'number' ? natalPlanet.longitude : natalPlanet.longitude.raw) : null;
        const natalSign = natalPlanet && natalLongitude !== null ? getSignByDegree(natalLongitude) : '';
        
        const transitHouse = getHouseForPlanet(transitPlanet, natalChart.houses);
        const houseMeaning = getTransitPlanetInHouseMeaning(transitPlanet.name, transitHouse, transitSign);
        const signMeaning = getTransitPlanetInSignMeaning(transitPlanet.name, transitSign);
        
        houseData.push({
          planet: transitPlanet.name,
          planetSymbol: getPlanetSymbol(transitPlanet.name),
          transitPosition: `${formatDegrees(transitLongitude % 30)} ${getSignSymbol(transitSign)}`,
          transitHouse: transitHouse,
          natalPosition: natalLongitude !== null ? `${formatDegrees(natalLongitude % 30)} ${getSignSymbol(natalSign)}` : 'N/A',
          natalHouse: natalPlanet ? getHouseForPlanet(natalPlanet, natalChart.houses) : null,
          movement: natalLongitude !== null ? Math.abs(transitLongitude - natalLongitude).toFixed(1) : 'N/A',
          transitSign: transitSign,
          natalSign: natalSign,
          houseMeaning: houseMeaning,
          signMeaning: signMeaning
        });
      }
    });
    
    const planetOrder = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    return houseData.sort((a, b) => planetOrder.indexOf(a.planet) - planetOrder.indexOf(b.planet));
  }

  function getHouseForPlanet(planet: Planet, houses: any[]): number {
    if (!houses || houses.length === 0) return 1;
    
    // Extract longitude - handle both direct values and nested objects
    let planetLongitude: number;
    if (typeof planet.longitude === 'number') {
      planetLongitude = planet.longitude;
    } else if (planet.longitude && typeof planet.longitude === 'object' && planet.longitude.raw !== undefined) {
      planetLongitude = planet.longitude.raw;
    } else {
      return 1; // Default to house 1 if no valid longitude
    }
    
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

  $: mainPlanetAspects = calculateTransitAspectRows(natalChart, currentTransits);
  $: priorityAspects = mainPlanetAspects.slice(0, 8);
  $: interpretedAspects = priorityAspects.slice(0, 5);
  $: mainAspectKeys = new Set(mainPlanetAspects.map(getAspectKey));
  $: additionalAspects = calculateTransitAspectRows(natalChart, currentTransits, {
    includeMinorAspects: true,
    includeNatalPoints: true
  }).filter((aspect) => !mainAspectKeys.has(getAspectKey(aspect)));
  $: planetHouseData = getPlanetHouseData();
</script>

<div class="text-sm p-4 bg-white dark:bg-card rounded-lg">
  <!-- Planet House Placement Table -->
  {#if planetHouseData.length > 0}
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-4 text-gray-900 border-b border-gray-200 pb-3">Current vs. Natal House Positions</h3>
      <div class="bg-white rounded-lg overflow-hidden border border-gray-200 mb-6">
        <div class="grid grid-cols-6 p-3 bg-gray-50 font-semibold text-gray-700 border-b-2 border-gray-200">
          <span>Planet</span>
          <span>Current Position</span>
          <span>Current House</span>
          <span>Natal Position</span>
          <span>Natal House</span>
          <span>Movement</span>
        </div>
        {#each planetHouseData as planet}
          <div class="grid grid-cols-6 p-3 border-b border-gray-100 hover:bg-gray-50 items-center">
            <span class="font-medium text-gray-700 flex items-center gap-2">
              <span class="font-['Noto_Sans_Symbols'] text-lg">{planet.planetSymbol}</span>
              {planet.planet}
            </span>
            <span class="text-gray-600 font-mono">
              {planet.transitPosition.split(' ')[0]} 
              <span class="font-['Noto_Sans_Symbols'] text-xl ml-1">{planet.transitPosition.split(' ')[1]}</span>
            </span>
            <span class="font-medium text-emerald-600">
              H{planet.transitHouse}
            </span>
            <span class="text-gray-600 font-mono">
              {planet.natalPosition !== 'N/A' ? planet.natalPosition.split(' ')[0] : 'N/A'} 
              {#if planet.natalPosition !== 'N/A'}
                <span class="font-['Noto_Sans_Symbols'] text-xl ml-1">{planet.natalPosition.split(' ')[1]}</span>
              {/if}
            </span>
            <span class="font-medium text-emerald-600">
              H{planet.natalHouse || 'N/A'}
            </span>
            <span class="font-mono text-gray-600 text-sm">
              {planet.movement}°
            </span>
          </div>
        {/each}
      </div>
      
      <!-- Enhanced House and Sign Meanings -->
      <div class="mt-6">
        <h4 class="font-semibold text-gray-900 mb-3 text-base">Current Transit Meanings:</h4>
        {#each planetHouseData as planet}
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div class="flex items-center gap-2 mb-3 font-semibold text-gray-700">
              <span class="font-['Noto_Sans_Symbols'] text-lg">{planet.planetSymbol}</span>
              <span>{planet.planet}</span>
            </div>
            <div class="text-sm leading-relaxed">
              <div class="mb-2">
                <strong>House {planet.transitHouse}:</strong> {planet.houseMeaning}
              </div>
              <div>
                <strong>{planet.transitSign}:</strong> {planet.signMeaning}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="mb-12">
    <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-foreground border-b border-gray-200 dark:border-border pb-3">Transit Aspects</h3>

    {#if mainPlanetAspects.length > 0}
      <div class="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-lg">
        <h4 class="font-semibold text-gray-900 dark:text-foreground mb-2">Priority Transits</h4>
        <p class="text-xs text-gray-600 dark:text-muted-foreground mb-3">
          Main planets only. {MAJOR_TRANSIT_ASPECTS.join(', ')}. Major aspect orb limit 6°, sextile 4°.
        </p>
        <div class="overflow-x-auto bg-white dark:bg-card rounded-lg border border-gray-200 dark:border-border">
          <div class="min-w-[720px]">
            <div class="grid grid-cols-6 p-3 bg-gray-50 dark:bg-muted/40 font-semibold text-gray-700 dark:text-foreground border-b border-gray-200 dark:border-border">
              <span>Transit</span>
              <span>Aspect</span>
              <span>Natal</span>
              <span>Orb</span>
              <span>Strength</span>
              <span>House</span>
            </div>
            {#each priorityAspects as aspect}
              <div class="grid grid-cols-6 p-3 border-b border-gray-100 dark:border-border hover:bg-gray-50 dark:hover:bg-muted/30 items-center">
                <span class="font-medium text-gray-800 dark:text-foreground">{aspect.transitSymbol} {aspect.transitPlanet}</span>
                <span class="font-medium text-emerald-700 dark:text-emerald-300">{aspect.aspectSymbol} {aspect.aspect}</span>
                <span class="font-medium text-gray-800 dark:text-foreground">{aspect.natalSymbol} {aspect.natalPlanet}</span>
                <span class="font-mono text-gray-700 dark:text-muted-foreground">{formatTransitOrb(aspect.orb)}</span>
                <span>
                  <span class="inline-flex px-2 py-0.5 rounded border text-xs font-medium {getOrbBadgeClass(aspect.orbStrength)}">{aspect.orbStrength}</span>
                </span>
                <span class="font-medium text-emerald-700 dark:text-emerald-300">{aspect.transitHouse ? `H${aspect.transitHouse}` : 'N/A'}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h4 class="font-semibold text-gray-900 dark:text-foreground mb-3 text-base">Full Main-Planet Aspect List</h4>
        <div class="overflow-x-auto bg-white dark:bg-card rounded-lg border border-gray-200 dark:border-border">
          <div class="min-w-[720px]">
            <div class="grid grid-cols-6 p-3 bg-gray-50 dark:bg-muted/40 font-semibold text-gray-700 dark:text-foreground border-b border-gray-200 dark:border-border">
              <span>Transit</span>
              <span>Aspect</span>
              <span>Natal</span>
              <span>Orb</span>
              <span>Limit</span>
              <span>Strength</span>
            </div>
            {#each mainPlanetAspects as aspect}
              <div class="grid grid-cols-6 p-3 border-b border-gray-100 dark:border-border hover:bg-gray-50 dark:hover:bg-muted/30 items-center">
                <span class="font-medium text-gray-800 dark:text-foreground">{aspect.transitSymbol} {aspect.transitPlanet}</span>
                <span class="font-medium text-emerald-700 dark:text-emerald-300">{aspect.aspectSymbol} {aspect.aspect}</span>
                <span class="font-medium text-gray-800 dark:text-foreground">{aspect.natalSymbol} {aspect.natalPlanet}</span>
                <span class="font-mono text-gray-700 dark:text-muted-foreground">{formatTransitOrb(aspect.orb)}</span>
                <span class="font-mono text-gray-600 dark:text-muted-foreground">{aspect.maxOrb}°</span>
                <span>
                  <span class="inline-flex px-2 py-0.5 rounded border text-xs font-medium {getOrbBadgeClass(aspect.orbStrength)}">{aspect.orbStrength}</span>
                </span>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <div class="mt-6">
        <h4 class="font-semibold text-gray-900 dark:text-foreground mb-3 text-base">Top Transit Interpretations</h4>
        {#each interpretedAspects as aspect}
          <div class="bg-gray-50 dark:bg-muted/30 border border-gray-200 dark:border-border rounded-lg p-4 mb-4">
            <div class="flex flex-wrap items-center gap-2 mb-3 font-semibold text-gray-800 dark:text-foreground">
              <span>{aspect.transitSymbol} {aspect.transitPlanet}</span>
              <span class="font-['Noto_Sans_Symbols'] text-xl text-emerald-700 dark:text-emerald-300">{aspect.aspectSymbol}</span>
              <span>{aspect.natalSymbol} {aspect.natalPlanet}</span>
              <span class="text-xs font-mono text-gray-600 dark:text-muted-foreground">{formatTransitOrb(aspect.orb)} {aspect.orbStrength}</span>
            </div>
            <div class="text-sm leading-relaxed text-gray-700 dark:text-foreground">
              {@html getTransitInterpretationText(aspect).replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-700 dark:text-emerald-300">$1</strong>')}
            </div>
          </div>
        {/each}
      </div>

      {#if additionalAspects.length > 0}
        <details class="mt-8 rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card">
          <summary class="cursor-pointer p-4 font-semibold text-gray-900 dark:text-foreground">
            Additional points ({additionalAspects.length})
          </summary>
          <div class="overflow-x-auto border-t border-gray-200 dark:border-border">
            <div class="min-w-[640px]">
              <div class="grid grid-cols-5 p-3 bg-gray-50 dark:bg-muted/40 font-semibold text-gray-700 dark:text-foreground border-b border-gray-200 dark:border-border">
                <span>Transit</span>
                <span>Aspect</span>
                <span>Natal point</span>
                <span>Orb</span>
                <span>Strength</span>
              </div>
              {#each additionalAspects as aspect}
                <div class="grid grid-cols-5 p-3 border-b border-gray-100 dark:border-border hover:bg-gray-50 dark:hover:bg-muted/30 items-center">
                  <span class="font-medium text-gray-800 dark:text-foreground">{aspect.transitSymbol} {aspect.transitPlanet}</span>
                  <span class="font-medium text-gray-700 dark:text-muted-foreground">{aspect.aspectSymbol} {aspect.aspect}</span>
                  <span class="font-medium text-gray-800 dark:text-foreground">{aspect.natalSymbol} {aspect.natalPlanet}</span>
                  <span class="font-mono text-gray-700 dark:text-muted-foreground">{formatTransitOrb(aspect.orb)}</span>
                  <span>
                    <span class="inline-flex px-2 py-0.5 rounded border text-xs font-medium {getOrbBadgeClass(aspect.orbStrength)}">{aspect.orbStrength}</span>
                  </span>
                </div>
              {/each}
            </div>
          </div>
        </details>
      {/if}
    {:else}
      <div class="text-center py-8 text-gray-600 dark:text-muted-foreground bg-gray-50 dark:bg-muted/30 rounded-lg border border-dashed border-gray-300 dark:border-border">
        <p>No main-planet major transits are currently active within the default orb limits.</p>
      </div>
    {/if}
  </div>
</div>

 
