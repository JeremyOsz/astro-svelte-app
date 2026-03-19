<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { OccultDivider, SectionHeader, OccultCard } from '$lib/components/occult';
  import { Search, Info } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  import { 
    PLANETS_DATA, 
    SIGNS_DATA, 
    HOUSES_DATA, 
    ASPECTS_DATA,
    OTHER_OBJECTS_DATA,
  } from '$lib/data/interpretations-page-data';

  let searchTerm = '';
  let activeTab = 'planets';

  // Filter functions
  $: filteredPlanets = PLANETS_DATA.filter(planet => 
    planet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    planet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    planet.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
    planet.themes.some(theme => theme.toLowerCase().includes(searchTerm.toLowerCase())) ||
    planet.challenges.some(challenge => challenge.toLowerCase().includes(searchTerm.toLowerCase())) ||
    planet.strengths.some(strength => strength.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  $: filteredSigns = SIGNS_DATA.filter(sign => 
    sign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sign.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
    sign.themes.some(theme => theme.toLowerCase().includes(searchTerm.toLowerCase())) ||
    sign.challenges.some(challenge => challenge.toLowerCase().includes(searchTerm.toLowerCase())) ||
    sign.strengths.some(strength => strength.toLowerCase().includes(searchTerm.toLowerCase()))
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

  $: filteredOtherObjects = OTHER_OBJECTS_DATA.filter(obj => 
    obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obj.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obj.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
    obj.themes.some(theme => theme.toLowerCase().includes(searchTerm.toLowerCase())) ||
    obj.significance.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      'Cardinal': 'bg-primary/20 text-primary border-primary/40',
      'Fixed': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700/50',
      'Mutable': 'bg-secondary text-secondary-foreground border-border'
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
      'Extended Planet': 'bg-primary/20 text-primary border-primary/40',
      'Angle': 'bg-accent/20 text-accent-foreground border-accent/40',
      'Asteroid': 'bg-secondary text-secondary-foreground border-border',
      'Point': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700/50'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  }
</script>

<svelte:head>
  <title>Astrological Interpretations - OsztrOlogy</title>
  <meta name="description" content="Comprehensive astrological interpretations for planets, signs, houses, and aspects" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Symbols:wght@400;500;600&display=swap" rel="stylesheet">
</svelte:head>

<div class="eclipse-interpretations min-h-screen bg-gradient-to-br from-background via-card/50 to-muted/60 dark:from-background dark:via-card/80 dark:to-muted/40">
  <div class="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
  <!-- Page Header -->
  <header class="text-center mb-10">
    <OccultDivider symbol="star" class="mb-6" />
    <h1 class="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-wide mb-3">Astrological Interpretations</h1>
    <p class="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
      Explore the meanings and interpretations of planets, signs, houses, and aspects in astrology.
      Discover how these cosmic elements influence personality, relationships, and life experiences.
    </p>
    <OccultDivider symbol="moon" class="mt-6" />
  </header>

  <!-- Search & Tabs -->
  <section class="mb-8">
    <SectionHeader title="Browse by category" symbol="dot" class="mb-4" />
    <OccultCard corners={true} class="mb-6">
      <div class="relative max-w-md mx-auto mb-6">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input placeholder="Search interpretations..." bind:value={searchTerm} class="pl-10 bg-background/80 font-body" />
      </div>
    <div class="flex justify-center flex-wrap gap-2">
      <div class="inline-flex flex-wrap rounded-lg bg-muted/50 border border-border p-1.5 occult-border">
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 {activeTab === 'planets' ? 'bg-background text-foreground border border-border shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
          on:click={() => activeTab = 'planets'}
        >
          <span class="text-lg astrological-symbol">☉</span>
          Planets
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 {activeTab === 'signs' ? 'bg-background text-foreground border border-border shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
          on:click={() => activeTab = 'signs'}
        >
          <span class="text-lg astrological-symbol">♈</span>
          Signs
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 {activeTab === 'houses' ? 'bg-background text-foreground border border-border shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
          on:click={() => activeTab = 'houses'}
        >
          <span class="text-lg">🏠</span>
          Houses
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 {activeTab === 'aspects' ? 'bg-background text-foreground border border-border shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
          on:click={() => activeTab = 'aspects'}
        >
          <span class="text-lg astrological-symbol">⚡</span>
          Aspects
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 font-body {activeTab === 'other-objects' ? 'bg-background text-foreground border border-border shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
          on:click={() => activeTab = 'other-objects'}
        >
          <span class="text-lg astrological-symbol">⚷</span>
          Other Objects
        </button>
      </div>
    </div>
    </OccultCard>
  </section>

  <!-- Content -->
  {#if activeTab === 'planets'}
    <section class="mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredPlanets as planet}
        <Card class="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-card border-border occult-border relative overflow-hidden">
          <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/30 rounded-tl z-10" aria-hidden="true"></div>
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
                <div class="strength-box rounded-lg p-3">
                  <h4 class="font-semibold strength-heading mb-2 text-sm">Strengths</h4>
                  <ul class="text-sm strength-copy space-y-1">
                    {#each planet.strengths as strength}
                      <li class="flex items-start gap-2">
                        <span class="strength-bullet mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/if}

              {#if planet.challenges && planet.challenges.length > 0}
                <div class="challenge-box rounded-lg p-3">
                  <h4 class="font-semibold challenge-heading mb-2 text-sm">Challenges</h4>
                  <ul class="text-sm challenge-copy space-y-1">
                    {#each planet.challenges as challenge}
                      <li class="flex items-start gap-2">
                        <span class="challenge-bullet mt-1">•</span>
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
    </section>
  {:else if activeTab === 'signs'}
    <section class="mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredSigns as sign}
        <Card class="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-card border-border occult-border relative overflow-hidden">
          <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/30 rounded-tl z-10" aria-hidden="true"></div>
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
                    <Badge variant="secondary" class="text-xs bg-primary/20 text-primary">
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
                <div class="strength-box rounded-lg p-3">
                  <h4 class="font-semibold strength-heading mb-2 text-sm">Strengths</h4>
                  <ul class="text-sm strength-copy space-y-1">
                    {#each sign.strengths as strength}
                      <li class="flex items-start gap-2">
                        <span class="strength-bullet mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/if}

              {#if sign.challenges && sign.challenges.length > 0}
                <div class="challenge-box rounded-lg p-3">
                  <h4 class="font-semibold challenge-heading mb-2 text-sm">Challenges</h4>
                  <ul class="text-sm challenge-copy space-y-1">
                    {#each sign.challenges as challenge}
                      <li class="flex items-start gap-2">
                        <span class="challenge-bullet mt-1">•</span>
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
    </section>
  {:else if activeTab === 'houses'}
    <section class="mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredHouses as house}
        <Card class="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-card border-border occult-border relative overflow-hidden">
          <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/30 rounded-tl z-10" aria-hidden="true"></div>
          <CardHeader class="pb-3">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-lg">
                {house.number}
              </div>
              <div>
                <CardTitle class="text-xl">{house.name}</CardTitle>
                <Badge variant="outline" class="mt-1 bg-primary/20 text-primary border-primary/40">
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
    </section>
  {:else if activeTab === 'aspects'}
    <section class="mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredAspects as aspect}
        <Card class="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-card border-border occult-border relative overflow-hidden">
          <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/30 rounded-tl z-10" aria-hidden="true"></div>
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
    </section>
  {:else if activeTab === 'other-objects'}
    <section class="mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredOtherObjects as obj}
        <Card class="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-card border-border occult-border relative overflow-hidden">
          <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/30 rounded-tl z-10" aria-hidden="true"></div>
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
            <div class="significance-box rounded-lg p-3">
              <h4 class="font-semibold significance-heading mb-2 text-sm">Significance</h4>
              <p class="text-sm significance-copy">{obj.significance}</p>
            </div>

            <!-- Themes -->
            {#if obj.themes && obj.themes.length > 0}
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Themes</h4>
                <div class="flex flex-wrap gap-1">
                  {#each obj.themes as theme}
                    <Badge variant="secondary" class="text-xs bg-primary/20 text-primary">
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
    </section>
  {/if}

  <!-- No Results -->
  {#if searchTerm && !hasResults}
    <div class="text-center py-12">
      <OccultDivider symbol="moon" class="mb-6" />
      <div class="max-w-md mx-auto">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Search class="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 class="font-display text-lg font-semibold text-foreground mb-2">No interpretations found</h3>
        <p class="text-muted-foreground font-body">
          No results found for "{searchTerm}". Try searching with different keywords or browse the tabs above.
        </p>
      </div>
      <OccultDivider symbol="star" class="mt-6" />
    </div>
  {/if}

  <!-- Info Section -->
  <OccultCard corners={true} class="mt-12">
    <div class="flex items-start gap-3">
      <Info class="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
      <div>
        <h3 class="font-semibold text-foreground mb-2">Understanding Astrological Elements</h3>
        <p class="text-muted-foreground text-sm leading-relaxed">
          These interpretations provide foundational meanings in astrology. Remember that the full interpretation 
          of any chart depends on the unique combination of planets, signs, houses, and aspects in your specific 
          birth chart. Each element interacts with others to create your unique astrological profile.
        </p>
      </div>
    </div>
  </OccultCard>
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

  .strength-box {
    background: #ecfdf3;
  }

  .strength-heading {
    color: #166534;
  }

  .strength-copy {
    color: #15803d;
  }

  .strength-bullet {
    color: #16a34a;
  }

  .challenge-box {
    background: #fff5eb;
  }

  .challenge-heading {
    color: #9a3412;
  }

  .challenge-copy {
    color: #c2410c;
  }

  .challenge-bullet {
    color: #ea580c;
  }

  .significance-box {
    background: #eff6ff;
  }

  .significance-heading {
    color: #1e40af;
  }

  .significance-copy {
    color: #1d4ed8;
  }

  :global(.dark .eclipse-interpretations .text-gray-900) {
    color: #f2f5fb !important;
  }

  :global(.dark .eclipse-interpretations .text-gray-600),
  :global(.dark .eclipse-interpretations .text-gray-500) {
    color: #cdd6e6 !important;
  }

  :global(.dark .eclipse-interpretations .bg-blue-100),
  :global(.dark .eclipse-interpretations .bg-indigo-100),
  :global(.dark .eclipse-interpretations .bg-purple-100),
  :global(.dark .eclipse-interpretations .bg-teal-100),
  :global(.dark .eclipse-interpretations .bg-amber-100),
  :global(.dark .eclipse-interpretations .bg-cyan-100),
  :global(.dark .eclipse-interpretations .bg-pink-100),
  :global(.dark .eclipse-interpretations .bg-red-100),
  :global(.dark .eclipse-interpretations .bg-green-100),
  :global(.dark .eclipse-interpretations .bg-orange-100),
  :global(.dark .eclipse-interpretations .bg-gray-100),
  :global(.dark .eclipse-interpretations .bg-emerald-100),
  :global(.dark .eclipse-interpretations .bg-rose-100),
  :global(.dark .eclipse-interpretations .bg-violet-100) {
    background-color: #283246 !important;
  }

  :global(.dark .eclipse-interpretations .text-blue-800),
  :global(.dark .eclipse-interpretations .text-indigo-800),
  :global(.dark .eclipse-interpretations .text-purple-800),
  :global(.dark .eclipse-interpretations .text-teal-800),
  :global(.dark .eclipse-interpretations .text-amber-800),
  :global(.dark .eclipse-interpretations .text-cyan-800),
  :global(.dark .eclipse-interpretations .text-pink-800),
  :global(.dark .eclipse-interpretations .text-red-800),
  :global(.dark .eclipse-interpretations .text-green-800),
  :global(.dark .eclipse-interpretations .text-orange-800),
  :global(.dark .eclipse-interpretations .text-gray-800),
  :global(.dark .eclipse-interpretations .text-emerald-800),
  :global(.dark .eclipse-interpretations .text-rose-800),
  :global(.dark .eclipse-interpretations .text-violet-800) {
    color: #dbe5f8 !important;
  }

  :global(.dark .eclipse-interpretations .border-blue-200),
  :global(.dark .eclipse-interpretations .border-indigo-200),
  :global(.dark .eclipse-interpretations .border-purple-200),
  :global(.dark .eclipse-interpretations .border-teal-200),
  :global(.dark .eclipse-interpretations .border-amber-200),
  :global(.dark .eclipse-interpretations .border-cyan-200),
  :global(.dark .eclipse-interpretations .border-pink-200),
  :global(.dark .eclipse-interpretations .border-red-200),
  :global(.dark .eclipse-interpretations .border-green-200),
  :global(.dark .eclipse-interpretations .border-orange-200),
  :global(.dark .eclipse-interpretations .border-gray-200),
  :global(.dark .eclipse-interpretations .border-emerald-200),
  :global(.dark .eclipse-interpretations .border-rose-200),
  :global(.dark .eclipse-interpretations .border-violet-200) {
    border-color: #3b4b66 !important;
  }

  :global(.dark .eclipse-interpretations .strength-box) {
    background: #1f2a22;
  }

  :global(.dark .eclipse-interpretations .strength-heading),
  :global(.dark .eclipse-interpretations .strength-copy),
  :global(.dark .eclipse-interpretations .strength-bullet) {
    color: #8de7b8;
  }

  :global(.dark .eclipse-interpretations .challenge-box) {
    background: #2b2219;
  }

  :global(.dark .eclipse-interpretations .challenge-heading),
  :global(.dark .eclipse-interpretations .challenge-copy),
  :global(.dark .eclipse-interpretations .challenge-bullet) {
    color: #ffb683;
  }

  :global(.dark .eclipse-interpretations .significance-box) {
    background: #1d2a3d;
  }

  :global(.dark .eclipse-interpretations .significance-heading),
  :global(.dark .eclipse-interpretations .significance-copy) {
    color: #91b9ff;
  }
</style> 
