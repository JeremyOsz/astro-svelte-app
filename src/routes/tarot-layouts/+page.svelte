<script lang="ts">
  import { onMount } from 'svelte';

  import * as Input from '$lib/components/ui/input';
  import * as Dialog from '$lib/components/ui/dialog';
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

  $: filteredLayouts = TAROT_LAYOUTS.filter(layout => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) {
      const matchesCategory = selectedCategory === 'all' || layout.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || layout.difficulty === selectedDifficulty;
      return matchesCategory && matchesDifficulty;
    }
    
    const inName = layout.name.toLowerCase().includes(searchLower);
    const inDescription = layout.description.toLowerCase().includes(searchLower);
    const inBestFor = layout.bestFor.some(item => item.toLowerCase().includes(searchLower));
    const inTips = layout.tips.some(tip => tip.toLowerCase().includes(searchLower));
    const matchesSearch = inName || inDescription || inBestFor || inTips;
    
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
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function getCategoryColor(category: string) {
    switch (category) {
      case 'Love':
        return 'bg-pink-100 text-pink-800';
      case 'Career':
        return 'bg-blue-100 text-blue-800';
      case 'Spiritual':
        return 'bg-purple-100 text-purple-800';
      case 'Problem-Solving':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
</script>

<svelte:head>
  <title>Tarot Layouts & Spreads | Astro Chart</title>
  <meta name="description" content="Explore tarot layouts and spreads for different purposes. From simple one-card readings to complex spreads like the Celtic Cross." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Tarot Layouts & Spreads</h1>
      <p class="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
        Discover the art of tarot spreads. Each layout offers a unique way to explore your questions and find guidance through the cards.
      </p>
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-2xl mx-auto">
        <p class="text-sm text-purple-800">
          💡 <strong>How to use:</strong> Click any layout to see detailed instructions and card positions. Use filters to find spreads for your specific needs.
        </p>
      </div>
    </div>

    <!-- Historical Background -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">The Art of Tarot Spreads</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-700">
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">What Are Spreads?</h3>
            <p class="text-sm leading-relaxed">
              Tarot spreads are specific arrangements of cards that create a framework for interpretation. Each position in a spread has a particular meaning, 
              allowing for deeper insights than reading cards in isolation. The layout itself often holds symbolic significance.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">Choosing the Right Spread</h3>
            <p class="text-sm leading-relaxed">
              The best spread depends on your question, experience level, and the depth of insight you seek. Simple spreads are perfect for daily guidance, 
              while complex spreads like the Celtic Cross offer comprehensive analysis for important life decisions.
            </p>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">Reading Techniques</h3>
            <p class="text-sm leading-relaxed">
              When reading a spread, consider both individual card meanings and their relationships to each other. Look for patterns, 
              connections, and the story that emerges from the cards' positions and interactions.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">Intuition & Practice</h3>
            <p class="text-sm leading-relaxed">
              While understanding card meanings is important, trust your intuition. The more you practice with different spreads, 
              the more you'll develop your own reading style and deepen your connection with the cards.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search Layouts</label>
          <Input.Root
            id="search"
            bind:value={searchTerm}
            placeholder="Search by name or description..."
            class="w-full"
          />
        </div>
        
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
          <select
            id="category"
            bind:value={selectedCategory}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {#each categories as category}
              <option value={category.value}>{category.label}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="difficulty" class="block text-sm font-medium text-gray-700 mb-2">Filter by Difficulty</label>
          <select
            id="difficulty"
            bind:value={selectedDifficulty}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {#each difficulties as difficulty}
              <option value={difficulty.value}>{difficulty.label}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <!-- Layouts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredLayouts as layout}
        <button
          on:click={() => selectLayout(layout)}
          class="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-left"
        >
          <div class="p-6">
            <!-- SVG Layout Preview -->
            <div class="mb-4 flex justify-center">
              <div class="relative bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-hidden">
                <svg width="350" height="250" viewBox="0 0 600 400" class="w-full h-auto">
                  {@html layout.svg}
                </svg>
              </div>
            </div>
            
            <!-- Layout Info -->
            <div class="space-y-3">
              <div class="flex items-start justify-between">
                <h3 class="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
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
              
              <p class="text-sm text-gray-600 leading-relaxed">
                {layout.description}
              </p>
              
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span>{layout.cardCount} card{layout.cardCount !== 1 ? 's' : ''}</span>
                <span class="text-purple-600 font-medium">View Details →</span>
              </div>
            </div>
          </div>
        </button>
      {/each}
    </div>

    <!-- No Results -->
    {#if filteredLayouts.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">🔮</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No layouts found</h3>
        <p class="text-gray-600">Try adjusting your search terms or filters</p>
      </div>
    {/if}

    <!-- Layout Count -->
    <div class="text-center mt-8 text-gray-600">
      Showing {filteredLayouts.length} of {TAROT_LAYOUTS.length} layouts
    </div>
  </div>

  <!-- Layout Detail Modal (Dialog) -->
  <Dialog.Root bind:open={modalOpen}>
    <Dialog.Content class="!max-w-none !w-[95vw] md:!w-[90vw] lg:!w-[85vw] !max-h-[95vh] overflow-y-auto sm:!max-w-none">
      {#if selectedLayout}
        <Dialog.Header>
          <Dialog.Title class="flex items-center gap-3">
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
            <p class="text-lg text-gray-600">{selectedLayout.description}</p>
            <p class="text-sm text-gray-500 mt-2">{selectedLayout.cardCount} card{selectedLayout.cardCount !== 1 ? 's' : ''}</p>
          </Dialog.Description>
        </Dialog.Header>
        
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 my-6">
          <!-- Layout Visualization -->
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Layout Pattern</h3>
              <div class="bg-gray-50 rounded-lg p-6 border border-gray-200 overflow-visible">
                <svg width="500" height="500" viewBox="0 0 600 500" class="w-full h-auto">
                  {@html selectedLayout.svg}
                </svg>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Best For</h3>
              <div class="flex flex-wrap gap-2">
                {#each selectedLayout.bestFor as item}
                  <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    {item}
                  </span>
                {/each}
              </div>
            </div>
          </div>
          
          <!-- Layout Details -->
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p class="text-gray-700 leading-relaxed">{selectedLayout.instructions}</p>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Tips for Reading</h3>
              <ul class="space-y-2">
                {#each selectedLayout.tips as tip}
                  <li class="flex items-start gap-2">
                    <span class="text-purple-500 mt-1">•</span>
                    <span class="text-gray-700">{tip}</span>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Card Positions -->
        <div class="border-t pt-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-6">Card Positions</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each selectedLayout.positions as position}
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="flex items-center gap-2 mb-2">
                  <span class="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {position.number}
                  </span>
                  <h4 class="font-semibold text-gray-900">{position.name}</h4>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed">{position.description}</p>
              </div>
            {/each}
          </div>
        </div>
        
        <!-- Reading Tips -->
        <div class="border-t pt-6 mt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">How to Read This Spread</h3>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="space-y-3">
              <p class="text-gray-700 leading-relaxed">
                <strong>Start with the central cards:</strong> Begin your interpretation with the core positions that represent the main issue or current situation.
              </p>
              <p class="text-gray-700 leading-relaxed">
                <strong>Follow the flow:</strong> Read the cards in numerical order to understand the progression and story of your situation.
              </p>
              <p class="text-gray-700 leading-relaxed">
                <strong>Look for connections:</strong> Notice how cards relate to each other and how their meanings interact across different positions.
              </p>
              <p class="text-gray-700 leading-relaxed">
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