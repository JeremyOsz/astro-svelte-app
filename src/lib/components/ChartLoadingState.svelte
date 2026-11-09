<script lang="ts">
  import { Loader2 } from 'lucide-svelte';

  export let message = 'Calculating your birth chart...';
</script>

<div role="status" class="flex min-h-[300px] items-center justify-center px-4 py-8">
  <div class="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
    <Loader2 aria-hidden="true" class="mx-auto mb-4 h-8 w-8 text-primary motion-safe:animate-spin" />
    <p class="text-base font-medium text-foreground">{message}</p>
    <p class="mt-2 text-sm text-muted-foreground">Your chart will appear here when it's ready.</p>
    <div aria-hidden="true" class="mt-6 space-y-3 motion-safe:animate-pulse">
      <div class="mx-auto h-24 w-24 rounded-full border-8 border-muted"></div>
      <div class="mx-auto h-3 w-2/3 rounded bg-muted"></div>
      <div class="mx-auto h-3 w-1/2 rounded bg-muted"></div>
    </div>
  </div>
</div>
