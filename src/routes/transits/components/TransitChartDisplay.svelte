<script lang="ts">
  import { onMount } from 'svelte';
  import * as Card from '$lib/components/ui/card';
  import D3BiWheelChart from '$lib/chart/D3BiWheelChart.svelte';
  import { chartStore } from '$lib/stores/chart-store';

  export let transitChartData: string;
  export let natalChartData: string;
  export let transitDate: string;
  export let transitTime: string;
  export let selectedTransitCityData: any;
  export let chartReady: boolean;

  onMount(() => {
    // Update the chart store with the natal chart data
    if (natalChartData) {
      chartStore.setChartData(natalChartData);
    }
  });
</script>

<Card.Root class="mt-6">
  <Card.Header>
    <Card.Title>Transit Chart</Card.Title>
    <Card.Description>
      <div class="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>Date: {new Date(transitDate).toLocaleDateString()}</span>
        <span>Time: {transitTime}</span>
        <span>Location: {selectedTransitCityData?.fullLocation}</span>
      </div>
    </Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="w-full min-h-[400px] md:min-h-[600px] flex justify-center">
      <D3BiWheelChart 
        transitData={transitChartData}
        showDegreeMarkers={true}
        showExtendedPlanets={false}
        showAspectLines={true}
        showPlanetLabels={true}
      />
    </div>
  </Card.Content>
</Card.Root>

 