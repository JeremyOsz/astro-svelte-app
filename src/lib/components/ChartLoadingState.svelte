<script lang="ts">
  import { Loader2 } from 'lucide-svelte';
  
  export let message = 'Loading chart...';
</script>

<div class="flex flex-col items-center justify-center py-12">
  <Loader2 class="h-8 w-8 animate-spin text-blue-500 mb-4" />
  <p class="text-gray-600">{message}</p>
</div>