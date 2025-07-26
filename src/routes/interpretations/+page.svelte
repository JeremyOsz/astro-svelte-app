<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
  import { Search, Info } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  import { 
    PLANETS_DATA, 
    SIGNS_DATA, 
    HOUSES_DATA, 
    ASPECTS_DATA,
    type PlanetData,
    type SignData,
    type HouseData,
    type AspectData
  } from '$lib/data/interpretations-page-data';

  let searchTerm = '';
  let activeTab = 'planets';

  // Filter functions
  $: filteredPlanets = PLANETS_DATA.filter(planet => 
    planet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    planet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    planet.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  $: filteredSigns = SIGNS_DATA.filter(sign => 
    sign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sign.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  $: filteredHouses = HOUSES_DATA.filter(house => 
    house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  $: filteredAspects = ASPECTS_DATA.filter(aspect => 
    aspect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aspect.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aspect.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Check if any results exist
  $: hasResults = filteredPlanets.length > 0 || filteredSigns.length > 0 || 
                  filteredHouses.length > 0 || filteredAspects.length > 0;

  // Get element color
  function getElementColor(element: string): string {
    const colors = {
      'Fire': 'bg-red-100 text-red-800 border-red-200',
      'Earth': 'bg-green-100 text-green-800 border-green-200',
      'Air': 'bg-blue-100 text-blue-800 border-blue-200',
      'Water': 'bg-cyan-100 text-cyan-800 border-cyan-200'
    };
    return colors[element as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  // Get quality color
  function getQualityColor(quality: string): string {
    const colors = {
      'Cardinal': 'bg-purple-100 text-purple-800 border-purple-200',
      'Fixed': 'bg-orange-100 text-orange-800 border-orange-200',
      'Mutable': 'bg-teal-100 text-teal-800 border-teal-200'
    };
    return colors[quality as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  // Get nature color
  function getNatureColor(nature: string): string {
    return nature === 'Harmonious' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-rose-100 text-rose-800 border-rose-200';
  }
</script>

<svelte:head>
  <title>Astrological Interpretations - Astro Chart</title>
  <meta name="description" content="Comprehensive astrological interpretations for planets, signs, houses, and aspects" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Symbols:wght@400;500;600&display=swap" rel="stylesheet">
</svelte:head>

<div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
  <!-- Page Header -->
  <div class="text-center mb-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">Astrological Interpretations</h1>
    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
      Explore the meanings and interpretations of planets, signs, houses, and aspects in astrology.
      Discover how these cosmic elements influence personality, relationships, and life experiences.
    </p>
  </div>

  <!-- Search Section -->
  <div class="mb-8">
    <div class="relative max-w-md mx-auto">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input placeholder="Search interpretations..." bind:value={searchTerm} class="pl-10" />
    </div>
  </div>

  <!-- Tabs -->
  <div class="mb-8">
    <div class="flex justify-center">
      <div class="inline-flex rounded-lg bg-gray-100 p-1">
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 {activeTab === 'planets' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          on:click={() => activeTab = 'planets'}
        >
          <span class="text-lg astrological-symbol">☉</span>
          Planets
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 {activeTab === 'signs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          on:click={() => activeTab = 'signs'}
        >
          <span class="text-lg astrological-symbol">♈</span>
          Signs
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 {activeTab === 'houses' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          on:click={() => activeTab = 'houses'}
        >
          <span class="text-lg">🏠</span>
          Houses
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 {activeTab === 'aspects' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          on:click={() => activeTab = 'aspects'}
        >
          <span class="text-lg astrological-symbol">⚡</span>
          Aspects
        </button>
      </div>
    </div>
  </div>

  <!-- Content -->
  {#if activeTab === 'planets'}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredPlanets as planet}
        <Card class="group hover:shadow-lg transition-all duration-200 cursor-pointer">
          <CardHeader class="pb-3">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-3xl astrological-symbol">{planet.symbol}</span>
              <div>
                <CardTitle class="text-xl">{planet.name}</CardTitle>
                <Badge variant="outline" class={cn("mt-1", getElementColor(planet.element))}>
                  {planet.element}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <p class="text-gray-600 leading-relaxed">{planet.description}</p>
            <div class="flex flex-wrap gap-1">
              {#each planet.keywords as keyword}
                <Badge variant="secondary" class="text-xs">
                  {keyword}
                </Badge>
              {/each}
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else if activeTab === 'signs'}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredSigns as sign}
        <Card class="group hover:shadow-lg transition-all duration-200 cursor-pointer">
          <CardHeader class="pb-3">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-3xl astrological-symbol">{sign.symbol}</span>
              <div>
                <CardTitle class="text-xl">{sign.name}</CardTitle>
                <div class="flex gap-2 mt-1">
                  <Badge variant="outline" class={cn("text-xs", getElementColor(sign.element))}>
                    {sign.element}
                  </Badge>
                  <Badge variant="outline" class={cn("text-xs", getQualityColor(sign.quality))}>
                    {sign.quality}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span>Ruled by:</span>
              <Badge variant="secondary" class="text-xs">
                {sign.ruler}
              </Badge>
            </div>
            <p class="text-gray-600 leading-relaxed">{sign.description}</p>
            <div class="flex flex-wrap gap-1">
              {#each sign.keywords as keyword}
                <Badge variant="secondary" class="text-xs">
                  {keyword}
                </Badge>
              {/each}
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else if activeTab === 'houses'}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredHouses as house}
        <Card class="group hover:shadow-lg transition-all duration-200 cursor-pointer">
          <CardHeader class="pb-3">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {house.number}
              </div>
              <div>
                <CardTitle class="text-xl">{house.name}</CardTitle>
                <Badge variant="outline" class="mt-1 bg-purple-100 text-purple-800 border-purple-200">
                  {house.keyword}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <p class="text-gray-600 leading-relaxed">{house.description}</p>
            <div class="flex flex-wrap gap-1">
              {#each house.keywords as keyword}
                <Badge variant="secondary" class="text-xs">
                  {keyword}
                </Badge>
              {/each}
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else if activeTab === 'aspects'}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredAspects as aspect}
        <Card class="group hover:shadow-lg transition-all duration-200 cursor-pointer">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between mb-3">
              <CardTitle class="text-xl">{aspect.name}</CardTitle>
              <Badge variant="outline" class={cn("text-xs", getNatureColor(aspect.nature))}>
                {aspect.nature}
              </Badge>
            </div>
            <div class="flex gap-2">
              <Badge variant="secondary" class="text-xs">
                {aspect.degrees}
              </Badge>
              <Badge variant="secondary" class="text-xs">
                Orb: {aspect.orb}
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <p class="text-gray-600 leading-relaxed">{aspect.description}</p>
            <div class="flex flex-wrap gap-1">
              {#each aspect.keywords as keyword}
                <Badge variant="secondary" class="text-xs">
                  {keyword}
                </Badge>
              {/each}
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  {/if}

  <!-- No Results -->
  {#if searchTerm && !hasResults}
    <div class="text-center py-12">
      <div class="max-w-md mx-auto">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Search class="h-8 w-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No interpretations found</h3>
        <p class="text-gray-600">
          No results found for "{searchTerm}". Try searching with different keywords or browse the tabs above.
        </p>
      </div>
    </div>
  {/if}

  <!-- Info Section -->
  <div class="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
    <div class="flex items-start gap-3">
      <Info class="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
      <div>
        <h3 class="font-semibold text-blue-900 mb-2">Understanding Astrological Elements</h3>
        <p class="text-blue-800 text-sm leading-relaxed">
          These interpretations provide foundational meanings in astrology. Remember that the full interpretation 
          of any chart depends on the unique combination of planets, signs, houses, and aspects in your specific 
          birth chart. Each element interacts with others to create your unique astrological profile.
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  /* Astrological symbol font */
  .astrological-symbol {
    font-family: 'Noto Sans Symbols', 'Segoe UI Symbol', 'Arial Unicode MS', sans-serif;
    font-weight: 500;
    line-height: 1;
  }
  
  /* Custom styles for better hover effects */
  :global(.group:hover .text-3xl) {
    transform: scale(1.1);
    transition: transform 0.2s ease;
  }
  
  /* Ensure proper cursor on interactive elements */
  button {
    cursor: pointer;
  }
</style> 