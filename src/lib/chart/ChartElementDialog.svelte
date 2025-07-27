<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import {
    PLANET_IN_SIGN_INTERPRETATIONS,
    SIGN_IN_HOUSE_INTERPRETATIONS,
    getDetailedAspectInterpretation,
    PLANET_INTERPRETATIONS,
    ASPECT_INTERPRETATIONS,
    HOUSES
  } from '../data/interpretations';

  export let open = false;
  export let elementData: any = null;

  type PlanetInterpretation = {
    title: string;
    type: string;
    typeColor: string;
    position: string;
    planetMeaning: string;
    planetInSign: string;
    signInHouse: string;
    planetSymbol: string;
    planetColor: string;
    isRetrograde: boolean;
    zodiacSymbol: string;
  };

  type AspectInterpretation = {
    title: string;
    type: string;
    orb: string;
    nature: string;
    general: string;
    specific: string;
    planet1Symbol: string;
    planet2Symbol: string;
    planet1Color: string;
    planet2Color: string;
    isTransitAspect: boolean;
    aspectSymbol: string;
    aspectColor: string;
  };

  type SignInterpretation = {
    title: string;
    houseGeneral: string;
    signInHouse: string;
    zodiacSymbol: string;
  };

  type Interpretation = PlanetInterpretation | AspectInterpretation | SignInterpretation;

  function closeDialog() {
    open = false;
  }

  function getPlanetInterpretation(planetData: any): PlanetInterpretation {
    const { planet, sign, house, degree, minute, isRetrograde, isTransit } = planetData;
    const planetInSign = (PLANET_IN_SIGN_INTERPRETATIONS as any)[planet]?.[sign] || "No interpretation available.";
    const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[sign]?.[house] || "No interpretation available.";
    const planetMeaning = (PLANET_INTERPRETATIONS as any)[planet]?.description || "";

    // Planet symbols for display
    const planetSymbols: Record<string, string> = {
      "Sun": "☉", "Moon": "☽", "Mercury": "☿", "Venus": "♀", "Mars": "♂", "Jupiter": "♃",
      "Saturn": "♄", "Uranus": "♅", "Neptune": "♆", "Pluto": "♇", "Node": "☊",
      "Lilith": "⚸", "Chiron": "⚷", "Fortune": "⊗", "Vertex": "Vx"
    };

    // Zodiac symbols
    const zodiacSymbols: Record<string, string> = {
      "Aries": "♈", "Taurus": "♉", "Gemini": "♊", "Cancer": "♋", "Leo": "♌", "Virgo": "♍",
      "Libra": "♎", "Scorpio": "♏", "Sagittarius": "♐", "Capricorn": "♑", "Aquarius": "♒", "Pisces": "♓"
    };

    // Transit planet colors
    const transitColors: Record<string, string> = {
      'Sun': '#ff6b35',
      'Moon': '#4a90e2', 
      'Mercury': '#8bc34a',
      'Venus': '#ffc107',
      'Mars': '#f44336',
      'Jupiter': '#9c27b0',
      'Saturn': '#607d8b',
      'Uranus': '#00bcd4',
      'Neptune': '#3f51b5',
      'Pluto': '#795548',
      'Node': '#ff9800',
      'Chiron': '#e91e63',
      'Lilith': '#9e9e9e',
      'Fortune': '#4caf50',
      'Vertex': '#673ab7'
    };

    const planetSymbol = planetSymbols[planet] || planet;
    const zodiacSymbol = zodiacSymbols[sign] || sign;
    const planetColor = isTransit ? (transitColors[planet] || '#ff9500') : '#333';
    const retrogradeText = isRetrograde ? ' (Retrograde)' : '';

    return {
      title: `${planetSymbol} ${planet} in ${zodiacSymbol} ${sign} (House ${house})`,
      type: isTransit ? 'Transit Planet' : 'Natal Planet',
      typeColor: isTransit ? 'text-orange-600' : 'text-gray-800',
      position: `${degree}°${minute.toString().padStart(2, '0')}' ${zodiacSymbol} ${sign}${retrogradeText}`,
      planetMeaning,
      planetInSign,
      signInHouse,
      planetSymbol,
      planetColor,
      isRetrograde,
      zodiacSymbol
    };
  }

  function getAspectInterpretation(aspectData: any): AspectInterpretation {
    const { aspect, planet1, planet2, orb, isTransitAspect } = aspectData;
    const interpretation = getDetailedAspectInterpretation(aspect, planet1, planet2);
    const aspectDataInfo = (ASPECT_INTERPRETATIONS as any)[aspect];
    
    const interpretationParts = interpretation.split('\n\n');
    const generalInterpretation = interpretationParts[0] || '';
    const specificInterpretation = interpretationParts[1] || '';

    // Planet symbols for display
    const planetSymbols: Record<string, string> = {
      "Sun": "☉", "Moon": "☽", "Mercury": "☿", "Venus": "♀", "Mars": "♂", "Jupiter": "♃",
      "Saturn": "♄", "Uranus": "♅", "Neptune": "♆", "Pluto": "♇", "Node": "☊",
      "Lilith": "⚸", "Chiron": "⚷", "Fortune": "⊗", "Vertex": "Vx"
    };

    // Aspect symbols
    const aspectSymbols: Record<string, string> = {
      'Conjunction': '☌',
      'Opposition': '☍',
      'Square': '□',
      'Trine': '△',
      'Sextile': '⚹',
      'Quincunx': '⚻'
    };

    // Aspect colors
    const aspectColors: Record<string, string> = {
      'Conjunction': '#228B22',
      'Opposition': '#FF0000',
      'Square': '#FF0000',
      'Trine': '#0000FF',
      'Sextile': '#0000FF',
      'Quincunx': '#B8860B'
    };

    // Transit planet colors
    const transitColors: Record<string, string> = {
      'Sun': '#ff6b35',
      'Moon': '#4a90e2', 
      'Mercury': '#8bc34a',
      'Venus': '#ffc107',
      'Mars': '#f44336',
      'Jupiter': '#9c27b0',
      'Saturn': '#607d8b',
      'Uranus': '#00bcd4',
      'Neptune': '#3f51b5',
      'Pluto': '#795548',
      'Node': '#ff9800',
      'Chiron': '#e91e63',
      'Lilith': '#9e9e9e',
      'Fortune': '#4caf50',
      'Vertex': '#673ab7'
    };

    const planet1Symbol = planetSymbols[planet1] || planet1;
    const planet2Symbol = planetSymbols[planet2] || planet2;
    const aspectSymbol = aspectSymbols[aspect] || aspect;
    const aspectColor = aspectColors[aspect] || '#666';
    // For transit aspects: planet1 is transit (orange), planet2 is natal (gray)
    const planet1Color = isTransitAspect ? '#ff9500' : '#333';
    const planet2Color = '#333'; // Natal planet is always gray

    return {
      title: `${planet1} ${aspect.toLowerCase()} ${planet2}`,
      type: isTransitAspect ? 'Transit Aspect' : 'Natal Aspect',
      orb: orb !== undefined ? `${orb.toFixed(2)}°` : aspectDataInfo?.orb || 'Unknown',
      nature: aspectDataInfo?.nature || 'Unknown',
      general: generalInterpretation,
      specific: specificInterpretation,
      planet1Symbol,
      planet2Symbol,
      planet1Color,
      planet2Color,
      isTransitAspect,
      aspectSymbol,
      aspectColor
    };
  }

  function getSignInterpretation(signData: any): SignInterpretation {
    const { sign, house } = signData;
    const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[sign]?.[house] || "No interpretation available.";
    const houseKey = `${house}${house === 1 ? 'st' : house === 2 ? 'nd' : house === 3 ? 'rd' : 'th'}`;
    const houseGeneral = HOUSES[houseKey] || "House information not available.";
    
    // Zodiac symbols
    const zodiacSymbols: Record<string, string> = {
      "Aries": "♈", "Taurus": "♉", "Gemini": "♊", "Cancer": "♋", "Leo": "♌", "Virgo": "♍",
      "Libra": "♎", "Scorpio": "♏", "Sagittarius": "♐", "Capricorn": "♑", "Aquarius": "♒", "Pisces": "♓"
    };
    
    return {
      title: `${sign} in House ${house}`,
      houseGeneral,
      signInHouse,
      zodiacSymbol: zodiacSymbols[sign] || sign
    };
  }

  // Helper functions for sign characteristics
  function getSignElement(sign: string): string {
    const elements: Record<string, string> = {
      "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
      "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
      "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
      "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water"
    };
    return elements[sign] || "Unknown";
  }

  function getSignQuality(sign: string): string {
    const qualities: Record<string, string> = {
      "Aries": "Cardinal", "Cancer": "Cardinal", "Libra": "Cardinal", "Capricorn": "Cardinal",
      "Taurus": "Fixed", "Leo": "Fixed", "Scorpio": "Fixed", "Aquarius": "Fixed",
      "Gemini": "Mutable", "Virgo": "Mutable", "Sagittarius": "Mutable", "Pisces": "Mutable"
    };
    return qualities[sign] || "Unknown";
  }

  function getSignRuler(sign: string): string {
    const rulers: Record<string, string> = {
      "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
      "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Pluto",
      "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Uranus", "Pisces": "Neptune"
    };
    return rulers[sign] || "Unknown";
  }

  function getSignPolarity(sign: string): string {
    const polarities: Record<string, string> = {
      "Aries": "Positive", "Gemini": "Positive", "Leo": "Positive", "Libra": "Positive", "Sagittarius": "Positive", "Aquarius": "Positive",
      "Taurus": "Negative", "Cancer": "Negative", "Virgo": "Negative", "Scorpio": "Negative", "Capricorn": "Negative", "Pisces": "Negative"
    };
    return polarities[sign] || "Unknown";
  }

  function getSignDescription(sign: string): string {
    const descriptions: Record<string, string> = {
      "Aries": "The first sign of the zodiac, Aries represents new beginnings, courage, and pioneering spirit. Natural leaders with boundless energy and enthusiasm.",
      "Taurus": "The bull represents stability, determination, and sensuality. Taureans are known for their patience, loyalty, and appreciation for beauty and comfort.",
      "Gemini": "The twins symbolize duality, communication, and adaptability. Geminis are curious, versatile, and excellent communicators with a quick wit.",
      "Cancer": "The crab represents emotional depth, intuition, and nurturing qualities. Cancerians are deeply caring, protective, and have strong family bonds.",
      "Leo": "The lion embodies creativity, leadership, and dramatic flair. Leos are natural performers, generous, and have a strong sense of pride and dignity.",
      "Virgo": "The virgin represents precision, service, and analytical thinking. Virgos are detail-oriented, practical, and have a strong sense of duty.",
      "Libra": "The scales symbolize balance, harmony, and justice. Librans are diplomatic, fair-minded, and have a natural sense of beauty and partnership.",
      "Scorpio": "The scorpion represents intensity, transformation, and deep emotional power. Scorpios are passionate, mysterious, and have incredible insight.",
      "Sagittarius": "The archer embodies adventure, optimism, and philosophical thinking. Sagittarians are freedom-loving, honest, and always seeking truth.",
      "Capricorn": "The sea-goat represents ambition, discipline, and practical wisdom. Capricorns are responsible, hardworking, and have strong traditional values.",
      "Aquarius": "The water bearer symbolizes innovation, humanitarianism, and intellectual independence. Aquarians are progressive, original thinkers with a strong sense of community.",
      "Pisces": "The fish represents spirituality, compassion, and artistic sensitivity. Pisceans are intuitive, empathetic, and have a deep connection to the mystical."
    };
    return descriptions[sign] || "No description available.";
  }

  function isPlanetInterpretation(interpretation: Interpretation): interpretation is PlanetInterpretation {
    return 'planetMeaning' in interpretation;
  }

  function isAspectInterpretation(interpretation: Interpretation): interpretation is AspectInterpretation {
    return 'orb' in interpretation;
  }

  function isSignInterpretation(interpretation: Interpretation): interpretation is SignInterpretation {
    return 'houseGeneral' in interpretation;
  }

  $: interpretation = elementData ? 
    (elementData.aspect ? getAspectInterpretation(elementData) :
     elementData.planet ? getPlanetInterpretation(elementData) :
     elementData.sign ? getSignInterpretation(elementData) : null) : null;
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-w-90vw md:max-w-3xl lg:max-w-3xl lg:p-10 max-h-[90vh] overflow-y-auto">
    {#if elementData && interpretation}
      <Dialog.Header>
        {#if isAspectInterpretation(interpretation)}
          <Dialog.Title>
            <span style="color: {interpretation.planet1Color};">{elementData.planet1}</span>
            <span class="text-gray-700"> {elementData.aspect.toLowerCase()} </span>
            <span style="color: {interpretation.planet2Color};">{elementData.planet2}</span>
            <span class="text-gray-500 ml-2">(</span>
            <span class="font-symbols" style="color: {interpretation.planet1Color};">{interpretation.planet1Symbol}</span>
            <span class="font-aspect ml-1" style="color: {interpretation.aspectColor};">{interpretation.aspectSymbol}</span>
            <span class="font-symbols ml-1" style="color: {interpretation.planet2Color};">{interpretation.planet2Symbol}</span>
            <span class="text-gray-500">)</span>
          </Dialog.Title>
        {:else if isPlanetInterpretation(interpretation)}
          <Dialog.Title>
            <span style="color: {interpretation.planetColor};">{elementData.planet}</span>
            <span class="text-gray-700 ml-1">in</span>
            <span class="text-gray-700 ml-1">{elementData.sign}</span>
            <span class="text-gray-500 ml-2">(</span>
            <span class="font-symbols" style="color: {interpretation.planetColor};">{interpretation.planetSymbol}</span>
            <span class="font-zodiac ml-1 text-gray-600">{interpretation.zodiacSymbol}</span>
            <span class="text-gray-500">)</span>
            {#if elementData.house}
              <span class="text-gray-500 ml-2">(House {elementData.house})</span>
            {/if}
          </Dialog.Title>
        {:else}
          <Dialog.Title>{interpretation.title}</Dialog.Title>
        {/if}
        <Dialog.Description>
          {#if isPlanetInterpretation(interpretation) || isAspectInterpretation(interpretation)}
            <span class="text-lg {isPlanetInterpretation(interpretation) ? interpretation.typeColor : 'text-gray-800'} font-medium">
              {interpretation.type}
            </span>
          {/if}
        </Dialog.Description>
      </Dialog.Header>

      <div class="space-y-6 my-6">
        {#if elementData.planet && isPlanetInterpretation(interpretation)}
          <!-- Planet Details -->
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Position</h3>
              <div class="flex items-center gap-2">
                <span class="text-2xl font-symbols" style="color: {interpretation.planetColor};">{interpretation.planetSymbol}</span>
                <p class="text-gray-700 font-zodiac">{interpretation.position}</p>
                {#if interpretation.isRetrograde}
                  <span class="text-sm text-red-500 font-medium">Rx</span>
                {/if}
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xl font-symbols" style="color: {interpretation.planetColor};">{interpretation.planetSymbol}</span>
                <h3 class="font-semibold text-gray-900">{elementData.planet} - Core Meaning</h3>
              </div>
              <p class="text-gray-700 leading-relaxed">{interpretation.planetMeaning}</p>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3">
                <span class="font-symbols" style="color: {interpretation.planetColor};">{interpretation.planetSymbol}</span>
                <span class="ml-1" style="color: {interpretation.planetColor};">{elementData.planet}</span>
                <span class="ml-1 text-gray-700">in</span>
                <span class="font-zodiac ml-1 text-gray-600">{interpretation.zodiacSymbol}</span>
                <span class="ml-1 text-gray-700">{elementData.sign}</span>
              </h3>
              <p class="text-gray-700 leading-relaxed">{interpretation.planetInSign}</p>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3">
                <span class="font-zodiac text-gray-600">{interpretation.zodiacSymbol}</span>
                <span class="ml-1 text-gray-700">{elementData.sign}</span>
                <span class="ml-1 text-gray-700">in House {elementData.house}</span>
              </h3>
              <p class="text-gray-700 leading-relaxed">{interpretation.signInHouse}</p>
            </div>
          </div>
        {:else if elementData.aspect && isAspectInterpretation(interpretation)}
          <!-- Aspect Details -->
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Orb</h4>
                  <p class="text-gray-700">{interpretation.orb}</p>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Nature</h4>
                  <p class="text-gray-700">{interpretation.nature}</p>
                </div>
              </div>
            </div>

            {#if interpretation.general}
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-3">General Interpretation</h3>
                <p class="text-gray-700 leading-relaxed">{interpretation.general}</p>
              </div>
            {/if}

            {#if interpretation.specific}
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-3">Specific Meaning</h3>
                <p class="text-gray-700 leading-relaxed">{interpretation.specific}</p>
              </div>
            {/if}
          </div>
        {:else if elementData.sign && isSignInterpretation(interpretation)}
          <!-- Sign Details -->
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl font-zodiac text-gray-600">{interpretation.zodiacSymbol}</span>
                <h3 class="font-semibold text-gray-900">{elementData.sign} - Sign Overview</h3>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Element:</span>
                  <span class="ml-2 text-gray-600">{getSignElement(elementData.sign)}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Quality:</span>
                  <span class="ml-2 text-gray-600">{getSignQuality(elementData.sign)}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Ruler:</span>
                  <span class="ml-2 text-gray-600">{getSignRuler(elementData.sign)}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Polarity:</span>
                  <span class="ml-2 text-gray-600">{getSignPolarity(elementData.sign)}</span>
                </div>
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">House {elementData.house} represents</h3>
              <p class="text-gray-700 leading-relaxed">{interpretation.houseGeneral}</p>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">{elementData.sign} in House {elementData.house}</h3>
              <p class="text-gray-700 leading-relaxed">{interpretation.signInHouse}</p>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3">
                <span class="font-zodiac text-gray-600">{interpretation.zodiacSymbol}</span>
                <span class="ml-1 text-gray-700">{elementData.sign} - Key Characteristics</span>
              </h3>
              <p class="text-gray-700 leading-relaxed">{getSignDescription(elementData.sign)}</p>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>

<style>
  .font-symbols {
    font-family: 'Noto Sans Symbols', 'Arial', sans-serif;
  }
  
  .font-zodiac {
    font-family: 'Noto Sans Symbols', 'Arial Unicode MS', 'Arial', sans-serif;
    font-weight: 500;
  }
  
  .font-aspect {
    font-family: 'Noto Sans Symbols', 'Arial Unicode MS', 'Arial', sans-serif;
    font-weight: 600;
  }
</style> 