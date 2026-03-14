<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    // Redirect to the birth chart page immediately
    goto('/chart');
  });
</script>

<svelte:head>
  <title>Velvet Arcana - Your Personal Grimoire of Celestial Wisdom</title>
  <meta name="description" content="Unlock the secrets of the cosmos with Velvet Arcana. Birth charts, transits, and tarot wisdom in an elegant, mysterious interface." />
</svelte:head>

<!-- Loading state while redirecting -->
<div class="min-h-screen bg-background flex items-center justify-center">
  <div class="text-center">
    <div class="w-16 h-16 mx-auto mb-4 relative">
      <div class="absolute inset-0 border-4 border-primary/30 rounded-full opacity-50 animate-pulse"></div>
      <div class="absolute inset-2 border-4 border-amber-700/40 dark:border-amber-500/40 rounded-full opacity-50 animate-pulse" style="animation-delay: 0.2s;"></div>
      <div class="absolute inset-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
        <svg class="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    </div>
    <h2 class="font-display text-xl font-semibold text-foreground mb-2">Loading Velvet Arcana</h2>
    <p class="text-muted-foreground font-body">Preparing your celestial journey...</p>
  </div>
</div>
