<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { drawTransitChart, cleanup } from './browser-transit-chart';
  import type { NatalChart, TransitChart } from '$lib/types/types';

  export let natalChart: NatalChart;
  export let transitChart: TransitChart;
  export let showAspectLines = true;

  let container: HTMLDivElement;

  onMount(() => {
    if (container && natalChart && transitChart) {
      drawTransitChart(container, natalChart, transitChart, { showAspectLines });
    }
  });

  onDestroy(() => {
    if (container) {
      cleanup(container);
    }
  });

  // Redraw chart when props change
  $: if (container && natalChart && transitChart) {
    cleanup(container);
    drawTransitChart(container, natalChart, transitChart, { showAspectLines });
  }
</script>

<div class="transit-chart-container" bind:this={container}></div>

<style>
  .transit-chart-container {
    width: 100%;
    height: 100%;
    min-height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
