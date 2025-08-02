<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { formatDegrees } from '$lib/utils/chart-utils';
  import { getSignByDegree } from '$lib/astrology/astrology';
  import type { NatalChart, TransitChart, TransitAspect, Planet } from '$lib/types/types';
  import { ASPECT_DEFINITIONS, ZODIAC_SYMBOLS, PLANET_SYMBOLS } from '$lib/data/astrological-data';
  import { 
    getTransitInterpretation, 
    getEnhancedTransitInterpretation,
    getTransitPlanetInHouseMeaning,
    getTransitPlanetInSignMeaning,
    MAJOR_ASPECTS 
  } from '$lib/data/interpretations/index';

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
    if (!natalChart || !currentTransits || !currentTransits.planets) return [];

    const aspects: TransitAspect[] = [];

    currentTransits.planets.forEach((transitPlanet) => {
      natalChart.planets.forEach((natalPlanet) => {
        if (natalPlanet.name === 'Vertex' || transitPlanet.name === 'Vertex') return;
        
        // Extract longitude values - handle both direct values and nested objects
        let transitLongitude: number;
        if (typeof transitPlanet.longitude === 'number') {
          transitLongitude = transitPlanet.longitude;
        } else if (transitPlanet.longitude && typeof transitPlanet.longitude === 'object' && transitPlanet.longitude.raw !== undefined) {
          transitLongitude = transitPlanet.longitude.raw;
        } else {
          return; // Skip if no valid longitude
        }
        
        const angleDiff = Math.abs(transitLongitude - (typeof natalPlanet.longitude === 'number' ? natalPlanet.longitude : natalPlanet.longitude.raw));
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
    if (!natalChart || !currentTransits || !currentTransits.planets) return [];
    
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
      transitHouse: number;
      transitSign: string;
      enhancedInterpretation: string;
    }> = [];
    const mainPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    
    currentTransits.planets.forEach((transitPlanet) => {
      if (!mainPlanets.includes(transitPlanet.name)) return;
      
      natalChart.planets.forEach((natalPlanet) => {
        if (!mainPlanets.includes(natalPlanet.name)) return;
        
        // Extract longitude values - handle both direct values and nested objects
        let transitLongitude: number;
        if (typeof transitPlanet.longitude === 'number') {
          transitLongitude = transitPlanet.longitude;
        } else if (transitPlanet.longitude && typeof transitPlanet.longitude === 'object' && transitPlanet.longitude.raw !== undefined) {
          transitLongitude = transitPlanet.longitude.raw;
        } else {
          return; // Skip if no valid longitude
        }
        
        const natalLongitude = typeof natalPlanet.longitude === 'number' ? natalPlanet.longitude : natalPlanet.longitude.raw;
        const angleDiff = Math.abs(transitLongitude - natalLongitude);
        const diff = Math.min(angleDiff, 360 - angleDiff);

        for (const [aspectName, aspectDef] of Object.entries(ASPECT_DEFINITIONS)) {
          const orb = Math.abs(diff - aspectDef.angle);
          if (orb <= aspectDef.orb && orb < 3) {
            // Extract sign for house calculation
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
            
            const transitHouse = getHouseForPlanet(transitPlanet, natalChart.houses);
            const enhancedInterpretation = getEnhancedTransitInterpretation(
              aspectName, 
              transitPlanet.name, 
              natalPlanet.name, 
              transitHouse, 
              transitSign
            );
            
            aspects.push({
              transitPlanet: transitPlanet.name,
              aspect: aspectName,
              birthPlanet: natalPlanet.name,
              orb: orb,
              transitSymbol: getPlanetSymbol(transitPlanet.name),
              birthSymbol: getPlanetSymbol(natalPlanet.name),
              aspectSymbol: getAspectSymbol(aspectName),
              transitLongitude: transitLongitude,
              natalLongitude: natalLongitude,
              transitHouse: transitHouse,
              transitSign: transitSign,
              enhancedInterpretation: enhancedInterpretation
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
      transitHouse: number;
      transitSign: string;
      enhancedInterpretation: string;
    }> = [];
    const mainPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    const objects = ['ASC', 'MC', 'DSC', 'IC', 'Node', 'S.Node', 'Lilith', 'Chiron', 'Fortune', 'Vertex'];
    
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
      if (!mainPlanets.includes(transitPlanet.name)) return;
      
      natalChart.planets.forEach((natalPlanet) => {
        if (!objects.includes(natalPlanet.name)) return;
        
        // Extract longitude values - handle both direct values and nested objects
        let transitLongitude: number;
        if (typeof transitPlanet.longitude === 'number') {
          transitLongitude = transitPlanet.longitude;
        } else if (transitPlanet.longitude && typeof transitPlanet.longitude === 'object' && transitPlanet.longitude.raw !== undefined) {
          transitLongitude = transitPlanet.longitude.raw;
        } else {
          return; // Skip if no valid longitude
        }
        
        const natalLongitude = typeof natalPlanet.longitude === 'number' ? natalPlanet.longitude : natalPlanet.longitude.raw;
        const angleDiff = Math.abs(transitLongitude - natalLongitude);
        const diff = Math.min(angleDiff, 360 - angleDiff);

        for (const [aspectName, aspectDef] of Object.entries(ASPECT_DEFINITIONS)) {
          const orb = Math.abs(diff - aspectDef.angle);
          if (orb <= aspectDef.orb && orb < 3) {
            // Extract sign for house calculation
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
            
            const transitHouse = getHouseForPlanet(transitPlanet, natalChart.houses);
            const enhancedInterpretation = getEnhancedTransitInterpretation(
              aspectName, 
              transitPlanet.name, 
              natalPlanet.name, 
              transitHouse, 
              transitSign
            );
            
            aspects.push({
              transitPlanet: transitPlanet.name,
              aspect: aspectName,
              birthObject: natalPlanet.name,
              orb: orb,
              transitSymbol: getPlanetSymbol(transitPlanet.name),
              birthSymbol: getPlanetSymbol(natalPlanet.name),
              aspectSymbol: getAspectSymbol(aspectName),
              transitLongitude: transitLongitude,
              natalLongitude: natalLongitude,
              transitHouse: transitHouse,
              transitSign: transitSign,
              enhancedInterpretation: enhancedInterpretation
            });
            break;
          }
        }
      });
    });
    
    return aspects.sort((a, b) => a.orb - b.orb);
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

  $: mainPlanetAspects = getMainPlanetAspects();
  $: planetHouseData = getPlanetHouseData();
  $: aspectsToObjects = getAspectsToObjects();
</script>

<div class="text-sm p-4 bg-white rounded-lg">
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
    <h3 class="text-xl font-semibold mb-4 text-gray-900 border-b border-gray-200 pb-3">Transit Aspects</h3>
    
    <!-- Main planet aspects -->
    {#if mainPlanetAspects.length > 0}
      <div class="mb-8">
        <h4 class="font-semibold text-gray-900 mb-3 text-base">Main Planet Aspects:</h4>
        <div class="bg-white rounded-lg overflow-hidden border border-gray-200 mb-6">
          <div class="grid grid-cols-4 p-3 bg-gray-50 font-semibold text-gray-700 border-b-2 border-gray-200">
            <span>Transit Planet</span>
            <span>Aspect</span>
            <span>Birth Planet</span>
            <span>Orb*</span>
          </div>
          <div class="p-3 bg-gray-100 text-xs text-gray-600 border-b border-gray-200">* &lt; 3°</div>
          {#each mainPlanetAspects as aspect}
            <div class="grid grid-cols-4 p-3 border-b border-gray-100 hover:bg-gray-50 items-center">
              <span class="font-medium text-gray-700">
                {aspect.transitSymbol} {aspect.transitPlanet}
              </span>
              <span class="text-emerald-600 font-medium">
                {aspect.aspectSymbol} {aspect.aspect}
              </span>
              <span class="font-medium text-gray-700">
                {aspect.birthSymbol} {aspect.birthPlanet}
              </span>
              <span class="font-mono text-gray-600 text-sm">
                {formatOrb(aspect.orb, aspect.transitLongitude, aspect.natalLongitude)}
              </span>
            </div>
          {/each}
        </div>
        
        <!-- Enhanced Interpretations -->
        <div class="mt-6">
          <h4 class="font-semibold text-gray-900 mb-3 text-base">Detailed Interpretations:</h4>
          {#each mainPlanetAspects as aspect}
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div class="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                <span>{aspect.transitSymbol} {aspect.transitPlanet}</span>
                <span class="font-['Noto_Sans_Symbols'] text-xl text-emerald-600">{aspect.aspectSymbol}</span>
                <span>{aspect.birthSymbol} {aspect.birthPlanet}</span>
              </div>
              <div class="text-sm leading-relaxed text-gray-700">
                {@html aspect.enhancedInterpretation.replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-600">$1</strong>')}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Aspects to objects -->
    {#if aspectsToObjects.length > 0}
      <div class="mb-8">
        <h4 class="font-semibold text-gray-900 mb-3 text-base">Aspects to Objects:</h4>
        <div class="bg-white rounded-lg overflow-hidden border border-gray-200 mb-6">
          <div class="grid grid-cols-4 p-3 bg-gray-50 font-semibold text-gray-700 border-b-2 border-gray-200">
            <span>Transit Planet</span>
            <span>Aspect</span>
            <span>Birth Object</span>
            <span>Orb</span>
          </div>
          {#each aspectsToObjects as aspect}
            <div class="grid grid-cols-4 p-3 border-b border-gray-100 hover:bg-gray-50 items-center">
              <span class="font-medium text-gray-700">
                {aspect.transitSymbol} {aspect.transitPlanet}
              </span>
              <span class="text-emerald-600 font-medium">
                {aspect.aspectSymbol} {aspect.aspect}
              </span>
              <span class="font-medium text-gray-700">
                {aspect.birthSymbol} {aspect.birthObject}
              </span>
              <span class="font-mono text-gray-600 text-sm">
                {formatOrb(aspect.orb, aspect.transitLongitude, aspect.natalLongitude)}
              </span>
            </div>
          {/each}
        </div>
        
        <!-- Enhanced Object Interpretations -->
        <div class="mt-6">
          <h4 class="font-semibold text-gray-900 mb-3 text-base">Detailed Object Interpretations:</h4>
          {#each aspectsToObjects as aspect}
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div class="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                <span>{aspect.transitSymbol} {aspect.transitPlanet}</span>
                <span class="font-['Noto_Sans_Symbols'] text-xl text-emerald-600">{aspect.aspectSymbol}</span>
                <span>{aspect.birthSymbol} {aspect.birthObject}</span>
              </div>
              <div class="text-sm leading-relaxed text-gray-700">
                {@html aspect.enhancedInterpretation.replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-600">$1</strong>')}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if mainPlanetAspects.length === 0 && aspectsToObjects.length === 0}
      <div class="text-center py-8 text-gray-600 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p>No notable transits with an orb of less than 3 degrees are currently active.</p>
      </div>
    {/if}
  </div>
</div>

 