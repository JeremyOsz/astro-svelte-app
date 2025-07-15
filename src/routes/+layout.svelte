<script>
  import "../app.css";
  import * as NavigationMenu from "$lib/components/ui/navigation-menu";
  import * as Sheet from "$lib/components/ui/sheet";
  let mobileMenuOpen = false;
</script>

<div class="min-h-screen flex flex-col">
  <header class="bg-gradient-to-tr from-indigo-500 to-purple-700 text-white shadow-md">
    <nav>
      <div class="max-w-6xl mx-auto px-4 flex justify-between items-center py-4">
        <h1 class="text-xl font-bold">Astro Chart</h1>
        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <NavigationMenu.Root>
            <NavigationMenu.List class="flex gap-8">
              <NavigationMenu.Item>
                <NavigationMenu.Link href="/">Home</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="/chart">Birth Chart</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="/transits">Transits</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="/interpretations">Interpretations</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="/chart/test/svelte-native">Chart Test</NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </div>
        <!-- Mobile Hamburger -->
        <div class="md:hidden">
          <button class="p-2 ml-2 text-white" aria-label="Open menu" on:click={() => mobileMenuOpen = true}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <Sheet.Root bind:open={mobileMenuOpen}>
            <Sheet.Content side="left" class="p-0 w-64 bg-white text-gray-900">
              <Sheet.Header class="p-4 border-b">
                <Sheet.Title>Menu</Sheet.Title>
                <Sheet.Close class="absolute top-4 right-4" />
              </Sheet.Header>
              <nav class="flex flex-col gap-2 p-4 text-gray-900">
                <a href="/" on:click={() => mobileMenuOpen = false} class="py-2 px-3 rounded hover:bg-gray-100 text-gray-900">Home</a>
                <a href="/chart" on:click={() => mobileMenuOpen = false} class="py-2 px-3 rounded hover:bg-gray-100 text-gray-900">Birth Chart</a>
                <a href="/transits" on:click={() => mobileMenuOpen = false} class="py-2 px-3 rounded hover:bg-gray-100 text-gray-900">Transits</a>
                <a href="/interpretations" on:click={() => mobileMenuOpen = false} class="py-2 px-3 rounded hover:bg-gray-100 text-gray-900">Interpretations</a>
                <a href="/chart/test/svelte-native" on:click={() => mobileMenuOpen = false} class="py-2 px-3 rounded hover:bg-gray-100 text-gray-900">Chart Test</a>
              </nav>
            </Sheet.Content>
          </Sheet.Root>
        </div>
      </div>
    </nav>
  </header>

  <main class="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
    <slot />
  </main>

  <footer class="bg-gray-100 py-4 text-center text-gray-500 border-t">
    <p>&copy; 2025 Astro Chart by Jeremy Osztreich. Powered by Swiss Ephemeris and D3.js</p>
  </footer>
</div> 