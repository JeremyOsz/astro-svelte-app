<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import D3Chart from '../../lib/chart/D3Chart.svelte';
  import InterpretationList from '../../lib/chart/InterpretationList.svelte';
  import BirthChartForm from './BirthChartForm.svelte';
  import SavedChartsList from '$lib/components/SavedChartsList.svelte';
  import SaveChartButton from '$lib/components/SaveChartButton.svelte';
  import ShareChartButton from '$lib/components/ShareChartButton.svelte';
  import ChartLoadingState from '$lib/components/ChartLoadingState.svelte';
  import * as Sidebar from "$lib/components/ui/sidebar";
  import * as Sheet from "$lib/components/ui/sheet";
  import { Button } from "$lib/components/ui/button";
  import { PanelLeft, Settings, X, BookOpen } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { chartStore, currentChart } from '$lib/stores/chart-store';
  import * as Accordion from "$lib/components/ui/accordion";
  import { Input } from '$lib/components/ui/input';

  export let data: PageData;

  let chartComponent: D3Chart;
  let showChart = false;
  let error: string | null = null;

  // Chart settings
  let showDegreeMarkers = true;
  let showExtendedPlanets = true;
  let showAspectLines = true;
  let showPlanetLabels = true;
  let zoomLevel = 1;

  // Interpretation search filter
  let interpretationFilter = '';

  // Sidebar and sheet state
  let sidebarOpen = true;
  let sheetOpen = false;
  let sidebarWidth = 320;
  let isResizing = false;
  let resizeStartX = 0;
  let resizeStartWidth = 0;
  let isMobile = false;
  let mounted = false;

  // Sidebar tabs
  let activeTab = 'form'; // 'form' | 'saved' | 'settings'

  // Constraints for sidebar width
  const MIN_SIDEBAR_WIDTH = 240;
  const MAX_SIDEBAR_WIDTH = 600;

  // Mock chart data for testing
  const mockChartData = `Sun,Sagittarius,17°09'
Moon,Capricorn,26°20'
Mercury,Sagittarius,14°28',R
Venus,Scorpio,4°00'
Mars,Sagittarius,7°36'
Jupiter,Virgo,13°55',R
Saturn,Aquarius,3°32'
Uranus,Capricorn,12°23'
Neptune,Capricorn,15°24'
Pluto,Scorpio,21°20'
Node,Capricorn,10°59',R
Lilith,Capricorn,25°14'
Chiron,Leo,9°20',R
Fortune,Libra,22°29'
Vertex,Aries,29°44'
ASC,Sagittarius,1°40'
MC,Leo,10°14'`;

  // Store for manual chart data input
  let textareaStore = '';
  
  // Update textarea when chart store changes
  $: if ($chartStore.chartData && $chartStore.chartData !== textareaStore) {
    textareaStore = $chartStore.chartData;
  }

  // Mobile detection
  $: if (mounted && typeof window !== 'undefined') {
    isMobile = window.innerWidth < 768;
  }

  // Subscribe to the chart store
  $: ({ chartData: storeChartData, error, isLoading } = $chartStore);
  
  // Update showChart based on chart data
  $: if (storeChartData && storeChartData.trim()) {
    showChart = true;
  } else {
    showChart = false;
  }

  // Accordion open state for mobile
  let mobileAccordionValue = '';
  $: mobileAccordionValue = !showChart ? 'birth-form' : '';

  onMount(() => {
    mounted = true;
    isMobile = window.innerWidth < 768;
    
    // Close sidebar on mobile if chart is empty
    if (isMobile && !showChart && sidebarOpen) {
      sidebarOpen = false;
    }
    
    // Load saved sidebar width from localStorage
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
      sidebarWidth = Math.max(MIN_SIDEBAR_WIDTH, parseInt(savedWidth));
    }

    // Try to load chart from URL parameters
    chartStore.loadFromURL().then(loadedFromURL => {
      if (loadedFromURL) {
        // If loaded from URL, switch to saved charts tab
        activeTab = 'saved';
      }
    }).catch(error => {
      console.error('Failed to load from URL:', error);
    });

    // Handle window resize
    const handleResize = () => {
      isMobile = window.innerWidth < 768;
      if (isMobile && sidebarOpen) {
        sidebarOpen = false;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  function loadTestData() {
    chartStore.setChartData(mockChartData);
  }

  function clearChart() {
    chartStore.clear();
  }

  function handleChartSelect(chart: any) {
    chartStore.loadChart(chart.id);
    if (isMobile) {
      sidebarOpen = false;
    }
  }

  // Resize handlers
  function handleResizeStart(event: MouseEvent) {
    if (isMobile) return;

    isResizing = true;
    resizeStartX = event.clientX;
    resizeStartWidth = sidebarWidth;
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
    
    document.body.style.userSelect = 'none';
    event.preventDefault();
  }

  function handleResizeMove(event: MouseEvent) {
    if (!isResizing) return;
    
    const deltaX = event.clientX - resizeStartX;
    const newWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, resizeStartWidth + deltaX));
    
    sidebarWidth = newWidth;
  }

  function handleResizeEnd() {
    isResizing = false;
    
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    
    document.body.style.userSelect = '';
    
    localStorage.setItem('sidebarWidth', sidebarWidth.toString());
  }

  function handleZoomIn() {
    if (chartComponent) {
      chartComponent.zoomIn();
    }
  }

  function handleZoomOut() {
    if (chartComponent) {
      chartComponent.zoomOut();
    }
  }

  function handleZoomReset() {
    if (chartComponent) {
      chartComponent.zoomReset();
    }
  }
</script>

<svelte:head>
  <title>Astrological Birth Chart - Astro Chart</title>
  <meta name="description" content="Generate and visualize your astrological birth chart" />
  {#if isResizing}
    <style>
      body { cursor: col-resize !important; }
    </style>
  {/if}
</svelte:head>

<Sidebar.Provider bind:open={sidebarOpen}>
  <div class="flex flex-col md:flex-row min-h-screen w-full relative">
    <!-- Mobile: Accordion for Birth Data -->
    <div class="w-full max-w-xl mx-auto mt-2 px-2 md:hidden">
        <Accordion.Accordion type="single" bind:value={mobileAccordionValue}>
          <Accordion.AccordionItem value="birth-form">
            <Accordion.AccordionTrigger class="text-lg font-semibold">
              Enter Birth Data
            </Accordion.AccordionTrigger>
            <Accordion.AccordionContent>
              <BirthChartForm formPrefix="mobile_" />
            </Accordion.AccordionContent>
          </Accordion.AccordionItem>
        </Accordion.Accordion>
      </div>

    <!-- Desktop: Sidebar -->
    <aside 
      class="relative border-r overflow-hidden z-50
             md:relative md:z-auto md:bg-muted/40
             fixed inset-y-0 left-0 bg-white
             md:border-r border-r-0 md:border-r
             hidden md:block" 
      class:transition-all={!isResizing}
      class:duration-300={!isResizing}
      class:ease-in-out={!isResizing}
      style="width: {sidebarOpen ? `${sidebarWidth}px` : '0px'}"
    >
        <div class="h-full flex flex-col p-4 space-y-6" class:hidden={!sidebarOpen}>
          <!-- Mobile header with close button -->
          <div class="flex items-center justify-between md:hidden">
            <h1 class="text-xl font-bold text-gray-800">Birth Chart</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onclick={() => sidebarOpen = false}
              class="h-8 w-8"
            >
            <X class="h-4 w-4" />
            </Button>
          </div>

          <!-- Desktop header -->
          <div class="text-center hidden md:block">
            <h1 class="text-2xl font-bold text-gray-800">Birth Chart Calculator</h1>
            <p class="text-sm text-gray-600">Generate your personalized astrological birth chart</p>
          </div>
        
        <!-- Tab Navigation -->
        <div class="flex border-b">
          <button
            class="flex-1 py-2 px-3 text-sm font-medium border-b-2 transition-colors"
            class:border-blue-500={activeTab === 'form'}
            class:text-blue-600={activeTab === 'form'}
            class:border-transparent={activeTab !== 'form'}
            class:text-gray-500={activeTab !== 'form'}
            on:click={() => activeTab = 'form'}
          >
            Birth Data
          </button>
          <button
            class="flex-1 py-2 px-3 text-sm font-medium border-b-2 transition-colors"
            class:border-blue-500={activeTab === 'saved'}
            class:text-blue-600={activeTab === 'saved'}
            class:border-transparent={activeTab !== 'saved'}
            class:text-gray-500={activeTab !== 'saved'}
            on:click={() => activeTab = 'saved'}
          >
            <BookOpen class="h-4 w-4 inline mr-1" />
            Saved ({$chartStore.savedCharts.length})
          </button>
        </div>
          
          <div class="space-y-4 flex-1 overflow-y-auto">
          {#if activeTab === 'form'}
            <!-- Birth Chart Form -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-3">Birth Details</h3>
              <BirthChartForm formPrefix="desktop_" />
            </div>

            <!-- Test Data Section -->
            <div class="border-t pt-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">Test Data</h3>
              <div class="space-y-3">
                <div class="flex gap-2">
                  <Button variant="outline" size="sm" class="flex-1 h-10" onclick={loadTestData}>
                    Load Test Data
                  </Button>
                  <Button variant="outline" size="sm" class="flex-1 h-10" onclick={clearChart}>
                    Clear Chart
                  </Button>
                </div>
                
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-2 block">Chart Data</label>
                  <p class="text-sm text-gray-600 mb-2">For testing - Copy and paste your chart data from astro-seek</p>
                  <div class="flex gap-2 mb-2">
                    <Button variant="outline" size="sm" onclick={() => textareaStore = mockChartData}>
                      Load Test Data
                    </Button>
                    <Button variant="outline" size="sm" onclick={() => textareaStore = ''}>
                      Clear
                    </Button>
                  </div>
                  <textarea 
                    class="w-full h-32 font-mono text-xs border border-gray-300 rounded-md p-2 resize-y"
                    bind:value={textareaStore}
                    on:input={() => {
                      if (textareaStore.trim() && textareaStore !== $chartStore.chartData) {
                        chartStore.setChartData(textareaStore);
                      } else if (!textareaStore.trim() && $chartStore.chartData) {
                        chartStore.clear();
                      }
                    }}
                    placeholder="Enter chart data in format: Planet,Sign,Degree&#10;Example: Sun,Aries,15°30'"
                    rows="8"
                  ></textarea>
                </div>
              </div>
            </div>
          {:else if activeTab === 'saved'}
            <!-- Saved Charts -->
            <SavedChartsList onChartSelect={handleChartSelect} />
          {/if}
            </div>
          </div>
        
      <!-- Resize handle -->
          <div 
        class="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors"
        class:bg-blue-500={isResizing}
            on:mousedown={handleResizeStart}
      ></div>
      </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-screen">
      <!-- Mobile: Toggle sidebar button -->
      <div class="md:hidden p-4 border-b">
        <Button variant="outline" size="sm" onclick={() => sidebarOpen = true}>
          <PanelLeft class="h-4 w-4 mr-2" />
          Open Sidebar
          </Button>
        </div>
        
      <!-- Chart Controls -->
      {#if showChart}
        <div class="p-4 border-b bg-gray-50">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <h2 class="text-lg font-semibold">
                {#if $currentChart}
                  {$currentChart.name}
                {:else}
                  Birth Chart
                {/if}
              </h2>
              
              <div class="flex items-center gap-2">
                <SaveChartButton />
                <ShareChartButton />
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <Button variant="outline" size="sm" onclick={handleZoomIn}>+</Button>
              <Button variant="outline" size="sm" onclick={handleZoomOut}>−</Button>
              <Button variant="outline" size="sm" onclick={handleZoomReset}>Reset</Button>
                    </div>
                  </div>
                </div>
      {/if}

      <!-- Chart Display -->
      <div class="flex-1 flex flex-col lg:flex-row">
        <!-- Chart Visualization -->
        <div class="flex-1 p-4">
          {#if isLoading}
            <ChartLoadingState message="Generating your birth chart..." />
          {:else if error}
            <div class="text-center py-12">
              <div class="text-red-500 mb-4">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">Error</h3>
              <p class="text-gray-600">{error}</p>
          </div>
        {:else if showChart}
            <D3Chart 
              bind:this={chartComponent}
              {showDegreeMarkers}
              {showExtendedPlanets}
              {showAspectLines}
              {showPlanetLabels}
              bind:zoomLevel={zoomLevel}
            />
          {:else}
            <div class="text-center py-12">
              <div class="text-gray-400 mb-4">
                <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
          </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Generate Your Birth Chart</h3>
              <p class="text-gray-600 mb-4">Enter your birth details to create your personalized astrological chart</p>
              <Button onclick={() => sidebarOpen = true}>
                Enter Birth Data
              </Button>
            </div>
          {/if}
        </div>

        <!-- Interpretations Panel -->
        {#if showChart}
          <div class="lg:w-80 border-l p-4 bg-gray-50">
            <InterpretationList filter={interpretationFilter} />
          </div>
        {/if}
      </div>
    </main>
  </div>
</Sidebar.Provider> 

<style>
  /* Custom styles for better UX */
  .chart-container {
    min-height: 600px;
  }
  
  @media (max-width: 768px) {
    .chart-container {
      min-height: 400px;
    }
  }
</style> 