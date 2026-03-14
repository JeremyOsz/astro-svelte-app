<script lang="ts">
  import { onMount } from 'svelte';

  import * as Input from '$lib/components/ui/input';
  import * as Dialog from '$lib/components/ui/dialog';
  import { OccultDivider, SectionHeader, OccultCard } from '$lib/components/occult';
  import TarotQuestionGenerator from '$lib/components/tarot/TarotQuestionGenerator.svelte';
  import { TAROT_LAYOUTS, type TarotLayout, getAllCategories, getAllDifficulties } from '$lib/data/tarot-layouts';

  let searchTerm = '';
  let selectedCategory = 'all';
  let selectedDifficulty = 'all';
  let selectedLayout: TarotLayout | null = null;
  let modalOpen = false;

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'General', label: 'General' },
    { value: 'Love', label: 'Love & Relationships' },
    { value: 'Career', label: 'Career & Work' },
    { value: 'Spiritual', label: 'Spiritual Growth' },
    { value: 'Problem-Solving', label: 'Problem-Solving' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];

  /** Common words to ignore in search (e.g. "spread for love" → "spread", "love"). */
  const SEARCH_STOPWORDS = new Set(['of', 'the', 'a', 'an', 'and', 'or', 'in', 'to', 'for', 'with', 'on', 'at', 'by', 'as', 'is', 'it']);

  /** Build one searchable string from layout fields for multi-word search. */
  function getLayoutSearchText(layout: TarotLayout): string {
    const parts = [
      layout.name,
      layout.description,
      ...layout.bestFor,
      ...layout.tips
    ];
    return parts.join(' ').toLowerCase();
  }

  $: filteredLayouts = TAROT_LAYOUTS.filter(layout => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) {
      const matchesCategory = selectedCategory === 'all' || layout.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || layout.difficulty === selectedDifficulty;
      return matchesCategory && matchesDifficulty;
    }

    const searchableText = getLayoutSearchText(layout);
    const words = searchLower.split(/\s+/).filter(w => w && !SEARCH_STOPWORDS.has(w));
    const matchesSearch = words.length === 0 || words.every(word => searchableText.includes(word));

    const matchesCategory = selectedCategory === 'all' || layout.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || layout.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  function selectLayout(layout: TarotLayout) {
    selectedLayout = layout;
    modalOpen = true;
  }

  function closeLayoutDetail() {
    selectedLayout = null;
    modalOpen = false;
  }

  function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-amber-900/50 dark:text-amber-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  }

  function getCategoryColor(category: string) {
    switch (category) {
      case 'Love':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200';
      case 'Career':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
      case 'Spiritual':
        return 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground';
      case 'Problem-Solving':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  }
</script>

<svelte:head>
  <title>Tarot Layouts & Spreads | Astro Chart</title>
  <meta name="description" content="Explore tarot layouts and spreads for different purposes. From simple one-card readings to complex spreads like the Celtic Cross." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-background via-card/50 to-muted/60 dark:from-background dark:via-card/80 dark:to-muted/40">
  <div class="w-full max-w-4xl mx-auto py-6 sm:py-8">
    <!-- Page title — grimoire chapter style -->
    <header class="text-center mb-10">
      <OccultDivider symbol="star" class="mb-6" />
      <h1 class="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-wide mb-3">Tarot Layouts & Spreads</h1>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto mb-6 font-body">
        Discover the art of tarot spreads. Each layout offers a unique way to explore your questions and find guidance through the cards.
      </p>
      <div class="inline-block max-w-2xl">
        <OccultCard corners={true} class="!py-4 !px-5">
          <p class="text-sm text-foreground font-body text-center">
            <strong>How to use:</strong> Click any layout to see detailed instructions and card positions. Use filters to find spreads for your specific needs.
          </p>
        </OccultCard>
      </div>
      <OccultDivider symbol="moon" class="mt-6" />
    </header>

    <!-- Single card pull — Question generator -->
    <section class="mb-10">
      <SectionHeader title="Single Card Pull — Question Generator" symbol="dot" class="mb-4" />
      <OccultCard corners={true}>
        <p class="text-muted-foreground mb-4 font-body">
          Not sure what to ask? Choose a theme and discover questions designed for one-card readings. Use one as your focus when you shuffle and draw.
        </p>
        <TarotQuestionGenerator />
      </OccultCard>
    </section>

    <!-- Historical Background -->
    <section class="mb-10">
      <SectionHeader title="The Art of Tarot Spreads" symbol="moon" class="mb-4" />
      <OccultCard corners={true}>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 text-muted-foreground">
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold text-foreground mb-2">What Are Spreads?</h3>
            <p class="text-sm leading-relaxed">
              Tarot spreads are specific arrangements of cards that create a framework for interpretation. Each position in a spread has a particular meaning, 
              allowing for deeper insights than reading cards in isolation. The layout itself often holds symbolic significance.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-foreground mb-2">Choosing the Right Spread</h3>
            <p class="text-sm leading-relaxed">
              The best spread depends on your question, experience level, and the depth of insight you seek. Simple spreads are perfect for daily guidance, 
              while complex spreads like the Celtic Cross offer comprehensive analysis for important life decisions.
            </p>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold text-foreground mb-2">Reading Techniques</h3>
            <p class="text-sm leading-relaxed">
              When reading a spread, consider both individual card meanings and their relationships to each other. Look for patterns, 
              connections, and the story that emerges from the cards' positions and interactions.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-foreground mb-2">Intuition & Practice</h3>
            <p class="text-sm leading-relaxed">
              While understanding card meanings is important, trust your intuition. The more you practice with different spreads, 
              the more you'll develop your own reading style and deepen your connection with the cards.
            </p>
          </div>
        </div>
      </div>
      </OccultCard>
    </section>

    <!-- Search and Filters -->
    <section class="mb-10">
      <SectionHeader title="Find a Spread" symbol="star" class="mb-4" />
      <OccultCard corners={true}>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="search" class="block text-sm font-medium text-muted-foreground mb-2">Search Layouts</label>
          <Input.Root
            id="search"
            bind:value={searchTerm}
            placeholder="Search by name or description..."
            class="w-full"
          />
        </div>
        
        <div>
          <label for="category" class="block text-sm font-medium text-muted-foreground mb-2">Filter by Category</label>
          <select
            id="category"
            bind:value={selectedCategory}
            class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            {#each categories as category}
              <option value={category.value}>{category.label}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="difficulty" class="block text-sm font-medium text-muted-foreground mb-2">Filter by Difficulty</label>
          <select
            id="difficulty"
            bind:value={selectedDifficulty}
            class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            {#each difficulties as difficulty}
              <option value={difficulty.value}>{difficulty.label}</option>
            {/each}
          </select>
        </div>
      </div>
      </OccultCard>
    </section>

    <!-- Layouts Grid -->
    <section>
      <SectionHeader title="Layouts" symbol="moon" class="mb-6" />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredLayouts as layout}
        <button
          on:click={() => selectLayout(layout)}
          class="group relative bg-card rounded-lg shadow-md hover:shadow-lg border border-border occult-border transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer text-left h-full overflow-hidden"
        >
          <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/30 rounded-tl" aria-hidden="true"></div>
          <div class="p-5 pt-6">
            <!-- SVG Layout Preview -->
            <div class="mb-4 flex justify-center">
              <div class="relative bg-muted/50 dark:bg-muted rounded-md p-3 border border-border overflow-hidden occult-border">
                <svg width="350" height="250" viewBox="0 0 600 400" class="w-full h-auto">
                  {@html layout.svg}
                </svg>
              </div>
            </div>
            
            <!-- Layout Info -->
            <div class="space-y-3">
              <div class="flex items-start justify-between">
                <h3 class="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {layout.name}
                </h3>
                <div class="flex gap-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getDifficultyColor(layout.difficulty)}">
                    {layout.difficulty}
                  </span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getCategoryColor(layout.category)}">
                    {layout.category}
                  </span>
                </div>
              </div>
              
              <p class="text-sm text-muted-foreground leading-relaxed">
                {layout.description}
              </p>
              
              <div class="flex items-center justify-between text-sm text-muted-foreground">
                <span>{layout.cardCount} card{layout.cardCount !== 1 ? 's' : ''}</span>
                <span class="text-primary font-medium">View Details →</span>
              </div>
            </div>
          </div>
        </button>
      {/each}
    </div>

    <!-- No Results -->
    {#if filteredLayouts.length === 0}
      <div class="text-center py-12">
        <OccultDivider symbol="moon" class="mb-6" />
        <div class="text-5xl mb-4 opacity-80" aria-hidden="true">◇</div>
        <h3 class="font-display text-xl font-semibold text-foreground mb-2">No layouts found</h3>
        <p class="text-muted-foreground font-body">Try adjusting your search terms or filters</p>
        <OccultDivider symbol="star" class="mt-6" />
      </div>
    {/if}

    <!-- Layout Count -->
    <div class="text-center mt-8 text-muted-foreground font-body text-sm">
      Showing {filteredLayouts.length} of {TAROT_LAYOUTS.length} layouts
    </div>
    </section>
  </div>

  <!-- Layout Detail Modal (Dialog) -->
  <Dialog.Root bind:open={modalOpen}>
    <Dialog.Content class="!max-w-none !w-[95vw] md:!w-[90vw] lg:!w-[85vw] !max-h-[95vh] overflow-y-auto sm:!max-w-none">
      {#if selectedLayout}
        <Dialog.Header>
          <Dialog.Title class="font-display flex items-center gap-3 text-xl tracking-wide">
            {selectedLayout.name}
            <div class="flex gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getDifficultyColor(selectedLayout.difficulty)}">
                {selectedLayout.difficulty}
              </span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getCategoryColor(selectedLayout.category)}">
                {selectedLayout.category}
              </span>
            </div>
          </Dialog.Title>
          <Dialog.Description>
            <p class="text-lg text-muted-foreground">{selectedLayout.description}</p>
            <p class="text-sm text-muted-foreground mt-2">{selectedLayout.cardCount} card{selectedLayout.cardCount !== 1 ? 's' : ''}</p>
          </Dialog.Description>
        </Dialog.Header>
        
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 my-6">
          <!-- Layout Visualization -->
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">Layout Pattern</h3>
              <div class="bg-muted/50 dark:bg-muted rounded-lg p-6 border border-border overflow-visible">
                <svg width="500" height="500" viewBox="0 0 600 500" class="w-full h-auto">
                  {@html selectedLayout.svg}
                </svg>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">Best For</h3>
              <div class="flex flex-wrap gap-2">
                {#each selectedLayout.bestFor as item}
                  <span class="bg-primary/20 dark:bg-primary/30 text-primary px-3 py-1 rounded-full text-sm">
                    {item}
                  </span>
                {/each}
              </div>
            </div>
          </div>
          
          <!-- Layout Details -->
          <div class="space-y-6">
            {#if selectedLayout.id === 'single-card'}
              <div>
                <h3 class="text-lg font-semibold text-foreground mb-4">Suggested questions for your pull</h3>
                <TarotQuestionGenerator compact={true} />
              </div>
            {/if}
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">Instructions</h3>
              <div class="bg-accent/30 dark:bg-accent/20 border border-border rounded-lg p-4">
                <p class="text-foreground leading-relaxed">{selectedLayout.instructions}</p>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">Tips for Reading</h3>
              <ul class="space-y-2">
                {#each selectedLayout.tips as tip}
                  <li class="flex items-start gap-2">
                    <span class="text-primary mt-1">•</span>
                    <span class="text-muted-foreground">{tip}</span>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Card Positions -->
        <div class="border-t border-border pt-6">
          <h3 class="text-xl font-semibold text-foreground mb-6">Card Positions</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each selectedLayout.positions as position}
              <div class="bg-muted/50 dark:bg-muted rounded-lg p-4 border border-border">
                <div class="flex items-center gap-2 mb-2">
                  <span class="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {position.number}
                  </span>
                  <h4 class="font-semibold text-foreground">{position.name}</h4>
                </div>
                <p class="text-sm text-muted-foreground leading-relaxed">{position.description}</p>
              </div>
            {/each}
          </div>
        </div>
        
        <!-- Reading Tips -->
        <div class="border-t border-border pt-6 mt-6">
          <h3 class="text-lg font-semibold text-foreground mb-4">How to Read This Spread</h3>
          <div class="bg-accent/30 dark:bg-accent/20 border border-border rounded-lg p-4">
            <div class="space-y-3">
              <p class="text-foreground leading-relaxed">
                <strong>Start with the central cards:</strong> Begin your interpretation with the core positions that represent the main issue or current situation.
              </p>
              <p class="text-foreground leading-relaxed">
                <strong>Follow the flow:</strong> Read the cards in numerical order to understand the progression and story of your situation.
              </p>
              <p class="text-foreground leading-relaxed">
                <strong>Look for connections:</strong> Notice how cards relate to each other and how their meanings interact across different positions.
              </p>
              <p class="text-foreground leading-relaxed">
                <strong>Trust your intuition:</strong> While card meanings provide structure, your intuitive understanding of the cards in context is equally important.
              </p>
            </div>
          </div>
        </div>
      {/if}
    </Dialog.Content>
  </Dialog.Root>
</div>

<style>
  /* Add any custom styles here if needed */
</style> 