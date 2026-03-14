<script lang="ts">
  import { cn } from '$lib/utils';
  import OccultCorner from './OccultCorner.svelte';

  /** Card with corner ornaments and occult framing. Wraps content in a grimoire-style panel. */
  let {
    class: className = '',
    corners = true,
    children
  }: { class?: string; corners?: boolean; children?: import('svelte').Snippet } = $props();
</script>

<div
  class={cn(
    'relative bg-card border border-border rounded-lg py-6 px-5 shadow-sm occult-border overflow-hidden',
    corners && 'pt-8 pb-8 px-6',
    className
  )}
>
  {#if corners}
    <OccultCorner position="top-left" size={28} />
    <OccultCorner position="top-right" size={28} />
    <OccultCorner position="bottom-left" size={28} />
    <OccultCorner position="bottom-right" size={28} />
  {/if}
  {@render children?.()}
</div>
