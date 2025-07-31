<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Info, MousePointer, Hand, Eye, X } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';

  export let showInstructions = false;
  
  const dispatch = createEventDispatcher();

  function closeInstructions() {
    showInstructions = false;
    dispatch('close');
  }

  function openInstructions() {
    showInstructions = true;
  }
</script>

{#if showInstructions}
  <Card class="mb-6 border-blue-200 bg-blue-50/50">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Info class="h-5 w-5 text-blue-600" />
          <CardTitle class="text-lg text-blue-900">How to Explore Your Chart</CardTitle>
        </div>
        <button 
          on:click={closeInstructions}
          class="h-8 w-8 p-0 hover:bg-blue-100 rounded-md flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
      <CardDescription class="text-blue-700">
        Discover the meanings behind your astrological chart by interacting with its elements
      </CardDescription>
    </CardHeader>
    
    <CardContent class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <!-- Hover Instructions -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Eye class="h-4 w-4 text-blue-600" />
            <h3 class="font-medium text-blue-900">Hover for Quick Info</h3>
          </div>
          <div class="space-y-2 text-sm text-blue-800">
            <div class="flex items-start gap-2">
              <Badge variant="outline" class="text-xs">Planets</Badge>
              <span>See planet name, sign, and exact degree</span>
            </div>
            <div class="flex items-start gap-2">
              <Badge variant="outline" class="text-xs">Zodiac Signs</Badge>
              <span>View sign name and house placement</span>
            </div>
            <div class="flex items-start gap-2">
              <Badge variant="outline" class="text-xs">Aspect Lines</Badge>
              <span>See aspect type and planets involved</span>
            </div>
            <div class="flex items-start gap-2">
              <Badge variant="outline" class="text-xs">Axis Points</Badge>
              <span>View ASC, MC, DSC, IC positions</span>
            </div>
          </div>
        </div>

        <!-- Click Instructions -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Hand class="h-4 w-4 text-blue-600" />
            <h3 class="font-medium text-blue-900">Click for Detailed Meanings</h3>
          </div>
          <div class="space-y-2 text-sm text-blue-800">
            <div class="flex items-start gap-2">
              <Badge variant="outline" class="text-xs">Planets</Badge>
              <span>Learn about the planet's influence in that sign and house</span>
            </div>
            <div class="flex items-start gap-2">
              <Badge variant="outline" class="text-xs">Zodiac Signs</Badge>
              <span>Explore how that sign manifests in your chart</span>
            </div>
            <div class="flex items-start gap-2">
              <Badge variant="outline" class="text-xs">Aspects</Badge>
              <span>Understand the relationship between planets</span>
            </div>
            <div class="flex items-start gap-2">
              <Badge variant="outline" class="text-xs">Axis Points</Badge>
              <span>Discover the meaning of your chart angles</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart Controls -->
      <div class="border-t border-blue-200 pt-4">
        <div class="flex items-center gap-2 mb-2">
          <MousePointer class="h-4 w-4 text-blue-600" />
          <h3 class="font-medium text-blue-900">Chart Navigation</h3>
        </div>
        <div class="grid gap-2 text-sm text-blue-800 md:grid-cols-3">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs bg-blue-100 px-1.5 py-0.5 rounded">+</span>
            <span>Zoom in for closer view</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs bg-blue-100 px-1.5 py-0.5 rounded">−</span>
            <span>Zoom out for overview</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs bg-blue-100 px-1.5 py-0.5 rounded">↺</span>
            <span>Reset zoom and position</span>
          </div>
        </div>
        <p class="text-xs text-blue-600 mt-2">
          You can also drag to pan and use mouse wheel to zoom
        </p>
      </div>

      <!-- Tips -->
      <div class="bg-blue-100/50 rounded-lg p-3">
        <p class="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Start by exploring your Sun, Moon, and Ascendant (ASC) - these are the most important points in your chart and reveal your core personality, emotional nature, and how you present yourself to the world.
        </p>
      </div>
    </CardContent>
  </Card>
{:else}
  <div class="mb-4 flex justify-center">
    <button 
      on:click={openInstructions}
      class="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
    >
      <Info class="h-4 w-4" />
      <span>How to Explore Your Chart</span>
    </button>
  </div>
{/if} 