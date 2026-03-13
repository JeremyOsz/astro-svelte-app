<script lang="ts">
  import type { TarotLayout, DrawnCard } from '$lib/data/tarot-layouts';
  import * as Dialog from '$lib/components/ui/dialog';

  interface Props {
    layout: TarotLayout;
    drawnCards: DrawnCard[];
  }

  let { layout, drawnCards }: Props = $props();

  let selectedCard: DrawnCard | null = $state(null);
  let cardModalOpen = $state(false);

  $: bounds = (() => {
    if (drawnCards.length === 0) return { maxX: 600, maxY: 400 };
    let maxX = 0;
    let maxY = 0;
    for (const { position } of drawnCards) {
      maxX = Math.max(maxX, position.x + position.width);
      maxY = Math.max(maxY, position.y + position.height);
    }
    return { maxX: Math.max(maxX, 600), maxY: Math.max(maxY, 400) };
  })();

  function openCardDetail(dc: DrawnCard) {
    selectedCard = dc;
    cardModalOpen = true;
  }

  function closeCardDetail() {
    selectedCard = null;
    cardModalOpen = false;
  }
</script>

<div class="spread-reading">
  <div
    class="spread-container"
    style="aspect-ratio: {bounds.maxX} / {bounds.maxY}; max-width: 100%;"
  >
    {#each drawnCards as drawn}
      {@const p = drawn.position}
      {@const leftPct = (p.x / bounds.maxX) * 100}
      {@const topPct = (p.y / bounds.maxY) * 100}
      {@const widthPct = (p.width / bounds.maxX) * 100}
      {@const heightPct = (p.height / bounds.maxY) * 100}
      <button
        type="button"
        class="spread-card-slot"
        style="
          left: {leftPct}%;
          top: {topPct}%;
          width: {widthPct}%;
          height: {heightPct}%;
        "
        on:click={() => openCardDetail(drawn)}
      >
        <div class="card-image-wrap" class:reversed={drawn.reversed}>
          <img
            src={drawn.card.image}
            alt={drawn.card.name}
          />
        </div>
        <span class="position-number">{p.number}</span>
        <span class="position-name">{p.name}</span>
      </button>
    {/each}
  </div>

  <ul class="position-list" aria-label="Cards in this spread">
    {#each drawnCards as drawn}
      <li>
        <button
          type="button"
          class="position-list-item"
          on:click={() => openCardDetail(drawn)}
        >
          <span class="position-num">{drawn.position.number}.</span>
          <span class="position-title">{drawn.position.name}</span>
          <span class="card-name">{drawn.card.name}{drawn.reversed ? ' (Reversed)' : ''}</span>
        </button>
      </li>
    {/each}
  </ul>
</div>

{#if selectedCard}
  <Dialog.Root bind:open={cardModalOpen}>
    <Dialog.Content class="max-w-2xl max-h-[90vh] overflow-y-auto">
      <Dialog.Header>
        <Dialog.Title>
          Position {selectedCard.position.number}: {selectedCard.position.name}
        </Dialog.Title>
        <Dialog.Description>
          {selectedCard.card.name}{selectedCard.reversed ? ' (Reversed)' : ''}
          {#if selectedCard.card.suit}
            — {selectedCard.card.suit}
          {/if}
        </Dialog.Description>
      </Dialog.Header>
      <div class="flex gap-4 items-start mt-4">
        <div class="shrink-0">
          <div
            class="card-image-wrap rounded-lg overflow-hidden"
            class:reversed={selectedCard.reversed}
            style="max-width: 160px;"
          >
            <img
              src={selectedCard.card.image}
              alt={selectedCard.card.name}
              class="w-full h-auto block"
            />
          </div>
        </div>
        <div class="min-w-0 space-y-3">
          <p class="text-sm text-gray-600">{selectedCard.position.description}</p>
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-1">Meaning</h4>
            <p class="text-sm text-gray-700">
              {selectedCard.reversed
                ? selectedCard.card.reversed.general
                : selectedCard.card.upright.general}
            </p>
          </div>
          <div class="flex flex-wrap gap-1">
            {#each selectedCard.card.keywords as keyword}
              <span class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">
                {keyword}
              </span>
            {/each}
          </div>
        </div>
      </div>
    </Dialog.Content>
  </Dialog.Root>
{/if}

<style>
  .spread-reading {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .spread-container {
    position: relative;
    width: 100%;
    margin: 0 auto;
    background: linear-gradient(145deg, #f5f3ff 0%, #ede9fe 100%);
    border-radius: 12px;
    border: 1px solid #e9e5ff;
    min-height: 280px;
  }

  .spread-card-slot {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 4px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: transform 0.15s ease;
    border-radius: 8px;
  }

  .spread-card-slot:hover {
    transform: scale(1.03);
  }

  .spread-card-slot:focus-visible {
    outline: 2px solid #7c3aed;
    outline-offset: 2px;
  }

  .card-image-wrap {
    width: 100%;
    flex: 1;
    min-height: 0;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-image-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .card-image-wrap.reversed img {
    transform: rotate(180deg);
  }

  .position-number {
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(124, 58, 237, 0.9);
    color: white;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    font-size: 0.7rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .position-name {
    margin-top: 2px;
    font-size: 0.6rem;
    font-weight: 600;
    color: #4b5563;
    text-align: center;
    line-height: 1.1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .position-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .position-list-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    width: 100%;
    font-size: 0.875rem;
    transition: background 0.15s, border-color 0.15s;
  }

  .position-list-item:hover {
    background: #f5f3ff;
    border-color: #c4b5fd;
  }

  .position-num {
    font-weight: 700;
    color: #7c3aed;
    min-width: 1.5rem;
  }

  .position-title {
    font-weight: 600;
    color: #374151;
    min-width: 8rem;
  }

  .card-name {
    color: #6b7280;
    margin-left: auto;
  }

  @media (min-width: 640px) {
    .position-name {
      font-size: 0.65rem;
    }
  }
</style>
