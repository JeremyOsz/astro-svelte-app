<script lang="ts">
  import { onMount } from 'svelte';

  let activeTab = 'planets';
  let searchTerm = '';

  const planets = [
    { name: 'Sun', symbol: '☉', element: 'Fire', description: 'Core identity, ego, father, leadership' },
    { name: 'Moon', symbol: '☽', element: 'Water', description: 'Emotions, mother, intuition, subconscious' },
    { name: 'Mercury', symbol: '☿', element: 'Air', description: 'Communication, thinking, learning, siblings' },
    { name: 'Venus', symbol: '♀', element: 'Earth', description: 'Love, beauty, values, relationships' },
    { name: 'Mars', symbol: '♂', element: 'Fire', description: 'Action, energy, aggression, sexuality' },
    { name: 'Jupiter', symbol: '♃', element: 'Fire', description: 'Expansion, wisdom, philosophy, luck' },
    { name: 'Saturn', symbol: '♄', element: 'Earth', description: 'Structure, discipline, limitations, karma' },
    { name: 'Uranus', symbol: '♅', element: 'Air', description: 'Innovation, rebellion, sudden change' },
    { name: 'Neptune', symbol: '♆', element: 'Water', description: 'Spirituality, dreams, illusion, compassion' },
    { name: 'Pluto', symbol: '♇', element: 'Water', description: 'Transformation, power, death, rebirth' }
  ];

  const signs = [
    { name: 'Aries', symbol: '♈', element: 'Fire', quality: 'Cardinal', ruler: 'Mars', description: 'Pioneering, energetic, impulsive, courageous' },
    { name: 'Taurus', symbol: '♉', element: 'Earth', quality: 'Fixed', ruler: 'Venus', description: 'Stable, practical, sensual, determined' },
    { name: 'Gemini', symbol: '♊', element: 'Air', quality: 'Mutable', ruler: 'Mercury', description: 'Versatile, curious, communicative, adaptable' },
    { name: 'Cancer', symbol: '♋', element: 'Water', quality: 'Cardinal', ruler: 'Moon', description: 'Nurturing, emotional, protective, intuitive' },
    { name: 'Leo', symbol: '♌', element: 'Fire', quality: 'Fixed', ruler: 'Sun', description: 'Creative, dramatic, generous, proud' },
    { name: 'Virgo', symbol: '♍', element: 'Earth', quality: 'Mutable', ruler: 'Mercury', description: 'Analytical, practical, perfectionist, helpful' },
    { name: 'Libra', symbol: '♎', element: 'Air', quality: 'Cardinal', ruler: 'Venus', description: 'Diplomatic, fair, social, indecisive' },
    { name: 'Scorpio', symbol: '♏', element: 'Water', quality: 'Fixed', ruler: 'Pluto', description: 'Intense, mysterious, passionate, secretive' },
    { name: 'Sagittarius', symbol: '♐', element: 'Fire', quality: 'Mutable', ruler: 'Jupiter', description: 'Optimistic, adventurous, philosophical, blunt' },
    { name: 'Capricorn', symbol: '♑', element: 'Earth', quality: 'Cardinal', ruler: 'Saturn', description: 'Ambitious, disciplined, responsible, cautious' },
    { name: 'Aquarius', symbol: '♒', element: 'Air', quality: 'Fixed', ruler: 'Uranus', description: 'Innovative, humanitarian, independent, eccentric' },
    { name: 'Pisces', symbol: '♓', element: 'Water', quality: 'Mutable', ruler: 'Neptune', description: 'Compassionate, artistic, spiritual, escapist' }
  ];

  const houses = [
    { number: 1, name: 'First House', keyword: 'Identity', description: 'Self, appearance, first impressions, physical body' },
    { number: 2, name: 'Second House', keyword: 'Values', description: 'Money, possessions, self-worth, material security' },
    { number: 3, name: 'Third House', keyword: 'Communication', description: 'Siblings, short trips, learning, local environment' },
    { number: 4, name: 'Fourth House', keyword: 'Home', description: 'Family, home, roots, emotional foundation' },
    { number: 5, name: 'Fifth House', keyword: 'Creativity', description: 'Children, romance, creativity, self-expression' },
    { number: 6, name: 'Sixth House', keyword: 'Service', description: 'Work, health, daily routines, service to others' },
    { number: 7, name: 'Seventh House', keyword: 'Partnerships', description: 'Marriage, partnerships, open enemies, contracts' },
    { number: 8, name: 'Eighth House', keyword: 'Transformation', description: 'Shared resources, death, rebirth, sexuality' },
    { number: 9, name: 'Ninth House', keyword: 'Philosophy', description: 'Higher education, travel, philosophy, spirituality' },
    { number: 10, name: 'Tenth House', keyword: 'Career', description: 'Career, reputation, public image, authority' },
    { number: 11, name: 'Eleventh House', keyword: 'Community', description: 'Friends, groups, hopes, dreams, social causes' },
    { number: 12, name: 'Twelfth House', keyword: 'Spirituality', description: 'Subconscious, spirituality, hidden enemies, karma' }
  ];

  const aspects = [
    { name: 'Conjunction', degrees: '0°', orb: '±8°', nature: 'Harmonious', description: 'Planets work together, intensifying their combined energy' },
    { name: 'Sextile', degrees: '60°', orb: '±4°', nature: 'Harmonious', description: 'Easy flow of energy, opportunities for growth and cooperation' },
    { name: 'Square', degrees: '90°', orb: '±8°', nature: 'Challenging', description: 'Tension and conflict, but also motivation for growth and change' },
    { name: 'Trine', degrees: '120°', orb: '±8°', nature: 'Harmonious', description: 'Natural harmony and ease, talents and abilities flow easily' },
    { name: 'Opposition', degrees: '180°', orb: '±8°', nature: 'Challenging', description: 'Polarity and awareness, relationships and external challenges' }
  ];

  $: filteredPlanets = planets.filter(planet => 
    planet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    planet.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  $: filteredSigns = signs.filter(sign => 
    sign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  $: filteredHouses = houses.filter(house => 
    house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  $: filteredAspects = aspects.filter(aspect => 
    aspect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aspect.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
</script>

<svelte:head>
  <title>Astrological Interpretations - Astro Chart</title>
  <meta name="description" content="Comprehensive astrological interpretations for planets, signs, houses, and aspects" />
</svelte:head>

<div class="interpretations-page">
  <div class="page-header">
    <h1>Astrological Interpretations</h1>
    <p>Explore the meanings and interpretations of planets, signs, houses, and aspects.</p>
  </div>

  <div class="search-section">
    <input
      type="text"
      placeholder="Search interpretations..."
      bind:value={searchTerm}
      class="search-input"
    />
  </div>

  <div class="tabs">
    <button 
      class="tab-btn {activeTab === 'planets' ? 'active' : ''}"
      on:click={() => activeTab = 'planets'}
    >
      Planets
    </button>
    <button 
      class="tab-btn {activeTab === 'signs' ? 'active' : ''}"
      on:click={() => activeTab = 'signs'}
    >
      Signs
    </button>
    <button 
      class="tab-btn {activeTab === 'houses' ? 'active' : ''}"
      on:click={() => activeTab = 'houses'}
    >
      Houses
    </button>
    <button 
      class="tab-btn {activeTab === 'aspects' ? 'active' : ''}"
      on:click={() => activeTab = 'aspects'}
    >
      Aspects
    </button>
  </div>

  <div class="content-section">
    {#if activeTab === 'planets'}
      <div class="planets-grid">
        {#each filteredPlanets as planet}
          <div class="interpretation-card">
            <div class="card-header">
              <span class="symbol">{planet.symbol}</span>
              <h3>{planet.name}</h3>
              <span class="element">{planet.element}</span>
            </div>
            <p class="description">{planet.description}</p>
          </div>
        {/each}
      </div>
    {:else if activeTab === 'signs'}
      <div class="signs-grid">
        {#each filteredSigns as sign}
          <div class="interpretation-card">
            <div class="card-header">
              <span class="symbol">{sign.symbol}</span>
              <h3>{sign.name}</h3>
              <div class="sign-details">
                <span class="element">{sign.element}</span>
                <span class="quality">{sign.quality}</span>
              </div>
            </div>
            <p class="ruler">Ruler: {sign.ruler}</p>
            <p class="description">{sign.description}</p>
          </div>
        {/each}
      </div>
    {:else if activeTab === 'houses'}
      <div class="houses-grid">
        {#each filteredHouses as house}
          <div class="interpretation-card">
            <div class="card-header">
              <span class="house-number">{house.number}</span>
              <h3>{house.name}</h3>
              <span class="keyword">{house.keyword}</span>
            </div>
            <p class="description">{house.description}</p>
          </div>
        {/each}
      </div>
    {:else if activeTab === 'aspects'}
      <div class="aspects-grid">
        {#each filteredAspects as aspect}
          <div class="interpretation-card">
            <div class="card-header">
              <h3>{aspect.name}</h3>
              <div class="aspect-details">
                <span class="degrees">{aspect.degrees}</span>
                <span class="orb">Orb: {aspect.orb}</span>
              </div>
            </div>
            <span class="nature {aspect.nature.toLowerCase()}">{aspect.nature}</span>
            <p class="description">{aspect.description}</p>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  {#if searchTerm && filteredPlanets.length === 0 && filteredSigns.length === 0 && filteredHouses.length === 0 && filteredAspects.length === 0}
    <div class="no-results">
      <p>No interpretations found for "{searchTerm}"</p>
    </div>
  {/if}
</div>

<style>
  .interpretations-page {
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .page-header h1 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  .page-header p {
    color: #666;
    font-size: 1.1rem;
  }

  .search-section {
    margin-bottom: 2rem;
  }

  .search-input {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    display: block;
  }

  .tabs {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid #667eea;
    background: transparent;
    color: #667eea;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
  }

  .tab-btn:hover {
    background: #667eea;
    color: white;
  }

  .tab-btn.active {
    background: #667eea;
    color: white;
  }

  .content-section {
    margin-bottom: 2rem;
  }

  .planets-grid,
  .signs-grid,
  .houses-grid,
  .aspects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .interpretation-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    border-left: 4px solid #667eea;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .symbol {
    font-size: 2rem;
    color: #667eea;
  }

  .house-number {
    font-size: 1.5rem;
    font-weight: bold;
    color: #667eea;
    background: #f8f9fa;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .card-header h3 {
    margin: 0;
    flex: 1;
    color: #333;
  }

  .element,
  .keyword {
    background: #667eea;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .sign-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .quality {
    background: #28a745;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .ruler {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .aspect-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .degrees {
    background: #ffc107;
    color: #333;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .orb {
    background: #6c757d;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .nature {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .nature.harmonious {
    background: #28a745;
    color: white;
  }

  .nature.challenging {
    background: #dc3545;
    color: white;
  }

  .description {
    color: #666;
    line-height: 1.6;
    margin: 0;
  }

  .no-results {
    text-align: center;
    padding: 3rem;
    color: #666;
    background: #f8f9fa;
    border-radius: 1rem;
  }

  @media (max-width: 768px) {
    .tabs {
      gap: 0.25rem;
    }
    
    .tab-btn {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
    
    .planets-grid,
    .signs-grid,
    .houses-grid,
    .aspects-grid {
      grid-template-columns: 1fr;
    }
    
    .card-header {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }
  }
</style> 