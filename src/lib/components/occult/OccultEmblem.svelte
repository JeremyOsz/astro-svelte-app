<script lang="ts">
  /** Sun-moon emblem for branding. Use in header or as favicon-style mark. */
  let {
    size = 40,
    class: className = ''
  }: { size?: number; class?: string } = $props();
</script>

<div
  class="inline-flex items-center justify-center shrink-0 text-amber-200/90 dark:text-amber-100/90 {className}"
  style="width: {size}px; height: {size}px;"
  aria-hidden="true"
>
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full">
    <!-- Crescent moon -->
    <path d="M24 8a16 16 0 0 1 0 32c8 0 14-6 14-16S32 8 24 8z" fill="currentColor" fill-opacity="0.15" stroke="currentColor"/>
    <path d="M24 8a16 16 0 0 0 0 32" fill="none"/>
    <!-- Sun rays -->
    <path d="M24 4v4M24 40v4M4 24h4M40 24h4" stroke-opacity="0.9"/>
    <path d="M8.7 8.7l2.8 2.8M36.5 36.5l2.8 2.8M8.7 39.3l2.8-2.8M36.5 11.5l2.8-2.8" stroke-opacity="0.7"/>
    <path d="M12 24a12 12 0 0 1 12-12" stroke-opacity="0.5"/>
  </svg>
</div>
