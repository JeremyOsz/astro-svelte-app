<script lang="ts">
  import PoeticChartWheel from '$lib/components/poetic/PoeticChartWheel.svelte';
  import PoeticFragments from '$lib/components/poetic/PoeticFragments.svelte';
  import { URLSharingService } from '$lib/services/url-sharing';
  import { chartStore, type BirthData } from '$lib/stores/chart-store';

  export let chartData: string | null = null;
  export let birthData: BirthData | null = null;
  export let loading = false;
  export let error: string | null = null;

  let shareStatus = '';

  const loadingLines = [
    'asking the houses to take their places',
    'counting degrees by hand',
    'waiting for the ascendant',
    'letting the planets become words'
  ];

  async function copyPoeticShareUrl() {
    if (!birthData || typeof window === 'undefined') return;

    const encodedData = URLSharingService.encodeChartData({ birthData });
    const shareUrl = `${window.location.origin}/poetic/chart?data=${encodedData}`;

    try {
      await URLSharingService.copyToClipboard(shareUrl);
      shareStatus = 'copied';
      setTimeout(() => (shareStatus = ''), 1800);
    } catch {
      shareStatus = 'copy failed';
    }
  }
</script>

<section class="reading-surface" aria-label="Poetic birth chart reading">
  <header class="opening">
    <p class="eyebrow">poetic chart / natal</p>
    <h1>Your chart as a small weather system</h1>
    <p>
      Not a dashboard. A page that waits with the data, then lets the wheel speak in
      fragments.
    </p>
  </header>

  {#if loading}
    <div class="listening" aria-live="polite" aria-busy="true">
      {#each loadingLines as line, index}
        <p style={`--delay: ${index * 450}ms`}>{line}</p>
      {/each}
    </div>
  {/if}

  {#if error}
    <p class="error" aria-live="polite">{error}</p>
  {/if}

  {#if chartData}
    <section class="birth-mark" aria-label="Birth data">
      <p>
        born at <time>{birthData?.time}</time>
        {#if birthData?.date}
          on <time>{birthData.date}</time>
        {/if}
      </p>
      <p>{birthData?.place}</p>
      <div class="reading-actions">
        <button type="button" on:click={copyPoeticShareUrl}>copy this doorway</button>
        <button type="button" on:click={() => chartStore.clear()}>begin again</button>
        {#if shareStatus}
          <span aria-live="polite">{shareStatus}</span>
        {/if}
      </div>
    </section>

    <PoeticChartWheel />
    <PoeticFragments {chartData} />
  {:else if !loading}
    <section class="empty-score" aria-label="Before chart">
      <p>enter the particulars.</p>
      <p>the browser will keep the rest visible: fields, focus, delay, answer.</p>
      <p class="small">source code as ritual, not curtain.</p>
    </section>
  {/if}
</section>

<style>
  .reading-surface {
    display: grid;
    gap: clamp(2rem, 7vw, 5.5rem);
  }

  .opening {
    display: grid;
    gap: 1rem;
    max-width: 54rem;
    padding-top: clamp(1rem, 4vw, 4rem);
  }

  .eyebrow,
  .birth-mark,
  .reading-actions,
  .listening,
  .small {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .eyebrow {
    color: color-mix(in oklch, var(--foreground) 52%, transparent);
    font-size: 0.78rem;
  }

  h1 {
    max-width: 12ch;
    margin: 0;
    font-size: clamp(3rem, 12vw, 8.8rem);
    font-weight: 400;
    line-height: 0.94;
  }

  .opening p:not(.eyebrow) {
    max-width: 34rem;
    color: color-mix(in oklch, var(--foreground) 72%, transparent);
    font-size: clamp(1.05rem, 2vw, 1.35rem);
    line-height: 1.8;
  }

  .listening {
    display: grid;
    gap: 0.5rem;
    color: color-mix(in oklch, var(--foreground) 64%, transparent);
  }

  .listening p {
    margin: 0;
    opacity: 0;
    animation: reveal 900ms ease forwards;
    animation-delay: var(--delay);
  }

  .error {
    max-width: 38rem;
    border-left: 1px solid var(--destructive);
    padding-left: 1rem;
    color: var(--destructive);
    line-height: 1.7;
  }

  .birth-mark {
    display: grid;
    gap: 0.35rem;
    color: color-mix(in oklch, var(--foreground) 68%, transparent);
  }

  .birth-mark p {
    margin: 0;
  }

  .reading-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.65rem;
    margin-top: 0.9rem;
  }

  .reading-actions button {
    border: 0;
    border-bottom: 1px dotted currentColor;
    background: transparent;
    padding: 0.2rem 0;
    color: var(--foreground);
    font: inherit;
  }

  .reading-actions button:hover,
  .reading-actions button:focus-visible {
    background: var(--foreground);
    color: var(--background);
    outline: 0;
  }

  .reading-actions span {
    color: color-mix(in oklch, var(--foreground) 58%, transparent);
    font-size: 0.8rem;
  }

  .empty-score {
    display: grid;
    gap: 0.7rem;
    max-width: 30rem;
    margin-left: auto;
    color: color-mix(in oklch, var(--foreground) 65%, transparent);
    line-height: 1.8;
  }

  .empty-score p {
    margin: 0;
  }

  .small {
    font-size: 0.8rem;
  }

  @keyframes reveal {
    to {
      opacity: 1;
    }
  }
</style>
