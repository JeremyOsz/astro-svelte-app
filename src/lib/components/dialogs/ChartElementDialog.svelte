<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import {
    PLANET_IN_SIGN_INTERPRETATIONS,
    SIGN_IN_HOUSE_INTERPRETATIONS,
    getDetailedAspectInterpretation,
    getEnhancedTransitInterpretation,
    getTransitPlanetInHouseMeaning,
    getTransitPlanetInSignMeaning,
    PLANET_INTERPRETATIONS,
    ASPECT_INTERPRETATIONS,
    HOUSES
  } from '../../data/interpretations';
  import { 
    PLANET_CHARACTERISTICS, 
    SIGN_CHARACTERISTICS
  } from '../../data/astrological-data';
  import {
    PLANET_SYMBOLS,
    ZODIAC_SYMBOLS,
    ASPECT_SYMBOLS,
    ASPECT_DEFINITIONS,
    TRANSIT_COLORS
  } from '../../data/symbols';

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
    enhancedTransitInfo?: string;
  };

  type AspectInterpretation = {
    title: string;
    type: string;
    orb: string;
    nature: string;
    general: string;
    specific: string;
    enhancedInterpretation?: string;
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

  type AngularHouseInterpretation = {
    title: string;
    meaning: string;
    description: string;
    symbol: string;
    sign: string;
    zodiacSymbol: string;
    degree: number;
    minute: number;
  };

  type Interpretation = PlanetInterpretation | AspectInterpretation | SignInterpretation | AngularHouseInterpretation;

  function closeDialog() {
    open = false;
  }

  function getPlanetInterpretation(planetData: any): PlanetInterpretation {
    const { planet, sign, house, degree, minute, isRetrograde, isTransit } = planetData;
    const planetInSign = (PLANET_IN_SIGN_INTERPRETATIONS as any)[planet]?.[sign] || "No interpretation available.";
    const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[sign]?.[house] || "No interpretation available.";
    const planetMeaning = (PLANET_INTERPRETATIONS as any)[planet]?.description || "";

    // Use centralized symbols and colors
    const planetSymbol = PLANET_SYMBOLS[planet] || planet;
    const zodiacSymbol = ZODIAC_SYMBOLS[sign] || sign;
    const planetColor = isTransit ? (TRANSIT_COLORS[planet] || '#ff9500') : '#333';
    const retrogradeText = isRetrograde ? ' (Retrograde)' : '';

    // Add enhanced transit meanings if it's a transit planet
    let enhancedTransitInfo = '';
    if (isTransit) {
      const houseMeaning = getTransitPlanetInHouseMeaning(planet, house);
      const signMeaning = getTransitPlanetInSignMeaning(planet, sign);
      enhancedTransitInfo = `
        <div class="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 class="font-semibold text-orange-800 mb-2">Current Transit Meaning</h4>
          <div class="space-y-2 text-sm">
            <p><strong>House ${house}:</strong> ${houseMeaning}</p>
            <p><strong>${sign}:</strong> ${signMeaning}</p>
          </div>
        </div>
      `;
    }

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
      zodiacSymbol,
      enhancedTransitInfo
    };
  }

  function getAspectInterpretation(aspectData: any): AspectInterpretation {
    const { aspect, planet1, planet2, orb, isTransitAspect } = aspectData;
    const aspectDataInfo = (ASPECT_INTERPRETATIONS as any)[aspect];
    
    let generalInterpretation = '';
    let specificInterpretation = '';
    let enhancedInterpretation = '';

    // Use enhanced interpretation for transit aspects
    if (isTransitAspect) {
      enhancedInterpretation = getEnhancedTransitInterpretation(aspect, planet1, planet2);
    } else {
      // Use regular interpretation for natal aspects
      const interpretation = getDetailedAspectInterpretation(aspect, planet1, planet2);
      const interpretationParts = interpretation.split('\n\n');
      generalInterpretation = interpretationParts[0] || '';
      specificInterpretation = interpretationParts[1] || '';
    }

    // Use centralized symbols and colors
    const planet1Symbol = PLANET_SYMBOLS[planet1] || planet1;
    const planet2Symbol = PLANET_SYMBOLS[planet2] || planet2;
    const aspectSymbol = ASPECT_SYMBOLS[aspect] || aspect;
    const aspectColor = (ASPECT_DEFINITIONS as any)[aspect]?.color || '#666';
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
      enhancedInterpretation,
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
    
    // Use centralized zodiac symbols
    return {
      title: `${sign} in House ${house}`,
      houseGeneral,
      signInHouse,
      zodiacSymbol: ZODIAC_SYMBOLS[sign] || sign
    };
  }


  function getAngularHouseInterpretation(angularHouseData: any): AngularHouseInterpretation {
    const { planet, sign, degree, minute } = angularHouseData;
    
    // Angular house symbols
    const angularHouseSymbols: Record<string, string> = {
      "ASC": "Asc", "MC": "MC", "DSC": "Dsc", "IC": "IC"
    };

    // Use centralized zodiac symbols

    // Angular house meanings and descriptions
    const angularHouseInfo: Record<string, { meaning: string; description: string }> = {
      "ASC": {
        meaning: "Ascendant - Your Rising Sign",
        description: "The Ascendant represents your outer personality, how you present yourself to the world, and your physical appearance. It's the sign that was rising on the eastern horizon at the moment of your birth. This is often called your 'rising sign' and represents your first impression on others, your approach to new situations, and your immediate reactions to life."
      },
      "MC": {
        meaning: "Midheaven - Your Career & Public Image",
        description: "The Midheaven (MC) represents your career path, public reputation, and life goals. It shows your ambitions, achievements, and how you want to be seen by the world. This point indicates your professional calling, your relationship with authority figures, and your highest aspirations in life."
      },
      "DSC": {
        meaning: "Descendant - Your Relationships",
        description: "The Descendant represents your relationships, partnerships, and what you seek in others. It shows the qualities you're attracted to in partners and the type of people you form close relationships with. This point also represents your shadow side - qualities you may project onto others."
      },
      "IC": {
        meaning: "Imum Coeli - Your Roots & Private Life",
        description: "The Imum Coeli (IC) represents your home, family, roots, and private life. It shows your deepest emotional needs, your relationship with family, and your sense of security. This point indicates your foundation, your connection to your past, and what makes you feel safe and nurtured."
      }
    };

    const houseInfo = angularHouseInfo[planet];
    const symbol = angularHouseSymbols[planet] || planet;
    const zodiacSymbol = ZODIAC_SYMBOLS[sign] || sign;

    return {
      title: `${planet} (${symbol}) in ${sign}`,
      meaning: houseInfo.meaning,
      description: houseInfo.description,
      symbol,
      sign,
      zodiacSymbol,
      degree,
      minute
    };
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

  function isAngularHouseInterpretation(interpretation: Interpretation): interpretation is AngularHouseInterpretation {
    return 'meaning' in interpretation && 'symbol' in interpretation;
  }

  $: interpretation = elementData ? 
    (elementData.aspect ? getAspectInterpretation(elementData) :
     elementData.planet ? (['ASC', 'MC', 'DSC', 'IC'].includes(elementData.planet) ? getAngularHouseInterpretation(elementData) : getPlanetInterpretation(elementData)) :
     elementData.sign ? getSignInterpretation(elementData) : null) : null;

  // Enhanced planet characteristics
  function getPlanetCharacteristics(planet: string): { keywords: string[], description: string, themes: string[], challenges: string[], strengths: string[] } {
    return PLANET_CHARACTERISTICS[planet] || {
      keywords: [],
      description: "This planet represents important aspects of your personality and life experience.",
      themes: [],
      challenges: [],
      strengths: []
    };
  }

  // Enhanced sign characteristics
  function getSignCharacteristics(sign: string): { element: string, quality: string, ruler: string, polarity: string, description: string, keywords: string[], themes: string[], challenges: string[], strengths: string[] } {
    return SIGN_CHARACTERISTICS[sign] || {
      element: "Unknown",
      quality: "Unknown",
      ruler: "Unknown",
      polarity: "Unknown",
      description: "This sign represents important aspects of your personality and life experience.",
      keywords: [],
      themes: [],
      challenges: [],
      strengths: []
    };
  }
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
          {@const planetChars = getPlanetCharacteristics(elementData.planet)}
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

            <!-- Enhanced Planet Characteristics -->
            <div class="border rounded-lg p-4">
              <div class="flex items-center gap-2 mb-3">
                <span class="text-xl font-symbols" style="color: {interpretation.planetColor};">{interpretation.planetSymbol}</span>
                <h3 class="font-semibold text-gray-900">{elementData.planet} - Core Meaning</h3>
              </div>
              <p class="text-gray-700 leading-relaxed mb-4">{planetChars.description}</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Keywords</h4>
                  <div class="flex flex-wrap gap-1">
                    {#each planetChars.keywords as keyword}
                      <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{keyword}</span>
                    {/each}
                  </div>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Themes</h4>
                  <div class="flex flex-wrap gap-1">
                    {#each planetChars.themes as theme}
                      <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{theme}</span>
                    {/each}
                  </div>
                </div>
              </div>
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

            {#if interpretation.enhancedTransitInfo}
              {@html interpretation.enhancedTransitInfo}
            {/if}

            <!-- Planet Strengths and Challenges -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border rounded-lg p-4 bg-green-50">
                <h4 class="font-semibold text-green-800 mb-2">Strengths</h4>
                <ul class="text-sm text-green-700 space-y-1">
                  {#each planetChars.strengths as strength}
                    <li class="flex items-start gap-2">
                      <span class="text-green-600 mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  {/each}
                </ul>
              </div>
              <div class="border rounded-lg p-4 bg-orange-50">
                <h4 class="font-semibold text-orange-800 mb-2">Challenges</h4>
                <ul class="text-sm text-orange-700 space-y-1">
                  {#each planetChars.challenges as challenge}
                    <li class="flex items-start gap-2">
                      <span class="text-orange-600 mt-1">•</span>
                      <span>{challenge}</span>
                    </li>
                  {/each}
                </ul>
              </div>
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

            {#if interpretation.enhancedInterpretation}
              <div class="border rounded-lg p-4 bg-orange-50 border-orange-200">
                <h3 class="font-semibold text-orange-800 mb-3">Enhanced Transit Interpretation</h3>
                <div class="text-gray-700 leading-relaxed">
                  {@html interpretation.enhancedInterpretation.replace(/\*\*(.*?)\*\*/g, '<strong class="text-orange-600">$1</strong>')}
                </div>
              </div>
            {/if}
          </div>
        {:else if elementData.sign && isSignInterpretation(interpretation)}
          <!-- Sign Details -->
          {@const signChars = getSignCharacteristics(elementData.sign)}
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl font-zodiac text-gray-600">{interpretation.zodiacSymbol}</span>
                <h3 class="font-semibold text-gray-900">{elementData.sign} - Sign Overview</h3>
              </div>
              <p class="text-gray-700 leading-relaxed mb-4">{signChars.description}</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Element:</span>
                  <span class="ml-2 text-gray-600">{signChars.element}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Quality:</span>
                  <span class="ml-2 text-gray-600">{signChars.quality}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Ruler:</span>
                  <span class="ml-2 text-gray-600">{signChars.ruler}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Polarity:</span>
                  <span class="ml-2 text-gray-600">{signChars.polarity}</span>
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

            <!-- Sign Keywords and Themes -->
            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3">
                <span class="font-zodiac text-gray-600">{interpretation.zodiacSymbol}</span>
                <span class="ml-1 text-gray-700">{elementData.sign} - Key Characteristics</span>
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Keywords</h4>
                  <div class="flex flex-wrap gap-1">
                    {#each signChars.keywords as keyword}
                      <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{keyword}</span>
                    {/each}
                  </div>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Themes</h4>
                  <div class="flex flex-wrap gap-1">
                    {#each signChars.themes as theme}
                      <span class="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">{theme}</span>
                    {/each}
                  </div>
                </div>
              </div>
            </div>

            <!-- Sign Strengths and Challenges -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border rounded-lg p-4 bg-green-50">
                <h4 class="font-semibold text-green-800 mb-2">Strengths</h4>
                <ul class="text-sm text-green-700 space-y-1">
                  {#each signChars.strengths as strength}
                    <li class="flex items-start gap-2">
                      <span class="text-green-600 mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  {/each}
                </ul>
              </div>
              <div class="border rounded-lg p-4 bg-orange-50">
                <h4 class="font-semibold text-orange-800 mb-2">Challenges</h4>
                <ul class="text-sm text-orange-700 space-y-1">
                  {#each signChars.challenges as challenge}
                    <li class="flex items-start gap-2">
                      <span class="text-orange-600 mt-1">•</span>
                      <span>{challenge}</span>
                    </li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        {:else if elementData.planet && ['ASC', 'MC', 'DSC', 'IC'].includes(elementData.planet) && isAngularHouseInterpretation(interpretation)}
          <!-- Angular House Details -->
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl font-symbols text-gray-600">{interpretation.symbol}</span>
                <h3 class="font-semibold text-gray-900">{interpretation.meaning}</h3>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Position:</span>
                  <span class="ml-2 text-gray-600">{interpretation.degree}°{interpretation.minute.toString().padStart(2, '0')}' {interpretation.sign}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Sign:</span>
                  <span class="ml-2 text-gray-600 font-zodiac">{interpretation.zodiacSymbol} {interpretation.sign}</span>
                </div>
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3">
                <span class="font-symbols text-gray-600">{interpretation.symbol}</span>
                <span class="ml-1 text-gray-700">{elementData.planet} - Meaning & Significance</span>
              </h3>
              <p class="text-gray-700 leading-relaxed">{interpretation.description}</p>
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