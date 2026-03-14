<script lang="ts">
  /** Horizontal rule with optional center symbol. Use between sections or under headings. */
  let {
    symbol = 'star' as 'star' | 'moon' | 'dot' | 'none',
    variant = 'default' as 'default' | 'light',
    class: className = ''
  }: { symbol?: 'star' | 'moon' | 'dot' | 'none'; variant?: 'default' | 'light'; class?: string } = $props();

  const lineClass = variant === 'light' ? 'bg-amber-200/50' : 'bg-border';
  const symbolClass = variant === 'light' ? 'text-amber-200/90' : 'text-primary/80';
</script>

<div class="flex items-center justify-center gap-3 w-full {className}" aria-hidden="true">
  <span class="flex-1 h-px {lineClass} shrink" style="max-width: 8rem;"></span>
  {#if symbol !== 'none'}
    <span class="{symbolClass} shrink-0" aria-hidden="true">
      {#if symbol === 'star'}
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0.5">
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"/>
        </svg>
      {:else if symbol === 'moon'}
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0.5">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      {:else}
        <span class="block w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>
      {/if}
    </span>
  {/if}
  <span class="flex-1 h-px {lineClass} shrink" style="max-width: 8rem;"></span>
</div>
