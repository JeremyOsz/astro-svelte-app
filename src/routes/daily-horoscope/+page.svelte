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

  // Chart selection
  let selectedBirthChart: BirthChart | null = null;
  let natalChart: BirthChart | null = null;
  let loading = false;
  let error: string | null = null;

  // Date navigation
  let selectedDate = new Date().toISOString().split('T')[0];
  let currentHoroscope: any = null;

  // Subscribe to chart store for saved charts
  $: ({ savedCharts } = $chartStore);

  onMount(async () => {
    // Auto-select the first saved chart if available
    if ($chartStore.savedCharts.length > 0 && !selectedBirthChart) {
      handleChartSelect($chartStore.savedCharts[0]);
    }
  });

  async function handleChartSelect(chart: any) {
    selectedBirthChart = chart;
    natalChart = chart;
    await generateHoroscope();
  }

  async function generateHoroscope() {
    if (!natalChart) {
      error = 'Please select a birth chart first';
      return;
    }

    loading = true;
    error = null;

    try {
      const response = await fetch('/api/daily-horoscope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          natalChart,
          date: selectedDate
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate horoscope');
      }

      currentHoroscope = data.dailyHoroscope;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to generate horoscope';
      console.error('Error generating horoscope:', err);
    } finally {
      loading = false;
    }
  }

  function navigateDate(direction: 'prev' | 'next') {
    const date = new Date(selectedDate);
    if (direction === 'prev') {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() + 1);
    }
    selectedDate = date.toISOString().split('T')[0];
    generateHoroscope();
  }

  function goToToday() {
    selectedDate = new Date().toISOString().split('T')[0];
    generateHoroscope();
  }

  $: if (natalChart && selectedDate) {
    generateHoroscope();
  }
</script>

<svelte:head>
  <title>Daily Horoscope - Astro App</title>
  <meta name="description" content="Your personalized daily horoscope based on your natal chart and current transits" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
        <Star class="w-8 h-8 text-yellow-400" />
        Daily Horoscope
        <Star class="w-8 h-8 text-yellow-400" />
      </h1>
      <p class="text-slate-300 text-lg">Your personalized daily guidance from the stars</p>
    </div>

    <!-- Chart Selection -->
    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <User class="w-5 h-5" />
        Select Your Birth Chart
      </h2>
      
      {#if $chartStore.savedCharts.length === 0}
        <div class="text-center py-8">
          <p class="text-slate-300 mb-4">No saved birth charts found</p>
          <Button href="/chart" class="bg-purple-600 hover:bg-purple-700 text-white font-medium">
            Create Birth Chart
          </Button>
        </div>
      {:else}
        <SavedChartsList theme="dark" on:chartSelect={(e) => handleChartSelect(e.detail)} />
      {/if}
    </div>

    <!-- Date Navigation -->
    {#if natalChart}
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar class="w-5 h-5" />
          Date Selection
        </h2>
        
        <div class="flex items-center justify-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onclick={() => navigateDate('prev')}
            class="bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50"
          >
            <ArrowLeft class="w-4 h-4" />
          </Button>
          
          <div class="flex items-center gap-2">
            <Input
              type="date"
              bind:value={selectedDate}
              class="w-auto text-center bg-white/10 border-white/20 text-white"
            />
            <Button 
              variant="outline" 
              size="sm"
              onclick={goToToday}
              class="bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50"
            >
              Today
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onclick={() => navigateDate('next')}
            class="bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50"
          >
            <ArrowRight class="w-4 h-4" />
          </Button>
        </div>
      </div>
    {/if}

    <!-- Loading State -->
    {#if loading}
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p class="text-white text-lg">Generating your daily horoscope...</p>
      </div>
    {:else if error}
      <div class="bg-red-500/20 backdrop-blur-sm rounded-lg p-6 text-center">
        <p class="text-red-300 text-lg mb-4">{error}</p>
        <Button onclick={generateHoroscope} class="bg-red-600 hover:bg-red-700 text-white font-medium">
          <RefreshCw class="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    {:else if currentHoroscope}
      <!-- Daily Horoscope Display -->
      <DailyHoroscopeDisplay {currentHoroscope} />
    {:else if natalChart}
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
        <p class="text-slate-300 text-lg">Click "Today" or select a date to generate your horoscope</p>
      </div>
    {/if}

    <!-- Instructions -->
    {#if !natalChart}
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-8">
        <h3 class="text-lg font-semibold text-white mb-3">How to Get Your Daily Horoscope</h3>
        <div class="grid md:grid-cols-3 gap-4 text-slate-300">
          <div class="text-center">
            <div class="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span class="text-white font-bold">1</span>
            </div>
            <p>Select your saved birth chart or create a new one</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span class="text-white font-bold">2</span>
            </div>
            <p>Choose a date for your horoscope (today or any date)</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span class="text-white font-bold">3</span>
            </div>
            <p>Receive your personalized daily guidance</p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div> 