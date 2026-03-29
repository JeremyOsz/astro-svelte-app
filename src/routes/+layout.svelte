<script>
  import "../app.css";
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import * as NavigationMenu from "$lib/components/ui/navigation-menu";
  import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
  import * as Sheet from "$lib/components/ui/sheet";
  import { OccultDivider, OccultEmblem } from "$lib/components/occult";
  import { cn } from "$lib/utils";
  import { Home, Star, BookOpen, Calendar, Search, Moon, Sun, Users, LineChart, Instagram, Linkedin } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores/auth-store';
  import { chartStore } from '$lib/stores/chart-store';
  import { injectAnalytics } from '@vercel/analytics/sveltekit';

  export let data;

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

  /**
   * @param {'light' | 'dark'} nextTheme
   */
  function applyTheme(nextTheme) {
    theme = nextTheme;
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    localStorage.setItem('theme', nextTheme);
  }

  function toggleTheme() {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }

  async function handleSignOut() {
    await authStore.signOut();
    await goto('/');
  }

  onMount(() => {
    authStore.initialize(data?.session ?? null, data?.user ?? null);

    const unsubscribe = authStore.subscribe((auth) => {
      void chartStore.setAuthUser(auth.user);
    });

    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolvedTheme = storedTheme === 'dark' || storedTheme === 'light'
      ? storedTheme
      : (prefersDark ? 'dark' : 'light');
    applyTheme(resolvedTheme);

    // Vercel Web Analytics: inject on the client only (avoid SSR build errors).
    injectAnalytics({ debug: false });

    return () => {
      unsubscribe();
    };
  });
</script>

<div class="min-h-screen flex flex-col relative z-[1]">
  <header class={`text-amber-50 shadow-lg flex-shrink-0 border-b ${isDark ? 'bg-gradient-to-r from-[#1a2520] via-[#2d3d35] to-[#1e2c24] border-amber-500/40' : 'bg-gradient-to-r from-[#2d4a3e] via-[#3D5C4A] to-[#2d4a3e] border-amber-900/30'}`}>
    <!-- Ornamental top rule -->
    <div class={`h-1 w-full bg-gradient-to-r from-transparent to-transparent ${isDark ? 'via-amber-400/50' : 'via-amber-600/40'}`} aria-hidden="true"></div>
    <nav>
              <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:pr-20 flex justify-between items-center py-3 relative overflow-visible">
        <a href="/" class="flex items-center gap-2 font-display text-xl font-semibold tracking-wide text-amber-50 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-amber-950/40 hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60">
          <OccultEmblem size={32} class="shrink-0" />
          <span>OsztrOlogy</span>
        </a>
        <!-- Desktop Navigation -->
        <div class="hidden lg:block relative">
          <NavigationMenu.Root>
            <NavigationMenu.List class="flex gap-8">
              <!-- Astrology Dropdown -->
              <NavigationMenu.Item>
                <NavigationMenu.Trigger class={cn(navigationMenuTriggerStyle(), "font-display text-amber-50 hover:bg-amber-950/40 hover:text-amber-100 focus:bg-amber-950/40 focus:text-amber-100 data-[state=open]:bg-amber-950/50 data-[state=open]:text-amber-100 focus-visible:ring-2 focus-visible:ring-amber-400/60")}>
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
                              class="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/20 hover:text-foreground focus:bg-primary/20 focus:text-foreground dark:hover:bg-amber-900/30 dark:hover:text-amber-100 dark:focus:bg-amber-900/30 dark:focus:text-amber-100"
                            >
                              <div class="text-sm font-medium leading-none">{item.title}</div>
                              <p class="line-clamp-2 text-sm leading-snug text-muted-foreground transition-colors group-hover:text-foreground/90 group-focus:text-foreground/90 dark:group-hover:text-amber-100/90 dark:group-focus:text-amber-100/90">
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
                <NavigationMenu.Trigger class={cn(navigationMenuTriggerStyle(), "font-display text-amber-50 hover:bg-amber-950/40 hover:text-amber-100 focus:bg-amber-950/40 focus:text-amber-100 data-[state=open]:bg-amber-950/50 data-[state=open]:text-amber-100 focus-visible:ring-2 focus-visible:ring-amber-400/60")}>
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
                              class="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/20 hover:text-foreground focus:bg-primary/20 focus:text-foreground dark:hover:bg-amber-900/30 dark:hover:text-amber-100 dark:focus:bg-amber-900/30 dark:focus:text-amber-100"
                            >
                              <div class="text-sm font-medium leading-none">{item.title}</div>
                              <p class="line-clamp-2 text-sm leading-snug text-muted-foreground transition-colors group-hover:text-foreground/90 group-focus:text-foreground/90 dark:group-hover:text-amber-100/90 dark:group-focus:text-amber-100/90">
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
        <div class="hidden lg:flex items-center gap-2">
          {#if $authStore.user}
            <span class="text-xs text-amber-100/90 max-w-[180px] truncate" title={$authStore.user.email || 'Signed in'}>{$authStore.user.email}</span>
            <button
              class="inline-flex h-9 items-center justify-center rounded-md border border-amber-200/30 bg-amber-950/20 px-3 text-xs text-amber-50 hover:bg-amber-950/40 hover:border-amber-200/50 transition-colors"
              on:click={handleSignOut}
            >
              Sign out
            </button>
          {:else}
            <a href="/login" class="inline-flex h-9 items-center justify-center rounded-md border border-amber-200/30 bg-amber-950/20 px-3 text-xs text-amber-50 hover:bg-amber-950/40 hover:border-amber-200/50 transition-colors">Sign in</a>
            <a href="/signup" class="inline-flex h-9 items-center justify-center rounded-md border border-amber-200/30 bg-amber-950/20 px-3 text-xs text-amber-50 hover:bg-amber-950/40 hover:border-amber-200/50 transition-colors">Sign up</a>
          {/if}

          <button
            class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-amber-200/30 bg-amber-950/20 text-amber-50 hover:bg-amber-950/40 hover:border-amber-200/50 transition-colors"
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
        </div>
        <!-- Mobile Hamburger -->
        <div class="lg:hidden">
          <button class="p-2 ml-2 text-amber-50 rounded-md hover:bg-amber-950/40 hover:text-amber-100 transition-colors" aria-label="Open menu" on:click={() => mobileMenuOpen = true}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <Sheet.Root bind:open={mobileMenuOpen}>
            <Sheet.Content side="left" class="p-0 w-80 max-w-[90vw] bg-card text-foreground border-r border-border">
              <Sheet.Header class="p-4 border-b border-border">
                <Sheet.Title class="font-display tracking-wide">Menu</Sheet.Title>
                <Sheet.Close class="absolute top-4 right-4" />
              </Sheet.Header>
              <nav class="flex flex-col gap-2 p-4 text-foreground">
                <!-- Astrology Section -->
                <div class="mb-6">
                  <h3 class="font-display font-semibold text-primary mb-3 text-sm uppercase tracking-wide border-b border-border pb-2">Astrology</h3>
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
                  <h3 class="font-display font-semibold text-primary mb-3 text-sm uppercase tracking-wide border-b border-border pb-2">Tarot</h3>
                  <div class="space-y-2">
                    <a href="/tarot" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-accent/20 text-foreground block transition-colors">Tarot Cards</a>
                    <a href="/tarot-layouts" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-accent/20 text-foreground block transition-colors">Tarot Layouts</a>
                  </div>
                </div>

                <div>
                  <h3 class="font-display font-semibold text-primary mb-3 text-sm uppercase tracking-wide border-b border-border pb-2">Account</h3>
                  <div class="space-y-2">
                    {#if $authStore.user}
                      <div class="py-3 px-4 rounded-lg bg-accent/10 text-sm text-foreground break-all">{$authStore.user.email}</div>
                      <button on:click={handleSignOut} class="w-full text-left py-3 px-4 rounded-lg hover:bg-accent/20 text-foreground block transition-colors">Sign out</button>
                    {:else}
                      <a href="/login" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-accent/20 text-foreground block transition-colors">Sign in</a>
                      <a href="/signup" on:click={() => mobileMenuOpen = false} class="py-3 px-4 rounded-lg hover:bg-accent/20 text-foreground block transition-colors">Sign up</a>
                    {/if}
                  </div>
                </div>
              </nav>
            </Sheet.Content>
          </Sheet.Root>
        </div>
      </div>
    </nav>
    <!-- Ornamental divider under header (visible in light and dark) -->
    <div class="max-w-6xl mx-auto px-4 flex justify-center pb-1.5 pt-0.5">
      <OccultDivider symbol="moon" variant="light" class={isDark ? 'opacity-100' : 'opacity-90'} />
    </div>
    <!-- Explicit bottom rule so the line is always visible in dark mode -->
    <div class={`h-px w-full ${isDark ? 'bg-amber-400/50' : 'bg-amber-900/25'}`} aria-hidden="true"></div>
  </header>

     <main class="flex-1 w-full pb-20 lg:pb-0 min-h-0">
     <div class="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
       <!-- Decorative side margins on large screens (grimoire margin) -->
       <div class="relative">
         <slot />
       </div>
     </div>
   </main>

   <!-- Mobile Bottom Navigation -->
   <nav class="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border lg:hidden z-50 pb-safe occult-border-thick">
     <div class="h-0.5 w-full bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true"></div>
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

   <!-- Footer -->
  <footer class="bg-card py-6 pb-24 lg:pb-6 text-center text-muted-foreground border-t-2 border-border flex-shrink-0 occult-border-thick">
    <div class="max-w-5xl mx-auto px-4">
      <OccultDivider symbol="star" class="mb-4 opacity-70" />
      <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-3 text-sm">
        <a
          href="https://www.instagram.com/jeremyosz/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-foreground/80 hover:text-primary transition-colors"
        >
          <Instagram class="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>@jeremyosz</span>
        </a>
        <a
          href="https://www.linkedin.com/in/jeremy-osztreicher-72236a125/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-foreground/80 hover:text-primary transition-colors"
        >
          <Linkedin class="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>LinkedIn</span>
        </a>
      </div>
      <p class="font-body text-sm">&copy; 2025 OsztrOlogy. Powered by Swiss Ephemeris and D3.js</p>
    </div>
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
