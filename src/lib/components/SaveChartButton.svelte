<script lang="ts">
    import { chartStore, currentChart } from '$lib/stores/chart-store';
    import { Button } from '$lib/components/ui/button';
    import { Save, Check, Loader2 } from 'lucide-svelte';
    
    let showSaveDialog = false;
    let chartName = '';
    let saveError = '';
    
    function handleSave() {
      if (chartName.trim()) {
        saveError = '';
        chartStore.saveCurrentChart(chartName.trim())
          .then(() => {
            showSaveDialog = false;
            chartName = '';
          })
          .catch(error => {
            saveError = error.message || 'Failed to save chart';
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
    {#if $currentChart}
      <Button variant="outline" size="sm" disabled>
        <Check class="h-4 w-4 mr-2" />
        Saved as {$currentChart.name}
      </Button>
    {:else}
      <Button 
        variant="outline" 
        size="sm" 
        onclick={() => showSaveDialog = true}
        disabled={!$chartStore.chartData || $chartStore.isSaving}
      >
        {#if $chartStore.isSaving}
          <Loader2 class="h-4 w-4 mr-2 animate-spin" />
          Saving...
        {:else}
          <Save class="h-4 w-4 mr-2" />
          Save Chart
        {/if}
      </Button>
    {/if}
    
    {#if showSaveDialog}
      <div class="absolute top-full mt-2 p-4 bg-white border rounded-lg shadow-lg z-50 min-w-64">
        <h4 class="font-medium mb-2">Save Chart</h4>
        <input
          type="text"
          bind:value={chartName}
          placeholder="Enter chart name"
          class="w-full px-3 py-2 border rounded mb-3"
          on:keydown={(e) => e.key === 'Enter' && handleSave()}
          autofocus
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