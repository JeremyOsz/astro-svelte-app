<script lang="ts">
  import D3Chart from '$lib/chart/D3Chart.svelte';
</script>

<div class="wheel-shell" title="The wheel remains interactive. Hover, click, or zoom if you need to.">
  <div class="wheel-label top">ascendant as threshold</div>
  <div class="wheel-label right">houses as rooms</div>
  <div class="wheel-label bottom">aspects as weather</div>
  <div class="wheel-label left">planets as verbs</div>
  <D3Chart
    showDegreeMarkers={false}
    showExtendedPlanets={true}
    showAspectLines={true}
    showPlanetLabels={false}
    zoomLevel={1}
  />
</div>

<style>
  .wheel-shell {
    position: relative;
    min-height: min(82vw, 48rem);
    border-top: 1px dotted color-mix(in oklch, var(--foreground) 32%, transparent);
    border-bottom: 1px dotted color-mix(in oklch, var(--foreground) 32%, transparent);
    padding: clamp(1.5rem, 4vw, 3rem) 0;
  }

  :global(.wheel-shell .chart-container) {
    background: transparent !important;
  }

  :global(.wheel-shell svg) {
    max-height: min(78vw, 44rem);
    filter: grayscale(0.2) contrast(0.95);
  }

  .wheel-label {
    position: absolute;
    z-index: 1;
    color: color-mix(in oklch, var(--foreground) 48%, transparent);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: clamp(0.68rem, 1vw, 0.78rem);
    pointer-events: none;
  }

  .top {
    top: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .right {
    top: 50%;
    right: 0;
    transform: translateY(-50%) rotate(90deg);
    transform-origin: center;
  }

  .bottom {
    bottom: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .left {
    top: 50%;
    left: 0;
    transform: translateY(-50%) rotate(-90deg);
    transform-origin: center;
  }

  @media (max-width: 720px) {
    .wheel-shell {
      min-height: 29rem;
      margin-inline: -1rem;
    }

    .right,
    .left {
      display: none;
    }
  }
</style>
