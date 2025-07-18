<script lang="ts">
    import { chartStore } from '$lib/stores/chart-store';
    import { Button } from '$lib/components/ui/button';
    import { Share2, Check } from 'lucide-svelte';
    
    let showShareDialog = false;
    let shareUrl = '';
    let copiedMessage = '';
    
    function handleShare() {
      shareUrl = chartStore.generateShareURL() || '';
      showShareDialog = true;
    }
    
    async function copyShareUrl() {
      if (!shareUrl) return;
      
      try {
        await chartStore.copyShareURL();
        copiedMessage = 'URL copied!';
        setTimeout(() => {
          copiedMessage = '';
        }, 2000);
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  </script>
  
  <div class="relative">
    <Button 
      variant="outline" 
      size="sm" 
      onclick={handleShare}
      disabled={!$chartStore.birthData}
    >
      <Share2 class="h-4 w-4 mr-2" />
      Share Chart
    </Button>
    
    {#if showShareDialog}
      <div class="absolute top-full mt-2 p-4 bg-white border rounded-lg shadow-lg z-50 min-w-80">
        <h4 class="font-medium mb-2">Share Chart</h4>
        <p class="text-sm text-gray-600 mb-4">
          Copy this URL to share your chart with others:
        </p>
        <div class="flex gap-2 mb-3">
          <input
            type="text"
            value={shareUrl}
            readonly
            class="flex-1 px-3 py-2 border rounded text-sm bg-gray-50"
          />
          <Button size="sm" onclick={copyShareUrl}>
            {#if copiedMessage}
              <Check class="h-4 w-4 mr-1" />
              Copied!
            {:else}
              Copy
            {/if}
          </Button>
        </div>
        <div class="flex justify-end">
          <Button variant="outline" size="sm" onclick={() => showShareDialog = false}>
            Close
          </Button>
        </div>
      </div>
    {/if}
  </div>