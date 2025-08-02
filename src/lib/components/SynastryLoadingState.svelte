<script lang="ts">
  import { onMount } from 'svelte';
  import { Loader2, Heart, Star, Globe, Clock, MapPin } from 'lucide-svelte';
  
  export let message = 'Calculating synastry compatibility...';
  export let showProgress = true;
  
  let progress = 0;
  let currentStep = 0;
  let steps = [
    'Fetching birth chart data...',
    'Calculating planetary aspects...',
    'Analyzing house overlays...',
    'Generating compatibility report...'
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
  <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md w-full">
    <!-- Header with Icon -->
    <div class="text-center mb-6">
      <div class="relative inline-block">
        <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center mb-4">
          <Heart class="h-8 w-8 text-white" />
        </div>
        <div class="absolute -top-1 -right-1 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
          <Star class="h-3 w-3 text-purple-800" />
        </div>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Synastry Analysis</h3>
      <p class="text-gray-600 text-sm">Exploring relationship dynamics</p>
    </div>
    
    <!-- Progress Bar -->
    {#if showProgress}
      <div class="mb-6">
        <div class="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-pink-500 to-red-600 h-2 rounded-full transition-all duration-300 ease-out"
            style="width: {progress}%"
          ></div>
        </div>
      </div>
    {/if}
    
    <!-- Current Step -->
    <div class="text-center mb-6">
      <div class="flex items-center justify-center gap-2 mb-2">
        <Loader2 class="h-5 w-5 animate-spin text-pink-500" />
        <span class="text-sm font-medium text-gray-700">{steps[currentStep]}</span>
      </div>
      <p class="text-xs text-gray-500">{message}</p>
    </div>
    
    <!-- Step Indicators -->
    {#if showProgress}
      <div class="space-y-2">
        {#each steps as step, index}
          <div class="flex items-center gap-3">
            <div class="w-4 h-4 rounded-full flex items-center justify-center text-xs font-medium
                        {index < currentStep ? 'bg-green-500 text-white' : 
                         index === currentStep ? 'bg-pink-500 text-white animate-pulse' : 
                         'bg-gray-200 text-gray-400'}">
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span class="text-xs {index <= currentStep ? 'text-gray-700' : 'text-gray-400'}">
              {step}
            </span>
          </div>
        {/each}
      </div>
    {/if}
    
    <!-- Astrological Elements -->
    <div class="mt-6 pt-4 border-t border-gray-100">
      <div class="flex justify-center gap-4 text-xs text-gray-500">
        <div class="flex items-center gap-1">
          <Heart class="h-3 w-3" />
          <span>Compatibility</span>
        </div>
        <div class="flex items-center gap-1">
          <Globe class="h-3 w-3" />
          <span>Planetary aspects</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Floating Elements for Ambiance -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden">
    <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-300 rounded-full animate-pulse opacity-60"></div>
    <div class="absolute top-1/3 right-1/4 w-1 h-1 bg-red-300 rounded-full animate-ping opacity-40"></div>
    <div class="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse opacity-50"></div>
    <div class="absolute bottom-1/4 right-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-ping opacity-30"></div>
  </div>
</div>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
</style> 