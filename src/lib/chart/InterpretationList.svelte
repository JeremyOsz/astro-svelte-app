<script lang="ts">
  import { chartStore } from '$lib/stores/chart-store';
  import { get } from 'svelte/store';
  import { getPlanetInterpretation, getAspectInterpretation, getSignInterpretation } from './tooltip';
  import { onMount } from 'svelte';

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
    ? planetInterpretations.filter((html) => html.toLowerCase().includes(normalizedFilter))
    : planetInterpretations;

  $: filteredAspectInterpretations = normalizedFilter
    ? aspectInterpretations.filter((html) => html.toLowerCase().includes(normalizedFilter))
    : aspectInterpretations;

  $: filteredSignInterpretations = normalizedFilter
    ? signInterpretations.filter((html) => html.toLowerCase().includes(normalizedFilter))
    : signInterpretations;

  let planetInterpretations: string[] = [];
  let aspectInterpretations: string[] = [];
  let signInterpretations: string[] = [];

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

    planetInterpretations = planets.map(p => getPlanetInterpretation(p));
    aspectInterpretations = aspects.map(a =>
      getAspectInterpretation(a.aspect, a.planet1, a.planet2, a.orb)
    );

    // Generate sign interpretations based on house cusps
    signInterpretations = houseCusps.map(({ sign, house }) =>
      getSignInterpretation(sign, house)
    );
    console.log('InterpretationList: Generated interpretations:', { 
      planets: planetInterpretations.length, 
      aspects: aspectInterpretations.length, 
      signs: signInterpretations.length 
    });
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
        {#each filteredPlanetInterpretations as html, i}
          <div class="border rounded-md p-4 bg-white shadow-sm" class:mt-2={i !== 0}>
            {@html html}
          </div>
        {/each}
      </div>
    {/if}

    {#if filteredAspectInterpretations.length}
      <div class="space-y-4">
        <h3 class="text-xl font-semibold text-gray-700">Aspects</h3>
        {#each filteredAspectInterpretations as html, i}
          <div class="border rounded-md p-4 bg-white shadow-sm" class:mt-2={i !== 0}>
            {@html html}
          </div>
        {/each}
      </div>
    {/if}

    {#if filteredSignInterpretations.length}
      <div class="space-y-4">
        <h3 class="text-xl font-semibold text-gray-700">Signs in Houses</h3>
        {#each filteredSignInterpretations as html, i}
          <div class="border rounded-md p-4 bg-white shadow-sm" class:mt-2={i !== 0}>
            {@html html}
          </div>
        {/each}
      </div>
    {/if}
  </section>
{/if} 