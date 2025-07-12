<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let chartData: string = '';

  let chartContainer: HTMLDivElement;
  let chartSvg: any;
  let zoomLevel = 1;

  onMount(() => {
    if (chartData && chartContainer) {
      createChart();
    }
  });

  function createChart() {
    // Clear previous chart
    d3.select(chartContainer).selectAll('*').remove();

    // Parse chart data
    const lines = chartData.trim().split('\n');
    const planets: any[] = [];

    lines.forEach(line => {
      const [name, sign, degree] = line.split(',');
      const retrograde = line.includes(',R');
      planets.push({
        name: name.trim(),
        sign: sign.trim(),
        degree: degree.trim(),
        retrograde
      });
    });

    // Chart dimensions
    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2 - 40;

    // Create SVG
    chartSvg = d3.select(chartContainer)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create chart circles
    createChartCircles(radius);
    createZodiacWheel(radius);
    createPlanetPositions(planets, radius);
    createAspectLines(planets, radius);
  }

  function createChartCircles(radius: number) {
    // Outer circle
    chartSvg.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-width', 2);

    // Inner circle
    chartSvg.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius * 0.8)
      .attr('fill', 'none')
      .attr('stroke', '#666')
      .attr('stroke-width', 1);

    // Center circle
    chartSvg.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius * 0.6)
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', 1);
  }

  function createZodiacWheel(radius: number) {
    const signs = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];

    const signSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    const signColors = ['#e53935', '#43a047', '#fbc02d', '#039be5', '#e53935', '#43a047',
                       '#fbc02d', '#039be5', '#e53935', '#43a047', '#fbc02d', '#039be5'];

    signs.forEach((sign, i) => {
      const angle = (i * 30 - 15) * Math.PI / 180; // Start at 15° Aries
      const x = Math.cos(angle) * (radius * 0.9);
      const y = Math.sin(angle) * (radius * 0.9);

      // Sign symbol
      chartSvg.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '24px')
        .attr('fill', signColors[i])
        .text(signSymbols[i]);

      // Sign name
      chartSvg.append('text')
        .attr('x', x)
        .attr('y', y + 20)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#666')
        .text(sign);
    });
  }

  function createPlanetPositions(planets: any[], radius: number) {
    const planetSymbols: { [key: string]: string } = {
      'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀', 'Mars': '♂',
      'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇',
      'Node': '☊', 'Lilith': '⚸', 'Chiron': '⚷', 'Fortune': '⊗', 'Vertex': 'Vx',
      'ASC': 'Asc', 'MC': 'MC'
    };

    planets.forEach(planet => {
      // Parse degree to get position
      const degreeMatch = planet.degree.match(/(\d+)°(\d+)'/);
      if (!degreeMatch) return;

      const degrees = parseInt(degreeMatch[1]);
      const minutes = parseInt(degreeMatch[2]);
      const totalDegrees = degrees + minutes / 60;

      // Find sign index
      const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
      const signIndex = signs.indexOf(planet.sign);
      if (signIndex === -1) return;

      // Calculate angle (Aries starts at 0°)
      const angle = ((signIndex * 30) + totalDegrees - 15) * Math.PI / 180;
      const x = Math.cos(angle) * (radius * 0.7);
      const y = Math.sin(angle) * (radius * 0.7);

      // Planet symbol
      chartSvg.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '16px')
        .attr('fill', planet.retrograde ? '#e74c3c' : '#333')
        .attr('font-weight', 'bold')
        .text(planetSymbols[planet.name] || planet.name);

      // Degree label
      chartSvg.append('text')
        .attr('x', x + 15)
        .attr('y', y - 10)
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#666')
        .text(planet.degree);

      // Retrograde indicator
      if (planet.retrograde) {
        chartSvg.append('text')
          .attr('x', x - 15)
          .attr('y', y - 10)
          .attr('text-anchor', 'end')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', '8px')
          .attr('fill', '#e74c3c')
          .text('R');
      }
    });
  }

  function createAspectLines(planets: any[], radius: number) {
    // This is a simplified aspect calculation
    // In a real implementation, you'd calculate actual aspects between planets
    const aspects = [
      { from: 'Sun', to: 'Moon', type: 'conjunction' },
      { from: 'Mercury', to: 'Venus', type: 'trine' }
    ];

    aspects.forEach(aspect => {
      const fromPlanet = planets.find(p => p.name === aspect.from);
      const toPlanet = planets.find(p => p.name === aspect.to);
      
      if (!fromPlanet || !toPlanet) return;

      // Calculate positions (simplified)
      const fromAngle = Math.random() * 2 * Math.PI;
      const toAngle = Math.random() * 2 * Math.PI;
      
      const fromX = Math.cos(fromAngle) * (radius * 0.7);
      const fromY = Math.sin(fromAngle) * (radius * 0.7);
      const toX = Math.cos(toAngle) * (radius * 0.7);
      const toY = Math.sin(toAngle) * (radius * 0.7);

      const aspectColor = aspect.type === 'conjunction' ? '#228B22' : 
                         aspect.type === 'opposition' ? '#FF0000' : '#0000FF';

      chartSvg.append('line')
        .attr('x1', fromX)
        .attr('y1', fromY)
        .attr('x2', toX)
        .attr('y2', toY)
        .attr('stroke', aspectColor)
        .attr('stroke-width', 1)
        .attr('opacity', 0.7);
    });
  }

  function zoomIn() {
    zoomLevel = Math.min(zoomLevel * 1.2, 3);
    updateZoom();
  }

  function zoomOut() {
    zoomLevel = Math.max(zoomLevel / 1.2, 0.5);
    updateZoom();
  }

  function resetZoom() {
    zoomLevel = 1;
    updateZoom();
  }

  function updateZoom() {
    if (chartSvg) {
      chartSvg.attr('transform', `translate(300, 300) scale(${zoomLevel}) translate(-300, -300)`);
    }
  }
</script>

<div class="chart-visualization">
  <div class="chart-controls">
    <button on:click={zoomIn} class="zoom-btn">+</button>
    <button on:click={zoomOut} class="zoom-btn">−</button>
    <button on:click={resetZoom} class="zoom-btn">Reset</button>
    <span class="zoom-level">{Math.round(zoomLevel * 100)}%</span>
  </div>
  
  <div class="chart-wrapper">
    <div bind:this={chartContainer} class="chart-container"></div>
  </div>

  <div class="chart-legend">
    <h4>Chart Legend</h4>
    <div class="legend-grid">
      <div class="legend-item">
        <span class="legend-symbol">☉</span>
        <span>Sun</span>
      </div>
      <div class="legend-item">
        <span class="legend-symbol">☽</span>
        <span>Moon</span>
      </div>
      <div class="legend-item">
        <span class="legend-symbol">☿</span>
        <span>Mercury</span>
      </div>
      <div class="legend-item">
        <span class="legend-symbol">♀</span>
        <span>Venus</span>
      </div>
      <div class="legend-item">
        <span class="legend-symbol">♂</span>
        <span>Mars</span>
      </div>
      <div class="legend-item">
        <span class="legend-symbol">♃</span>
        <span>Jupiter</span>
      </div>
      <div class="legend-item">
        <span class="legend-symbol">♄</span>
        <span>Saturn</span>
      </div>
      <div class="legend-item">
        <span class="legend-symbol">♅</span>
        <span>Uranus</span>
      </div>
      <div class="legend-item">
        <span class="legend-symbol">♆</span>
        <span>Neptune</span>
      </div>
      <div class="legend-item">
        <span class="legend-symbol">♇</span>
        <span>Pluto</span>
      </div>
    </div>
  </div>
</div>

<style>
  .chart-visualization {
    text-align: center;
  }

  .chart-controls {
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  .zoom-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 18px;
    font-weight: bold;
  }

  .zoom-level {
    margin-left: 1rem;
    font-weight: 600;
    color: #666;
  }

  .chart-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .chart-container {
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .chart-legend {
    text-align: left;
    max-width: 400px;
    margin: 0 auto;
  }

  .chart-legend h4 {
    margin-bottom: 1rem;
    text-align: center;
  }

  .legend-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .legend-symbol {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
  }

  @media (max-width: 768px) {
    .chart-container {
      max-width: 100%;
      overflow-x: auto;
    }
    
    .legend-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style> 