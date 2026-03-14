<script lang="ts">
  /** Corner ornament for framing cards/panels. Position with absolute. */
  let {
    position = 'top-left' as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
    size = 24,
    class: className = ''
  }: { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; size?: number; class?: string } = $props();

  const rotation = position === 'top-left' ? 0 : position === 'top-right' ? 90 : position === 'bottom-right' ? 180 : 270;
</script>

<div
  class="absolute pointer-events-none text-border {className}"
  style="width: {size}px; height: {size}px; {position.includes('top') ? 'top' : 'bottom'}: 0; {position.includes('left') ? 'left' : 'right'}: 0; transform: rotate({rotation}deg);"
  aria-hidden="true"
>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" class="w-full h-full">
    <!-- L-shaped corner with small flourish -->
    <path d="M2 2v8h0a4 4 0 0 0 4 4h0M2 2h8v0a4 4 0 0 0 4 4v0" stroke-linecap="round"/>
    <path d="M4 4v4M4 4h4" stroke-width="1"/>
  </svg>
</div>
