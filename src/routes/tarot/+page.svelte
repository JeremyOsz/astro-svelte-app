<script lang="ts">
  import { onMount } from 'svelte';
  import PageInsightChat from '$lib/components/PageInsightChat.svelte';

  import * as Input from '$lib/components/ui/input';
  import * as Dialog from '$lib/components/ui/dialog';
  import { OccultDivider, SectionHeader, OccultCard } from '$lib/components/occult';
  import {
    ALL_TAROT_CARDS,
    getRandomCard,
    getElementDescription,
    getPlanetDescription,
    getZodiacDescription,
    type TarotCard
  } from '$lib/data/tarot-data';
  import { buildTarotPageContext } from '$lib/page-chat/context-builders';
  import { env as publicEnv } from '$env/dynamic/public';

  let searchTerm = '';
  let selectedSuit = 'all';
  let selectedCard: TarotCard | null = null;
  let showReversed = false;
  let modalOpen = false;
  let chatContext = '';
  let chatSuggestions: string[] = [];

  const AI_CHAT_ENABLED = publicEnv.PUBLIC_ENABLE_AI_CHAT === 'true';

  const suits = [
    { value: 'all', label: 'All Cards' },
    { value: 'major', label: 'Major Arcana' },
    { value: 'wands', label: 'Wands' },
    { value: 'cups', label: 'Cups' },
    { value: 'swords', label: 'Swords' },
    { value: 'pentacles', label: 'Pentacles' }
  ];

  /** Common words to ignore in search so "king of cups" matches King of Cups, not every "X of Cups". */
  const SEARCH_STOPWORDS = new Set(['of', 'the', 'a', 'an', 'and', 'or', 'in', 'to', 'for', 'with', 'on', 'at', 'by', 'as', 'is', 'it']);

  /** Build one searchable string from all card text so we can do multi-word search. */
  function getCardSearchText(card: TarotCard): string {
    const parts = [
      card.name,
      ...card.keywords,
      card.suit ?? '',
      ...Object.values(card.upright),
      ...Object.values(card.reversed),
      card.element ?? '',
      card.planet ?? '',
      card.zodiac ?? '',
      card.historical ?? '',
      ...(card.symbology?.symbols ?? []),
      ...(card.symbology?.colors ?? []),
      ...(card.symbology?.numbers ?? []),
      ...(card.symbology?.animals ?? []),
      ...(card.symbology?.objects ?? []),
      ...(card.symbology?.elements ?? [])
    ].filter(Boolean);
    return parts.join(' ').toLowerCase();
  }

  /** Relevance score: name match ranks highest, then keywords/suit, then other text. */
  function getCardSearchScore(card: TarotCard, words: string[]): number {
    if (words.length === 0) return 0;
    const nameLower = card.name.toLowerCase();
    const keywordsLower = card.keywords.map(k => k.toLowerCase());
    const suitLower = card.suit?.toLowerCase() ?? '';
    let score = 0;
    for (const word of words) {
      if (nameLower.includes(word)) score += 10;
      else if (keywordsLower.some(k => k.includes(word)) || suitLower.includes(word)) score += 5;
      else score += 1;
    }
    return score;
  }

  $: filteredCards = (() => {
    const searchLower = searchTerm.toLowerCase().trim();
    const words = searchLower.split(/\s+/).filter(w => w && !SEARCH_STOPWORDS.has(w));
    const filtered = ALL_TAROT_CARDS.filter(card => {
      if (!searchLower) return selectedSuit === 'all' || (selectedSuit === 'major' && !card.suit) || card.suit?.toLowerCase() === selectedSuit;
      const searchableText = getCardSearchText(card);
      const matchesSearch = words.length === 0 || words.every(word => searchableText.includes(word));
      const matchesSuit = selectedSuit === 'all' || (selectedSuit === 'major' && !card.suit) || card.suit?.toLowerCase() === selectedSuit;
      return matchesSearch && matchesSuit;
    });
    if (words.length === 0) return filtered;
    return [...filtered].sort((a, b) => getCardSearchScore(b, words) - getCardSearchScore(a, words));
  })();

  $: chatContext = buildTarotPageContext({
    searchTerm,
    selectedSuit,
    filteredCount: filteredCards.length,
    totalCount: ALL_TAROT_CARDS.length,
    showReversed,
    selectedCard
  });

  $: chatSuggestions = selectedCard
    ? [
        `What is the core lesson of ${selectedCard.name}?`,
        `How should I read ${selectedCard.name} in ${showReversed ? 'reversed' : 'upright'} form?`,
        'What details on this card matter most?'
      ]
    : [
        'Help me choose a card focus from this page.',
        'What does the current filter suggest?',
        'How should I start exploring tarot meanings here?'
      ];

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

  function pullRandomCard() {
    const { card, reversed } = getRandomCard();
    selectedCard = card;
    showReversed = reversed;
    modalOpen = true;
  }
</script>

<svelte:head>
  <title>Tarot Card Meanings & Interpretations | Astro Chart</title>
  <meta name="description" content="Explore the meanings and interpretations of all 78 tarot cards. Find guidance for love, career, health, and general life questions." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-background via-card/50 to-muted/60 dark:from-background dark:via-card/80 dark:to-muted/40">
  <div class="w-full max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
    <!-- Page title -->
    <header class="text-center mb-10">
      <OccultDivider symbol="star" class="mb-6" />
      <h1 class="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-wide mb-3">Tarot Card Meanings</h1>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto mb-6 font-body">
        Explore the wisdom of all 78 tarot cards. Each card holds deep meaning for love, career, health, and life's journey.
      </p>
      <div class="inline-block max-w-2xl">
        <OccultCard corners={true} class="!py-4 !px-5">
          <p class="text-sm text-foreground font-body text-center">
            <strong>How to use:</strong> Click any card to see its detailed interpretation. Use the search and filter options to find specific cards.
          </p>
        </OccultCard>
      </div>
      <OccultDivider symbol="moon" class="mt-6" />
    </header>

    <!-- The History of Tarot -->
    <section class="mb-10">
      <SectionHeader title="The History of Tarot" symbol="moon" class="mb-4" />
      <OccultCard corners={true}>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 text-muted-foreground">
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold text-foreground mb-2">Origins</h3>
            <p class="text-sm leading-relaxed">
              The tarot's origins trace back to 15th century Italy, where the first known decks were created as playing cards. 
              The Major Arcana evolved from medieval allegorical imagery and Renaissance symbolism, incorporating elements from 
              Christian mysticism, classical mythology, and esoteric traditions.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-foreground mb-2">The Fool's Journey</h3>
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
            <h3 class="font-semibold text-foreground mb-2">Historical Development</h3>
            <p class="text-sm leading-relaxed">
              Throughout history, the Major Arcana has been associated with various mystical and philosophical traditions. 
              In the 18th and 19th centuries, occultists like Antoine Court de Gébelin and Éliphas Lévi connected the tarot 
              to ancient Egyptian wisdom and Kabbalistic teachings.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-foreground mb-2">Modern Tarot</h3>
            <p class="text-sm leading-relaxed">
              The Rider-Waite-Smith deck, published in 1909, revolutionized tarot interpretation by adding detailed symbolic 
              imagery to all 78 cards. Today, tarot serves as a powerful tool for self-reflection, spiritual guidance, and 
              psychological insight.
            </p>
          </div>
        </div>
      </div>
      </OccultCard>
    </section>

    <!-- Search and Filters -->
    <section class="mb-8">
      <SectionHeader title="Find Cards" symbol="star" class="mb-4" />
      <OccultCard corners={true}>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="search" class="block text-sm font-medium text-muted-foreground mb-2">Search Cards</label>
          <Input.Root
            id="search"
            bind:value={searchTerm}
            placeholder="Search by name or keywords..."
            class="w-full"
          />
        </div>
        
        <div>
          <label for="suit" class="block text-sm font-medium text-muted-foreground mb-2">Filter by Suit</label>
          <select
            id="suit"
            bind:value={selectedSuit}
            class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            {#each suits as suit}
              <option value={suit.value}>{suit.label}</option>
            {/each}
          </select>
        </div>
      </div>
      </OccultCard>
    </section>

    <!-- Random card pull & Explore layouts -->
    <div class="flex flex-wrap justify-center gap-4 mb-8">
      <button
        type="button"
        on:click={pullRandomCard}
        class="btn-occult inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-display font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] shadow-md border border-primary/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Pull a random card
      </button>
      <a
        href="/tarot-layouts"
        class="occult-border-thick inline-flex items-center gap-2 border-2 border-primary text-primary bg-transparent px-6 py-3 rounded-lg font-display font-medium hover:bg-primary/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Explore Tarot Layouts
      </a>
    </div>

    <!-- Cards Grid -->
    <section class="mb-8">
      <SectionHeader title="The Deck" symbol="moon" class="mb-6" />
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {#each filteredCards as card}
        <button
          on:click={() => selectCard(card)}
          class="group relative bg-card rounded-lg shadow-md hover:shadow-lg border border-border occult-border transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer aspect-[3/5] overflow-hidden"
        >
          <div class="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-primary/40 rounded-tl z-10" aria-hidden="true"></div>
          <div class="w-full h-full relative overflow-hidden rounded-t-lg">
            <img
              src={card.image}
              alt={card.name}
              class="w-full h-full"
            />
            {#if card.number !== undefined}
              <div class="absolute top-2 left-2 bg-card/95 dark:bg-card border border-border rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-foreground">
                {card.number}
              </div>
            {/if}
          </div>
          <div class="absolute bottom-0 left-0 right-0 p-2 bg-card/95 dark:bg-card border-t border-border">
            <h3 class="text-xs font-display font-semibold text-foreground truncate">{card.name}</h3>
            {#if card.suit}
              <p class="text-xs text-muted-foreground">{card.suit}</p>
            {/if}
          </div>
        </button>
      {/each}
    </div>

    <!-- No Results -->
    {#if filteredCards.length === 0}
      <div class="text-center py-12">
        <OccultDivider symbol="moon" class="mb-6" />
        <div class="text-5xl mb-4 opacity-80" aria-hidden="true">◇</div>
        <h3 class="font-display text-xl font-semibold text-foreground mb-2">No cards found</h3>
        <p class="text-muted-foreground font-body">Try adjusting your search terms or filters</p>
        <OccultDivider symbol="star" class="mt-6" />
      </div>
    {/if}

    <!-- Card Count -->
    <div class="text-center mt-6 text-muted-foreground font-body text-sm">
      Showing {filteredCards.length} of {ALL_TAROT_CARDS.length} cards
    </div>
    </section>

    <!-- Ask the Arcana -->
    <section class="mt-10">
      <SectionHeader title="Ask the Arcana" symbol="star" class="mb-4" />
      <OccultCard corners={true}>
        {#if AI_CHAT_ENABLED}
          <div>
            <PageInsightChat
              title="Ask the Arcana"
              description="Chat with the current tarot filter state and selected card details as context."
              contextSummary={chatContext}
              suggestions={chatSuggestions}
            />
          </div>
        {/if}
      </OccultCard>
    </section>
  </div>

  <!-- Card Detail Modal (Dialog) -->
  <Dialog.Root bind:open={modalOpen}>
    <Dialog.Content class="!max-w-none !w-[95vw] md:!w-[80vw] lg:!w-[75vw] !max-h-[95vh] overflow-y-auto sm:!max-w-none">
      {#if selectedCard}
        <Dialog.Header>
          <Dialog.Title class="font-display text-xl tracking-wide">{selectedCard.name}</Dialog.Title>
          <Dialog.Description>
            {#if selectedCard.suit}
              <span class="text-lg text-muted-foreground">{selectedCard.suit}</span>
            {/if}
            <div class="mt-3 space-y-1">
              {#if selectedCard.element || selectedCard.planet || selectedCard.zodiac}
                <div class="flex flex-wrap gap-3">
                  {#if selectedCard.element}
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                      {selectedCard.element}
                    </span>
                  {/if}
                  {#if selectedCard.planet}
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                      {selectedCard.planet}
                    </span>
                  {/if}
                  {#if selectedCard.zodiac}
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
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
            <h3 class="text-lg font-semibold text-foreground mb-3">Keywords</h3>
            <div class="flex flex-wrap gap-2 mb-6">
              {#each selectedCard.keywords as keyword}
                <span class="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                  {keyword}
                </span>
              {/each}
            </div>
            <div class="flex gap-2 mb-4">
              <button
                class="px-4 py-2 text-sm font-medium rounded-md transition-colors {!showReversed ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'}"
                on:click={() => showReversed = false}
              >
                Upright
              </button>
              <button
                class="px-4 py-2 text-sm font-medium rounded-md transition-colors {showReversed ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'}"
                on:click={() => showReversed = true}
              >
                Reversed
              </button>
            </div>
            <!-- Astrological Significance (from centralized data) -->
            {#if selectedCard.element || selectedCard.planet || selectedCard.zodiac}
              <div class="border-t border-border py-4">
                <h4 class="text-sm font-semibold text-foreground mb-2">Astrological Significance</h4>
                <div class="text-sm text-muted-foreground space-y-1">
                  {#if selectedCard.element && getElementDescription(selectedCard.element)}
                    <p><span class="font-medium text-foreground">Element {selectedCard.element}:</span> {getElementDescription(selectedCard.element)}</p>
                  {/if}
                  {#if selectedCard.planet && getPlanetDescription(selectedCard.planet)}
                    <p><span class="font-medium text-foreground">Ruled by {selectedCard.planet}:</span> {getPlanetDescription(selectedCard.planet)}</p>
                  {/if}
                  {#if selectedCard.zodiac && getZodiacDescription(selectedCard.zodiac)}
                    <p><span class="font-medium text-foreground">Associated with {selectedCard.zodiac}:</span> {getZodiacDescription(selectedCard.zodiac)}</p>
                  {/if}
                </div>
              </div>
            {/if}

            <!-- Symbology -->
            {#if selectedCard.symbology}
              <div class="border-t border-border pt-4">
                <h4 class="text-sm font-semibold text-foreground mb-2">Symbolism & Meaning</h4>
                <div class="space-y-3">
                  {#if selectedCard.symbology.symbols && selectedCard.symbology.symbols.length > 0}
                    <div>
                      <h5 class="text-xs font-medium text-muted-foreground mb-1">Key Symbols</h5>
                      <div class="flex flex-wrap gap-1">
                        {#each selectedCard.symbology.symbols as symbol}
                          <span class="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                            {symbol}
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                  {#if selectedCard.symbology.colors && selectedCard.symbology.colors.length > 0}
                    <div>
                      <h5 class="text-xs font-medium text-muted-foreground mb-1">Colors</h5>
                      <div class="flex flex-wrap gap-1">
                        {#each selectedCard.symbology.colors as color}
                          <span class="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                            {color}
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                  {#if selectedCard.symbology.numbers && selectedCard.symbology.numbers.length > 0}
                    <div>
                      <h5 class="text-xs font-medium text-muted-foreground mb-1">Numbers</h5>
                      <div class="flex flex-wrap gap-1">
                        {#each selectedCard.symbology.numbers as number}
                          <span class="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                            {number}
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                  {#if selectedCard.symbology.animals && selectedCard.symbology.animals.length > 0}
                    <div>
                      <h5 class="text-xs font-medium text-muted-foreground mb-1">Animals</h5>
                      <div class="flex flex-wrap gap-1">
                        {#each selectedCard.symbology.animals as animal}
                          <span class="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                            {animal}
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                  {#if selectedCard.symbology.objects && selectedCard.symbology.objects.length > 0}
                    <div>
                      <h5 class="text-xs font-medium text-muted-foreground mb-1">Objects</h5>
                      <div class="flex flex-wrap gap-1">
                        {#each selectedCard.symbology.objects as object}
                          <span class="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                            {object}
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                  {#if selectedCard.symbology.elements && selectedCard.symbology.elements.length > 0}
                    <div>
                      <h5 class="text-xs font-medium text-muted-foreground mb-1">Elements</h5>
                      <div class="flex flex-wrap gap-1">
                        {#each selectedCard.symbology.elements as element}
                          <span class="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
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
          <div class="border border-border rounded-lg p-6 bg-muted/50 dark:bg-muted">
            <h4 class="font-semibold text-foreground mb-4 text-lg">Card Background</h4>
            <div class="text-muted-foreground space-y-4">
              <p class="text-sm leading-relaxed">
                {selectedCard.historical}
              </p>
            </div>
          </div>
        {/if}
        <!-- Interpretations -->
        <div class="space-y-4">
          <div class="border border-border rounded-lg p-4 bg-card">
            <h4 class="font-semibold text-foreground mb-2">General Meaning</h4>
            <p class="text-foreground leading-relaxed">
              {showReversed ? selectedCard.reversed.general : selectedCard.upright.general}
            </p>
          </div>
          <div class="border border-border rounded-lg p-4 bg-card">
            <h4 class="font-semibold text-foreground mb-2">Love & Relationships</h4>
            <p class="text-foreground leading-relaxed">
              {showReversed ? selectedCard.reversed.love : selectedCard.upright.love}
            </p>
          </div>
          <div class="border border-border rounded-lg p-4 bg-card">
            <h4 class="font-semibold text-foreground mb-2">Career & Work</h4>
            <p class="text-foreground leading-relaxed">
              {showReversed ? selectedCard.reversed.career : selectedCard.upright.career}
            </p>
          </div>
          <div class="border border-border rounded-lg p-4 bg-card">
            <h4 class="font-semibold text-foreground mb-2">Health & Wellness</h4>
            <p class="text-foreground leading-relaxed">
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
