<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { User, BookOpen } from 'lucide-svelte';
  import SavedChartsList from '$lib/components/SavedChartsList.svelte';
  import { chartStore } from '$lib/stores/chart-store';

  export let selectedBirthChart: any;
  export let onChartSelect: (chart: any) => void;
  export let onClearSelection: () => void;

  function handleChartSelect(chart: any) {
    onChartSelect(chart);
  }
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="flex items-center gap-2">
      <User class="h-5 w-5" />
      Select Birth Chart
    </Card.Title>
  </Card.Header>
  <Card.Content>
    {#if selectedBirthChart}
      <div class="space-y-4">
        <div class="p-4 bg-gray-50 rounded-lg border">
          <div class="space-y-2">
            <h3 class="font-semibold text-lg">{selectedBirthChart.name}</h3>
            <div class="grid grid-cols-1 gap-1 text-sm text-gray-600">
              <span>Date: {selectedBirthChart.birthData.date}</span>
              <span>Time: {selectedBirthChart.birthData.time}</span>
              <span>Location: {selectedBirthChart.birthData.place}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onclick={onClearSelection}>
          Change Chart
        </Button>
      </div>
    {:else}
      <div class="space-y-4">
        {#if $chartStore.savedCharts.length > 0}
          <p class="text-sm text-gray-600">Choose a saved birth chart to analyze:</p>
          <SavedChartsList onChartSelect={handleChartSelect} />
        {:else}
          <div class="text-center py-8">
            <BookOpen class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No Saved Charts</h3>
            <p class="text-gray-600 mb-4">You need to create and save a birth chart first.</p>
            <Button onclick={() => window.location.href = '/chart'}>
              Create Birth Chart
            </Button>
          </div>
        {/if}
      </div>
    {/if}
  </Card.Content>
</Card.Root> 