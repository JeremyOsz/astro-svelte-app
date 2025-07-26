<script lang="ts">
  import { onMount } from 'svelte';

  import * as Input from '$lib/components/ui/input';
  import * as Dialog from '$lib/components/ui/dialog';
  import { ALL_TAROT_CARDS, type TarotCard } from '$lib/data/tarot-data';

  let searchTerm = '';
  let selectedSuit = 'all';
  let selectedCard: TarotCard | null = null;
  let showReversed = false;
  let modalOpen = false;

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
    modalOpen = true;
  }

  function toggleReversed() {
    showReversed = !showReversed;
  }

  function closeCardDetail() {
    selectedCard = null;
    modalOpen = false;
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

    <!-- Historical Background -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">The History of Tarot</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-700">
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">Origins</h3>
            <p class="text-sm leading-relaxed">
              The tarot's origins trace back to 15th century Italy, where the first known decks were created as playing cards. 
              The Major Arcana evolved from medieval allegorical imagery and Renaissance symbolism, incorporating elements from 
              Christian mysticism, classical mythology, and esoteric traditions.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">The Fool's Journey</h3>
            <p class="text-sm leading-relaxed">
              The Major Arcana tells the story of "The Fool's Journey" - a metaphorical path of spiritual development. 
              Beginning with The Fool (0) representing innocence and new beginnings, the journey progresses through 
              various life experiences, challenges, and spiritual revelations, culminating in The World (21) representing 
              completion and wholeness.
            </p>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">Historical Development</h3>
            <p class="text-sm leading-relaxed">
              Throughout history, the Major Arcana has been associated with various mystical and philosophical traditions. 
              In the 18th and 19th centuries, occultists like Antoine Court de Gébelin and Éliphas Lévi connected the tarot 
              to ancient Egyptian wisdom and Kabbalistic teachings.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">Modern Tarot</h3>
            <p class="text-sm leading-relaxed">
              The Rider-Waite-Smith deck, published in 1909, revolutionized tarot interpretation by adding detailed symbolic 
              imagery to all 78 cards. Today, tarot serves as a powerful tool for self-reflection, spiritual guidance, and 
              psychological insight.
            </p>
          </div>
        </div>
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
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {#each filteredCards as card}
        <button
          on:click={() => selectCard(card)}
          class="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer aspect-[3/5]"
        >
          <div class="w-full h-full relative overflow-hidden rounded-t-lg">
            <img
              src={card.image}
              alt={card.name}
              class="w-full h-full"
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

  <!-- Card Detail Modal (Dialog) -->
  <Dialog.Root bind:open={modalOpen}>
    <Dialog.Content class="!max-w-none !w-[95vw] md:!w-[80vw] lg:!w-[75vw] !max-h-[95vh] overflow-y-auto sm:!max-w-none">
      {#if selectedCard}
        <Dialog.Header>
          <Dialog.Title>{selectedCard.name}</Dialog.Title>
          <Dialog.Description>
            {#if selectedCard.suit}
              <span class="text-lg text-gray-600">{selectedCard.suit}</span>
            {/if}
            <div class="mt-3 space-y-1">
              {#if selectedCard.element || selectedCard.planet || selectedCard.zodiac}
                <div class="flex flex-wrap gap-3">
                  {#if selectedCard.element}
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedCard.element}
                    </span>
                  {/if}
                  {#if selectedCard.planet}
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {selectedCard.planet}
                    </span>
                  {/if}
                  {#if selectedCard.zodiac}
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {selectedCard.zodiac}
                    </span>
                  {/if}
                </div>
              {/if}
            </div>
          </Dialog.Description>
        </Dialog.Header>
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 my-6">
          <div class="flex items-center justify-center">
            <div class="relative">
              <img
                src={selectedCard.image}
                alt={selectedCard.name}
                class="max-w-full h-auto rounded-lg shadow-lg transition-transform duration-300"
                style="max-height: 400px; {showReversed ? 'transform: rotate(180deg);' : ''}"
              />
            </div>
          </div>
          <div class="col-span-1 lg:mr-12">
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
            <!-- Astrological Significance -->
            {#if selectedCard.element || selectedCard.planet || selectedCard.zodiac}
              <div class="border-t py-4">
                <h4 class="text-sm font-semibold text-gray-900 mb-2">Astrological Significance</h4>
                <div class="text-sm text-gray-600 space-y-1">
                  {#if selectedCard.element}
                    <p><span class="font-medium">Element {selectedCard.element}:</span> 
                      {#if selectedCard.element === 'Fire'}
                        Dynamic energy, passion, and transformation
                      {:else if selectedCard.element === 'Earth'}
                        Stability, practicality, and material concerns
                      {:else if selectedCard.element === 'Air'}
                        Intellectual energy, communication, and ideas
                      {:else if selectedCard.element === 'Water'}
                        Emotional energy, intuition, and spiritual depth
                      {/if}
                    </p>
                  {/if}
                  {#if selectedCard.planet}
                    <p><span class="font-medium">Ruled by {selectedCard.planet}:</span> 
                      {#if selectedCard.planet === 'Sun'}
                        Vitality, ego, and conscious self-expression
                      {:else if selectedCard.planet === 'Moon'}
                        Emotions, intuition, and subconscious patterns
                      {:else if selectedCard.planet === 'Mercury'}
                        Communication, intellect, and adaptability
                      {:else if selectedCard.planet === 'Venus'}
                        Love, beauty, and harmonious relationships
                      {:else if selectedCard.planet === 'Mars'}
                        Action, courage, and assertive energy
                      {:else if selectedCard.planet === 'Jupiter'}
                        Expansion, wisdom, and spiritual growth
                      {:else if selectedCard.planet === 'Saturn'}
                        Structure, discipline, and life lessons
                      {:else if selectedCard.planet === 'Uranus'}
                        Innovation, rebellion, and sudden change
                      {:else if selectedCard.planet === 'Neptune'}
                        Dreams, spirituality, and transcendence
                      {:else if selectedCard.planet === 'Pluto'}
                        Transformation, power, and deep change
                      {/if}
                    </p>
                  {/if}
                  {#if selectedCard.zodiac}
                    <p><span class="font-medium">Associated with {selectedCard.zodiac}:</span> 
                      {#if selectedCard.zodiac === 'Aries'}
                        Pioneering spirit, courage, and new beginnings
                      {:else if selectedCard.zodiac === 'Taurus'}
                        Stability, sensuality, and material security
                      {:else if selectedCard.zodiac === 'Gemini'}
                        Communication, curiosity, and adaptability
                      {:else if selectedCard.zodiac === 'Cancer'}
                        Emotional depth, nurturing, and intuition
                      {:else if selectedCard.zodiac === 'Leo'}
                        Creative expression, leadership, and confidence
                      {:else if selectedCard.zodiac === 'Virgo'}
                        Practicality, service, and attention to detail
                      {:else if selectedCard.zodiac === 'Libra'}
                        Balance, harmony, and relationship focus
                      {:else if selectedCard.zodiac === 'Scorpio'}
                        Transformation, intensity, and deep insight
                      {:else if selectedCard.zodiac === 'Sagittarius'}
                        Adventure, wisdom, and spiritual quest
                      {:else if selectedCard.zodiac === 'Capricorn'}
                        Ambition, structure, and long-term goals
                      {:else if selectedCard.zodiac === 'Aquarius'}
                        Innovation, humanitarianism, and individuality
                      {:else if selectedCard.zodiac === 'Pisces'}
                        Compassion, spirituality, and artistic sensitivity
                      {/if}
                    </p>
                  {/if}
                </div>
              </div>
            {/if}

            <!-- Symbology -->
            {#if selectedCard.symbology}
              <div class="border-t pt-4">
                <h4 class="text-sm font-semibold text-gray-900 mb-2">Symbolism & Meaning</h4>
                <div class="space-y-3">
                  {#if selectedCard.symbology.symbols && selectedCard.symbology.symbols.length > 0}
                    <div>
                      <h5 class="text-xs font-medium text-gray-700 mb-1">Key Symbols</h5>
                      <div class="flex flex-wrap gap-1">
                        {#each selectedCard.symbology.symbols as symbol}
                          <span class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                            {symbol}
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                  
                  {#if selectedCard.symbology.colors && selectedCard.symbology.colors.length > 0}
                    <div>
                      <h5 class="text-xs font-medium text-gray-700 mb-1">Colors</h5>
                      <div class="flex flex-wrap gap-1">
                        {#each selectedCard.symbology.colors as color}
                          <span class="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                            {color}
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                  
                  {#if selectedCard.symbology.numbers && selectedCard.symbology.numbers.length > 0}
                    <div>
                      <h5 class="text-xs font-medium text-gray-700 mb-1">Numbers</h5>
                      <div class="flex flex-wrap gap-1">
                        {#each selectedCard.symbology.numbers as number}
                          <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {number}
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                  
                  {#if selectedCard.symbology.animals && selectedCard.symbology.animals.length > 0}
                    <div>
                      <h5 class="text-xs font-medium text-gray-700 mb-1">Animals</h5>
                      <div class="flex flex-wrap gap-1">
                        {#each selectedCard.symbology.animals as animal}
                          <span class="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                            {animal}
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                  
                  {#if selectedCard.symbology.objects && selectedCard.symbology.objects.length > 0}
                    <div>
                      <h5 class="text-xs font-medium text-gray-700 mb-1">Objects</h5>
                      <div class="flex flex-wrap gap-1">
                        {#each selectedCard.symbology.objects as object}
                          <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                            {object}
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                  
                  {#if selectedCard.symbology.elements && selectedCard.symbology.elements.length > 0}
                    <div>
                      <h5 class="text-xs font-medium text-gray-700 mb-1">Elements</h5>
                      <div class="flex flex-wrap gap-1">
                        {#each selectedCard.symbology.elements as element}
                          <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {element}
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        </div>
        <!-- Card-Specific Historical Information -->
        {#if selectedCard.historical}
          <div class="border rounded-lg p-6 bg-gray-50">
            <h4 class="font-semibold text-gray-900 mb-4 text-lg">Card Background</h4>
            <div class="text-gray-700 space-y-4">
              <p class="text-sm leading-relaxed">
                {selectedCard.historical}
              </p>
            </div>
          </div>
        {/if}
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

        
      {/if}
    </Dialog.Content>
  </Dialog.Root>
</div>

<style>
  /* Add any custom styles here if needed */
</style> 