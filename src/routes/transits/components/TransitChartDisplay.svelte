<script lang="ts">
  import { onMount } from 'svelte';
  import * as Card from '$lib/components/ui/card';
  import * as Dialog from '$lib/components/ui/dialog';
  import D3BiWheelChart from '$lib/chart/D3BiWheelChart.svelte';
  import { chartStore } from '$lib/stores/chart-store';
  import ChartElementDialog from '$lib/components/dialogs/ChartElementDialog.svelte';
  import ChartInstructions from '$lib/components/ChartInstructions.svelte';
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
    PLANET_INTERPRETATIONS,
    HOUSES,
    PLANET_IN_SIGN_INTERPRETATIONS,
    SIGN_IN_HOUSE_INTERPRETATIONS
  } from '$lib/data/interpretations/index';
  import { SIGN_CHARACTERISTICS } from '$lib/data/astrological-data';

  export let transitChartData: string;
  export let natalChartData: string;
  export let transitDate: string;
  export let transitTime: string;
  export let selectedTransitCityData: any;
  export let chartReady: boolean;

  // Chart instructions
  let showInstructions = false;

  // State for detailed transit interpretation dialog
  let dialogOpen = false;
  let selectedElementData: any = null;

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
    
    // Use our ChartElementDialog for consistent display
    selectedElementData = data;
    dialogOpen = true;
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

  function getSignSymbols(sign: string): string {
    const signSymbols: Record<string, string> = {
      'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋', 'Leo': '♌', 'Virgo': '♍',
      'Libra': '♎', 'Scorpio': '♏', 'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
    };
    
    return `(${signSymbols[sign] || sign})`;
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

  function getHouseMeaning(houseNumber: number): string {
    const houseKey = `${houseNumber}${houseNumber === 1 ? 'st' : houseNumber === 2 ? 'nd' : houseNumber === 3 ? 'rd' : 'th'}`;
    return HOUSES[houseKey] || 'life areas and experiences';
  }

  function getHouseInteractionDynamics(natalHouse: number, transitHouse: number): string {
    const houseMeanings = {
      1: 'self-expression and personal identity',
      2: 'values, resources, and self-worth',
      3: 'communication, learning, and local connections',
      4: 'home, family, and emotional foundation',
      5: 'creativity, romance, and self-expression',
      6: 'work, health, and daily routines',
      7: 'partnerships, relationships, and balance',
      8: 'transformation, shared resources, and deep change',
      9: 'higher learning, philosophy, and expansion',
      10: 'career, public image, and life goals',
      11: 'friends, groups, and social causes',
      12: 'spirituality, subconscious, and hidden matters'
    };

    const natalTheme = houseMeanings[natalHouse as keyof typeof houseMeanings] || 'personal development';
    const transitTheme = houseMeanings[transitHouse as keyof typeof houseMeanings] || 'current experiences';

    // Create meaningful house interaction descriptions
    const interactions = {
      '1-1': 'intense focus on personal identity and self-expression',
      '1-7': 'balancing personal needs with relationship dynamics',
      '1-10': 'aligning personal identity with career and public image',
      '2-8': 'transformation of values and shared resources',
      '3-9': 'expansion of communication and learning',
      '4-10': 'balancing home life with career ambitions',
      '5-11': 'creative expression within social groups',
      '6-12': 'spiritual approach to work and health',
      '7-1': 'relationship dynamics affecting personal identity',
      '8-2': 'deep transformation of values and resources',
      '9-3': 'philosophical expansion of communication',
      '10-4': 'career affecting home and family life',
      '11-5': 'social connections enhancing creativity',
      '12-6': 'spiritual insights into daily work and health'
    };

    const interactionKey = `${natalHouse}-${transitHouse}`;
    const specificInteraction = interactions[interactionKey as keyof typeof interactions];
    
    if (specificInteraction) {
      return specificInteraction;
    } else if (natalHouse === transitHouse) {
      return `intensified focus on ${natalTheme}`;
    } else {
      return `the relationship between ${natalTheme} and ${transitTheme}`;
    }
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
        title: 'Interpretation',
        content: enhancedInterpretation,
        type: 'enhanced-interpretation'
      });
    }
    
    // Add house placement sections if we have house data
    if (data.transitHouse && data.natalHouse) {
      // 5. Natal Planet House Placement
      sections.push({
        title: 'Natal Planet House Context',
        content: `Your natal ${data.planet2} is in House ${data.natalHouse} which represents ${getHouseMeaning(data.natalHouse)}.`,
        type: 'natal-house'
      });
      
      // 6. Transit Planet House Placement
      sections.push({
        title: 'Transit Planet House Context',
        content: `Planet ${data.planet1} is currently transiting through House ${data.transitHouse} enhancing ${getHouseMeaning(data.transitHouse)}.`,
        type: 'transit-house'
      });
      
      // 7. House Interaction Dynamics
      sections.push({
        title: 'House Interaction Dynamics',
        content: `The house placements emphasize ${getHouseInteractionDynamics(data.natalHouse, data.transitHouse)}.`,
        type: 'house-interaction'
      });
    }
    
    return sections;
  }

  function generateNatalPlanetSections(data: any) {
    const sections = [];
    
    // 1. Natal Planet in House Meaning - using natal sign in house data
    const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[data.sign]?.[data.house] || "No interpretation available.";
    sections.push({
      title: 'Natal Planet in House Meaning',
      content: signInHouse,
      type: 'natal-house'
    });
    
    // 2. Natal Planet in Sign Meaning - using natal planet in sign data
    const planetInSign = (PLANET_IN_SIGN_INTERPRETATIONS as any)[data.planet]?.[data.sign] || "No interpretation available.";
    sections.push({
      title: 'Natal Planet in Sign Meaning',
      content: planetInSign,
      type: 'natal-sign'
    });
    
    // 3. Natal Planet Core Meaning - using centralized data from interpretations
    const planetData = PLANET_INTERPRETATIONS[data.planet];
    const planetMeaning = planetData?.description || 'your core planetary energy';
    
    sections.push({
      title: 'Natal Planet Core Meaning',
      content: `**Your natal ${data.planet}** represents ${planetMeaning}.`,
      type: 'natal-core'
    });
    
    return sections;
  }

  function formatInterpretationContent(content: string, type: string): string {
    // Color coding based on section type
    let planetColor = 'text-blue-600'; // Default for transit planets
    let aspectColor = 'text-green-600'; // Default for harmonious aspects
    
    if (type === 'transit-planet' || type === 'transit-energy' || type === 'transit-house') {
      planetColor = 'text-orange-600'; // Transit planets in orange
    } else if (type === 'natal-planet' || type === 'natal-house' || type === 'natal-sign' || type === 'natal-core') {
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
      content: getTransitPlanetInHouseMeaning(data.planet, data.house, data.sign),
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

  function generateSignSections(data: any) {
    const sections = [];
    
    // 1. Sign Overview
    const signChars = SIGN_CHARACTERISTICS[data.sign] || {};
    sections.push({
      title: `${data.sign} - Sign Overview`,
      content: signChars.description || "Sign description not available.",
      type: 'sign-overview',
      metadata: {
        element: signChars.element || "Unknown",
        quality: signChars.quality || "Unknown", 
        ruler: signChars.ruler || "Unknown",
        polarity: signChars.polarity || "Unknown"
      }
    });
    
    // 2. House General Meaning
    const houseKey = `${data.house}${data.house === 1 ? 'st' : data.house === 2 ? 'nd' : data.house === 3 ? 'rd' : 'th'}`;
    const houseGeneral = HOUSES[houseKey] || "House information not available.";
    sections.push({
      title: `House ${data.house} represents`,
      content: houseGeneral,
      type: 'house-general'
    });
    
    // 3. Sign in House Meaning
    const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[data.sign]?.[data.house] || "No interpretation available.";
    sections.push({
      title: `${data.sign} in House ${data.house}`,
      content: signInHouse,
      type: 'sign-house-meaning'
    });
    
    // 4. Key Characteristics
    sections.push({
      title: `${data.sign} - Key Characteristics`,
      content: 'Keywords and themes for this sign',
      type: 'sign-characteristics',
      keywords: signChars.keywords || [],
      themes: signChars.themes || []
    });
    
    // 5. Strengths and Challenges
    sections.push({
      title: 'Strengths and Challenges',
      content: 'Personal strengths and areas for growth',
      type: 'sign-strengths-challenges',
      strengths: signChars.strengths || [],
      challenges: signChars.challenges || []
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

<!-- Chart Instructions -->
<ChartInstructions bind:showInstructions />

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

<!-- Chart Element Dialog -->
<ChartElementDialog 
  bind:open={dialogOpen} 
  elementData={selectedElementData} 
  chartType="transit" 
/>

<style>
  .font-zodiac {
    font-family: 'Noto Sans Symbols', 'Arial Unicode MS', 'Arial', sans-serif;
    font-weight: 500;
  }
  
  .font-symbols {
    font-family: 'Noto Sans Symbols', 'Arial', sans-serif;
  }
</style>