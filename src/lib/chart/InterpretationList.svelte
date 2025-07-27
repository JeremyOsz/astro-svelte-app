<script lang="ts">
  import { chartStore } from '$lib/stores/chart-store';
  import { get } from 'svelte/store';
  import { getPlanetInterpretation, getAspectInterpretation, getSignInterpretation } from './tooltip';
  import { onMount } from 'svelte';
  import { PLANET_CHARACTERISTICS, SIGN_CHARACTERISTICS } from '$lib/data/astrological-data';
  import { 
    PLANET_INTERPRETATIONS, 
    PLANET_IN_SIGN_INTERPRETATIONS, 
    SIGN_IN_HOUSE_INTERPRETATIONS, 
    ASPECT_INTERPRETATIONS, 
    HOUSES,
    getDetailedAspectInterpretation 
  } from '$lib/data/interpretations';

  interface PlanetData {
    planet: string;
    sign: string;
    degree: number;
    minute: number;
    isRetrograde: boolean;
    angle: number;
    house: number;
  }

  interface Aspect {
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
  }

  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const aspectDefs: Record<string, { angle: number; orb: number }> = {
    Conjunction: { angle: 0, orb: 8 },
    Opposition: { angle: 180, orb: 8 },
    Square: { angle: 90, orb: 8 },
    Trine: { angle: 120, orb: 8 },
    Sextile: { angle: 60, orb: 6 },
    Quincunx: { angle: 150, orb: 3 }
  };

  const coreAspectBodies = [
    "Sun", "Moon", "Mercury", "Venus", "Mars",
    "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "ASC"
  ];

  // Search filter passed from parent
  export let filter: string = "";

  $: normalizedFilter = filter.toLowerCase();

  // Filtered arrays based on search term
  $: filteredPlanetInterpretations = normalizedFilter
    ? planetInterpretations.filter((interpretation) => 
        interpretation.title.toLowerCase().includes(normalizedFilter) ||
        interpretation.description.toLowerCase().includes(normalizedFilter) ||
        interpretation.themes.some(theme => theme.toLowerCase().includes(normalizedFilter)) ||
        interpretation.challenges.some(challenge => challenge.toLowerCase().includes(normalizedFilter)) ||
        interpretation.strengths.some(strength => strength.toLowerCase().includes(normalizedFilter))
      )
    : planetInterpretations;

  $: filteredAspectInterpretations = normalizedFilter
    ? aspectInterpretations.filter((interpretation) => 
        interpretation.title.toLowerCase().includes(normalizedFilter) ||
        interpretation.description.toLowerCase().includes(normalizedFilter)
      )
    : aspectInterpretations;

  $: filteredSignInterpretations = normalizedFilter
    ? signInterpretations.filter((interpretation) => 
        interpretation.title.toLowerCase().includes(normalizedFilter) ||
        interpretation.description.toLowerCase().includes(normalizedFilter) ||
        interpretation.themes.some(theme => theme.toLowerCase().includes(normalizedFilter)) ||
        interpretation.challenges.some(challenge => challenge.toLowerCase().includes(normalizedFilter)) ||
        interpretation.strengths.some(strength => strength.toLowerCase().includes(normalizedFilter))
      )
    : signInterpretations;

  interface EnhancedPlanetInterpretation {
    title: string;
    description: string;
    position: string;
    planetMeaning: string;
    planetInSign: string;
    signInHouse: string;
    themes: string[];
    challenges: string[];
    strengths: string[];
    isRetrograde: boolean;
    isTransit: boolean;
  }

  interface EnhancedAspectInterpretation {
    title: string;
    description: string;
    orb: string;
    nature: string;
    general: string;
    specific: string;
  }

  interface EnhancedSignInterpretation {
    title: string;
    description: string;
    houseGeneral: string;
    signInHouse: string;
    themes: string[];
    challenges: string[];
    strengths: string[];
  }

  let planetInterpretations: EnhancedPlanetInterpretation[] = [];
  let aspectInterpretations: EnhancedAspectInterpretation[] = [];
  let signInterpretations: EnhancedSignInterpretation[] = [];

  // Subscribe to chart store changes
  $: {
    const { chartData } = $chartStore;
    if (chartData) {
      updateInterpretations();
    }
  }

  // Also run on mount
  onMount(() => {
    updateInterpretations();
  });

  function updateInterpretations() {
    const { chartData } = get(chartStore);
    console.log('InterpretationList: updateInterpretations called with chartData:', chartData?.substring(0, 100));
    if (!chartData || !chartData.trim()) {
      planetInterpretations = [];
      aspectInterpretations = [];
      signInterpretations = [];
      console.log('InterpretationList: No chart data, clearing interpretations');
      return;
    }

    const { planets, aspects, houseCusps } = parseChartData(chartData.trim());
    console.log('InterpretationList: Parsed data:', { planets: planets.length, aspects: aspects.length, houseCusps: houseCusps.length });

    planetInterpretations = planets.map(p => getEnhancedPlanetInterpretation(p));
    aspectInterpretations = aspects.map(a => getEnhancedAspectInterpretation(a));
    signInterpretations = houseCusps.map(({ sign, house }) => getEnhancedSignInterpretation(sign, house));
    
    console.log('InterpretationList: Generated interpretations:', { 
      planets: planetInterpretations.length, 
      aspects: aspectInterpretations.length, 
      signs: signInterpretations.length 
    });
  }

  function getEnhancedPlanetInterpretation(planetData: PlanetData): EnhancedPlanetInterpretation {
    const { planet, sign, house, degree, minute, isRetrograde } = planetData;
    const planetChars = PLANET_CHARACTERISTICS[planet] || {
      keywords: [],
      description: "This planet represents important aspects of your personality and life experience.",
      themes: [],
      challenges: [],
      strengths: []
    };
    const signChars = SIGN_CHARACTERISTICS[sign] || {
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

    // Get interpretations from the existing data
    const planetInSign = (PLANET_IN_SIGN_INTERPRETATIONS as any)[planet]?.[sign] || "No interpretation available.";
    const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[sign]?.[house] || "No interpretation available.";
    const planetMeaning = (PLANET_INTERPRETATIONS as any)[planet]?.description || "";

    const position = `${degree}°${minute.toString().padStart(2, '0')}' ${sign}`;
    const retrogradeText = isRetrograde ? ' (Retrograde)' : '';

    return {
      title: `${planet} in ${sign} (House ${house})`,
      description: `${planetMeaning} ${planetInSign} ${signInHouse}`,
      position: `${position}${retrogradeText}`,
      planetMeaning,
      planetInSign,
      signInHouse,
      themes: [...planetChars.themes, ...signChars.themes],
      challenges: [...planetChars.challenges, ...signChars.challenges],
      strengths: [...planetChars.strengths, ...signChars.strengths],
      isRetrograde,
      isTransit: false
    };
  }

  function getEnhancedAspectInterpretation(aspectData: Aspect): EnhancedAspectInterpretation {
    const { planet1, planet2, aspect, orb } = aspectData;
    const interpretation = getDetailedAspectInterpretation(aspect, planet1, planet2);
    const aspectDataInfo = (ASPECT_INTERPRETATIONS as any)[aspect];
    
    const interpretationParts = interpretation.split('\n\n');
    const generalInterpretation = interpretationParts[0] || '';
    const specificInterpretation = interpretationParts[1] || '';

    return {
      title: `${planet1} ${aspect.toLowerCase()} ${planet2}`,
      description: `${generalInterpretation} ${specificInterpretation}`,
      orb: orb !== undefined ? `${orb.toFixed(2)}°` : aspectDataInfo?.orb || 'Unknown',
      nature: aspectDataInfo?.nature || 'Unknown',
      general: generalInterpretation,
      specific: specificInterpretation
    };
  }

  function getEnhancedSignInterpretation(sign: string, house: number): EnhancedSignInterpretation {
    const signChars = SIGN_CHARACTERISTICS[sign] || {
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

    const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[sign]?.[house] || "No interpretation available.";
    const houseKey = `${house}${house === 1 ? 'st' : house === 2 ? 'nd' : house === 3 ? 'rd' : 'th'}`;
    const houseGeneral = HOUSES[houseKey] || "House information not available.";

    return {
      title: `${sign} in House ${house}`,
      description: `${signChars.description} ${signInHouse}`,
      houseGeneral,
      signInHouse,
      themes: signChars.themes,
      challenges: signChars.challenges,
      strengths: signChars.strengths
    };
  }

  function parseChartData(data: string) {
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const planets: PlanetData[] = [];

    for (const line of lines) {
      const parts = line.split(',');
      if (parts.length < 3) continue;
      let planetName = parts[0].trim();
      const sign = parts[1].trim();
      const degreeMatch = parts[2].trim().match(/^(\d+)°(\d+)'$/);
      if (!degreeMatch || !zodiacSigns.includes(sign)) continue;

      const degree = parseInt(degreeMatch[1]);
      const minute = parseInt(degreeMatch[2]);
      const isRetrograde = parts.length > 3 && parts[3].trim() === 'R';

      // Normalize angles
      if (planetName === 'Asc') planetName = 'ASC';
      if (planetName === 'Mc') planetName = 'MC';
      if (planetName === 'Dsc') planetName = 'DSC';
      if (planetName === 'Ic') planetName = 'IC';

      const signIndex = zodiacSigns.indexOf(sign);
      const absoluteDegree = signIndex * 30 + degree + minute / 60;

      planets.push({
        planet: planetName,
        sign,
        degree,
        minute,
        isRetrograde,
        angle: absoluteDegree,
        house: 0 // placeholder, will be assigned later
      });
    }

    // Determine houses using whole sign system
    const asc = planets.find(p => p.planet === 'ASC');
    const houseCusps: { house: number; angle: number; sign: string }[] = [];
    if (asc) {
      const ascSignIndex = zodiacSigns.indexOf(asc.sign);
      for (let i = 0; i < 12; i++) {
        const signIndex = (ascSignIndex + i) % 12;
        const angle = signIndex * 30;
        houseCusps.push({ house: i + 1, angle, sign: zodiacSigns[signIndex] });
      }

      planets.forEach(p => {
        const planetSignIndex = zodiacSigns.indexOf(p.sign);
        p.house = ((planetSignIndex - ascSignIndex + 12) % 12) + 1;
      });
    }

    // Calculate aspects
    const aspects: Aspect[] = [];
    const core = planets.filter(p => coreAspectBodies.includes(p.planet));
    for (let i = 0; i < core.length; i++) {
      for (let j = i + 1; j < core.length; j++) {
        const p1 = core[i];
        const p2 = core[j];
        const angleDiff = Math.abs(p1.angle - p2.angle);
        const minAngle = Math.min(angleDiff, 360 - angleDiff);
        for (const [name, def] of Object.entries(aspectDefs)) {
          if (Math.abs(minAngle - def.angle) <= def.orb) {
            aspects.push({
              planet1: p1.planet,
              planet2: p2.planet,
              aspect: name,
              orb: parseFloat(Math.abs(minAngle - def.angle).toFixed(2))
            });
          }
        }
      }
    }

    return { planets, aspects, houseCusps };
  }
</script>

{#if filteredPlanetInterpretations.length || filteredAspectInterpretations.length || filteredSignInterpretations.length}
  <section class="mt-8 space-y-6">
    <h2 class="text-2xl font-bold text-gray-800">Interpretations</h2>

    {#if filteredPlanetInterpretations.length}
      <div class="space-y-4">
        <h3 class="text-xl font-semibold text-gray-700">Planets in Signs & Houses</h3>
        {#each filteredPlanetInterpretations as interpretation, i}
          <div class="border rounded-lg p-6 bg-white shadow-sm" class:mt-2={i !== 0}>
            <div class="space-y-4">
              <!-- Header -->
              <div class="border-b pb-3">
                <h4 class="text-lg font-semibold text-gray-900">{interpretation.title}</h4>
                <p class="text-sm text-gray-600 mt-1">{interpretation.position}</p>
              </div>

              <!-- Description -->
              <div>
                <p class="text-gray-700 leading-relaxed">{interpretation.description}</p>
              </div>

              <!-- Themes -->
              {#if interpretation.themes && interpretation.themes.length > 0}
                <div>
                  <h5 class="font-medium text-gray-900 mb-2">Themes</h5>
                  <div class="flex flex-wrap gap-1">
                    {#each interpretation.themes as theme}
                      <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{theme}</span>
                    {/each}
                  </div>
                </div>
              {/if}

              <!-- Strengths and Challenges -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#if interpretation.strengths && interpretation.strengths.length > 0}
                  <div class="bg-green-50 rounded-lg p-4">
                    <h5 class="font-semibold text-green-800 mb-2 text-sm">Strengths</h5>
                    <ul class="text-sm text-green-700 space-y-1">
                      {#each interpretation.strengths as strength}
                        <li class="flex items-start gap-2">
                          <span class="text-green-600 mt-1">•</span>
                          <span>{strength}</span>
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}

                {#if interpretation.challenges && interpretation.challenges.length > 0}
                  <div class="bg-orange-50 rounded-lg p-4">
                    <h5 class="font-semibold text-orange-800 mb-2 text-sm">Challenges</h5>
                    <ul class="text-sm text-orange-700 space-y-1">
                      {#each interpretation.challenges as challenge}
                        <li class="flex items-start gap-2">
                          <span class="text-orange-600 mt-1">•</span>
                          <span>{challenge}</span>
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    {#if filteredAspectInterpretations.length}
      <div class="space-y-4">
        <h3 class="text-xl font-semibold text-gray-700">Aspects</h3>
        {#each filteredAspectInterpretations as interpretation, i}
          <div class="border rounded-lg p-6 bg-white shadow-sm" class:mt-2={i !== 0}>
            <div class="space-y-4">
              <!-- Header -->
              <div class="border-b pb-3">
                <h4 class="text-lg font-semibold text-gray-900">{interpretation.title}</h4>
                <div class="flex gap-2 mt-2">
                  <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Orb: {interpretation.orb}</span>
                  <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{interpretation.nature}</span>
                </div>
              </div>

              <!-- Description -->
              <div>
                <p class="text-gray-700 leading-relaxed">{interpretation.description}</p>
              </div>

              {#if interpretation.general}
                <div class="bg-blue-50 rounded-lg p-4">
                  <h5 class="font-medium text-blue-900 mb-2">General Interpretation</h5>
                  <p class="text-sm text-blue-800">{interpretation.general}</p>
                </div>
              {/if}

              {#if interpretation.specific}
                <div class="bg-purple-50 rounded-lg p-4">
                  <h5 class="font-medium text-purple-900 mb-2">Specific Meaning</h5>
                  <p class="text-sm text-purple-800">{interpretation.specific}</p>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}

    {#if filteredSignInterpretations.length}
      <div class="space-y-4">
        <h3 class="text-xl font-semibold text-gray-700">Signs in Houses</h3>
        {#each filteredSignInterpretations as interpretation, i}
          <div class="border rounded-lg p-6 bg-white shadow-sm" class:mt-2={i !== 0}>
            <div class="space-y-4">
              <!-- Header -->
              <div class="border-b pb-3">
                <h4 class="text-lg font-semibold text-gray-900">{interpretation.title}</h4>
              </div>

              <!-- Description -->
              <div>
                <p class="text-gray-700 leading-relaxed">{interpretation.description}</p>
              </div>

              <!-- House Information -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h5 class="font-medium text-gray-900 mb-2">House {interpretation.title.split(' ').pop()} represents</h5>
                <p class="text-sm text-gray-700">{interpretation.houseGeneral}</p>
              </div>

              <!-- Themes -->
              {#if interpretation.themes && interpretation.themes.length > 0}
                <div>
                  <h5 class="font-medium text-gray-900 mb-2">Themes</h5>
                  <div class="flex flex-wrap gap-1">
                    {#each interpretation.themes as theme}
                      <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{theme}</span>
                    {/each}
                  </div>
                </div>
              {/if}

              <!-- Strengths and Challenges -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#if interpretation.strengths && interpretation.strengths.length > 0}
                  <div class="bg-green-50 rounded-lg p-4">
                    <h5 class="font-semibold text-green-800 mb-2 text-sm">Strengths</h5>
                    <ul class="text-sm text-green-700 space-y-1">
                      {#each interpretation.strengths as strength}
                        <li class="flex items-start gap-2">
                          <span class="text-green-600 mt-1">•</span>
                          <span>{strength}</span>
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}

                {#if interpretation.challenges && interpretation.challenges.length > 0}
                  <div class="bg-orange-50 rounded-lg p-4">
                    <h5 class="font-semibold text-orange-800 mb-2 text-sm">Challenges</h5>
                    <ul class="text-sm text-orange-700 space-y-1">
                      {#each interpretation.challenges as challenge}
                        <li class="flex items-start gap-2">
                          <span class="text-orange-600 mt-1">•</span>
                          <span>{challenge}</span>
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
{/if} 