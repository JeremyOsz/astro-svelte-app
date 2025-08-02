<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Accordion from '$lib/components/ui/accordion';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Heart, Zap, AlertTriangle, Info, Search, Filter } from 'lucide-svelte';
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
    strength?: 'strong' | 'moderate' | 'weak';
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

  // Search and filter state
  let searchTerm = '';
  let selectedCompatibility: 'all' | 'harmonious' | 'challenging' | 'neutral' = 'all';
  let selectedIntensity: 'all' | 'strong' | 'moderate' | 'weak' = 'all';
  let selectedAspect: 'all' | 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' = 'all';
  let sortBy: 'strength' | 'orb' | 'compatibility' = 'strength';

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
      intensity: aspect.strength || interpretation?.intensity || 'moderate'
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

  // Filtered aspects based on search and filters
  $: filteredAspects = synastryAspects.filter(aspect => {
    const matchesSearch = searchTerm === '' || 
      aspect.person1Planet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aspect.person2Planet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aspect.aspect.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aspect.interpretation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompatibility = selectedCompatibility === 'all' || aspect.compatibility === selectedCompatibility;
    const matchesIntensity = selectedIntensity === 'all' || aspect.intensity === selectedIntensity;
    const matchesAspect = selectedAspect === 'all' || aspect.aspect.toLowerCase() === selectedAspect;
    
    return matchesSearch && matchesCompatibility && matchesIntensity && matchesAspect;
  }).sort((a, b) => {
    // Sort by selected criteria
    switch (sortBy) {
      case 'strength':
        const strengthOrder = { 'strong': 3, 'moderate': 2, 'weak': 1 };
        const aStrength = strengthOrder[a.intensity as keyof typeof strengthOrder] || 0;
        const bStrength = strengthOrder[b.intensity as keyof typeof strengthOrder] || 0;
        if (aStrength !== bStrength) return bStrength - aStrength;
        return a.orb - b.orb; // Then by orb (tightest first)
      
      case 'orb':
        return a.orb - b.orb; // Tightest orbs first
      
      case 'compatibility':
        const compatibilityOrder = { 'harmonious': 3, 'neutral': 2, 'challenging': 1 };
        const aCompat = compatibilityOrder[a.compatibility as keyof typeof compatibilityOrder] || 0;
        const bCompat = compatibilityOrder[b.compatibility as keyof typeof compatibilityOrder] || 0;
        if (aCompat !== bCompat) return bCompat - aCompat;
        return a.orb - b.orb; // Then by orb (tightest first)
      
      default:
        return 0;
    }
  });

  // Summary statistics
  $: harmoniousAspects = synastryAspects.filter(a => a.compatibility === 'harmonious');
  $: challengingAspects = synastryAspects.filter(a => a.compatibility === 'challenging');
  $: strongAspects = synastryAspects.filter(a => a.intensity === 'strong');
  $: moderateAspects = synastryAspects.filter(a => a.intensity === 'moderate');

  // Top harmonious and challenging aspects for summary
  $: topHarmonious = harmoniousAspects
    .sort((a, b) => b.intensity === 'strong' ? 1 : -1)
    .slice(0, 3);
  
  $: topChallenging = challengingAspects
    .sort((a, b) => b.intensity === 'strong' ? 1 : -1)
    .slice(0, 3);

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

  function clearFilters() {
    searchTerm = '';
    selectedCompatibility = 'all';
    selectedIntensity = 'all';
    selectedAspect = 'all';
    sortBy = 'strength';
  }
</script>


  <!-- Summary Section -->
  <div class="mb-6">
    <Card.Root>
      <Card.Header>
        <Card.Title class="flex items-center gap-2">
          <Zap class="h-5 w-5" />
          Synastry Summary
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div class="text-2xl font-bold text-green-600">{harmoniousAspects.length}</div>
            <div class="text-green-700 font-medium">Harmonious</div>
            <div class="text-xs text-green-600 mt-1">Strong: {harmoniousAspects.filter(a => a.intensity === 'strong').length}</div>
          </div>
          <div class="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div class="text-2xl font-bold text-red-600">{challengingAspects.length}</div>
            <div class="text-red-700 font-medium">Challenging</div>
            <div class="text-xs text-red-600 mt-1">Strong: {challengingAspects.filter(a => a.intensity === 'strong').length}</div>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div class="text-2xl font-bold text-purple-600">{strongAspects.length}</div>
            <div class="text-purple-700 font-medium">Strong Aspects</div>
            <div class="text-xs text-purple-600 mt-1">Most impactful</div>
          </div>
          <div class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-600">{synastryAspects.length}</div>
            <div class="text-blue-700 font-medium">Total Aspects</div>
            <div class="text-xs text-blue-600 mt-1">All interactions</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold mb-3 text-green-700 flex items-center gap-2">
              <Heart class="h-4 w-4" />
              Top Harmonious Aspects
            </h4>
            {#if topHarmonious.length}
              <div class="space-y-2">
                {#each topHarmonious as aspect}
                  <div class="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                    <span class="text-sm">
                      <span class={getPlanetColor(aspect.person1Planet)}>{aspect.person1Planet}</span> - 
                      <span class={getPlanetColor(aspect.person2Planet)}>{aspect.person2Planet}</span> 
                      <span class="text-green-600 font-medium">{aspect.aspect}</span>
                    </span>
                    <Badge class="bg-green-100 text-green-800 text-xs">{aspect.intensity}</Badge>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="text-sm text-gray-500 italic">No major harmonious aspects detected.</p>
            {/if}
          </div>
          
          <div>
            <h4 class="font-semibold mb-3 text-red-700 flex items-center gap-2">
              <AlertTriangle class="h-4 w-4" />
              Top Challenging Aspects
            </h4>
            {#if topChallenging.length}
              <div class="space-y-2">
                {#each topChallenging as aspect}
                  <div class="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                    <span class="text-sm">
                      <span class={getPlanetColor(aspect.person1Planet)}>{aspect.person1Planet}</span> - 
                      <span class={getPlanetColor(aspect.person2Planet)}>{aspect.person2Planet}</span> 
                      <span class="text-red-600 font-medium">{aspect.aspect}</span>
                    </span>
                    <Badge class="bg-red-100 text-red-800 text-xs">{aspect.intensity}</Badge>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="text-sm text-gray-500 italic">No major challenging aspects detected.</p>
            {/if}
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </div>

  <!-- Search and Filter Section -->
  <div class="mb-6">
    <Card.Root>
      <Card.Header>
        <Card.Title class="flex items-center gap-2">
          <Search class="h-5 w-5" />
          Search & Filter Aspects
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Label for="search">Search</Label>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                id="search"
                bind:value={searchTerm}
                placeholder="Search planets, aspects..."
                class="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Label for="compatibility">Compatibility</Label>
            <select 
              id="compatibility"
              bind:value={selectedCompatibility}
              class="w-full p-2 border rounded-md bg-white"
            >
              <option value="all">All Types</option>
              <option value="harmonious">Harmonious</option>
              <option value="challenging">Challenging</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
          
          <div>
            <Label for="intensity">Intensity</Label>
            <select 
              id="intensity"
              bind:value={selectedIntensity}
              class="w-full p-2 border rounded-md bg-white"
            >
              <option value="all">All Strengths</option>
              <option value="strong">Strong</option>
              <option value="moderate">Moderate</option>
              <option value="weak">Weak</option>
            </select>
          </div>
          
          <div>
            <Label for="aspect">Aspect Type</Label>
            <select 
              id="aspect"
              bind:value={selectedAspect}
              class="w-full p-2 border rounded-md bg-white"
            >
              <option value="all">All Aspects</option>
              <option value="conjunction">Conjunction</option>
              <option value="sextile">Sextile</option>
              <option value="square">Square</option>
              <option value="trine">Trine</option>
              <option value="opposition">Opposition</option>
            </select>
          </div>
          
          <div>
            <Label for="sort">Sort By</Label>
            <select 
              id="sort"
              bind:value={sortBy}
              class="w-full p-2 border rounded-md bg-white"
            >
              <option value="strength">Strength (Strong First)</option>
              <option value="orb">Orb (Tightest First)</option>
              <option value="compatibility">Compatibility</option>
            </select>
          </div>
        </div>
        
        <div class="flex items-center justify-between mt-4">
          <div class="text-sm text-gray-600">
            Showing {filteredAspects.length} of {synastryAspects.length} aspects
          </div>
          <button 
            on:click={clearFilters}
            class="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Clear Filters
          </button>
        </div>
      </Card.Content>
    </Card.Root>
  </div>

  <!-- Filtered Aspects Display -->
  {#if filteredAspects.length > 0}
    <div class="mb-6">
      <Card.Root>
        <Card.Header>
          <Card.Title class="flex items-center gap-2">
            <Filter class="h-5 w-5" />
            Filtered Aspects ({filteredAspects.length})
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <Accordion.Root type="multiple" value={['main-aspects', 'angular-aspects', 'minor-aspects']} class="space-y-4">
            <!-- Main Aspects -->
            {#if filteredAspects.filter(a => ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(a.person1Planet) && ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(a.person2Planet)).length > 0}
              <Accordion.Item value="main-aspects">
                <Accordion.Trigger class="flex items-center justify-between w-full py-4 text-lg font-semibold text-gray-900">
                  <span class="flex items-center gap-2">
                    <Zap class="h-5 w-5" />
                    Main Planetary Aspects ({filteredAspects.filter(a => ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(a.person1Planet) && ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(a.person2Planet)).length})
                  </span>
                </Accordion.Trigger>
                <Accordion.Content>
                  <div class="space-y-3">
                    {#each filteredAspects.filter(a => ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(a.person1Planet) && ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(a.person2Planet)) as aspect}
                      <div class="border rounded-lg p-4 hover:bg-gray-50">
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
                </Accordion.Content>
              </Accordion.Item>
            {/if}

            <!-- Angular Aspects -->
            {#if filteredAspects.filter(a => ['ASC', 'MC', 'DSC', 'IC'].includes(a.person1Planet) || ['ASC', 'MC', 'DSC', 'IC'].includes(a.person2Planet)).length > 0}
              <Accordion.Item value="angular-aspects">
                <Accordion.Trigger class="flex items-center justify-between w-full py-4 text-lg font-semibold text-gray-900">
                  <span class="flex items-center gap-2">
                    <Info class="h-5 w-5" />
                    Angular Aspects ({filteredAspects.filter(a => ['ASC', 'MC', 'DSC', 'IC'].includes(a.person1Planet) || ['ASC', 'MC', 'DSC', 'IC'].includes(a.person2Planet)).length})
                  </span>
                </Accordion.Trigger>
                <Accordion.Content>
                  <div class="space-y-3">
                    {#each filteredAspects.filter(a => ['ASC', 'MC', 'DSC', 'IC'].includes(a.person1Planet) || ['ASC', 'MC', 'DSC', 'IC'].includes(a.person2Planet)) as aspect}
                      <div class="border rounded-lg p-4 hover:bg-gray-50">
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
                </Accordion.Content>
              </Accordion.Item>
            {/if}

            <!-- Minor Aspects -->
            {#if filteredAspects.filter(a => !['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'ASC', 'MC', 'DSC', 'IC'].includes(a.person1Planet) || !['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'ASC', 'MC', 'DSC', 'IC'].includes(a.person2Planet)).length > 0}
              <Accordion.Item value="minor-aspects">
                <Accordion.Trigger class="flex items-center justify-between w-full py-4 text-lg font-semibold text-gray-900">
                  <span class="flex items-center gap-2">
                    <AlertTriangle class="h-5 w-5" />
                    Minor Aspects ({filteredAspects.filter(a => !['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'ASC', 'MC', 'DSC', 'IC'].includes(a.person1Planet) || !['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'ASC', 'MC', 'DSC', 'IC'].includes(a.person2Planet)).length})
                  </span>
                </Accordion.Trigger>
                <Accordion.Content>
                  <div class="space-y-3">
                    {#each filteredAspects.filter(a => !['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'ASC', 'MC', 'DSC', 'IC'].includes(a.person1Planet) || !['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'ASC', 'MC', 'DSC', 'IC'].includes(a.person2Planet)) as aspect}
                      <div class="border rounded-lg p-4 hover:bg-gray-50">
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
                </Accordion.Content>
              </Accordion.Item>
            {/if}
          </Accordion.Root>
        </Card.Content>
      </Card.Root>
    </div>
  {:else if searchTerm || selectedCompatibility !== 'all' || selectedIntensity !== 'all' || selectedAspect !== 'all'}
    <div class="mb-6">
      <Card.Root>
        <Card.Content>
          <div class="text-center py-8">
            <Filter class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600">No aspects match your current filters.</p>
            <button 
              on:click={clearFilters}
              class="mt-2 text-blue-600 hover:text-blue-800 underline"
            >
              Clear filters to see all aspects
            </button>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  {/if}

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
