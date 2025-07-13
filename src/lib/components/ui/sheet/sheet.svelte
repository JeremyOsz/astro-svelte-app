<script lang="ts">
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";

  export let open = false;
  export let side: "left" | "right" | "top" | "bottom" = "right";
  export let variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" = "default";
  export let size: "default" | "sm" | "lg" | "icon" = "default";
  
  let className = "";
  export { className as class };

  export let trigger: Snippet;
  export let content: Snippet;
  export let title: string = "";
  export let description: string = "";

  const sheetVariants = {
    default: "border-l",
    destructive: "border-l border-destructive",
    outline: "border-l border-input",
    secondary: "border-l bg-secondary",
    ghost: "border-l",
    link: "border-l"
  };

  const sheetSizes = {
    default: "w-80",
    sm: "w-64", 
    lg: "w-96",
    icon: "w-10"
  };

  const sheetSides = {
    left: "left-0",
    right: "right-0",
    top: "top-0 w-full h-1/3",
    bottom: "bottom-0 w-full h-1/3"
  };

  const overlayClass = "fixed inset-0 bg-black/50 z-40 lg:hidden";
  const sheetClass = cn(
    "fixed top-0 z-50 h-full bg-background transition-transform duration-300 ease-in-out",
    sheetVariants[variant],
    side === "top" || side === "bottom" ? sheetSides[side] : sheetSizes[size],
    side === "left" || side === "right" ? sheetSides[side] : "",
    open ? "translate-x-0 translate-y-0" : 
      side === "left" ? "-translate-x-full" :
      side === "right" ? "translate-x-full" :
      side === "top" ? "-translate-y-full" :
      "translate-y-full",
    "lg:relative lg:translate-x-0 lg:translate-y-0 lg:z-auto",
    className
  );

  function handleOverlayClick() {
    open = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      open = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Mobile overlay -->
{#if open}
  <div class={overlayClass} on:click={handleOverlayClick} on:keydown={handleKeydown} role="button" tabindex="0"></div>
{/if}

<!-- Sheet -->
<aside class={sheetClass}>
  <div class="h-full flex flex-col">
    <!-- Sheet header with title and close button -->
    <div class="flex items-center justify-between p-4 border-b lg:hidden">
      <div>
        {#if title}
          <h2 class="text-lg font-semibold">{title}</h2>
        {/if}
        {#if description}
          <p class="text-sm text-muted-foreground">{description}</p>
        {/if}
      </div>
      <button 
        on:click={() => open = false}
        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Sheet content -->
    <div class="flex-1 overflow-y-auto">
      {@render content()}
    </div>
  </div>
</aside>

<!-- Sheet trigger for mobile -->
<div class="lg:hidden">
  {@render trigger()}
</div> 