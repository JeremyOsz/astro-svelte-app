<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { chartStore } from '$lib/stores/chart-store';
  import * as Alert from '$lib/components/ui/alert';
  import { AlertCircle } from 'lucide-svelte';
  import { 
    TransitChartDisplay, 
    TransitDetails 
  } from './components';
  import UnifiedTransitForm from './components/UnifiedTransitForm.svelte';
  import { enhance } from '$app/forms';
  import TransitLoadingState from '$lib/components/TransitLoadingState.svelte';

  // Core data
  let selectedBirthChart: any = null;
  let natalChart: any = null;
  let currentTransits: any = null;
  let loading = false;
  let error: string | null = null;

  // Transit settings
  let transitDate = new Date().toISOString().split('T')[0];
  let transitTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  let transitCitySearch = '';
  let selectedTransitCityData: any = null;

  // Chart display
  let transitChartData: string | null = null;
  let chartReady = false;
  let preparingChart = false;

  // Form validation
  let formError: string = '';

  onMount(async () => {
    // Auto-select the first saved chart if available
    if ($chartStore.savedCharts.length > 0 && !selectedBirthChart) {
      handleChartSelect($chartStore.savedCharts[0]);
    }
  });

  function handleChartSelect(chart: any) {
    selectedBirthChart = chart;
    currentTransits = null;
    transitChartData = null;
    error = null;
  }

  // Form result handling is now done in the enhance function

  function clearTransits() {
    currentTransits = null;
    transitChartData = null;
    error = null;
    chartReady = false;
    preparingChart = false;
  }
</script>

<svelte:head>
  <title>Planetary Transits - Astro Chart</title>
  <meta name="description" content="View planetary transits and their effects on your natal chart for any date and location" />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <!-- Page Header -->
  <div class="text-center mb-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">Planetary Transits</h1>
    <p class="text-lg text-gray-600 max-w-3xl mx-auto">
      See how current planetary positions interact with your natal chart to understand their influence on your life. 
      Get detailed interpretations for major aspects, minor aspects, and angular house transits with enhanced analysis.
    </p>
  </div>

  <!-- Error Messages -->
  {#if error}
    <Alert.Root class="mb-6">
      <AlertCircle class="h-4 w-4" />
      <Alert.Title>Error</Alert.Title>
      <Alert.Description>{error}</Alert.Description>
    </Alert.Root>
  {/if}

  {#if formError}
    <Alert.Root class="mb-6">
      <AlertCircle class="h-4 w-4" />
      <Alert.Title>Please fix the following:</Alert.Title>
      <Alert.Description>{formError}</Alert.Description>
    </Alert.Root>
  {/if}

  <!-- Unified Transit Form -->
  <div class=" mx-auto pb-4">
    <form 
      method="POST" 
      action="?/calculateTransits"
      use:enhance={({ cancel }) => {
        // Client-side validation
        if (!selectedBirthChart) {
          formError = 'Please select a birth chart first';
          cancel();
          return;
        }
        
        if (!transitDate) {
          formError = 'Please select a transit date';
          cancel();
          return;
        }
        
        if (!selectedTransitCityData) {
          formError = 'Please select a transit location';
          cancel();
          return;
        }
        
        formError = '';
        loading = true;
        error = null;
        
        return async ({ result }) => {
          loading = false;
          
          if (result.type === 'failure') {
            error = (result.data?.error as string) || 'An error occurred';
          } else if (result.type === 'success' && result.data) {
            natalChart = result.data.natalChart;
            currentTransits = result.data.currentTransits;
            transitChartData = result.data.transitChartData as string;
            
            // Show preparing chart state
            preparingChart = true;
            
            // Small delay to ensure DOM is ready
            setTimeout(() => {
              chartReady = true;
              preparingChart = false;
            }, 1000);
          }
        };
      }}
    >
      <input type="hidden" name="selectedBirthChartId" value={selectedBirthChart?.id || ''} />
      <input type="hidden" name="chartData" value={selectedBirthChart?.chartData || ''} />
      <input type="hidden" name="birthData" value={JSON.stringify(selectedBirthChart?.birthData || {})} />
      <!-- Debug info -->
      <input type="hidden" name="debug_chart_name" value={selectedBirthChart?.name || ''} />
      <input type="hidden" name="transitDate" value={transitDate} />
      <input type="hidden" name="transitTime" value={transitTime} />
      <input type="hidden" name="transitLat" value={selectedTransitCityData?.lat || ''} />
      <input type="hidden" name="transitLng" value={selectedTransitCityData?.lng || ''} />
      <input type="hidden" name="transitLocationName" value={selectedTransitCityData?.fullLocation || ''} />
      
      <UnifiedTransitForm 
        {selectedBirthChart}
        bind:transitDate
        bind:transitTime
        bind:transitCitySearch
        bind:selectedTransitCityData
        {loading}
        onChartSelect={handleChartSelect}
        onClearSelection={() => selectedBirthChart = null}
        onClear={clearTransits}
        hasResults={!!currentTransits}
      />
    </form>
  </div>

  <!-- Chart Preparation Loading State -->
  {#if preparingChart}
    <div class="mt-8">
      <TransitLoadingState 
        message="Preparing transit chart visualization..." 
        showProgress={false}
      />
    </div>
  {/if}

  <!-- Transit Results -->
  {#if currentTransits && transitChartData && chartReady && !preparingChart}
    <TransitChartDisplay 
      {transitChartData}
      natalChartData={selectedBirthChart?.chartData || ''}
      {transitDate}
      {transitTime}
      {selectedTransitCityData}
      {chartReady}
    />
  {/if}

  <!-- Transit Details -->
  {#if currentTransits && !preparingChart}
    <TransitDetails {natalChart} {currentTransits} />
  {/if}
</div>

<style>
  .container {
    min-height: calc(100vh - 200px);
  }

  @media (max-width: 768px) {
    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
</style> 