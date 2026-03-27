<script lang="ts">
  import { chartStore, currentChart } from '$lib/stores/chart-store';
  import { Button } from '$lib/components/ui/button';
  import { Save, Check, Loader2 } from 'lucide-svelte';
  import type { BirthData } from '$lib/stores/chart-store';

  let showSaveDialog = false;
  let chartName = '';
  let saveError = '';

  function birthDataMatches(a: BirthData | null, b: BirthData | null): boolean {
    if (!a || !b) return false;

    return (
      a.date === b.date &&
      a.time === b.time &&
      a.place === b.place &&
      a.latitude === b.latitude &&
      a.longitude === b.longitude
    );
  }

  $: matchedSavedChart =
    $chartStore.chartData && $chartStore.birthData
      ? $chartStore.savedCharts.find(
          (chart) =>
            chart.chartData === $chartStore.chartData &&
            birthDataMatches(chart.birthData, $chartStore.birthData)
        ) ?? null
      : null;

  $: displayedSavedChart =
    matchedSavedChart ??
    ($currentChart &&
    $chartStore.chartData === $currentChart.chartData &&
    birthDataMatches($chartStore.birthData, $currentChart.birthData)
      ? $currentChart
      : null);

  function openSaveDialog() {
    saveError = '';
    showSaveDialog = true;
  }

  function handleSave() {
    if (chartName.trim()) {
      saveError = '';
      chartStore
        .saveCurrentChart(chartName.trim())
        .then(() => {
          showSaveDialog = false;
          chartName = '';
        })
        .catch((error) => {
          saveError = error.message || 'Failed to save person';
        });
    }
  }

  function handleCancel() {
    showSaveDialog = false;
    chartName = '';
    saveError = '';
  }
</script>

<div class="relative">
  {#if displayedSavedChart}
    <Button variant="outline" size="sm" disabled>
      <Check class="h-4 w-4 mr-2" />
      Saved as {displayedSavedChart.name}
    </Button>
  {:else}
    <Button
      variant="outline"
      size="sm"
      onclick={openSaveDialog}
      disabled={!$chartStore.chartData || $chartStore.isSaving}
    >
      {#if $chartStore.isSaving}
        <Loader2 class="h-4 w-4 mr-2 animate-spin" />
        Saving...
      {:else}
        <Save class="h-4 w-4 mr-2" />
        Save Person
      {/if}
    </Button>
  {/if}

  {#if saveError}
    <p class="mt-2 text-xs text-destructive">{saveError}</p>
  {/if}

  {#if showSaveDialog}
    <div class="absolute top-full mt-2 p-4 bg-white border rounded-lg shadow-lg z-50 min-w-64">
      <h4 class="font-medium mb-2">Save Person</h4>
      <input
        type="text"
        bind:value={chartName}
        placeholder="Enter person name"
        class="w-full px-3 py-2 border rounded mb-3"
        on:keydown={(e) => e.key === 'Enter' && handleSave()}
      />
      {#if saveError}
        <p class="text-red-500 text-sm mb-3">{saveError}</p>
      {/if}
      <div class="flex gap-2">
        <Button size="sm" onclick={handleSave} disabled={!chartName.trim() || $chartStore.isSaving}>
          {#if $chartStore.isSaving}
            <Loader2 class="h-4 w-4 mr-1 animate-spin" />
            Saving...
          {:else}
            Save
          {/if}
        </Button>
        <Button variant="outline" size="sm" onclick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  {/if}
</div>
