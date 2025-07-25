<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as d3 from 'd3';
  import type { NatalChart, TransitChart, Planet, HouseCusp, TransitAspect } from '$lib/types/types';
  import { ZODIAC_DETAILED, ZODIAC_COLORS, PLANET_SYMBOLS, ASPECT_DEFINITIONS } from '$lib/data/astrological-data';
  import { createTooltip, handleMouseOver, handleMouseOut, handleClick } from './tooltip';

  export let natalChart: NatalChart;
  export let transitChart: TransitChart;
  export let showAspectLines: boolean = true;
  export let showExtendedObjects: boolean = false;
  export let houseSystem: string = 'whole';

  let container: HTMLDivElement;
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  interface ChartOptions {
    showAspectLines?: boolean;
    showExtendedObjects?: boolean;
    houseSystem?: string;
  }

  function drawBiWheelChart(
    container: HTMLElement,
    natalChart: NatalChart,
    transitChart: TransitChart,
    options: ChartOptions = {}
  ) {
    const { 
      showAspectLines = true,
      showExtendedObjects = false,
      houseSystem = 'whole'
    } = options;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const size = Math.min(width, height);
    const radius = size / 2;

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', size)
      .attr('height', size)
      .append('g')
      .attr('transform', `translate(${radius}, ${radius})`);

    createTooltip();

    // Layout radii – natal inside, transit outside
    const zodiacOuterRadius = radius * 0.95;
    const zodiacInnerRadius = radius * 0.8;
    const natalPlanetRingRadius = radius * 0.55;
    const transitPlanetRingRadius = radius * 0.7;
    const aspectHubRadius = radius * 0.45;
    const houseLineInnerRadius = radius * 0.45;
    const houseNumRadius = radius * 0.38;

    const ascAngle = natalChart.ascendant;

    drawZodiacWheel(svg, zodiacOuterRadius, zodiacInnerRadius, ascAngle);
    drawHouseLines(svg, natalChart.houses, zodiacInnerRadius, houseLineInnerRadius, houseNumRadius, ascAngle, houseSystem);
    drawPlanets(svg, natalChart.planets, natalPlanetRingRadius, ascAngle, 'natal', showExtendedObjects);
    drawPlanets(svg, transitChart.planets, transitPlanetRingRadius, ascAngle, 'transit', showExtendedObjects);

    if (showAspectLines) {
      const aspects = calculateTransitAspects(natalChart.planets, transitChart.planets, showExtendedObjects);
      drawAspects(svg, aspects, natalPlanetRingRadius, transitPlanetRingRadius, ascAngle);
    }
  }

  function cleanup(container: HTMLElement) {
    d3.select(container).select('svg').remove();
  }

  function drawZodiacWheel(
    svg: d3.Selection<any, any, any, any>,
    outerRadius: number,
    innerRadius: number,
    ascAngle: number
  ) {
    const zodiacGroup = svg.append('g').attr('class', 'zodiac-wheel');

    ZODIAC_DETAILED.forEach((sign, i) => {
      const startAngle = (i * 30 - ascAngle + 360) % 360;
      const endAngle = ((i + 1) * 30 - ascAngle + 360) % 360;

      const arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(((startAngle - 90) * Math.PI) / 180)
        .endAngle(((endAngle - 90) * Math.PI) / 180);

      zodiacGroup
        .append('path')
        .attr('d', arc as any)
        .attr('fill', i % 2 === 0 ? '#f8f8f8' : '#fff')
        .attr('stroke', '#ccc');

      const symbolAngle = ((startAngle + 15 - 90) * Math.PI) / 180;
      const symbolRadius = innerRadius + (outerRadius - innerRadius) / 2;
      zodiacGroup
        .append('text')
        .attr('x', symbolRadius * Math.cos(symbolAngle))
        .attr('y', symbolRadius * Math.sin(symbolAngle))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '20px')
        .style('fill', ZODIAC_COLORS[sign.name])
        .text(sign.symbol);
    });
  }

  function drawHouseLines(
    svg: d3.Selection<any, any, any, any>,
    houses: HouseCusp[],
    zodiacInnerRadius: number,
    houseLineInnerRadius: number,
    houseNumRadius: number,
    ascAngle: number,
    houseSystem: string
  ) {
    const houseGroup = svg.append('g').attr('class', 'house-lines');

    houses.forEach((house, i) => {
      const angle = (house.longitude - ascAngle + 360) % 360;
      const angleRad = ((angle - 90) * Math.PI) / 180;

      // Adjust house line styling based on system
      const isAxis = i === 0 || i === 3 || i === 6 || i === 9;
      const strokeColor = isAxis ? '#888' : '#ddd';
      const strokeWidth = isAxis ? 1.5 : 1;

      houseGroup
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', zodiacInnerRadius * Math.cos(angleRad))
        .attr('y2', zodiacInnerRadius * Math.sin(angleRad))
        .attr('stroke', strokeColor)
        .attr('stroke-width', strokeWidth);

      const nextHouse = houses[(i + 1) % 12];
      const nextAngle = nextHouse ? (nextHouse.longitude - ascAngle + 360) % 360 : angle + 30;
      const midAngle = angle + (nextAngle - angle) / 2;
      const midAngleRad = ((midAngle - 90) * Math.PI) / 180;

      houseGroup
        .append('text')
        .attr('x', houseNumRadius * Math.cos(midAngleRad))
        .attr('y', houseNumRadius * Math.sin(midAngleRad))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '12px')
        .text(house.house);
    });
  }

  function drawPlanets(
    svg: d3.Selection<any, any, any, any>,
    planets: Planet[],
    ringRadius: number,
    ascAngle: number,
    type: 'natal' | 'transit',
    showExtendedObjects: boolean
  ) {
    const planetGroup = svg.append('g').attr('class', `${type}-planets`);

    // Filter planets based on extended objects setting
    const corePlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    const extendedPlanets = ['Chiron', 'Lilith', 'Node', 'Fortune', 'Vertex'];
    
    const planetsToShow = showExtendedObjects 
      ? planets 
      : planets.filter(p => corePlanets.includes(p.name));

    planetsToShow.forEach((planet) => {
      const angle = (planet.longitude - ascAngle + 360) % 360;
      const angleRad = ((angle - 90) * Math.PI) / 180;

      planetGroup
        .append('text')
        .attr('x', ringRadius * Math.cos(angleRad))
        .attr('y', ringRadius * Math.sin(angleRad))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '18px')
        .style('fill', planet.retrograde ? 'red' : 'black')
        .style('cursor', 'pointer')
        .text(PLANET_SYMBOLS[planet.name] || planet.name)
        .on('mouseover', (event) => handleMouseOver(event, planet))
        .on('mouseout', handleMouseOut)
        .on('click', (event) => handleClick(event, planet));
    });
  }

  function calculateTransitAspects(natalPlanets: Planet[], transitPlanets: Planet[], showExtendedObjects: boolean) {
    const aspects: TransitAspect[] = [];

    // Filter planets for aspect calculation
    const corePlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    const natalFiltered = showExtendedObjects ? natalPlanets : natalPlanets.filter(p => corePlanets.includes(p.name));
    const transitFiltered = showExtendedObjects ? transitPlanets : transitPlanets.filter(p => corePlanets.includes(p.name));

    transitFiltered.forEach((tPlanet) => {
      natalFiltered.forEach((nPlanet) => {
        const angleDiff = Math.abs(tPlanet.longitude - nPlanet.longitude);
        const diff = Math.min(angleDiff, 360 - angleDiff);

        for (const aspectName in ASPECT_DEFINITIONS) {
          const aspect = ASPECT_DEFINITIONS[aspectName as keyof typeof ASPECT_DEFINITIONS];
          if (Math.abs(diff - aspect.angle) <= aspect.orb) {
            aspects.push({
              transitPlanet: tPlanet,
              natalPlanet: nPlanet,
              type: aspectName,
              orb: Math.abs(diff - aspect.angle),
              color: aspect.color,
              style: aspect.style,
            });
            break;
          }
        }
      });
    });
    return aspects;
  }

  function drawAspects(
    svg: d3.Selection<any, any, any, any>,
    aspects: TransitAspect[],
    natalRadius: number,
    transitRadius: number,
    ascAngle: number
  ) {
    const aspectGroup = svg.append('g').attr('class', 'aspects');

    aspects.forEach((aspect) => {
      const tAngle = (aspect.transitPlanet.longitude - ascAngle + 360) % 360;
      const nAngle = (aspect.natalPlanet.longitude - ascAngle + 360) % 360;
      const tAngleRad = ((tAngle - 90) * Math.PI) / 180;
      const nAngleRad = ((nAngle - 90) * Math.PI) / 180;

      aspectGroup
        .append('line')
        .attr('x1', transitRadius * Math.cos(tAngleRad))
        .attr('y1', transitRadius * Math.sin(tAngleRad))
        .attr('x2', natalRadius * Math.cos(nAngleRad))
        .attr('y2', natalRadius * Math.sin(nAngleRad))
        .attr('stroke', aspect.color)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', aspect.style === 'dashed' ? '4,4' : 'none')
        .style('opacity', 0.8)
        .style('cursor', 'pointer')
        .on('mouseover', (event) => handleMouseOver(event, aspect))
        .on('mouseout', handleMouseOut)
        .on('click', (event) => handleClick(event, aspect));
    });
  }

  onMount(() => {
    if (container && natalChart && transitChart) {
      drawBiWheelChart(container, natalChart, transitChart, { showAspectLines });
    }
  });

  onDestroy(() => {
    if (container) {
      cleanup(container);
    }
  });

  // Redraw when inputs change
  $: if (container && natalChart && transitChart) {
    cleanup(container);
    drawBiWheelChart(container, natalChart, transitChart, { 
      showAspectLines,
      showExtendedObjects,
      houseSystem
    });
  }
</script>

<div class="biwheel-chart-container" bind:this={container}></div>

<style>
  .biwheel-chart-container {
    width: 100%;
    height: 100%;
    min-height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style> 