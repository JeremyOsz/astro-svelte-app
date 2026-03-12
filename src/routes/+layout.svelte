<script>
  import "../app.css";
  import { onMount } from 'svelte';
  import * as NavigationMenu from "$lib/components/ui/navigation-menu";
  import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
  import * as Sheet from "$lib/components/ui/sheet";
  import { cn } from "$lib/utils";
  import { Home, Star, BookOpen, Calendar, Search, Moon, Sun, Users, LineChart } from 'lucide-svelte';
  import { page } from '$app/stores';
  let mobileMenuOpen = false;
  let theme = 'light';

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
      title: "Synastry",
      href: "/synastry",
      description: "Compare birth charts for relationship compatibility"
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
    },
    {
      title: "Market Cosmos",
      href: "/market-cosmos",
      description: "Track index timelines against planetary sign movements"
    }
  ];

  // Tarot navigation items
  const tarotItems = [
    {
      title: "Tarot Cards",
      href: "/tarot",
      description: "Explore all 78 tarot cards and their meanings"
    },
    {
      title: "Tarot Layouts",
      href: "/tarot-layouts",
      description: "Discover tarot spreads and reading layouts"
    }
  ];

  // Mobile bottom navigation items
  const mobileNavItems = [
    {
      title: "Birth Chart",
      href: "/chart",
      icon: Star,
      description: "Calculate natal chart"
    },
    {
      title: "Transits",
      href: "/transits",
      icon: Moon,
      description: "Current transits"
    },
    {
      title: "Daily",
      href: "/daily-horoscope",
      icon: Calendar,
      description: "Daily horoscope"
    },
    {
      title: "Synastry",
      href: "/synastry",
      icon: Users,
      description: "Relationship compatibility"
    },
    {
      title: "Tarot",
      href: "/tarot",
      icon: BookOpen,
      description: "Tarot cards and meanings"
    },
    {
      title: "Markets",
      href: "/market-cosmos",
      icon: LineChart,
      description: "Market x cosmos timeline"
    }
  ];

  $: currentPath = $page.url.pathname;
  $: isDark = theme === 'dark';

  function applyTheme(nextTheme) {
    theme = nextTheme;
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    localStorage.setItem('theme', nextTheme);
  }

  function toggleTheme() {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }

  onMount(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(storedTheme ?? (prefersDark ? 'dark' : 'light'));
  });
</script>

<div class="min-h-screen flex flex-col">
  <header class={`text-white shadow-md flex-shrink-0 border-b border-border ${isDark ? 'bg-gradient-to-r from-[#182133] via-[#24324a] to-[#2f3d5c]' : 'bg-gradient-to-r from-[#5a6fa8] to-[#9aafd6]'}`}>
    <nav>
              <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:pr-20 flex justify-between items-center py-4 relative overflow-visible">
        <a href="/" class="text-xl font-bold hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-white/15">Astro Chart</a>
        <!-- Desktop Navigation -->
        <div class="hidden lg:block relative">
          <NavigationMenu.Root>
            <NavigationMenu.List class="flex gap-8">
              <!-- Astrology Dropdown -->
              <NavigationMenu.Item>
                <NavigationMenu.Trigger class={cn(navigationMenuTriggerStyle(), "text-white/95 hover:bg-white/20 focus:bg-white/20 data-[state=open]:bg-white/25 data-[state=open]:text-white")}>
                  Astrology
                </NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <ul class="grid w-[300px] gap-2 p-2 max-h-[80vh] overflow-y-auto">
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
                <NavigationMenu.Trigger class={cn(navigationMenuTriggerStyle(), "text-white/95 hover:bg-white/20 focus:bg-white/20 data-[state=open]:bg-white/25 data-[state=open]:text-white")}>
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
        <button
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/35 bg-white/10 text-white hover:bg-white/25 hover:border-white/55 transition-colors"
          on:click={toggleTheme}
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {#if theme === 'dark'}
            <Sun class="h-4 w-4" />
          {:else}
            <Moon class="h-4 w-4" />
          {/if}
        </button>
        <!-- Mobile Hamburger -->
        <div class="lg:hidden">
          <button class="p-2 ml-2 text-white rounded-md hover:bg-white/20 transition-colors" aria-label="Open menu" on:click={() => mobileMenuOpen = true}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <Sheet.Root bind:open={mobileMenuOpen}>
            <Sheet.Content side="left" class="p-0 w-80 max-w-[90vw] bg-card text-foreground border-r border-border">
              <Sheet.Header class="p-4 border-b border-border">
                <Sheet.Title>Menu</Sheet.Title>
                <Sheet.Close class="absolute top-4 right-4" />
              </Sheet.Header>
              <nav class="flex flex-col gap-2 p-4 text-foreground">
                <!-- Astrology Section -->
                <div class="mb-6">
                  <h3 class="font-semibold text-primary mb-3 text-sm uppercase tracking-wide border-b border-border pb-2">Astrology</h3>
                  <div class="space-y-2">
                    <a href="/chart" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-accent/20 text-foreground block transition-colors">Birth Chart</a>
                    <a href="/transits" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-accent/20 text-foreground block transition-colors">Transits</a>
                    <a href="/synastry" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-accent/20 text-foreground block transition-colors">Synastry</a>
                    <a href="/interpretations" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-accent/20 text-foreground block transition-colors">Interpretations</a>
                    <a href="/daily-horoscope" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-accent/20 text-foreground block transition-colors">Daily Horoscope</a>
                    <a href="/market-cosmos" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-accent/20 text-foreground block transition-colors">Market Cosmos</a>
                  </div>
                </div>
                
                <!-- Tarot Section -->
                <div class="mb-6">
                  <h3 class="font-semibold text-primary mb-3 text-sm uppercase tracking-wide border-b border-border pb-2">Tarot</h3>
                  <div class="space-y-2">
                    <a href="/tarot" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-accent/20 text-foreground block transition-colors">Tarot Cards</a>
                    <a href="/tarot-layouts" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-accent/20 text-foreground block transition-colors">Tarot Layouts</a>
                  </div>
                </div>
              </nav>
            </Sheet.Content>
          </Sheet.Root>
        </div>
      </div>
    </nav>
  </header>

     <main class="flex-1 w-full pb-20 lg:pb-0 min-h-0">
     <div class="container mx-auto max-w-none lg:px-0">
       <slot />
     </div>
   </main>

   <!-- Mobile Bottom Navigation -->
   <nav class="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-50 pb-safe">
     <div class="flex justify-around">
       {#each mobileNavItems as item}
         <a
           href={item.href}
           class="flex flex-col items-center py-3 px-2 min-w-0 flex-1 transition-colors {currentPath === item.href ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}"
         >
           <svelte:component this={item.icon} class="w-6 h-6 mb-1" />
           <span class="text-xs font-medium truncate">{item.title}</span>
         </a>
       {/each}
     </div>
   </nav>

   <!-- Desktop Footer -->
   <footer class="bg-card py-4 text-center text-muted-foreground border-t border-border hidden lg:block flex-shrink-0">
     <p>&copy; 2025 Astro Chart by Jeremy Osztreicher. Powered by Swiss Ephemeris and D3.js</p>
   </footer>
</div><style>
  /* Ensure full viewport height */
  :global(html, body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  
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
