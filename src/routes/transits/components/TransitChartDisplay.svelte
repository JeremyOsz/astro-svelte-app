<script lang="ts">
  import { onMount } from 'svelte';
  import * as Card from '$lib/components/ui/card';
  import * as Dialog from '$lib/components/ui/dialog';
  import D3BiWheelChart from '$lib/chart/D3BiWheelChart.svelte';
  import { chartStore } from '$lib/stores/chart-store';
  import { 
    createBriefTooltip,
    showBriefTooltip,
    hideBriefTooltip
  } from '$lib/components/tooltips/brief-tooltip';
  import { 
    createTransitTooltip,
    handleTransitMouseOver,
    handleTransitMouseOut,
    unpinTransitTooltip,
    getTransitPlanetInterpretation,
    getTransitAspectInterpretation
  } from '$lib/components/tooltips';
  import {
    getTransitPlanetInHouseMeaning,
    getTransitPlanetInSignMeaning,
    getEnhancedTransitInterpretation,
    ASPECT_INTERPRETATIONS,
    PLANET_INTERPRETATIONS
  } from '$lib/data/interpretations';

  export let transitChartData: string;
  export let natalChartData: string;
  export let transitDate: string;
  export let transitTime: string;
  export let selectedTransitCityData: any;
  export let chartReady: boolean;

  // State for detailed transit interpretation dialog
  let showTransitDialog = false;
  let selectedTransitData: any = null;
  let detailedInterpretation: any = null;

  // Custom handlers that combine brief tooltips with detailed dialogs
  function handleTransitHover(event: MouseEvent, data: any) {
    // Use brief tooltip for hover
    showBriefTooltip(event, data);
  }

  function handleTransitLeave(event: MouseEvent) {
    // Hide brief tooltip
    hideBriefTooltip();
  }

  function handleTransitClick(event: MouseEvent, data: any) {
    event.stopPropagation();
    
    // Generate detailed interpretation
    if (data.aspect && data.isTransitAspect) {
      // It's a transit aspect
      detailedInterpretation = {
        type: 'aspect',
        title: `${data.planet1} ${data.aspect} ${data.planet2}`,
        symbols: getAspectSymbols(data.planet1, data.aspect, data.planet2),
        orb: data.orb ? `${data.orb.toFixed(2)}°` : 'Unknown',
        nature: getAspectNature(data.aspect),
        sections: generateTransitAspectSections(data)
      };
    } else if (data.planet && data.isTransit) {
      // It's a transit planet
      detailedInterpretation = {
        type: 'planet',
        title: `${data.planet} in ${data.sign} (House ${data.house})`,
        symbols: getPlanetSymbols(data.planet, data.sign),
        position: `${data.degree}°${data.minute.toString().padStart(2, '0')}' ${data.sign}${data.isRetrograde ? ' (Retrograde)' : ''}`,
        sections: generateTransitPlanetSections(data)
      };
    }
    
    selectedTransitData = data;
    showTransitDialog = true;
  }

  function getAspectSymbols(planet1: string, aspect: string, planet2: string): string {
    const planetSymbols: Record<string, string> = {
      'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀', 'Mars': '♂',
      'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇'
    };
    
    const aspectSymbols: Record<string, string> = {
      'Conjunction': '☌', 'Opposition': '☍', 'Square': '□', 'Trine': '△', 'Sextile': '⚹'
    };
    
    return `(${planetSymbols[planet1] || planet1} ${aspectSymbols[aspect] || aspect} ${planetSymbols[planet2] || planet2})`;
  }

  function getPlanetSymbols(planet: string, sign: string): string {
    const planetSymbols: Record<string, string> = {
      'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀', 'Mars': '♂',
      'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇'
    };
    
    const signSymbols: Record<string, string> = {
      'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋', 'Leo': '♌', 'Virgo': '♍',
      'Libra': '♎', 'Scorpio': '♏', 'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
    };
    
    return `(${planetSymbols[planet] || planet} ${signSymbols[sign] || sign})`;
  }

  function getAspectNature(aspect: string): string {
    const aspectData = ASPECT_INTERPRETATIONS[aspect];
    return aspectData?.nature || 'Aspect nature information not available';
  }

  function generateTransitAspectSections(data: any) {
    const sections = [];
    
    // Get enhanced interpretation from the interpretations file
    const enhancedInterpretation = getEnhancedTransitInterpretation(data.aspect, data.planet1, data.planet2);
    
    // Split the interpretation into sections based on the structure
    const parts = enhancedInterpretation.split('. ');
    
    if (parts.length >= 4) {
      // 1. Transit Planet Meaning
      sections.push({
        title: 'Transit Planet Meaning',
        content: parts[0] + '.',
        type: 'transit-planet'
      });
      
      // 2. Natal Planet Meaning
      sections.push({
        title: 'Natal Planet Meaning', 
        content: parts[1] + '.',
        type: 'natal-planet'
      });
      
      // 3. Aspect Meaning
      sections.push({
        title: 'Aspect Meaning',
        content: parts[2] + '.',
        type: 'aspect'
      });
      
      // 4. Interaction Meaning
      sections.push({
        title: 'What This Interaction Represents',
        content: parts[3] + '.',
        type: 'interaction'
      });
    } else {
      // Fallback if the interpretation doesn't have the expected structure
      sections.push({
        title: 'Enhanced Transit Interpretation',
        content: enhancedInterpretation,
        type: 'enhanced-interpretation'
      });
    }
    
    return sections;
  }

  function generateTransitPlanetSections(data: any) {
    const sections = [];
    
    // 1. Transit Planet in House Meaning
    sections.push({
      title: 'Transit Planet in House Meaning',
      content: getTransitPlanetInHouseMeaning(data.planet, data.house),
      type: 'house-meaning'
    });
    
    // 2. Transit Planet in Sign Meaning
    sections.push({
      title: 'Transit Planet in Sign Meaning',
      content: getTransitPlanetInSignMeaning(data.planet, data.sign),
      type: 'sign-meaning'
    });
    
    // 3. Current Transit Energy - using centralized data from interpretations
    const planetData = PLANET_INTERPRETATIONS[data.planet];
    const planetMeaning = planetData?.description || 'your current energy';
    
    sections.push({
      title: 'Transit Planet Meaning',
      content: `**Transit ${data.planet}** represents ${planetMeaning}.`,
      type: 'transit-energy'
    });
    
    return sections;
  }

  onMount(() => {
    // Update the chart store with the natal chart data
    if (natalChartData) {
      chartStore.setChartData(natalChartData);
    }
    
    // Initialize both tooltip systems
    createBriefTooltip();
    createTransitTooltip();
  });
</script>

<Card.Root class="mt-6">
  <Card.Header>
    <Card.Title>Transit Chart</Card.Title>
    <Card.Description>
      <div class="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>Date: {new Date(transitDate).toLocaleDateString()}</span>
        <span>Time: {transitTime}</span>
        <span>Location: {selectedTransitCityData?.fullLocation}</span>
      </div>
    </Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="w-full min-h-[400px] md:min-h-[600px] flex justify-center">
      <D3BiWheelChart 
        transitData={transitChartData}
        showDegreeMarkers={true}
        showExtendedPlanets={false}
        showAspectLines={true}
        showPlanetLabels={true}
        onMouseOver={handleTransitHover}
        onMouseOut={handleTransitLeave}
        onClick={handleTransitClick}
      />
    </div>
  </Card.Content>
</Card.Root>

<!-- Detailed Transit Interpretation Dialog -->
<Dialog.Root bind:open={showTransitDialog}>
  <Dialog.Content class="max-w-2xl max-h-[80vh] overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title class="text-xl font-semibold text-orange-600">
        {detailedInterpretation?.title}
      </Dialog.Title>
      <Dialog.Description class="text-sm text-gray-600">
        {detailedInterpretation?.symbols} • {detailedInterpretation?.type === 'aspect' ? 'Transit Aspect' : 'Transit Planet'}
      </Dialog.Description>
    </Dialog.Header>
    
    {#if detailedInterpretation}
      <!-- Orb and Nature Section -->
      {#if detailedInterpretation.type === 'aspect'}
        <div class="bg-gray-50 p-4 rounded-lg mb-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium text-gray-700">Orb</h4>
              <p class="text-sm">{detailedInterpretation.orb}</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-700">Nature</h4>
              <p class="text-sm">{detailedInterpretation.nature}</p>
            </div>
          </div>
        </div>
      {/if}
      
      <!-- Enhanced Transit Interpretation Section -->
      <div class="bg-orange-50 p-4 rounded-lg">
        <h4 class="font-medium text-orange-700 mb-3">Enhanced Transit Interpretation</h4>
        <div class="space-y-4">
          {#each detailedInterpretation.sections as section}
            <div class="border-l-4 border-orange-200 pl-4">
              <h5 class="font-medium text-gray-800 mb-2">{section.title}</h5>
              <div class="text-sm text-gray-700 leading-relaxed">
                {@html section.content.replace(/\*\*(.*?)\*\*/g, '<span class="text-orange-600 font-semibold">$1</span>')}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    <Dialog.Footer>
      <Dialog.Close class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
        Close
      </Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

 