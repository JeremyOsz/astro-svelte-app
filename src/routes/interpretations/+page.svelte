<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { Search, Info } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  import { interpretationLoader } from '$lib/services/interpretation-loader';

  let searchTerm = '';
  let activeTab = 'planets';
  let isLoading = true;
  let interpretationData: any = null;

  // Load interpretation data on mount
  onMount(async () => {
    try {
      interpretationData = await interpretationLoader.loadInterpretationsPageData();
    } catch (error) {
      console.error('Failed to load interpretation data:', error);
    } finally {
      isLoading = false;
    }
  });

  // Filter functions (only run when data is loaded)
  $: filteredPlanets = interpretationData?.PLANETS_DATA?.filter((planet: any) => 
    planet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    planet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    planet.keywords.some((keyword: string) => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
    planet.themes.some((theme: string) => theme.toLowerCase().includes(searchTerm.toLowerCase())) ||
    planet.challenges.some((challenge: string) => challenge.toLowerCase().includes(searchTerm.toLowerCase())) ||
    planet.strengths.some((strength: string) => strength.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  $: filteredSigns = interpretationData?.SIGNS_DATA?.filter((sign: any) => 
    sign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sign.keywords.some((keyword: string) => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
    sign.themes.some((theme: string) => theme.toLowerCase().includes(searchTerm.toLowerCase())) ||
    sign.challenges.some((challenge: string) => challenge.toLowerCase().includes(searchTerm.toLowerCase())) ||
    sign.strengths.some((strength: string) => strength.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  $: filteredHouses = interpretationData?.HOUSES_DATA?.filter((house: any) => 
    house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house.keywords.some((keyword: string) => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  $: filteredAspects = interpretationData?.ASPECTS_DATA?.filter((aspect: any) => 
    aspect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aspect.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aspect.keywords.some((keyword: string) => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  $: filteredOtherObjects = interpretationData?.OTHER_OBJECTS_DATA?.filter((obj: any) => 
    obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obj.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obj.keywords.some((keyword: string) => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
    obj.themes.some((theme: string) => theme.toLowerCase().includes(searchTerm.toLowerCase())) ||
    obj.significance.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Check if any results exist
  $: hasResults = filteredPlanets.length > 0 || filteredSigns.length > 0 || 
                  filteredHouses.length > 0 || filteredAspects.length > 0 || filteredOtherObjects.length > 0;

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

  // Get category color
  function getCategoryColor(category: string): string {
    const colors = {
      'Extended Planet': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Angle': 'bg-violet-100 text-violet-800 border-violet-200',
      'Asteroid': 'bg-pink-100 text-pink-800 border-pink-200',
      'Point': 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
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
      <div class="inline-flex flex-wrap rounded-lg bg-gray-100 p-1">
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
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 {activeTab === 'other-objects' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          on:click={() => activeTab = 'other-objects'}
        >
          <span class="text-lg astrological-symbol">⚷</span>
          Other Objects
        </button>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  {#if isLoading}
    <div class="text-center py-12">
      <div class="inline-flex items-center gap-3 text-gray-600">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
        <span>Loading interpretations...</span>
      </div>
    </div>
  {:else}
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
            
            <!-- Themes -->
            {#if planet.themes && planet.themes.length > 0}
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Themes</h4>
                <div class="flex flex-wrap gap-1">
                  {#each planet.themes as theme}
                    <Badge variant="secondary" class="text-xs bg-blue-100 text-blue-800">
                      {theme}
                    </Badge>
                  {/each}
                </div>
              </div>
            {/if}

            <!-- Keywords -->
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Keywords</h4>
              <div class="flex flex-wrap gap-1">
                {#each planet.keywords as keyword}
                  <Badge variant="secondary" class="text-xs">
                    {keyword}
                  </Badge>
                {/each}
              </div>
            </div>

            <!-- Strengths and Challenges -->
            <div class="grid grid-cols-1 gap-3">
              {#if planet.strengths && planet.strengths.length > 0}
                <div class="bg-green-50 rounded-lg p-3">
                  <h4 class="font-semibold text-green-800 mb-2 text-sm">Strengths</h4>
                  <ul class="text-sm text-green-700 space-y-1">
                    {#each planet.strengths as strength}
                      <li class="flex items-start gap-2">
                        <span class="text-green-600 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/if}

              {#if planet.challenges && planet.challenges.length > 0}
                <div class="bg-orange-50 rounded-lg p-3">
                  <h4 class="font-semibold text-orange-800 mb-2 text-sm">Challenges</h4>
                  <ul class="text-sm text-orange-700 space-y-1">
                    {#each planet.challenges as challenge}
                      <li class="flex items-start gap-2">
                        <span class="text-orange-600 mt-1">•</span>
                        <span>{challenge}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/if}
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
            
            <!-- Themes -->
            {#if sign.themes && sign.themes.length > 0}
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Themes</h4>
                <div class="flex flex-wrap gap-1">
                  {#each sign.themes as theme}
                    <Badge variant="secondary" class="text-xs bg-purple-100 text-purple-800">
                      {theme}
                    </Badge>
                  {/each}
                </div>
              </div>
            {/if}

            <!-- Keywords -->
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Keywords</h4>
              <div class="flex flex-wrap gap-1">
                {#each sign.keywords as keyword}
                  <Badge variant="secondary" class="text-xs">
                    {keyword}
                  </Badge>
                {/each}
              </div>
            </div>

            <!-- Strengths and Challenges -->
            <div class="grid grid-cols-1 gap-3">
              {#if sign.strengths && sign.strengths.length > 0}
                <div class="bg-green-50 rounded-lg p-3">
                  <h4 class="font-semibold text-green-800 mb-2 text-sm">Strengths</h4>
                  <ul class="text-sm text-green-700 space-y-1">
                    {#each sign.strengths as strength}
                      <li class="flex items-start gap-2">
                        <span class="text-green-600 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/if}

              {#if sign.challenges && sign.challenges.length > 0}
                <div class="bg-orange-50 rounded-lg p-3">
                  <h4 class="font-semibold text-orange-800 mb-2 text-sm">Challenges</h4>
                  <ul class="text-sm text-orange-700 space-y-1">
                    {#each sign.challenges as challenge}
                      <li class="flex items-start gap-2">
                        <span class="text-orange-600 mt-1">•</span>
                        <span>{challenge}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/if}
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
  {:else if activeTab === 'other-objects'}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredOtherObjects as obj}
        <Card class="group hover:shadow-lg transition-all duration-200 cursor-pointer">
          <CardHeader class="pb-3">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-3xl astrological-symbol">{obj.symbol}</span>
              <div>
                <CardTitle class="text-xl">{obj.name}</CardTitle>
                <Badge variant="outline" class={cn("mt-1", getCategoryColor(obj.category))}>
                  {obj.category}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <p class="text-gray-600 leading-relaxed">{obj.description}</p>
            
            <!-- Significance -->
            <div class="bg-blue-50 rounded-lg p-3">
              <h4 class="font-semibold text-blue-800 mb-2 text-sm">Significance</h4>
              <p class="text-sm text-blue-700">{obj.significance}</p>
            </div>

            <!-- Themes -->
            {#if obj.themes && obj.themes.length > 0}
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Themes</h4>
                <div class="flex flex-wrap gap-1">
                  {#each obj.themes as theme}
                    <Badge variant="secondary" class="text-xs bg-indigo-100 text-indigo-800">
                      {theme}
                    </Badge>
                  {/each}
                </div>
              </div>
            {/if}

            <!-- Keywords -->
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Keywords</h4>
              <div class="flex flex-wrap gap-1">
                {#each obj.keywords as keyword}
                  <Badge variant="secondary" class="text-xs">
                    {keyword}
                  </Badge>
                {/each}
              </div>
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
  {/if}
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