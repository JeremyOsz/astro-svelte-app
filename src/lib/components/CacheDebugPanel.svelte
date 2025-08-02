<script lang="ts">
  import { onMount } from 'svelte';
  import { CacheManager } from '$lib/services/cache-management';
  import { RefreshCw, Trash2, Info } from 'lucide-svelte';

  let cacheStats: any = null;
  let showDetails = false;

  function refreshStats() {
    cacheStats = CacheManager.getStats();
  }

  function clearCache() {
    CacheManager.clearCache();
    refreshStats();
  }

  function formatAge(ageMs: number): string {
    return CacheManager.formatAge(ageMs);
  }

  onMount(() => {
    refreshStats();
  });
</script>

{#if import.meta.env.DEV}
  <div class="bg-gray-100/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <Info class="w-4 h-4 text-blue-600" />
        <h4 class="text-sm font-medium text-gray-900">Cache Debug</h4>
      </div>
      <div class="flex gap-2">
        <button 
          class="p-1.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          on:click={refreshStats}
        >
          <RefreshCw class="w-3 h-3" />
        </button>
        <button 
          class="p-1.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          on:click={clearCache}
        >
          <Trash2 class="w-3 h-3" />
        </button>
      </div>
    </div>

    {#if cacheStats}
      <div class="space-y-2">
        <div class="text-xs text-gray-600">
          <strong>Entries:</strong> {cacheStats.size} • 
          <strong>Info:</strong> {CacheManager.getCacheInfo()}
        </div>

        {#if showDetails && cacheStats.details.length > 0}
          <div class="text-xs space-y-1">
            <div class="font-medium text-gray-700">Cache Details:</div>
            {#each cacheStats.details as detail}
              <div class="flex justify-between text-gray-600">
                <span>{detail.date} ({detail.source})</span>
                <span>{formatAge(detail.age)}</span>
              </div>
            {/each}
          </div>
        {/if}

        <button 
          class="text-xs text-blue-600 hover:text-blue-800 underline"
          on:click={() => showDetails = !showDetails}
        >
          {showDetails ? 'Hide' : 'Show'} details
        </button>
      </div>
    {:else}
      <div class="text-xs text-gray-500">No cache data available</div>
    {/if}
  </div>
{/if} 