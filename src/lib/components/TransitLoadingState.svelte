<script lang="ts">
  import { onMount } from 'svelte';
  import { Loader2, Star, Globe, Clock, MapPin } from 'lucide-svelte';
  
  export let message = 'Calculating planetary transits...';
  export let showProgress = true;
  
  let progress = 0;
  let currentStep = 0;
  let steps = [
    'Fetching planetary positions...',
    'Calculating transit aspects...',
    'Generating chart visualization...',
    'Preparing transit interpretations...'
  ];
  
  onMount(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        
        // Update current step based on progress
        if (progress < 25) {
          currentStep = 0;
        } else if (progress < 50) {
          currentStep = 1;
        } else if (progress < 75) {
          currentStep = 2;
        } else {
          currentStep = 3;
        }
      }, 200);
      
      return () => clearInterval(interval);
    }
  });
</script>

<div class="flex flex-col items-center justify-center py-16 px-4">
  <!-- Main Loading Container -->
  <div class="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-lg">
    <!-- Header with Icon -->
    <div class="text-center mb-6">
      <div class="relative inline-block">
        <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
          <Globe class="h-8 w-8 text-white" />
        </div>
        <div class="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
          <Star class="h-3 w-3 text-yellow-800" />
        </div>
      </div>
      <h3 class="mb-2 text-xl font-semibold text-foreground">Planetary Transits</h3>
      <p class="text-sm text-muted-foreground">Analyzing celestial influences</p>
    </div>
    
    <!-- Progress Bar -->
    {#if showProgress}
      <div class="mb-6">
        <div class="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div class="h-2 w-full rounded-full bg-muted">
          <div 
            class="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style="width: {progress}%"
          ></div>
        </div>
      </div>
    {/if}
    
    <!-- Current Step -->
    <div class="text-center mb-6">
      <div class="flex items-center justify-center gap-2 mb-2">
        <Loader2 class="h-5 w-5 animate-spin text-primary" />
        <span class="text-sm font-medium text-foreground">{steps[currentStep]}</span>
      </div>
      <p class="text-xs text-muted-foreground">{message}</p>
    </div>
    
    <!-- Step Indicators -->
    {#if showProgress}
      <div class="space-y-2">
        {#each steps as step, index}
          <div class="flex items-center gap-3">
            <div class="flex h-4 w-4 items-center justify-center rounded-full text-xs font-medium
                        {index < currentStep ? 'bg-green-500 text-white' : 
                         index === currentStep ? 'bg-primary text-primary-foreground animate-pulse' : 
                         'bg-muted text-muted-foreground/70'}">
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span class="text-xs {index <= currentStep ? 'text-foreground' : 'text-muted-foreground/70'}">
              {step}
            </span>
          </div>
        {/each}
      </div>
    {/if}
    
    <!-- Astrological Elements -->
    <div class="mt-6 border-t border-border pt-4">
      <div class="flex justify-center gap-4 text-xs text-muted-foreground">
        <div class="flex items-center gap-1">
          <Clock class="h-3 w-3" />
          <span>Real-time data</span>
        </div>
        <div class="flex items-center gap-1">
          <MapPin class="h-3 w-3" />
          <span>Precise location</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Floating Elements for Ambiance -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden">
    <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-60"></div>
    <div class="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-40"></div>
    <div class="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-primary/50 rounded-full animate-pulse opacity-50"></div>
    <div class="absolute bottom-1/4 right-1/3 w-1 h-1 bg-green-300 rounded-full animate-ping opacity-30"></div>
  </div>
</div>
