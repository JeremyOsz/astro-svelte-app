<script lang="ts">
  import { onMount } from 'svelte';
  import { Loader2, Sparkles, Star, Moon, Sun } from 'lucide-svelte';
  
  export let message = 'Calculating your birth chart...';
  export let showProgress = true;
  export let progress = 0;
  
  let currentStep = 0;
  let stepMessages = [
    'Aligning with the cosmos...',
    'Calculating planetary positions...',
    'Mapping your unique astrological signature...',
    'Revealing your celestial blueprint...',
    'Preparing your birth chart...'
  ];
  
  let dots = '';
  let dotCount = 0;
  
  onMount(() => {
    // Animate dots
    const dotInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      dots = '.'.repeat(dotCount);
    }, 500);
    
    // Animate progress steps
    const stepInterval = setInterval(() => {
      if (currentStep < stepMessages.length - 1) {
        currentStep++;
      }
    }, 2000);
    
    return () => {
      clearInterval(dotInterval);
      clearInterval(stepInterval);
    };
  });
</script>

<div class="flex flex-col items-center justify-center py-12 px-4">
  <!-- Main loading container with mystical styling -->
  <div class="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-2xl p-8 shadow-lg max-w-md w-full">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden rounded-2xl">
      <div class="absolute top-4 left-4 star-twinkle">
        <Sparkles class="h-6 w-6 text-purple-400 opacity-60" />
      </div>
      <div class="absolute top-8 right-6 star-twinkle" style="animation-delay: 0.5s;">
        <Star class="h-4 w-4 text-yellow-400 opacity-60" />
      </div>
      <div class="absolute bottom-6 left-8 star-twinkle" style="animation-delay: 1s;">
        <Moon class="h-5 w-5 text-blue-400 opacity-60" />
      </div>
      <div class="absolute bottom-8 right-4 star-twinkle" style="animation-delay: 1.5s;">
        <Sun class="h-5 w-5 text-orange-400 opacity-60" />
      </div>
    </div>
    
    <!-- Main content -->
    <div class="relative z-10 text-center">
      <!-- Spinning chart wheel -->
      <div class="relative mb-6">
        <div class="w-20 h-20 mx-auto relative mystical-glow">
          <!-- Outer ring -->
          <div class="absolute inset-0 border-4 border-indigo-200 rounded-full cosmic-spin" style="animation-duration: 3s;"></div>
          <!-- Inner ring -->
          <div class="absolute inset-2 border-4 border-purple-300 rounded-full cosmic-spin" style="animation-duration: 2s; animation-direction: reverse;"></div>
          <!-- Center -->
          <div class="absolute inset-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <Loader2 class="h-6 w-6 text-white animate-spin" />
          </div>
        </div>
      </div>
      
      <!-- Loading message -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">
          {stepMessages[currentStep]}
        </h3>
        <p class="text-sm text-gray-600">
          {message}{dots}
        </p>
      </div>
      
      <!-- Progress bar -->
      {#if showProgress}
        <div class="mb-4">
          <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              class="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style="width: {progress}%"
            ></div>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            {Math.round(progress)}% complete
          </p>
        </div>
      {/if}
      
      <!-- Mystical tips -->
      <div class="text-xs text-gray-500 space-y-1">
        <p>✨ Connecting to the celestial realm</p>
        <p>🌟 Mapping your unique cosmic fingerprint</p>
        <p>🌙 Revealing your astrological destiny</p>
      </div>
    </div>
  </div>
  
  <!-- Additional info below -->
  <div class="mt-6 text-center">
    <p class="text-sm text-gray-500 max-w-sm">
      This process involves complex astronomical calculations to determine the exact positions of planets at your moment of birth.
    </p>
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
  
  /* Custom pulse animation for mystical elements */
  @keyframes mystical-pulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
  
  .animate-pulse {
    animation: mystical-pulse 2s ease-in-out infinite;
  }
</style>