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

  function getAspectHarmonyClass(aspectTitle: string): string {
    if (aspectTitle.includes('Trine') || aspectTitle.includes('Sextile') || aspectTitle.includes('Conjunction')) {
      return 'text-green-600 font-medium'; // Harmonious aspects
    } else if (aspectTitle.includes('Square') || aspectTitle.includes('Opposition')) {
      return 'text-red-600 font-medium'; // Challenging aspects
    } else if (aspectTitle.includes('Quincunx')) {
      return 'text-yellow-600 font-medium'; // Neutral aspects
    }
    return 'text-gray-600 font-medium'; // Default
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

  function formatInterpretationContent(content: string, type: string): string {
    // Color coding based on section type
    let planetColor = 'text-blue-600'; // Default for transit planets
    let aspectColor = 'text-green-600'; // Default for harmonious aspects
    
    if (type === 'transit-planet' || type === 'transit-energy') {
      planetColor = 'text-orange-600'; // Transit planets in orange
    } else if (type === 'natal-planet') {
      planetColor = 'text-purple-600'; // Natal planets in purple
    }
    
    // Determine aspect harmony color
    if (content.includes('Trine') || content.includes('Sextile') || content.includes('Conjunction')) {
      aspectColor = 'text-green-600'; // Harmonious aspects in green
    } else if (content.includes('Square') || content.includes('Opposition')) {
      aspectColor = 'text-red-600'; // Challenging aspects in red
    } else if (content.includes('Quincunx')) {
      aspectColor = 'text-yellow-600'; // Neutral aspects in yellow
    }
    
    // Format the content with color coding
    let formattedContent = content;
    
    // Color code planet names
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    planets.forEach(planet => {
      const regex = new RegExp(`\\b${planet}\\b`, 'g');
      formattedContent = formattedContent.replace(regex, `<span class="${planetColor} font-semibold">${planet}</span>`);
    });
    
    // Color code aspect names
    const aspects = ['Conjunction', 'Opposition', 'Square', 'Trine', 'Sextile', 'Quincunx'];
    aspects.forEach(aspect => {
      const regex = new RegExp(`\\b${aspect}\\b`, 'g');
      formattedContent = formattedContent.replace(regex, `<span class="${aspectColor} font-semibold">${aspect}</span>`);
    });
    
    // Color code sign names
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    signs.forEach(sign => {
      const regex = new RegExp(`\\b${sign}\\b`, 'g');
      formattedContent = formattedContent.replace(regex, `<span class="text-indigo-600 font-semibold">${sign}</span>`);
    });
    
    // Color code house numbers
    formattedContent = formattedContent.replace(/\bHouse (\d+)\b/g, '<span class="text-teal-600 font-semibold">House $1</span>');
    
    // Handle bold text (already formatted with **)
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, `<span class="${planetColor} font-semibold">$1</span>`);
    
    return formattedContent;
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
    <Dialog.Header class="pb-4">
      <Dialog.Title class="text-xl font-semibold text-gray-900 mb-2">
        {detailedInterpretation?.title}
      </Dialog.Title>
      <Dialog.Description class="text-sm text-gray-600">
        {detailedInterpretation?.symbols} • {detailedInterpretation?.type === 'aspect' ? 'Transit Aspect' : 'Transit Planet'}
      </Dialog.Description>
    </Dialog.Header>
    
    {#if detailedInterpretation}
      <!-- Orb and Nature Section -->
      {#if detailedInterpretation.type === 'aspect'}
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <h4 class="font-semibold text-gray-800 mb-2">Orb</h4>
              <p class="text-sm text-gray-600">{detailedInterpretation.orb}</p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-800 mb-2">Nature</h4>
              <p class="text-sm">
                <span class={getAspectHarmonyClass(detailedInterpretation.title)}>
                  {detailedInterpretation.nature}
                </span>
              </p>
            </div>
          </div>
        </div>
      {/if}
      
      <!-- Enhanced Transit Interpretation Section -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h4 class="font-medium text-gray-800 mb-4 text-lg">Enhanced Transit Interpretation</h4>
        <div class="space-y-6">
          {#each detailedInterpretation.sections as section}
            <div class="border-l-4 border-gray-300 pl-6 py-2">
              <h5 class="font-semibold text-gray-900 mb-3 text-base">{section.title}</h5>
              <div class="text-sm text-gray-700 leading-relaxed">
                {@html formatInterpretationContent(section.content, section.type)}
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

 