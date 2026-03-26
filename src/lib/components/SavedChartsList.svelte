<script lang="ts">
  import { chartStore, type SavedChart } from '$lib/stores/chart-store';
  import { Button } from '$lib/components/ui/button';
  import { Trash2, Edit, Eye, Share2, Check } from 'lucide-svelte';
  import { URLSharingService } from '$lib/services/url-sharing';
  import { logFeatureUsage } from '$lib/services/usage-logger';

  export let onChartSelect: (chart: SavedChart) => void = () => {};

  let editingChartId: string | null = null;
  let editingName: string = '';
  let showShareDialog = false;
  let shareUrl = '';
  let copiedMessage = '';
  let importMessage = '';
  let importError = '';
  let importLoading = false;

  function handleEdit(chart: SavedChart) {
    editingChartId = chart.id;
    editingName = chart.name;
  }

  async function handleSaveEdit() {
    if (editingChartId && editingName.trim()) {
      try {
        await chartStore.updateChartName(editingChartId, editingName.trim());
        editingChartId = null;
        editingName = '';
      } catch (error) {
        console.error('Failed to update person name:', error);
      }
    }
  }

  function handleCancelEdit() {
    editingChartId = null;
    editingName = '';
  }

  async function handleDelete(chartId: string) {
    if (confirm('Are you sure you want to delete this person?')) {
      try {
        await chartStore.deleteChart(chartId);
      } catch (error) {
        console.error('Failed to delete person:', error);
      }
    }
  }

  async function handleImportLegacyPeople() {
    importLoading = true;
    importMessage = '';
    importError = '';

    try {
      const result = await chartStore.importLegacyCharts();
      importMessage = `Imported ${result.importedCount} people, skipped ${result.skippedCount} duplicates.`;
    } catch (error) {
      importError = error instanceof Error ? error.message : 'Failed to import local people';
    } finally {
      importLoading = false;
    }
  }

  async function handleShare(chart: SavedChart) {
    shareUrl = URLSharingService.generateShareURL({
      birthData: chart.birthData,
      name: chart.name
    });
    showShareDialog = true;
    void logFeatureUsage({
      feature: 'chart',
      action: 'share_open',
      route: '/chart',
      metadata: { chartId: chart.id }
    });
  }

  function handleSelectChart(chart: SavedChart) {
    chartStore.loadChart(chart.id);
    void logFeatureUsage({
      feature: 'chart',
      action: 'select_view',
      route: typeof window !== 'undefined' ? window.location.pathname : '/chart',
      metadata: { chartId: chart.id }
    });
    onChartSelect(chart);
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
  {#if $chartStore.hasPendingLegacyImport}
    <div class="rounded-lg border border-primary/40 bg-primary/10 p-3">
      <p class="text-sm text-foreground">Local data found. Import local people into your account?</p>
      <div class="mt-2 flex gap-2">
        <Button size="sm" onclick={handleImportLegacyPeople} disabled={importLoading}>
          {importLoading ? 'Importing...' : 'Import Local People'}
        </Button>
        <Button variant="outline" size="sm" onclick={chartStore.dismissLegacyImportPrompt}>
          Dismiss
        </Button>
      </div>
      {#if importMessage}
        <p class="mt-2 text-xs text-emerald-600">{importMessage}</p>
      {/if}
      {#if importError}
        <p class="mt-2 text-xs text-destructive">{importError}</p>
      {/if}
    </div>
  {/if}

  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold text-foreground">People</h3>
    <span class="text-sm text-muted-foreground">{$chartStore.savedCharts.length} people</span>
  </div>

  {#if $chartStore.savedCharts.length === 0}
    <div class="text-center py-8">
      <div class="text-muted-foreground mb-2">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p class="text-muted-foreground text-sm">No saved people yet</p>
      <p class="text-muted-foreground text-xs">Save a chart to keep it in your people list.</p>
    </div>
  {:else}
    <div class="space-y-2">
      {#each $chartStore.savedCharts as chart}
        {@const isSelected = $chartStore.currentChartId === chart.id}
        <div
          class="flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer border {isSelected ? 'border-primary/55 bg-primary/10' : 'border-border bg-card hover:bg-accent/20'}"
          role="button"
          tabindex="0"
          onclick={() => handleSelectChart(chart)}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSelectChart(chart);
            }
          }}
        >
          <div class="flex-1 min-w-0">
            {#if editingChartId === chart.id}
              <input
                type="text"
                bind:value={editingName}
                class="w-full px-2 py-1 border rounded text-sm"
                onkeydown={(e) => e.key === 'Enter' && handleSaveEdit()}
                onblur={handleSaveEdit}
              />
            {:else}
              <div class="flex items-center gap-2">
                {#if isSelected}
                  <Check class="h-4 w-4 text-primary" />
                {/if}
                <div class="font-medium truncate text-foreground">{chart.name}</div>
              </div>
              <div class="text-sm text-muted-foreground">
                {new Date(chart.createdAt).toLocaleDateString()} • {chart.birthData.place}
              </div>
            {/if}
          </div>

          <div class="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onclick={(e) => {
                e.stopPropagation();
                handleSelectChart(chart);
              }}
              title={isSelected ? 'Currently viewing' : 'View person'}
              class="{isSelected ? 'text-primary bg-primary/15 hover:bg-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-accent/20'}"
            >
              <Eye class="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onclick={(e) => {
                e.stopPropagation();
                handleShare(chart);
              }}
              title="Share person"
              class="text-muted-foreground hover:text-foreground hover:bg-accent/20"
            >
              <Share2 class="h-4 w-4" />
            </Button>

            {#if editingChartId !== chart.id}
              <Button
                variant="ghost"
                size="sm"
                onclick={(e) => {
                  e.stopPropagation();
                  handleEdit(chart);
                }}
                title="Edit name"
                class="text-muted-foreground hover:text-foreground hover:bg-accent/20"
              >
                <Edit class="h-4 w-4" />
              </Button>
            {/if}

            <Button
              variant="ghost"
              size="sm"
              onclick={(e) => {
                e.stopPropagation();
                handleDelete(chart.id);
              }}
              title="Delete person"
              class="text-destructive hover:bg-destructive/10"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

{#if showShareDialog}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-card border border-border rounded-lg p-6 max-w-md w-full">
      <h3 class="text-lg font-semibold text-foreground mb-4">Share Person</h3>
      <p class="text-sm text-muted-foreground mb-4">
        Copy this URL to share the chart with others:
      </p>
      <div class="flex gap-2">
        <input
          type="text"
          value={shareUrl}
          readonly
          class="flex-1 px-3 py-2 border border-input rounded text-sm bg-muted/50 text-foreground"
        />
        <Button size="sm" onclick={copyShareUrl} class="bg-primary hover:opacity-90 text-primary-foreground font-medium">
          {copiedMessage ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <div class="flex justify-end mt-4">
        <Button variant="outline" size="sm" onclick={() => (showShareDialog = false)} class="border-border text-foreground hover:bg-accent/20">
          Close
        </Button>
      </div>
    </div>
  </div>
{/if}
