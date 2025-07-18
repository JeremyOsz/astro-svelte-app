<script lang="ts">
  import { chartStore, type SavedChart } from '$lib/stores/chart-store';
  import { Button } from '$lib/components/ui/button';
  import { Trash2, Edit, Eye, Share2 } from 'lucide-svelte';
  import { URLSharingService } from '$lib/services/url-sharing';
  
  export let onChartSelect: (chart: SavedChart) => void = () => {};
  
  let editingChartId: string | null = null;
  let editingName: string = '';
  let showShareDialog = false;
  let shareUrl = '';
  let copiedMessage = '';
  
  function handleEdit(chart: SavedChart) {
    editingChartId = chart.id;
    editingName = chart.name;
  }
  
  function handleSaveEdit() {
    if (editingChartId && editingName.trim()) {
      chartStore.updateChartName(editingChartId, editingName.trim());
      editingChartId = null;
      editingName = '';
    }
  }
  
  function handleCancelEdit() {
    editingChartId = null;
    editingName = '';
  }
  
  function handleDelete(chartId: string) {
    if (confirm('Are you sure you want to delete this chart?')) {
      chartStore.deleteChart(chartId);
    }
  }
  
  async function handleShare(chart: SavedChart) {
    shareUrl = URLSharingService.generateShareURL({
      birthData: chart.birthData,
      name: chart.name
    });
    showShareDialog = true;
  }
  
  async function copyShareUrl() {
    try {
      await URLSharingService.copyToClipboard(shareUrl);
      copiedMessage = 'URL copied!';
      setTimeout(() => {
        copiedMessage = '';
      }, 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  }
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold">Saved Charts</h3>
    <span class="text-sm text-gray-500">{$chartStore.savedCharts.length} charts</span>
  </div>
  
  {#if $chartStore.savedCharts.length === 0}
    <div class="text-center py-8">
      <div class="text-gray-400 mb-2">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p class="text-gray-500 text-sm">No saved charts yet</p>
      <p class="text-gray-400 text-xs">Generate a chart to save it here</p>
    </div>
  {:else}
    <div class="space-y-2">
      {#each $chartStore.savedCharts as chart}
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div class="flex-1 min-w-0">
            {#if editingChartId === chart.id}
              <input
                type="text"
                bind:value={editingName}
                class="w-full px-2 py-1 border rounded text-sm"
                on:keydown={(e) => e.key === 'Enter' && handleSaveEdit()}
                on:blur={handleSaveEdit}
                autofocus
              />
            {:else}
              <div class="font-medium truncate">{chart.name}</div>
              <div class="text-sm text-gray-500">
                {new Date(chart.createdAt).toLocaleDateString()} • {chart.birthData.place}
              </div>
            {/if}
          </div>
          
          <div class="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onclick={() => onChartSelect(chart)}
              title="View chart"
            >
              <Eye class="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onclick={() => handleShare(chart)}
              title="Share chart"
            >
              <Share2 class="h-4 w-4" />
            </Button>
            
            {#if editingChartId !== chart.id}
              <Button
                variant="ghost"
                size="sm"
                onclick={() => handleEdit(chart)}
                title="Edit name"
              >
                <Edit class="h-4 w-4" />
              </Button>
            {/if}
            
            <Button
              variant="ghost"
              size="sm"
              onclick={() => handleDelete(chart.id)}
              title="Delete chart"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Share Dialog -->
{#if showShareDialog}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <h3 class="text-lg font-semibold mb-4">Share Chart</h3>
      <p class="text-sm text-gray-600 mb-4">
        Copy this URL to share your chart with others:
      </p>
      <div class="flex gap-2">
        <input
          type="text"
          value={shareUrl}
          readonly
          class="flex-1 px-3 py-2 border rounded text-sm bg-gray-50"
        />
        <Button size="sm" onclick={copyShareUrl}>
          {copiedMessage ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <div class="flex justify-end mt-4">
        <Button variant="outline" size="sm" onclick={() => showShareDialog = false}>
          Close
        </Button>
      </div>
    </div>
  </div>
{/if}