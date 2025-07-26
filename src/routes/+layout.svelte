<script>
  import "../app.css";
  import * as NavigationMenu from "$lib/components/ui/navigation-menu";
  import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
  import * as Sheet from "$lib/components/ui/sheet";
  import { cn } from "$lib/utils";
  let mobileMenuOpen = false;

  // Astrology navigation items
  const astrologyItems = [
    {
      title: "Birth Chart",
      href: "/chart",
      description: "Calculate your natal chart with precise planetary positions"
    },
    {
      title: "Transits",
      href: "/transits", 
      description: "View current planetary transits and their effects"
    },
    {
      title: "Interpretations",
      href: "/interpretations",
      description: "Meanings of planets, signs, houses, and aspects"
    },
    {
      title: "Daily Horoscope",
      href: "/daily-horoscope",
      description: "Daily astrological guidance and insights"
    }
  ];

  // Tarot navigation items
  const tarotItems = [
    {
      title: "Tarot Cards",
      href: "/tarot",
      description: "Explore all 78 tarot cards and their meanings"
    }
  ];
</script>

<div class="min-h-screen flex flex-col">
  <header class="bg-gradient-to-tr from-indigo-500 to-purple-700 text-white shadow-md">
    <nav>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center py-4 relative overflow-visible mr-14">
        <h1 class="text-xl font-bold">Astro Chart</h1>
        <!-- Desktop Navigation -->
        <div class="hidden lg:block relative">
          <NavigationMenu.Root>
            <NavigationMenu.List class="flex gap-8">
              <!-- Astrology Dropdown -->
              <NavigationMenu.Item>
                <NavigationMenu.Trigger class={cn(navigationMenuTriggerStyle())}>
                  Astrology
                </NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <ul class="grid w-[300px] gap-2 p-2 max-h-[80vh] overflow-y-auto">
                    <li>
                      <NavigationMenu.Link>
                        {#snippet child({ props })}
                          <a
                            {...props}
                            href="/"
                            class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div class="text-sm font-medium leading-none">Home</div>
                            <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Main landing page
                            </p>
                          </a>
                        {/snippet}
                      </NavigationMenu.Link>
                    </li>
                    {#each astrologyItems as item}
                      <li>
                        <NavigationMenu.Link>
                          {#snippet child({ props })}
                            <a
                              {...props}
                              href={item.href}
                              class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div class="text-sm font-medium leading-none">{item.title}</div>
                              <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </a>
                          {/snippet}
                        </NavigationMenu.Link>
                      </li>
                    {/each}
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              
              <!-- Tarot Dropdown -->
              <NavigationMenu.Item>
                <NavigationMenu.Trigger class={cn(navigationMenuTriggerStyle())}>
                  Tarot
                </NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <ul class="grid w-[300px] gap-2 p-2 max-h-[80vh] overflow-y-auto">
                    {#each tarotItems as item}
                      <li>
                        <NavigationMenu.Link>
                          {#snippet child({ props })}
                            <a
                              {...props}
                              href={item.href}
                              class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div class="text-sm font-medium leading-none">{item.title}</div>
                              <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </a>
                          {/snippet}
                        </NavigationMenu.Link>
                      </li>
                    {/each}
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>
            <NavigationMenu.Viewport />
          </NavigationMenu.Root>
        </div>
        <!-- Mobile Hamburger -->
        <div class="lg:hidden">
          <button class="p-2 ml-2 text-white" aria-label="Open menu" on:click={() => mobileMenuOpen = true}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <Sheet.Root bind:open={mobileMenuOpen}>
            <Sheet.Content side="left" class="p-0 w-80 max-w-[90vw] bg-white text-gray-900">
              <Sheet.Header class="p-4 border-b">
                <Sheet.Title>Menu</Sheet.Title>
                <Sheet.Close class="absolute top-4 right-4" />
              </Sheet.Header>
              <nav class="flex flex-col gap-2 p-4 text-gray-900">
                <!-- Astrology Section -->
                <div class="mb-6">
                  <h3 class="font-semibold text-purple-600 mb-3 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">Astrology</h3>
                  <div class="space-y-2">
                    <a href="/" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-900 block transition-colors">Home</a>
                    <a href="/chart" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-900 block transition-colors">Birth Chart</a>
                    <a href="/transits" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-900 block transition-colors">Transits</a>
                    <a href="/interpretations" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-900 block transition-colors">Interpretations</a>
                    <a href="/daily-horoscope" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-900 block transition-colors">Daily Horoscope</a>
                  </div>
                </div>
                
                <!-- Tarot Section -->
                <div class="mb-6">
                  <h3 class="font-semibold text-purple-600 mb-3 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">Tarot</h3>
                  <div class="space-y-2">
                    <a href="/tarot" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-900 block transition-colors">Tarot Cards</a>
                  </div>
                </div>
              </nav>
            </Sheet.Content>
          </Sheet.Root>
        </div>
      </div>
    </nav>
  </header>

  <main class="flex-1 w-full">
    <slot />
  </main>

  <footer class="bg-gray-100 py-4 text-center text-gray-500 border-t">
    <p>&copy; 2025 Astro Chart by Jeremy Osztreicher. Powered by Swiss Ephemeris and D3.js</p>
  </footer>
</div>

<style>
  /* Ensure navigation menu dropdowns stay within viewport */
  :global([data-radix-navigation-menu-viewport]) {
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 50 !important;
    max-height: 80vh !important;
    overflow: hidden !important;
  }
  
  /* Ensure dropdown content doesn't break out of container */
  :global([data-radix-navigation-menu-content]) {
    max-width: 100vw !important;
    overflow: hidden !important;
  }
  
  /* Responsive adjustments for medium screens */
  @media (max-width: 1024px) {
    :global([data-radix-navigation-menu-viewport]) {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      z-index: 100 !important;
    }
  }
</style>