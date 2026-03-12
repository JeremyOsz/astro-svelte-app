<script lang="ts">
  import type { ZodiacSign } from '$lib/types/market-cosmos';

  export let sign: ZodiacSign;
  export let size = 16;
  export let color = 'currentColor';
  export let strokeWidth = 1.8;
  export let x: number | undefined = undefined;
  export let y: number | undefined = undefined;
  export let className = '';
  export let ariaLabel: string | null = null;
</script>

<svg
  {x}
  {y}
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
  role={ariaLabel ? 'img' : undefined}
  aria-label={ariaLabel ?? undefined}
  aria-hidden={ariaLabel ? undefined : 'true'}
>
  {#if sign === 'Aries'}
    <path d="M6 20c0-5 2-9 6-9" />
    <path d="M18 20c0-5-2-9-6-9" />
    <path d="M12 11v9" />
  {:else if sign === 'Taurus'}
    <circle cx="12" cy="14" r="5" />
    <path d="M8 8a4 4 0 1 1 8 0" />
    <path d="M8 8c0-2-1.4-4-3.5-4" />
    <path d="M16 8c0-2 1.4-4 3.5-4" />
  {:else if sign === 'Gemini'}
    <path d="M7 5h10" />
    <path d="M7 19h10" />
    <path d="M9 5c1 3 1 8 0 14" />
    <path d="M15 5c-1 3-1 8 0 14" />
  {:else if sign === 'Cancer'}
    <path d="M6 10c1.2-2.4 4.3-3.3 6.7-2.2 2.1 1 3.2 3.3 2.7 5.4" />
    <circle cx="16.2" cy="8.2" r="2.2" />
    <path d="M18 14c-1.2 2.4-4.3 3.3-6.7 2.2-2.1-1-3.2-3.3-2.7-5.4" />
    <circle cx="7.8" cy="15.8" r="2.2" />
  {:else if sign === 'Leo'}
    <circle cx="8" cy="9.5" r="3" />
    <path d="M11 9.5c3 0 5.5 2.1 5.5 5.3 0 3.1-2.4 5.2-5.4 5.2-2.3 0-4.2-1.2-5.1-3.2" />
  {:else if sign === 'Virgo'}
    <path d="M5 6v12" />
    <path d="M9 6v12" />
    <path d="M13 6v9" />
    <path d="M5 10h8" />
    <path d="M13 15c1.7 0 3.1 1.3 3.1 3.1 0 1.6-1.1 3-2.6 3.4" />
  {:else if sign === 'Libra'}
    <path d="M4 18h16" />
    <path d="M6 14h12" />
    <path d="M8 14a4 4 0 1 1 8 0" />
  {:else if sign === 'Scorpio'}
    <path d="M5 6v12" />
    <path d="M9 6v12" />
    <path d="M13 6v12" />
    <path d="M5 10h8" />
    <path d="M13 18h4" />
    <path d="M17 18l-2.5-2.5" />
    <path d="M17 18l-2.5 2.5" />
  {:else if sign === 'Sagittarius'}
    <path d="M5 19L19 5" />
    <path d="M13 5h6v6" />
    <path d="M9 15h4" />
    <path d="M9 15v4" />
  {:else if sign === 'Capricorn'}
    <path d="M5 6v10" />
    <path d="M5 10h6" />
    <path d="M11 6v10" />
    <path d="M11 16c0 2.4 1.9 4 4.1 4s4-1.6 4-4-1.8-4-4-4c-1.2 0-2.4.4-3.2 1.3" />
  {:else if sign === 'Aquarius'}
    <path d="M4 9l4-2 4 4 4-4 4 2" />
    <path d="M4 15l4-2 4 4 4-4 4 2" />
  {:else}
    <path d="M6 6c3 2 3 10 0 12" />
    <path d="M18 6c-3 2-3 10 0 12" />
    <path d="M5 12h14" />
  {/if}
</svg>
