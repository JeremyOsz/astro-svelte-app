<script>
  import { onMount } from 'svelte';
  
  let currentTime = new Date();
  
  onMount(() => {
    const timer = setInterval(() => {
      currentTime = new Date();
    }, 1000);
    
    return () => clearInterval(timer);
  });
</script>

<svelte:head>
  <title>Astro Chart - Birth Charts, Transits & Interpretations</title>
  <meta name="description" content="Calculate birth charts, view transits, and get astrological interpretations using Swiss Ephemeris" />
</svelte:head>

<div class="hero">
  <div class="hero-content">
    <h1>Welcome to Astro Chart</h1>
    <p class="hero-subtitle">
      Calculate birth charts, view transits, and explore astrological interpretations
    </p>
    <div class="hero-actions">
      <a href="/chart" class="btn btn-primary">Calculate Birth Chart</a>
      <a href="/transits" class="btn btn-secondary">View Transits</a>
    </div>
  </div>
</div>

<div class="features grid grid-3">
  <div class="card feature-card">
    <div class="feature-icon">☉</div>
    <h3>Birth Charts</h3>
    <p>Calculate accurate birth charts using Swiss Ephemeris with precise planetary positions, houses, and aspects.</p>
    <a href="/chart" class="feature-link">Get Started →</a>
  </div>
  
  <div class="card feature-card">
    <div class="feature-icon">♈</div>
    <h3>Transits</h3>
    <p>View current planetary transits and their effects on your natal chart with detailed interpretations.</p>
    <a href="/transits" class="feature-link">Explore Transits →</a>
  </div>
  
  <div class="card feature-card">
    <div class="feature-icon">📖</div>
    <h3>Interpretations</h3>
    <p>Access comprehensive astrological interpretations for planets, signs, houses, and aspects.</p>
    <a href="/interpretations" class="feature-link">Read More →</a>
  </div>
</div>

<div class="info-section">
  <div class="card">
    <h2>About This Application</h2>
    <p>
      This astrological application combines the power of Swiss Ephemeris for accurate astronomical calculations 
      with modern web technologies to provide a comprehensive astrology experience. Built with SvelteKit and D3.js, 
      it offers interactive birth charts, transit calculations, and detailed interpretations.
    </p>
    
    <div class="tech-stack">
      <h3>Technologies Used</h3>
      <ul>
        <li><strong>Swiss Ephemeris:</strong> High-precision astronomical calculations</li>
        <li><strong>SvelteKit:</strong> Modern web framework for reactive UI</li>
        <li><strong>D3.js:</strong> Interactive data visualization</li>
        <li><strong>TypeScript:</strong> Type-safe development</li>
      </ul>
    </div>
  </div>
</div>

<div class="current-time">
  <p>Current Time: {currentTime.toLocaleString()}</p>
</div>

<style>
  .hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4rem 2rem;
    text-align: center;
    margin: -2rem -1rem 3rem -1rem;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-block;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }

  .btn-primary {
    background: white;
    color: #667eea;
  }

  .btn-secondary {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 2px solid rgba(255,255,255,0.3);
  }

  .feature-card {
    text-align: center;
    transition: transform 0.2s;
  }

  .feature-card:hover {
    transform: translateY(-4px);
  }

  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }

  .feature-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    margin-top: 1rem;
    display: inline-block;
  }

  .feature-link:hover {
    text-decoration: underline;
  }

  .info-section {
    margin: 3rem 0;
  }

  .tech-stack {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
  }

  .tech-stack ul {
    list-style: none;
    padding: 0;
  }

  .tech-stack li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .tech-stack li:last-child {
    border-bottom: none;
  }

  .current-time {
    text-align: center;
    color: #666;
    font-size: 0.9rem;
    margin-top: 2rem;
  }

  @media (max-width: 768px) {
    .hero {
      padding: 2rem 1rem;
      margin: -1rem -1rem 2rem -1rem;
    }

    .hero h1 {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.1rem;
    }

    .hero-actions {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 300px;
      text-align: center;
    }
  }
</style>
