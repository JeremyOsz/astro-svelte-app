<script>
  import "../app.css";
  import * as NavigationMenu from "$lib/components/ui/navigation-menu";
  import * as Sheet from "$lib/components/ui/sheet";
  let mobileMenuOpen = false;
</script>

<div class="app">
  <header>
    <nav>
      <div class="nav-container">
        <h1>Astro Chart</h1>
        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <NavigationMenu.Root>
            <NavigationMenu.List>
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
          <button class="hamburger" aria-label="Open menu" on:click={() => mobileMenuOpen = true}>
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

  <main>
    <slot />
  </main>

  <footer>
    <p>&copy; 2024 Astro Chart. Powered by astronomia and D3.js</p>
  </footer>
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }

  nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2rem;
  }

  nav a {
    /* color: white; */
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s;
  }

  nav a:hover {
    background-color: rgba(255,255,255,0.1);
  }

  main {
    flex: 1;
    padding: 2rem 1rem;
    /* max-width: 1200px; */
    margin: 0 auto;
    width: 100%;
  }

  footer {
    background-color: #f8f9fa;
    padding: 1rem;
    text-align: center;
    color: #6c757d;
    border-top: 1px solid #dee2e6;
  }

  /* You may want to add custom styles for NavigationMenu here if needed */
  .hamburger {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    margin-left: 1rem;
    color: white;
    z-index: 30;
  }
</style> 