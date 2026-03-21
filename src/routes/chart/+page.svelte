<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import PageInsightChat from '$lib/components/PageInsightChat.svelte';
  import { buildChartPageContext } from '$lib/page-chat/context-builders';
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
  import { PanelLeft, Settings, X, BookOpen, Star } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { chartStore, currentChart } from '$lib/stores/chart-store';
  import * as Accordion from "$lib/components/ui/accordion";
  import { Input } from '$lib/components/ui/input';
  import ChartInstructions from '$lib/components/ChartInstructions.svelte';
  import { env as publicEnv } from '$env/dynamic/public';
  import { logFeatureUsage } from '$lib/services/usage-logger';

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

  // Chart instructions
  let showInstructions = false;
  let chatContext = '';
  let chatSuggestions: string[] = [];

  const AI_CHAT_ENABLED = publicEnv.PUBLIC_ENABLE_AI_CHAT === 'true';

  // Loading progress tracking
  let loadingProgress = 0;

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
  let userHasInteractedWithTextarea = false;
  
  // Update textarea when chart store changes (but only if it's different to avoid loops)
  $: if ($chartStore.chartData && $chartStore.chartData !== textareaStore && !userHasInteractedWithTextarea) {
    textareaStore = $chartStore.chartData;
  }

  // Mobile detection for sidebar behavior only
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

  $: chatContext = buildChartPageContext({
    birthData: $chartStore.birthData,
    chartData: $chartStore.chartData,
    interpretationFilter,
    showChart,
    showDegreeMarkers,
    showExtendedPlanets,
    showAspectLines,
    showPlanetLabels,
    zoomLevel,
    savedChartsCount: $chartStore.savedCharts.length
  });

  $: chatSuggestions = showChart
    ? [
        'What are the dominant themes in this chart?',
        'Which placements should I pay attention to first?',
        'How do the chart settings and interpretations connect?'
      ]
    : [
        'What information do I need to generate a chart?',
        'How should I read this birth chart page?',
        'What can this chart tool help me discover?'
      ];

  // Show loading state when API calls are in progress
  $: if (isLoading) {
    // Loading state active
  } else {
    loadingProgress = 0;
  }

  // Progress simulation
  let progressInterval: ReturnType<typeof setInterval> | null = null;
  
  $: if (isLoading && !progressInterval) {
    progressInterval = setInterval(() => {
      if (loadingProgress < 90) {
        loadingProgress += Math.random() * 15;
      }
    }, 500);
  } else if (!isLoading && progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
    loadingProgress = 0;
  }

  // Accordion open state for mobile
  let mobileAccordionValue = '';
  $: mobileAccordionValue = !showChart ? 'birth-form' : 'saved-charts';

  onMount(() => {
    void logFeatureUsage({
      feature: 'chart',
      action: 'page_open',
      route: '/chart'
    });

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
    chartStore.loadFromURL().then(async loadedFromURL => {
      if (loadedFromURL) {
        activeTab = 'saved';
        // Auto-generate chart if birthData is present and no chartData
        if (!$chartStore.chartData && $chartStore.birthData) {
          await chartStore.generateChartFromBirthData($chartStore.birthData);
        }
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
  <title>Astrological Birth Chart - OsztrOlogy</title>
  <meta name="description" content="Generate and visualize your astrological birth chart" />
  {#if isResizing}
    <style>
      body { cursor: col-resize !important; }
    </style>
  {/if}
</svelte:head>

<Sidebar.Provider bind:open={sidebarOpen}>
  <div class="flex flex-col md:flex-row min-h-screen w-full relative">
    <!-- Mobile: Accordion for Birth Data and People -->
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
              People ({$chartStore.savedCharts.length})
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
             fixed inset-y-0 left-0 bg-card
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
            <h1 class="text-xl font-bold text-foreground">Birth Chart</h1>
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
            <h1 class="text-2xl font-bold text-foreground">Birth Chart Calculator</h1>
            <p class="text-sm text-muted-foreground">Generate your personalized astrological birth chart</p>
          </div>
        
        <!-- Tab Navigation -->
        <div class="flex border-b">
          <button
            class="flex-1 py-2 px-3 text-sm font-medium border-b-2 transition-colors"
            class:border-primary={activeTab === 'form'}
            class:text-foreground={activeTab === 'form'}
            class:border-transparent={activeTab !== 'form'}
            class:text-muted-foreground={activeTab !== 'form'}
            on:click={() => activeTab = 'form'}
          >
            Birth Data
          </button>
          <button
            class="flex-1 py-2 px-3 text-sm font-medium border-b-2 transition-colors"
            class:border-primary={activeTab === 'saved'}
            class:text-foreground={activeTab === 'saved'}
            class:border-transparent={activeTab !== 'saved'}
            class:text-muted-foreground={activeTab !== 'saved'}
            on:click={() => activeTab = 'saved'}
          >
            <BookOpen class="h-4 w-4 inline mr-1" />
            People ({$chartStore.savedCharts.length})
          </button>
        </div>
          
          <div class="space-y-4 flex-1 overflow-y-auto">
          {#if activeTab === 'form'}
            <!-- Birth Chart Form -->
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-3">Birth Details</h3>
              <BirthChartForm formPrefix="desktop_" />
            </div>

            <!-- Test Data Section -->
            <div class="border-t pt-4">
              <h3 class="text-lg font-semibold text-foreground mb-3">Test Data</h3>
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
                  <label for="chart-data-textarea" class="text-sm font-medium text-foreground mb-2 block">Chart Data</label>
                  <p class="text-sm text-muted-foreground mb-2">For testing - Copy and paste your chart data from astro-seek - on your chart page click 'copy positions' and paste here</p>
                  <p class="text-sm text-muted-foreground mb-2">Changing the string will change the chart</p>
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
                    class="w-full h-32 font-mono text-sm leading-5 border border-input rounded-md p-3 resize-y bg-card text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    bind:value={textareaStore}
                    on:input={() => {
                      userHasInteractedWithTextarea = true;
                      if (textareaStore.trim() && textareaStore !== $chartStore.chartData) {
                        chartStore.setChartData(textareaStore);
                      } else if (!textareaStore.trim() && $chartStore.chartData && userHasInteractedWithTextarea) {
                        chartStore.clear();
                      }
                    }}
                    placeholder="Enter chart data in format: Planet,Sign,Degree&#10;Example: Sun,Aries,15°30'"
                    rows="8"
                  ></textarea>
                  <div class="text-xs text-muted-foreground mt-1">
                    Current value: {textareaStore ? textareaStore.substring(0, 50) + '...' : 'empty'}
                  </div>
                </div>
              </div>
            </div>
          {:else if activeTab === 'saved'}
            <!-- People -->
            <SavedChartsList onChartSelect={handleChartSelect} />
          {/if}
            </div>
          </div>
        
        <!-- Resize Handle (Desktop only) -->
        {#if sidebarOpen && !isMobile}
          <div 
            class="absolute top-0 right-0 w-3 h-full hover:bg-accent/40 cursor-col-resize transition-colors duration-150 z-10 group {isResizing ? 'bg-accent/60' : ''}"
            on:mousedown={handleResizeStart}
            role="button"
            tabindex="0"
            aria-label="Resize sidebar"
          >
            <!-- Visual indicator -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-muted-foreground rounded-full group-hover:bg-foreground"></div>
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
          <h2 class="text-xl font-semibold text-foreground sm:block">Chart Visualization</h2>
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
                        <div class="sticky top-0 bg-card border-b z-10 flex-shrink-0">
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
                  <h3 class="text-lg font-semibold text-foreground border-b pb-2">Chart Options</h3>
                  <div class="space-y-4">
                    <label class="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        bind:checked={showDegreeMarkers} 
                        class="w-5 h-5 text-primary border-input rounded focus:ring-ring"
                      >
                      <span class="text-sm font-medium text-foreground group-hover:text-foreground">Show Degree Markers</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        bind:checked={showExtendedPlanets} 
                        class="w-5 h-5 text-primary border-input rounded focus:ring-ring"
                      >
                      <span class="text-sm font-medium text-foreground group-hover:text-foreground">Show Extended Planets</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        bind:checked={showAspectLines} 
                        class="w-5 h-5 text-primary border-input rounded focus:ring-ring"
                      >
                      <span class="text-sm font-medium text-foreground group-hover:text-foreground">Show Aspect Lines</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        bind:checked={showPlanetLabels} 
                        class="w-5 h-5 text-primary border-input rounded focus:ring-ring"
                      >
                      <span class="text-sm font-medium text-foreground group-hover:text-foreground">Show Planet Labels</span>
                    </label>
                  </div>
                </div>



                <!-- Zodiac Signs Legend -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-foreground border-b pb-2">Zodiac Signs</h3>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-red-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♈</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Aries</span>
                        <div class="text-xs text-muted-foreground">Fire Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-amber-700" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♉</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Taurus</span>
                        <div class="text-xs text-muted-foreground">Earth Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-primary" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♊</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Gemini</span>
                        <div class="text-xs text-muted-foreground">Air Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-indigo-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♋</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Cancer</span>
                        <div class="text-xs text-muted-foreground">Water Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-red-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♌</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Leo</span>
                        <div class="text-xs text-muted-foreground">Fire Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-amber-700" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♍</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Virgo</span>
                        <div class="text-xs text-muted-foreground">Earth Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-primary" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♎</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Libra</span>
                        <div class="text-xs text-muted-foreground">Air Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-indigo-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♏</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Scorpio</span>
                        <div class="text-xs text-muted-foreground">Water Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-red-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♐</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Sagittarius</span>
                        <div class="text-xs text-muted-foreground">Fire Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-amber-700" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♑</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Capricorn</span>
                        <div class="text-xs text-muted-foreground">Earth Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-primary" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♒</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Aquarius</span>
                        <div class="text-xs text-muted-foreground">Air Sign</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-indigo-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♓</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Pisces</span>
                        <div class="text-xs text-muted-foreground">Water Sign</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Planet Symbols Legend -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-foreground border-b pb-2">Planet Symbols</h3>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-yellow-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">☉</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Sun</span>
                        <div class="text-xs text-muted-foreground">Core Identity</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-muted-foreground" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">☽</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Moon</span>
                        <div class="text-xs text-muted-foreground">Emotions</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-muted-foreground" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">☿</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Mercury</span>
                        <div class="text-xs text-muted-foreground">Communication</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-pink-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♀</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Venus</span>
                        <div class="text-xs text-muted-foreground">Love & Beauty</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-red-600" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♂</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Mars</span>
                        <div class="text-xs text-muted-foreground">Action & Energy</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-orange-500" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♃</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Jupiter</span>
                        <div class="text-xs text-muted-foreground">Expansion</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-purple-600" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♄</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Saturn</span>
                        <div class="text-xs text-muted-foreground">Structure</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-cyan-600" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♅</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Uranus</span>
                        <div class="text-xs text-muted-foreground">Innovation</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-accent" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♆</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Neptune</span>
                        <div class="text-xs text-muted-foreground">Spirituality</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-red-800" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">♇</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Pluto</span>
                        <div class="text-xs text-muted-foreground">Transformation</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-green-600" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">☊</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">North Node</span>
                        <div class="text-xs text-muted-foreground">Soul Purpose</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <span class="text-xl text-violet-700" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">⚸</span>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Lilith</span>
                        <div class="text-xs text-muted-foreground">Dark Moon</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Aspect Lines Legend -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-foreground border-b pb-2">Aspect Lines</h3>
                  <div class="space-y-3">
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <div class="w-6 h-0.5 bg-red-500 rounded"></div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Conjunction (0°)</span>
                        <div class="text-xs text-muted-foreground">Unity & blending of energies</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <div class="w-6 h-0.5 bg-red-600 rounded"></div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Opposition (180°)</span>
                        <div class="text-xs text-muted-foreground">Tension & balance</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <div class="w-6 h-0.5 bg-blue-500 rounded"></div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Square (90°)</span>
                        <div class="text-xs text-muted-foreground">Challenge & growth</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <div class="w-6 h-0.5 bg-blue-600 rounded"></div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Trine (120°)</span>
                        <div class="text-xs text-muted-foreground">Harmony & flow</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <div class="w-6 h-0.5 bg-green-500 rounded"></div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Sextile (60°)</span>
                        <div class="text-xs text-muted-foreground">Opportunity & cooperation</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                      <div class="w-6 h-0.5 bg-muted-foreground rounded"></div>
                      <div class="flex-1">
                        <span class="text-sm font-medium text-foreground">Quincunx (150°)</span>
                        <div class="text-xs text-muted-foreground">Adjustment & adaptation</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Instructions -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-foreground border-b pb-2">Instructions</h3>
                  <div class="space-y-3 text-sm text-muted-foreground">
                    <div class="flex items-start space-x-2">
                      <span class="text-primary mt-0.5">•</span>
                      <span>Hover over planets and aspects to see detailed interpretations</span>
                    </div>
                    <div class="flex items-start space-x-2">
                      <span class="text-primary mt-0.5">•</span>
                      <span>Use the checkboxes above to toggle different chart elements</span>
                    </div>
                    <div class="flex items-start space-x-2">
                      <span class="text-primary mt-0.5">•</span>
                      <span>Update the chart data in the sidebar to see different charts</span>
                    </div>
                    <div class="flex items-start space-x-2">
                      <span class="text-primary mt-0.5">•</span>
                      <span>Use zoom controls to get a closer look at details</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Root>

      <!-- Chart Content -->
      <div class="flex-1 p-2 sm:py-2 sm:py-4 m:p-4 min-h-0 relative">
        <!-- Loading State -->
        {#if isLoading}
          <div class="flex items-center justify-center h-full min-h-[400px]">
            <ChartLoadingState 
              message="Connecting to the ephemeris service..."
              showProgress={true}
              progress={loadingProgress}
            />
          </div>
        {:else if showChart}
          <!-- Chart Instructions -->
          <ChartInstructions bind:showInstructions />
          
          <div class="bg-card/70 border border-border rounded-lg shadow-md p-2 sm:p-4 md:p-4"
               class:px-0={isMobile}
               class:rounded-none={isMobile}
               class:shadow-none={isMobile}
               class:-mx-4={isMobile}>
            <D3Chart 
              bind:this={chartComponent}
              {showDegreeMarkers}
              {showExtendedPlanets}
              {showAspectLines}
              {showPlanetLabels}
              bind:zoomLevel={zoomLevel}
            />
          </div>
          {#if AI_CHAT_ENABLED}
            <div class="mt-4 rounded-lg border border-border bg-card/60">
              <details class="group" open>
                <summary class="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-foreground">
                  <span>AI Chart Interpretation</span>
                  <span class="text-xs text-muted-foreground transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div class="border-t border-border px-4 py-4">
                  <PageInsightChat
                    title="Ask about this birth chart"
                    description="Chat with the current chart, birth details, and interpretation filter as context."
                    contextSummary={chatContext}
                    suggestions={chatSuggestions}
                    featuredPromptLabel="What does this chart mean?"
                    featuredPrompt="What does this chart mean? Give me a clear overall interpretation of the main themes, strongest placements, and anything especially notable."
                  />
                </div>
              </details>
            </div>
          {/if}
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
          <div class="absolute inset-0 flex items-center justify-center top-5 bottom-auto">
            <div class="text-center p-8 max-w-md">
              <div class="bg-gradient-to-br from-background via-card to-accent/20 border border-border rounded-2xl p-8 shadow-lg mystical-glow">
                <div class="mb-6">
                  <div class="w-16 h-16 mx-auto mb-4 relative">
                    <div class="absolute inset-0 border-4 border-primary/30 rounded-full opacity-70"></div>
                    <div class="absolute inset-2 border-4 border-accent/40 rounded-full opacity-70"></div>
                    <div class="absolute inset-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <Star class="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <h3 class="text-lg font-semibold text-foreground mb-2">Ready to Discover Your Chart</h3>
                <p class="text-sm text-muted-foreground mb-4">
                  Enter your birth details to reveal your unique astrological blueprint and cosmic signature
                </p>
                <div class="text-xs text-muted-foreground space-y-1">
                  <p>✨ Your birth chart reveals your soul's journey</p>
                  <p>🌟 Each planet tells a story of your potential</p>
                  <p>🌙 The stars align to guide your path</p>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </main>
  </div>
</Sidebar.Provider> 

{#if !showChart && AI_CHAT_ENABLED}
  <div class="mx-auto max-w-4xl px-4 pb-10">
    <PageInsightChat
      title="Ask about the birth chart tool"
      description="Get help generating or understanding a chart before you load one."
      contextSummary={chatContext}
      suggestions={chatSuggestions}
    />
  </div>
{/if}

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
