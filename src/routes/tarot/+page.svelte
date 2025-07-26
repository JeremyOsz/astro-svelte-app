<script lang="ts">
  import { onMount } from 'svelte';

  import * as Input from '$lib/components/ui/input';
  import { ALL_TAROT_CARDS, type TarotCard } from '$lib/data/tarot-data';

  let searchTerm = '';
  let selectedSuit = 'all';
  let selectedCard: TarotCard | null = null;
  let showReversed = false;

  const suits = [
    { value: 'all', label: 'All Cards' },
    { value: 'major', label: 'Major Arcana' },
    { value: 'wands', label: 'Wands' },
    { value: 'cups', label: 'Cups' },
    { value: 'swords', label: 'Swords' },
    { value: 'pentacles', label: 'Pentacles' }
  ];

  $: filteredCards = ALL_TAROT_CARDS.filter(card => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return selectedSuit === 'all' || (selectedSuit === 'major' && !card.suit) || card.suit?.toLowerCase() === selectedSuit;
    const inName = card.name.toLowerCase().includes(searchLower);
    const inKeywords = card.keywords.some(keyword => keyword.toLowerCase().includes(searchLower));
    const inSuit = card.suit && card.suit.toLowerCase().includes(searchLower);
    const inUpright = Object.values(card.upright).some(val => val.toLowerCase().includes(searchLower));
    const inReversed = Object.values(card.reversed).some(val => val.toLowerCase().includes(searchLower));
    const matchesSearch = inName || inKeywords || inSuit || inUpright || inReversed;
    const matchesSuit = selectedSuit === 'all' || (selectedSuit === 'major' && !card.suit) || card.suit?.toLowerCase() === selectedSuit;
    return matchesSearch && matchesSuit;
  });
  $: console.log('Search:', searchTerm, 'Results:', filteredCards.length);

  function selectCard(card: TarotCard) {
    selectedCard = card;
    showReversed = false;
  }

  function toggleReversed() {
    showReversed = !showReversed;
  }

  function closeCardDetail() {
    selectedCard = null;
  }


</script>

<svelte:head>
  <title>Tarot Card Meanings & Interpretations | Astro Chart</title>
  <meta name="description" content="Explore the meanings and interpretations of all 78 tarot cards. Find guidance for love, career, health, and general life questions." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Tarot Card Meanings</h1>
      <p class="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
        Explore the wisdom of all 78 tarot cards. Each card holds deep meaning for love, career, health, and life's journey.
      </p>
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-2xl mx-auto">
        <p class="text-sm text-purple-800">
          💡 <strong>How to use:</strong> Click any card to see its detailed interpretation. Use the search and filter options to find specific cards.
        </p>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search Cards</label>
          <Input.Root
            id="search"
            bind:value={searchTerm}
            placeholder="Search by name or keywords..."
            class="w-full"
          />
        </div>
        
        <div>
          <label for="suit" class="block text-sm font-medium text-gray-700 mb-2">Filter by Suit</label>
          <select
            id="suit"
            bind:value={selectedSuit}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {#each suits as suit}
              <option value={suit.value}>{suit.label}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {#each filteredCards as card}
        <button
          on:click={() => selectCard(card)}
          class="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer aspect-[3/5]"
        >
          <div class="w-full h-full relative overflow-hidden rounded-t-lg">
            <img
              src={card.image}
              alt={card.name}
              class="w-full h-full object-cover"
            />
            {#if card.number !== undefined}
              <div class="absolute top-2 left-2 bg-white bg-opacity-90 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-800">
                {card.number}
              </div>
            {/if}
          </div>
          <div class="absolute bottom-0 left-0 right-0 p-2 bg-white bg-opacity-90">
            <h3 class="text-xs font-semibold text-gray-900 truncate">{card.name}</h3>
            {#if card.suit}
              <p class="text-xs text-gray-500">{card.suit}</p>
            {/if}
          </div>
        </button>
      {/each}
    </div>

    <!-- No Results -->
    {#if filteredCards.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">🔮</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No cards found</h3>
        <p class="text-gray-600">Try adjusting your search terms or filters</p>
      </div>
    {/if}

    <!-- Card Count -->
    <div class="text-center mt-8 text-gray-600">
      Showing {filteredCards.length} of {ALL_TAROT_CARDS.length} cards
    </div>
  </div>

  <!-- Card Detail Modal -->
  {#if selectedCard}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <!-- Header -->
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{selectedCard.name}</h2>
              {#if selectedCard.suit}
                <p class="text-lg text-gray-600">{selectedCard.suit}</p>
              {/if}
              {#if selectedCard.element}
                <p class="text-sm text-gray-500">Element: {selectedCard.element}</p>
              {/if}
              {#if selectedCard.planet}
                <p class="text-sm text-gray-500">Planet: {selectedCard.planet}</p>
              {/if}
              {#if selectedCard.zodiac}
                <p class="text-sm text-gray-500">Zodiac: {selectedCard.zodiac}</p>
              {/if}
            </div>
            <button
              on:click={closeCardDetail}
              class="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Card Image and Keywords -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div class="flex justify-center">
              <div class="relative">
                <img
                  src={selectedCard.image}
                  alt={selectedCard.name}
                  class="max-w-full h-auto rounded-lg shadow-lg"
                  style="max-height: 400px;"
                />
                {#if showReversed}
                  <div class="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span class="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                      REVERSED
                    </span>
                  </div>
                {/if}
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Keywords</h3>
              <div class="flex flex-wrap gap-2 mb-6">
                {#each selectedCard.keywords as keyword}
                  <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    {keyword}
                  </span>
                {/each}
              </div>
              
              <div class="flex gap-2 mb-4">
                <button
                  class="px-4 py-2 text-sm font-medium rounded-md transition-colors {!showReversed ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
                  on:click={() => showReversed = false}
                >
                  Upright
                </button>
                <button
                  class="px-4 py-2 text-sm font-medium rounded-md transition-colors {showReversed ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
                  on:click={() => showReversed = true}
                >
                  Reversed
                </button>
              </div>
            </div>
          </div>

          <!-- Interpretations -->
          <div class="space-y-4">
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 mb-2">General Meaning</h4>
              <p class="text-gray-700 leading-relaxed">
                {showReversed ? selectedCard.reversed.general : selectedCard.upright.general}
              </p>
            </div>

            <div class="border rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 mb-2">Love & Relationships</h4>
              <p class="text-gray-700 leading-relaxed">
                {showReversed ? selectedCard.reversed.love : selectedCard.upright.love}
              </p>
            </div>

            <div class="border rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 mb-2">Career & Work</h4>
              <p class="text-gray-700 leading-relaxed">
                {showReversed ? selectedCard.reversed.career : selectedCard.upright.career}
              </p>
            </div>

            <div class="border rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 mb-2">Health & Wellness</h4>
              <p class="text-gray-700 leading-relaxed">
                {showReversed ? selectedCard.reversed.health : selectedCard.upright.health}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Add any custom styles here if needed */
</style> 