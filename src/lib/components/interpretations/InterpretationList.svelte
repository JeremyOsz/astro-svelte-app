<script lang="ts">
  import { chartStore } from '$lib/stores/chart-store';
  import { get } from 'svelte/store';
  import { getPlanetInterpretation, getAspectInterpretation, getSignInterpretation } from '../tooltips/chart-tooltip';
  import { onMount } from 'svelte';
  import { PLANET_CHARACTERISTICS, SIGN_CHARACTERISTICS } from '$lib/data/astrological-data';
  import { 
    PLANET_INTERPRETATIONS, 
    PLANET_IN_SIGN_INTERPRETATIONS, 
    SIGN_IN_HOUSE_INTERPRETATIONS, 
    ASPECT_INTERPRETATIONS, 
    HOUSES,
    getDetailedAspectInterpretation 
  } from '$lib/data/interpretations/index';

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
    if (!chartData || !chartData.trim()) {
      planetInterpretations = [];
      aspectInterpretations = [];
      signInterpretations = [];
      return;
    }

    const { planets, aspects, houseCusps } = parseChartData(chartData.trim());

    planetInterpretations = planets.map(p => getEnhancedPlanetInterpretation(p));
    aspectInterpretations = aspects.map(a => getEnhancedAspectInterpretation(a));
    signInterpretations = houseCusps.map(({ sign, house }) => getEnhancedSignInterpretation(sign, house));
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
  <section class="interpretation-list mt-8 space-y-6 text-[15px]">
    <h2 class="text-2xl font-bold text-foreground">Interpretations</h2>

    {#if filteredPlanetInterpretations.length}
      <div class="space-y-4">
        <h3 class="text-xl font-semibold text-foreground">Planets in Signs & Houses</h3>
        {#each filteredPlanetInterpretations as interpretation, i}
          <div class="interpretation-card border border-border rounded-lg p-6 bg-card shadow-sm" class:mt-2={i !== 0}>
            <div class="space-y-4">
              <!-- Header -->
              <div class="border-b border-border pb-3">
                <h4 class="text-lg font-semibold text-foreground">{interpretation.title}</h4>
                <p class="text-sm text-muted-foreground mt-1">{interpretation.position}</p>
              </div>

              <!-- Description -->
              <div>
                <p class="text-foreground leading-7">{interpretation.description}</p>
              </div>

              <!-- Themes -->
              {#if interpretation.themes && interpretation.themes.length > 0}
                <div>
                  <h5 class="font-medium text-foreground mb-2">Themes</h5>
                  <div class="flex flex-wrap gap-1">
                    {#each interpretation.themes as theme}
                      <span class="theme-chip px-2 py-1 text-xs rounded-full">{theme}</span>
                    {/each}
                  </div>
                </div>
              {/if}

              <!-- Strengths and Challenges -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#if interpretation.strengths && interpretation.strengths.length > 0}
                  <div class="strength-box rounded-lg p-4">
                    <h5 class="font-semibold strength-heading mb-2">Strengths</h5>
                    <ul class="strength-copy space-y-1.5 leading-6">
                      {#each interpretation.strengths as strength}
                        <li class="flex items-start gap-2">
                          <span class="strength-bullet mt-1">•</span>
                          <span>{strength}</span>
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}

                {#if interpretation.challenges && interpretation.challenges.length > 0}
                  <div class="challenge-box rounded-lg p-4">
                    <h5 class="font-semibold challenge-heading mb-2">Challenges</h5>
                    <ul class="challenge-copy space-y-1.5 leading-6">
                      {#each interpretation.challenges as challenge}
                        <li class="flex items-start gap-2">
                          <span class="challenge-bullet mt-1">•</span>
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
        <h3 class="text-xl font-semibold text-foreground">Aspects</h3>
        {#each filteredAspectInterpretations as interpretation, i}
          <div class="interpretation-card border border-border rounded-lg p-6 bg-card shadow-sm" class:mt-2={i !== 0}>
            <div class="space-y-4">
              <!-- Header -->
              <div class="border-b border-border pb-3">
                <h4 class="text-lg font-semibold text-foreground">{interpretation.title}</h4>
                <div class="flex gap-2 mt-2">
                  <span class="meta-chip px-2 py-1 text-xs rounded-full">Orb: {interpretation.orb}</span>
                  <span class="meta-chip px-2 py-1 text-xs rounded-full">{interpretation.nature}</span>
                </div>
              </div>

              <!-- Description -->
              <div>
                <p class="text-foreground leading-7">{interpretation.description}</p>
              </div>

              {#if interpretation.general}
                <div class="info-box rounded-lg p-4">
                  <h5 class="font-medium info-heading mb-2">General Interpretation</h5>
                  <p class="info-copy leading-7">{interpretation.general}</p>
                </div>
              {/if}

              {#if interpretation.specific}
                <div class="specific-box rounded-lg p-4">
                  <h5 class="font-medium specific-heading mb-2">Specific Meaning</h5>
                  <p class="specific-copy leading-7">{interpretation.specific}</p>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}

    {#if filteredSignInterpretations.length}
      <div class="space-y-4">
        <h3 class="text-xl font-semibold text-foreground">Signs in Houses</h3>
        {#each filteredSignInterpretations as interpretation, i}
          <div class="interpretation-card border border-border rounded-lg p-6 bg-card shadow-sm" class:mt-2={i !== 0}>
            <div class="space-y-4">
              <!-- Header -->
              <div class="border-b border-border pb-3">
                <h4 class="text-lg font-semibold text-foreground">{interpretation.title}</h4>
              </div>

              <!-- Description -->
              <div>
                <p class="text-foreground leading-7">{interpretation.description}</p>
              </div>

              <!-- House Information -->
              <div class="house-box rounded-lg p-4">
                <h5 class="font-medium text-foreground mb-2">House {interpretation.title.split(' ').pop()} represents</h5>
                <p class="text-muted-foreground leading-6">{interpretation.houseGeneral}</p>
              </div>

              <!-- Themes -->
              {#if interpretation.themes && interpretation.themes.length > 0}
                <div>
                  <h5 class="font-medium text-foreground mb-2">Themes</h5>
                  <div class="flex flex-wrap gap-1">
                    {#each interpretation.themes as theme}
                      <span class="theme-chip px-2 py-1 text-xs rounded-full">{theme}</span>
                    {/each}
                  </div>
                </div>
              {/if}

              <!-- Strengths and Challenges -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#if interpretation.strengths && interpretation.strengths.length > 0}
                  <div class="strength-box rounded-lg p-4">
                    <h5 class="font-semibold strength-heading mb-2">Strengths</h5>
                    <ul class="strength-copy space-y-1.5 leading-6">
                      {#each interpretation.strengths as strength}
                        <li class="flex items-start gap-2">
                          <span class="strength-bullet mt-1">•</span>
                          <span>{strength}</span>
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}

                {#if interpretation.challenges && interpretation.challenges.length > 0}
                  <div class="challenge-box rounded-lg p-4">
                    <h5 class="font-semibold challenge-heading mb-2">Challenges</h5>
                    <ul class="challenge-copy space-y-1.5 leading-6">
                      {#each interpretation.challenges as challenge}
                        <li class="flex items-start gap-2">
                          <span class="challenge-bullet mt-1">•</span>
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

<style>
  .interpretation-card {
    border-color: color-mix(in oklch, var(--color-border) 92%, var(--color-foreground));
    background: color-mix(in oklch, var(--color-card) 88%, var(--color-background));
  }

  .theme-chip {
    background: color-mix(in oklch, var(--color-primary) 18%, var(--color-card));
    color: var(--color-foreground);
    border: 1px solid color-mix(in oklch, var(--color-primary) 28%, var(--color-border));
    font-weight: 600;
  }

  .meta-chip {
    background: color-mix(in oklch, var(--color-muted) 75%, var(--color-card));
    color: var(--color-foreground);
    border: 1px solid color-mix(in oklch, var(--color-border) 88%, var(--color-foreground));
    font-weight: 600;
  }

  .house-box {
    background: color-mix(in oklch, var(--color-muted) 85%, var(--color-card));
    border: 1px solid color-mix(in oklch, var(--color-border) 88%, var(--color-foreground));
  }

  .info-box {
    background: color-mix(in oklch, var(--color-accent) 14%, var(--color-card));
    border: 1px solid color-mix(in oklch, var(--color-accent) 35%, var(--color-border));
  }

  .info-heading,
  .info-copy {
    color: color-mix(in oklch, var(--color-foreground) 90%, white);
  }

  .specific-box {
    background: color-mix(in oklch, var(--color-primary) 16%, var(--color-card));
    border: 1px solid color-mix(in oklch, var(--color-primary) 35%, var(--color-border));
  }

  .specific-heading,
  .specific-copy {
    color: var(--color-foreground);
  }

  .strength-box {
    background: color-mix(in oklch, var(--color-muted) 86%, var(--color-card));
    border: 1px solid color-mix(in oklch, #22c55e 36%, var(--color-border));
    box-shadow: inset 3px 0 0 0 color-mix(in oklch, #22c55e 58%, transparent);
  }

  .strength-heading,
  .strength-copy,
  .strength-bullet {
    color: var(--color-foreground);
  }

  .strength-heading {
    color: color-mix(in oklch, #22c55e 42%, var(--color-foreground));
  }

  .challenge-box {
    background: color-mix(in oklch, var(--color-muted) 86%, var(--color-card));
    border: 1px solid color-mix(in oklch, #f97316 36%, var(--color-border));
    box-shadow: inset 3px 0 0 0 color-mix(in oklch, #f97316 58%, transparent);
  }

  .challenge-heading,
  .challenge-copy,
  .challenge-bullet {
    color: var(--color-foreground);
  }

  .challenge-heading {
    color: color-mix(in oklch, #f97316 45%, var(--color-foreground));
  }
</style>
