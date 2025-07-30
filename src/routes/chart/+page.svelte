<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import D3Chart from '../../lib/chart/D3Chart.svelte';
  import InterpretationList from '../../lib/components/interpretations/InterpretationList.svelte';
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

  // export let data: PageData;

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
  let sidebarWidth = 320; // Default width in pixels
  let isResizing = false;
  let resizeStartX = 0;
  let resizeStartWidth = 0;
  let isMobile = false;
  let mounted = false; // Track if component has mounted

  // Sidebar tabs
  let activeTab = 'form'; // 'form' | 'saved'

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

  // Store for manual chart data input - make it reactive to chart store
  let textareaStore = '';
  
  // Update textarea when chart store changes (but only if it's different to avoid loops)
  $: if ($chartStore.chartData && $chartStore.chartData !== textareaStore) {
    textareaStore = $chartStore.chartData;
  }

  // Mobile detection for sidebar behavior only
  $: if (mounted && typeof window !== 'undefined') {
    isMobile = window.innerWidth < 768;
  }

  // Subscribe to the chart store
  $: ({ chartData: storeChartData, error, isLoading } = $chartStore);
  console.log('Chart store updated:', { storeChartData, error, isLoading });
  
  // Update showChart based on chart data
  $: if (storeChartData && storeChartData.trim()) {
    showChart = true;
    console.log('Chart data available, showing chart');
  } else {
    showChart = false;
    console.log('No chart data, hiding chart');
  }

  // Show loading state when API calls are in progress
  $: if (isLoading) {
    console.log('Chart is loading, showing loading state');
  }

  // Accordion open state for mobile
  let mobileAccordionValue = '';
  $: mobileAccordionValue = !showChart ? 'birth-form' : 'saved-charts';

  onMount(() => {
    // Mark as hydrated to enable mobile detection
    mounted = true;
    
    // Initial mobile detection
    isMobile = window.innerWidth < 768;
    
    // Close sidebar on mobile if chart is empty
    if (isMobile && !showChart && sidebarOpen) {
      sidebarOpen = false;
    }
    
    // Don't auto-load test data - let user submit form instead
    // if (!storeChartData) {
    //   loadTestData();
    // } else {
    //   showChart = true;
    // }
    
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
      // Close sidebar on mobile when rotating to portrait
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
    // Prevent resize on mobile devices
    if (isMobile) return;
    

    isResizing = true;
    resizeStartX = event.clientX;
    resizeStartWidth = sidebarWidth;
    
    // Add global event listeners
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
    
    // Prevent text selection during resize
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
    
    // Remove global event listeners
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    
    // Restore text selection
    document.body.style.userSelect = '';
    
    // Save to localStorage
    localStorage.setItem('sidebarWidth', sidebarWidth.toString());
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
    <!-- Mobile: Accordion for Birth Data and Saved Charts -->
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
          <Accordion.AccordionItem value="saved-charts">
            <Accordion.AccordionTrigger class="text-lg font-semibold">
              <BookOpen class="h-4 w-4 inline mr-1" />
              Saved Charts ({$chartStore.savedCharts.length})
            </Accordion.AccordionTrigger>
            <Accordion.AccordionContent>
              <SavedChartsList onChartSelect={handleChartSelect} />
            </Accordion.AccordionContent>
          </Accordion.AccordionItem>
        </Accordion.Accordion>
      </div>
    <!-- Desktop: Sidebar -->
    <!-- Collapsible and Resizable Sidebar -->
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
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
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
                  <label for="chart-data-textarea" class="text-sm font-medium text-gray-700 mb-2 block">Chart Data</label>
                  <p class="text-sm text-gray-600 mb-2">For testing - Copy and paste your chart data from astro-seek - on your chart page click 'copy positions' and paste here</p>
                  <p class="text-sm text-gray-600 mb-2">Changing the string will change the chart</p>
                  <div class="flex gap-2 mb-2">
                    <Button variant="outline" size="sm" onclick={() => textareaStore = mockChartData}>
                      Load Test Data
                    </Button>
                    <Button variant="outline" size="sm" onclick={() => textareaStore = ''}>
                      Clear
                    </Button>
                  </div>
                  <textarea 
                    id="chart-data-textarea"
                    class="w-full h-32 font-mono text-xs border border-gray-300 rounded-md p-2 resize-y"
                    bind:value={textareaStore}
                    on:input={() => {
                      console.log('Textarea input:', textareaStore);
                      // Only update store if the data is actually different to avoid loops
                      if (textareaStore.trim() && textareaStore !== $chartStore.chartData) {
                        chartStore.setChartData(textareaStore);
                      } else if (!textareaStore.trim() && $chartStore.chartData) {
                        chartStore.clear();
                      }
                    }}
                    placeholder="Enter chart data in format: Planet,Sign,Degree&#10;Example: Sun,Aries,15°30'"
                    rows="8"
                  ></textarea>
                  <div class="text-xs text-gray-500 mt-1">
                    Current value: {textareaStore ? textareaStore.substring(0, 50) + '...' : 'empty'}
                  </div>
                </div>
              </div>
            </div>
          {:else if activeTab === 'saved'}
            <!-- Saved Charts -->
            <SavedChartsList onChartSelect={handleChartSelect} />
          {/if}
            </div>
          </div>
        
        <!-- Resize Handle (Desktop only) -->
        {#if sidebarOpen && !isMobile}
          <div 
            class="absolute top-0 right-0 w-3 h-full hover:bg-gray-300 cursor-col-resize transition-colors duration-150 z-10 group"
            class:bg-gray-500={isResizing}
            on:mousedown={handleResizeStart}
            role="button"
            tabindex="0"
            aria-label="Resize sidebar"
          >
            <!-- Visual indicator -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-gray-600 rounded-full group-hover:bg-gray-800"></div>
          </div>
        {/if}
      </aside>
    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0 w-full md:w-auto">
      <!-- Header with controls -->
      <div class="border-b bg-background px-4 py-3 flex items-center justify-between sm:justify-between flex-wrap">
        <div class="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onclick={() => sidebarOpen = !sidebarOpen}
            class="h-8 w-8"
          >
            <PanelLeft class="h-4 w-4" />
          </Button>
          <h2 class="text-xl font-semibold text-gray-800 sm:block">Chart Visualization</h2>
        </div>
        
        <!-- Right side buttons - wrap on mobile, normal on desktop -->
        <div class="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          {#if showChart}
            <SaveChartButton />
            <ShareChartButton />
          {/if}
          <Sheet.Root bind:open={sheetOpen}>
            <Sheet.Trigger>
              <Button variant="outline" size="sm" class="h-10">
                <Settings class="h-4 w-4 mr-2" />
                <span class="hidden sm:inline">Controls & Legend</span>
                <span class="sm:hidden">Controls & Legend</span>
              </Button>
            </Sheet.Trigger>
          </Sheet.Root>
        </div>
      </div>

      <!-- Sheet Content -->
      <Sheet.Root bind:open={sheetOpen}>
        <Sheet.Content side="right" class="w-full sm:w-96 md:w-[540px] flex flex-col">
                        <div class="sticky top-0 bg-white border-b z-10 flex-shrink-0">
              <div class="flex items-start justify-between p-6">
                <Sheet.Header class="p-0 flex-1">
                  <Sheet.Title>Chart Controls & Legend</Sheet.Title>
                  <Sheet.Description>
                    Customize your chart appearance and view the legend
                  </Sheet.Description>
                </Sheet.Header>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onclick={() => sheetOpen = false}
                  class="h-8 w-8 ml-4 flex-shrink-0 cursor-pointer"
                >
                  <X class="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div class="flex-1 overflow-y-auto p-4 min-h-0">
              <div class="space-y-8 pb-8">
                <!-- Chart Options -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Chart Options</h3>
                  <div class="space-y-4">
                    <label class="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        bind:checked={showDegreeMarkers} 
                        class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      >
                      <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">Show Degree Markers</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        bind:checked={showExtendedPlanets} 
                        class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      >
                      <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">Show Extended Planets</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        bind:checked={showAspectLines} 
                        class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      >
                      <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">Show Aspect Lines</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        bind:checked={showPlanetLabels} 
                        class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      >
                      <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">Show Planet Labels</span>
                    </label>
                  </div>
                </div>



                <!-- Zodiac Signs Legend -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Zodiac Signs</h3>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-red-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♈</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Aries</span>
                        <div class="text-xs text-gray-500">Fire Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-amber-700" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♉</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Taurus</span>
                        <div class="text-xs text-gray-500">Earth Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-blue-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♊</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Gemini</span>
                        <div class="text-xs text-gray-500">Air Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-indigo-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♋</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Cancer</span>
                        <div class="text-xs text-gray-500">Water Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-red-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♌</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Leo</span>
                        <div class="text-xs text-gray-500">Fire Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-amber-700" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♍</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Virgo</span>
                        <div class="text-xs text-gray-500">Earth Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-blue-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♎</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Libra</span>
                        <div class="text-xs text-gray-500">Air Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-indigo-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♏</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Scorpio</span>
                        <div class="text-xs text-gray-500">Water Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-red-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♐</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Sagittarius</span>
                        <div class="text-xs text-gray-500">Fire Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-amber-700" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♑</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Capricorn</span>
                        <div class="text-xs text-gray-500">Earth Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-blue-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♒</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Aquarius</span>
                        <div class="text-xs text-gray-500">Air Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-indigo-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♓</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Pisces</span>
                        <div class="text-xs text-gray-500">Water Sign</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Planet Symbols Legend -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Planet Symbols</h3>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-yellow-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">☉</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Sun</span>
                        <div class="text-xs text-gray-500">Core Identity</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-slate-400" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">☽</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Moon</span>
                        <div class="text-xs text-gray-500">Emotions</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-gray-600" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">☿</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Mercury</span>
                        <div class="text-xs text-gray-500">Communication</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-pink-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♀</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Venus</span>
                        <div class="text-xs text-gray-500">Love & Beauty</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-red-600" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♂</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Mars</span>
                        <div class="text-xs text-gray-500">Action & Energy</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-orange-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♃</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Jupiter</span>
                        <div class="text-xs text-gray-500">Expansion</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-purple-600" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♄</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Saturn</span>
                        <div class="text-xs text-gray-500">Structure</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-cyan-600" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♅</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Uranus</span>
                        <div class="text-xs text-gray-500">Innovation</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-blue-700" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♆</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Neptune</span>
                        <div class="text-xs text-gray-500">Spirituality</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-red-800" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♇</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Pluto</span>
                        <div class="text-xs text-gray-500">Transformation</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-green-600" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">☊</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">North Node</span>
                        <div class="text-xs text-gray-500">Soul Purpose</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <span class="text-xl text-violet-700" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">⚸</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Lilith</span>
                        <div class="text-xs text-gray-500">Dark Moon</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Aspect Lines Legend -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Aspect Lines</h3>
                  <div class="space-y-3">
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <div class="w-6 h-0.5 bg-red-500 rounded"></div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Conjunction (0°)</span>
                        <div class="text-xs text-gray-500">Unity & blending of energies</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <div class="w-6 h-0.5 bg-red-600 rounded"></div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Opposition (180°)</span>
                        <div class="text-xs text-gray-500">Tension & balance</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <div class="w-6 h-0.5 bg-blue-500 rounded"></div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Square (90°)</span>
                        <div class="text-xs text-gray-500">Challenge & growth</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <div class="w-6 h-0.5 bg-blue-600 rounded"></div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Trine (120°)</span>
                        <div class="text-xs text-gray-500">Harmony & flow</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <div class="w-6 h-0.5 bg-green-500 rounded"></div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Sextile (60°)</span>
                        <div class="text-xs text-gray-500">Opportunity & cooperation</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <div class="w-6 h-0.5 bg-gray-400 rounded"></div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-900">Quincunx (150°)</span>
                        <div class="text-xs text-gray-500">Adjustment & adaptation</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Instructions -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Instructions</h3>
                  <div class="space-y-3 text-sm text-gray-600">
                    <div class="flex items-start space-x-2">
                      <span class="text-blue-500 mt-0.5">•</span>
                      <span>Hover over planets and aspects to see detailed interpretations</span>
                    </div>
                    <div class="flex items-start space-x-2">
                      <span class="text-blue-500 mt-0.5">•</span>
                      <span>Use the checkboxes above to toggle different chart elements</span>
                    </div>
                    <div class="flex items-start space-x-2">
                      <span class="text-blue-500 mt-0.5">•</span>
                      <span>Update the chart data in the sidebar to see different charts</span>
                    </div>
                    <div class="flex items-start space-x-2">
                      <span class="text-blue-500 mt-0.5">•</span>
                      <span>Use zoom controls to get a closer look at details</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Root>

      <!-- Chart Content -->
      <div class="flex-1 p-2 sm:p-4 min-h-0">
        <!-- Loading State -->
        {#if isLoading}
          <div class="flex items-center justify-center h-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
            <div class="text-center p-8">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p class="text-gray-600 text-lg font-medium">Generating your birth chart...</p>
              <p class="text-gray-500 text-sm mt-2">This may take a few moments</p>
            </div>
          </div>
        {:else if showChart}
          <div class="bg-white rounded-lg shadow-md p-2 sm:p-4">
            <D3Chart 
              bind:this={chartComponent}
              {showDegreeMarkers}
              {showExtendedPlanets}
              {showAspectLines}
              {showPlanetLabels}
              bind:zoomLevel={zoomLevel}
            />
          </div>
          <!-- Search bar for interpretations -->
          <div class="mt-4">
            <Input
              placeholder="Search interpretations..."
              bind:value={interpretationFilter}
              class="w-full"
            />
          </div>
          <!-- Interpretations list -->
          <InterpretationList filter={interpretationFilter} />
        {:else}
          <div class="flex items-center justify-center h-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
            <div class="text-center p-4">
              <p class="text-gray-500 text-sm sm:text-lg">Enter your birth details or load test data to see the chart visualization</p>
            </div>
          </div>
        {/if}
      </div>
    </main>
  </div>
</Sidebar.Provider> 

<style>

  /* Ensure all buttons and interactive elements have pointer cursor */
  button, 
  [role="button"],
  .cursor-pointer {
    cursor: pointer;
  }

  /* Make sure tab buttons have pointer cursor */
  button[class*="border-b-2"] {
    cursor: pointer;
  }

  /* Ensure resize handle has proper cursor */
  .cursor-col-resize {
    cursor: col-resize;
  }

  /* Make sure all clickable elements show pointer */
  input[type="checkbox"] + span,
  label[class*="cursor-pointer"] {
    cursor: pointer;
  }
</style> 