<script>
  import "../app.css";
</script>

<div class="app">
  <header>
    <nav>
      <div class="nav-container">
        <h1>Astro Chart</h1>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/chart">Birth Chart</a></li>
          <li><a href="/transits">Transits</a></li>
          <li><a href="/interpretations">Interpretations</a></li>
          <li><a href="/chart/test">Chart Test</a></li>
        </ul>
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
    color: white;
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
    max-width: 1200px;
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

  @media (max-width: 768px) {
    .nav-container {
      flex-direction: column;
      gap: 1rem;
    }

    nav ul {
      gap: 1rem;
    }

    main {
      padding: 1rem;
    }
  }
</style> 