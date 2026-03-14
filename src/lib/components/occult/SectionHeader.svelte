<script lang="ts">
  import OccultDivider from './OccultDivider.svelte';

  /** Section title with optional ornamental underline. */
  let {
    title,
    symbol = 'star' as 'star' | 'moon' | 'dot' | 'none',
    class: className = ''
  }: { title: string; symbol?: 'star' | 'moon' | 'dot' | 'none'; class?: string } = $props();
</script>

<header class="mb-4 {className}">
  <h2 class="font-display text-2xl font-bold text-foreground tracking-wide text-center md:text-left">
    {title}
  </h2>
  <div class="mt-2">
    <OccultDivider {symbol} />
  </div>
</header>
