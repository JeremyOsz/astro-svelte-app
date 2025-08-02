<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Accordion from '$lib/components/ui/accordion';
  import { Badge } from '$lib/components/ui/badge';
  import { Heart, Zap, AlertTriangle, Info } from 'lucide-svelte';
  import { 
    getSynastryAspectInterpretation, 
    getSynastryHouseOverlay, 
    getSynastryPlanetInSign,
    getSynastryCompatibilitySummary,
    type SynastryAspectInterpretation 
  } from '$lib/data/interpretations/index';

  export let aspects: Array<{
    person1Planet: string;
    person2Planet: string;
    aspect: string;
    orb: number;
  }> = [];

  export let mainAspects: Array<{
    person1Planet: string;
    person2Planet: string;
    aspect: string;
    orb: number;
  }> = [];

  export let angularAspects: Array<{
    person1Planet: string;
    person2Planet: string;
    aspect: string;
    orb: number;
  }> = [];

  export let minorAspects: Array<{
    person1Planet: string;
    person2Planet: string;
    aspect: string;
    orb: number;
  }> = [];

  export let houseOverlays: Array<{
    person2Planet: string;
    person1House: number;
  }> = [];

  export let planetInSigns: Array<{
    person2Planet: string;
    person1Sign: string;
  }> = [];

  export let relationshipType: 'romance' | 'friendship' | 'family' | 'business' = 'romance';
  export let person1Name: string = 'Person 1';
  export let person2Name: string = 'Person 2';

  // Process aspects to get interpretations
  $: synastryAspects = aspects.map(aspect => {
    const interpretation = getSynastryAspectInterpretation(
      aspect.aspect, 
      aspect.person1Planet, 
      aspect.person2Planet,
      relationshipType
    );
    return {
      ...aspect,
      interpretation: interpretation?.interpretation || '',
      compatibility: interpretation?.compatibility || 'neutral',
      intensity: interpretation?.intensity || 'moderate'
    };
  });

  // Process main aspects
  $: synastryMainAspects = mainAspects.map(aspect => {
    const interpretation = getSynastryAspectInterpretation(
      aspect.aspect, 
      aspect.person1Planet, 
      aspect.person2Planet,
      relationshipType
    );
    return {
      ...aspect,
      interpretation: interpretation?.interpretation || '',
      compatibility: interpretation?.compatibility || 'neutral',
      intensity: interpretation?.intensity || 'moderate'
    };
  });

  // Process angular aspects
  $: synastryAngularAspects = angularAspects.map(aspect => {
    const interpretation = getSynastryAspectInterpretation(
      aspect.aspect, 
      aspect.person1Planet, 
      aspect.person2Planet,
      relationshipType
    );
    return {
      ...aspect,
      interpretation: interpretation?.interpretation || '',
      compatibility: interpretation?.compatibility || 'neutral',
      intensity: interpretation?.intensity || 'moderate'
    };
  });

  // Process minor aspects
  $: synastryMinorAspects = minorAspects.map(aspect => {
    const interpretation = getSynastryAspectInterpretation(
      aspect.aspect, 
      aspect.person1Planet, 
      aspect.person2Planet,
      relationshipType
    );
    return {
      ...aspect,
      interpretation: interpretation?.interpretation || '',
      compatibility: interpretation?.compatibility || 'neutral',
      intensity: interpretation?.intensity || 'moderate'
    };
  });

  // Process house overlays
  $: synastryHouseOverlays = houseOverlays.map(overlay => {
    const interpretation = getSynastryHouseOverlay(overlay.person2Planet, overlay.person1House);
    return {
      ...overlay,
      interpretation
    };
  });

  // Process planet in sign placements
  $: synastryPlanetInSigns = planetInSigns.map(placement => {
    const interpretation = getSynastryPlanetInSign(placement.person2Planet, placement.person1Sign);
    return {
      ...placement,
      interpretation
    };
  });

  // Calculate compatibility summary
  $: compatibilitySummary = getSynastryCompatibilitySummary(synastryAspects as SynastryAspectInterpretation[]);

  // Get key aspects (most important for synastry)
  $: keyAspects = synastryAspects.filter(aspect => {
    const isKeyAspect = [
      'Sun_Moon', 'Moon_Sun', 'Venus_Mars', 'Mars_Venus',
      'Sun_Venus', 'Venus_Sun', 'Moon_Venus', 'Venus_Moon',
      'Saturn_Venus', 'Venus_Saturn', 'Jupiter_Venus', 'Venus_Jupiter'
    ].includes(`${aspect.person1Planet}_${aspect.person2Planet}`);
    
    return isKeyAspect && aspect.intensity === 'strong';
  });

  // Relationship dynamics
  function makeDynamicsPhrase(a: any) {
    const pair = `${person1Name}'s ${a.person1Planet}–${person2Name}'s ${a.person2Planet}`;
    switch (a.compatibility) {
      case 'harmonious':
        return `${pair} ${a.aspect.toLowerCase()} fosters ${a.interpretation.toLowerCase()}`;
      case 'challenging':
        return `${pair} ${a.aspect.toLowerCase()} can create tension – ${a.interpretation.toLowerCase()}`;
      default:
        return `${pair} ${a.aspect.toLowerCase()} adds neutral energy.`;
    }
  }

  function colorCodePlanets(text: string): string {
    // Replace planet names with colored spans
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Asc', 'MC', 'Chiron', 'Lilith', 'Node', 'Vertex', 'Fortune'];
    
    let coloredText = text;
    planets.forEach(planet => {
      const regex = new RegExp(`(${person1Name}'s|${person2Name}'s) (${planet})`, 'g');
      coloredText = coloredText.replace(regex, `$1 <span class="${getPlanetColor(planet)}">$2</span>`);
    });
    
    return coloredText;
  }

  $: relationshipStrengths = synastryAspects.filter(a=>a.compatibility==='harmonious').map(makeDynamicsPhrase);
  $: relationshipChallenges = synastryAspects.filter(a=>a.compatibility==='challenging').map(makeDynamicsPhrase);

  function getCompatibilityColor(compatibility: string): string {
    switch (compatibility) {
      case 'harmonious': return 'bg-green-100 text-green-800 border-green-200';
      case 'challenging': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  function getIntensityColor(intensity: string): string {
    switch (intensity) {
      case 'strong': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'moderate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'weak': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  function getCompatibilityIcon(compatibility: string) {
    switch (compatibility) {
      case 'harmonious': return Heart;
      case 'challenging': return AlertTriangle;
      case 'neutral': return Info;
      default: return Info;
    }
  }

  function getOrdinalSuffix(num: number): string {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) {
      return num + "st";
    }
    if (j === 2 && k !== 12) {
      return num + "nd";
    }
    if (j === 3 && k !== 13) {
      return num + "rd";
    }
    return num + "th";
  }

  function getPlanetColor(planet: string): string {
    const planetColors: Record<string, string> = {
      'Sun': 'text-orange-600',
      'Moon': 'text-blue-600',
      'Mercury': 'text-green-600',
      'Venus': 'text-pink-600',
      'Mars': 'text-red-600',
      'Jupiter': 'text-purple-600',
      'Saturn': 'text-gray-600',
      'Uranus': 'text-cyan-600',
      'Neptune': 'text-indigo-600',
      'Pluto': 'text-black',
      'Asc': 'text-teal-600',
      'MC': 'text-amber-600',
      'Chiron': 'text-emerald-600',
      'Lilith': 'text-rose-600',
      'Node': 'text-violet-600',
      'Vertex': 'text-slate-600',
      'Fortune': 'text-yellow-600'
    };
    return planetColors[planet] || 'text-gray-600';
  }
</script>

<Accordion.Root type="multiple" value={['compatibility', 'dynamics', 'key-aspects', 'house-overlays', 'main-aspects', 'angular-aspects', 'minor-aspects']} class="space-y-4">
  <!-- Compatibility Summary -->
  <Accordion.Item value="compatibility">
    <Accordion.Trigger class="flex items-center justify-between w-full py-4 text-lg font-semibold text-gray-900">
      <span class="flex items-center gap-2">
        <Heart class="h-5 w-5" />
        Relationship Compatibility
      </span>
    </Accordion.Trigger>
    <Accordion.Content>
      <Card.Root>
        <Card.Content>
          <p class="text-gray-700 mb-4">{compatibilitySummary}</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">
                {synastryAspects.filter(a => a.compatibility === 'harmonious').length}
              </div>
              <div class="text-green-700">Harmonious Aspects</div>
            </div>
            <div class="text-center p-3 bg-red-50 rounded-lg">
              <div class="text-2xl font-bold text-red-600">
                {synastryAspects.filter(a => a.compatibility === 'challenging').length}
              </div>
              <div class="text-red-700">Challenging Aspects</div>
            </div>
            <div class="text-center p-3 bg-yellow-50 rounded-lg">
              <div class="text-2xl font-bold text-yellow-600">
                {synastryAspects.filter(a => a.compatibility === 'neutral').length}
              </div>
              <div class="text-yellow-700">Neutral Aspects</div>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    </Accordion.Content>
  </Accordion.Item>

  <!-- Relationship Dynamics -->
  <Accordion.Item value="dynamics">
    <Accordion.Trigger class="flex items-center justify-between w-full py-4 text-lg font-semibold text-gray-900">
      <span class="flex items-center gap-2">
        <Info class="h-5 w-5" />
        Relationship Dynamics
      </span>
    </Accordion.Trigger>
    <Accordion.Content>
      <Card.Root>
        <Card.Content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-semibold mb-2 text-green-700 flex items-center gap-1"><Heart class="h-4 w-4"/>Strengths</h4>
              {#if relationshipStrengths.length}
                <ul class="list-disc list-inside space-y-1 text-sm">
                  {#each relationshipStrengths as s}
                    <li>{@html colorCodePlanets(s)}</li>
                  {/each}
                </ul>
              {:else}
                <p class="text-sm text-gray-500 italic">No major harmonious dynamics detected.</p>
              {/if}
            </div>
            <div>
              <h4 class="font-semibold mb-2 text-red-700 flex items-center gap-1"><AlertTriangle class="h-4 w-4"/>Challenges</h4>
              {#if relationshipChallenges.length}
                <ul class="list-disc list-inside space-y-1 text-sm">
                  {#each relationshipChallenges as c}
                    <li>{@html colorCodePlanets(c)}</li>
                  {/each}
                </ul>
              {:else}
                <p class="text-sm text-gray-500 italic">No major challenging dynamics detected.</p>
              {/if}
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    </Accordion.Content>
  </Accordion.Item>

  <!-- Key Aspects -->
  {#if keyAspects.length > 0}
    <Accordion.Item value="key-aspects">
      <Accordion.Trigger class="flex items-center justify-between w-full py-4 text-lg font-semibold text-gray-900">
        <span class="flex items-center gap-2">
          <Zap class="h-5 w-5" />
          Key Relationship Aspects
        </span>
      </Accordion.Trigger>
      <Accordion.Content>
        <Card.Root>
          <Card.Content>
            <div class="space-y-4">
              {#each keyAspects as aspect}
                <div class="border rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                                      <h4 class="font-semibold">
                    {person1Name}'s <span class={getPlanetColor(aspect.person1Planet)}>{aspect.person1Planet}</span> - {person2Name}'s <span class={getPlanetColor(aspect.person2Planet)}>{aspect.person2Planet}</span> {aspect.aspect}
                  </h4>
                    <div class="flex gap-2">
                      <Badge class={getCompatibilityColor(aspect.compatibility)}>
                        <svelte:component this={getCompatibilityIcon(aspect.compatibility)} class="h-3 w-3 mr-1" />
                        {aspect.compatibility}
                      </Badge>
                      <Badge class={getIntensityColor(aspect.intensity)}>
                        {aspect.intensity}
                      </Badge>
                    </div>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">
                    Orb: {aspect.orb.toFixed(1)}°
                  </p>
                  {#if aspect.interpretation}
                    <p class="text-gray-700">{aspect.interpretation}</p>
                  {:else}
                    <p class="text-gray-500 italic">This aspect creates a dynamic interaction between your charts.</p>
                  {/if}
                </div>
              {/each}
            </div>
          </Card.Content>
        </Card.Root>
      </Accordion.Content>
    </Accordion.Item>
  {/if}

  <!-- House Overlays -->
  {#if synastryHouseOverlays.length > 0}
    <Accordion.Item value="house-overlays">
      <Accordion.Trigger class="flex items-center justify-between w-full py-4 text-lg font-semibold text-gray-900">
        <span>House Influences</span>
      </Accordion.Trigger>
      <Accordion.Content>
        <Card.Root>
          <Card.Content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#each synastryHouseOverlays as overlay}
                <div class="border rounded-lg p-3">
                  <h4 class="font-semibold mb-2">
                    {person2Name}'s <span class={getPlanetColor(overlay.person2Planet)}>{overlay.person2Planet}</span> in {person1Name}'s {getOrdinalSuffix(overlay.person1House)} House
                  </h4>
                  {#if overlay.interpretation}
                    <p class="text-sm text-gray-700">{overlay.interpretation.interpretation}</p>
                    {#if overlay.interpretation.themes.length > 0}
                      <div class="flex flex-wrap gap-1 mt-2">
                        {#each overlay.interpretation.themes as theme}
                          <Badge variant="secondary" class="text-xs">{theme}</Badge>
                        {/each}
                      </div>
                    {/if}
                  {:else}
                    <p class="text-sm text-gray-500 italic">
                      This planet influences your {getOrdinalSuffix(overlay.person1House)} house area of life.
                    </p>
                  {/if}
                </div>
              {/each}
            </div>
          </Card.Content>
        </Card.Root>
      </Accordion.Content>
    </Accordion.Item>
  {/if}

  <!-- Main Aspects -->
  {#if synastryMainAspects.length > 0}
    <Accordion.Item value="main-aspects">
      <Accordion.Trigger class="flex items-center justify-between w-full py-4 text-lg font-semibold text-gray-900">
        <span>Main Planetary Aspects</span>
      </Accordion.Trigger>
      <Accordion.Content>
        <Card.Root>
          <Card.Content>
            <div class="space-y-3">
              {#each synastryMainAspects as aspect}
                <div class="p-3 border rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex-1">
                      <div class="font-medium">
                        {person1Name}'s <span class={getPlanetColor(aspect.person1Planet)}>{aspect.person1Planet}</span> - {person2Name}'s <span class={getPlanetColor(aspect.person2Planet)}>{aspect.person2Planet}</span> {aspect.aspect}
                      </div>
                      <div class="text-sm text-gray-500">
                        Orb: {aspect.orb.toFixed(1)}°
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <Badge class={getCompatibilityColor(aspect.compatibility)}>
                        {aspect.compatibility}
                      </Badge>
                      <Badge class={getIntensityColor(aspect.intensity)}>
                        {aspect.intensity}
                      </Badge>
                    </div>
                  </div>
                  {#if aspect.interpretation}
                    <p class="text-gray-700 text-sm leading-relaxed">{aspect.interpretation}</p>
                  {:else}
                    <p class="text-gray-500 italic text-sm">This aspect creates a dynamic interaction between your charts.</p>
                  {/if}
                </div>
              {/each}
            </div>
          </Card.Content>
        </Card.Root>
      </Accordion.Content>
    </Accordion.Item>
  {/if}

  <!-- Angular Aspects -->
  {#if synastryAngularAspects.length > 0}
    <Accordion.Item value="angular-aspects">
      <Accordion.Trigger class="flex items-center justify-between w-full py-4 text-lg font-semibold text-gray-900">
        <span>Angular Aspects</span>
      </Accordion.Trigger>
      <Accordion.Content>
        <Card.Root>
          <Card.Content>
            <div class="space-y-3">
              {#each synastryAngularAspects as aspect}
                <div class="p-3 border rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex-1">
                      <div class="font-medium">
                        {person1Name}'s <span class={getPlanetColor(aspect.person1Planet)}>{aspect.person1Planet}</span> - {person2Name}'s <span class={getPlanetColor(aspect.person2Planet)}>{aspect.person2Planet}</span> {aspect.aspect}
                      </div>
                      <div class="text-sm text-gray-500">
                        Orb: {aspect.orb.toFixed(1)}°
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <Badge class={getCompatibilityColor(aspect.compatibility)}>
                        {aspect.compatibility}
                      </Badge>
                      <Badge class={getIntensityColor(aspect.intensity)}>
                        {aspect.intensity}
                      </Badge>
                    </div>
                  </div>
                  {#if aspect.interpretation}
                    <p class="text-gray-700 text-sm leading-relaxed">{aspect.interpretation}</p>
                  {:else}
                    <p class="text-gray-500 italic text-sm">This aspect creates a dynamic interaction between your charts.</p>
                  {/if}
                </div>
              {/each}
            </div>
          </Card.Content>
        </Card.Root>
      </Accordion.Content>
    </Accordion.Item>
  {/if}

  <!-- Minor Aspects -->
  {#if synastryMinorAspects.length > 0}
    <Accordion.Item value="minor-aspects">
      <Accordion.Trigger class="flex items-center justify-between w-full py-4 text-lg font-semibold text-gray-900">
        <span>Minor Aspects</span>
      </Accordion.Trigger>
      <Accordion.Content>
        <Card.Root>
          <Card.Content>
            <div class="space-y-3">
              {#each synastryMinorAspects as aspect}
                <div class="p-3 border rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex-1">
                      <div class="font-medium">
                        {person1Name}'s <span class={getPlanetColor(aspect.person1Planet)}>{aspect.person1Planet}</span> - {person2Name}'s <span class={getPlanetColor(aspect.person2Planet)}>{aspect.person2Planet}</span> {aspect.aspect}
                      </div>
                      <div class="text-sm text-gray-500">
                        Orb: {aspect.orb.toFixed(1)}°
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <Badge class={getCompatibilityColor(aspect.compatibility)}>
                        {aspect.compatibility}
                      </Badge>
                      <Badge class={getIntensityColor(aspect.intensity)}>
                        {aspect.intensity}
                      </Badge>
                    </div>
                  </div>
                  {#if aspect.interpretation}
                    <p class="text-gray-700 text-sm leading-relaxed">{aspect.interpretation}</p>
                  {:else}
                    <p class="text-gray-500 italic text-sm">This aspect creates a dynamic interaction between your charts.</p>
                  {/if}
                </div>
              {/each}
            </div>
          </Card.Content>
        </Card.Root>
      </Accordion.Content>
    </Accordion.Item>
  {/if}
</Accordion.Root>
