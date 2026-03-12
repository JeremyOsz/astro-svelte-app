<script lang="ts">
  import { onMount } from 'svelte';
  import { chartStore } from '$lib/stores/chart-store';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Accordion from '$lib/components/ui/accordion';
  import { Calendar, MapPin, Clock, User, CalendarDays, BookOpen, Moon, Sun, Star, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-svelte';
  import SavedChartsList from '$lib/components/SavedChartsList.svelte';
  import DailyHoroscopeDisplay from './DailyHoroscopeDisplay.svelte';
  import type { BirthChart } from '$lib/types/types';
  import { enhance } from '$app/forms';

  // Chart selection
  let selectedBirthChart: BirthChart | null = null;
  let natalChart: BirthChart | null = null;
  let loading = false;
  let error: string | null = null;

  // Date navigation
  let selectedDate = new Date().toISOString().split('T')[0];
  let currentHoroscope: any = null;
  let formError: string = '';

  // Subscribe to chart store for saved charts
  $: ({ savedCharts } = $chartStore);

  onMount(async () => {
    // Auto-select the first saved chart if available
    if ($chartStore.savedCharts.length > 0 && !selectedBirthChart) {
      handleChartSelect($chartStore.savedCharts[0]);
    }
  });

  // Form handling will be done with enhance function

  async function handleChartSelect(chart: any) {
    // Only update if the chart is different (compare by date and location)
    const isSameChart = selectedBirthChart && 
      selectedBirthChart.date?.toISOString() === chart?.date?.toISOString() &&
      selectedBirthChart.latitude === chart?.latitude &&
      selectedBirthChart.longitude === chart?.longitude;
    
    if (!isSameChart) {
      selectedBirthChart = chart;
      natalChart = chart;
    }
  }

  // Form handling will be done with enhance function

  function navigateDate(direction: 'prev' | 'next') {
    const date = new Date(selectedDate);
    if (direction === 'prev') {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() + 1);
    }
    selectedDate = date.toISOString().split('T')[0];
  }

  function goToToday() {
    selectedDate = new Date().toISOString().split('T')[0];
  }

  // Remove the reactive statement that causes infinite loops
  // Instead, we'll call generateHoroscope() explicitly when needed
</script>

<svelte:head>
  <title>Daily Horoscope - Astro App</title>
  <meta name="description" content="Your personalized daily horoscope based on your natal chart and current transits" />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
        <Star class="w-8 h-8 text-primary" />
        Daily Horoscope
        <Star class="w-8 h-8 text-primary" />
      </h1>
      <p class="text-muted-foreground text-lg">Your personalized daily guidance from the stars</p>
    </div>

    <!-- Chart Selection -->
    <div class="bg-card border border-border rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
        <User class="w-5 h-5" />
        Select Your Birth Chart
      </h2>
      
      {#if $chartStore.savedCharts.length === 0}
        <div class="text-center py-8">
          <p class="text-muted-foreground mb-4">No saved birth charts found</p>
          <Button href="/chart" class="bg-primary text-primary-foreground hover:opacity-90 font-medium">
            Create Birth Chart
          </Button>
        </div>
      {:else}
        <SavedChartsList onChartSelect={handleChartSelect} />
      {/if}
    </div>

    <!-- Date Navigation and Form -->
    {#if natalChart}
      <form 
        method="POST" 
        action="?/generateHoroscope"
        use:enhance={({ cancel }) => {
          // Client-side validation
          if (!natalChart) {
            formError = 'Please select a birth chart first';
            cancel();
            return;
          }
          
          if (!selectedDate) {
            formError = 'Please select a date';
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
              currentHoroscope = result.data.dailyHoroscope;
            }
          };
        }}
      >
        <input type="hidden" name="natalChart" value={JSON.stringify(natalChart)} />
        <input type="hidden" name="date" value={selectedDate} />
        
        <div class="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar class="w-5 h-5" />
            Date Selection
          </h2>
          
          <div class="flex items-center justify-center gap-4">
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onclick={() => navigateDate('prev')}
              class="bg-background text-foreground border-border hover:bg-accent/20"
            >
              <ArrowLeft class="w-4 h-4" />
            </Button>
            
            <div class="flex items-center gap-2">
              <Input
                type="date"
                value={selectedDate}
                onchange={(e) => {
                  selectedDate = (e.target as HTMLInputElement).value;
                }}
                class="w-auto text-center bg-background border-border text-foreground"
              />
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onclick={goToToday}
                class="bg-background text-foreground border-border hover:bg-accent/20"
              >
                Today
              </Button>
            </div>
            
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onclick={() => navigateDate('next')}
              class="bg-background text-foreground border-border hover:bg-accent/20"
            >
              <ArrowRight class="w-4 h-4" />
            </Button>
          </div>
          
          <div class="text-center mt-4">
            <Button type="submit" class="bg-primary text-primary-foreground hover:opacity-90 font-medium">
              Generate Horoscope
            </Button>
          </div>
        </div>
      </form>
    {/if}

    <!-- Error Messages -->
    {#if formError}
      <div class="bg-destructive/15 border border-destructive/30 rounded-lg p-6 mb-8 text-center">
        <p class="text-destructive text-lg">{formError}</p>
      </div>
    {/if}

    <!-- Loading State -->
    {#if loading}
      <div class="bg-card border border-border rounded-lg p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-foreground text-lg">Generating your daily horoscope...</p>
      </div>
    {:else if error}
      <div class="bg-destructive/15 border border-destructive/30 rounded-lg p-6 text-center">
        <p class="text-destructive text-lg mb-4">{error}</p>
        <form method="POST" action="?/generateHoroscope" use:enhance>
          <input type="hidden" name="natalChart" value={JSON.stringify(natalChart)} />
          <input type="hidden" name="date" value={selectedDate} />
          <Button type="submit" variant="destructive" class="font-medium">
            <RefreshCw class="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </form>
      </div>
    {:else if currentHoroscope}
      <!-- Daily Horoscope Display -->
      <DailyHoroscopeDisplay {currentHoroscope} {natalChart} />
    {:else if natalChart}
      <div class="bg-card border border-border rounded-lg p-8 text-center">
        <p class="text-muted-foreground text-lg">Click "Today" or select a date to generate your horoscope</p>
      </div>
    {/if}

    <!-- Instructions -->
    {#if !natalChart}
      <div class="bg-card border border-border rounded-lg p-6 mt-8">
        <h3 class="text-lg font-semibold mb-3">How to Get Your Daily Horoscope</h3>
        <div class="grid md:grid-cols-3 gap-4 text-muted-foreground">
          <div class="text-center">
            <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
              <span class="text-primary-foreground font-bold">1</span>
            </div>
            <p>Select your saved birth chart or create a new one</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
              <span class="text-primary-foreground font-bold">2</span>
            </div>
            <p>Choose a date for your horoscope (today or any date)</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
              <span class="text-primary-foreground font-bold">3</span>
            </div>
            <p>Receive your personalized daily guidance</p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div> 
