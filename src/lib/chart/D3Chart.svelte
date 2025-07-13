<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { writable, derived, get } from 'svelte/store';
  import * as d3 from 'd3';
  import interpretations from '../data/interpretations.json';
  import { CHART_LAYOUT, CHART_STYLES, injectChartStyles, removeChartStyles } from '../data/chart-styles';

  // Props
  export let chartData: string = '';
  export let showDegreeMarkers: boolean = true;
  export let showExtendedPlanets: boolean = true;
  export let showAspectLines: boolean = true;
  export let showPlanetLabels: boolean = true;
  export let zoomLevel: number = 1;

  // Chart container reference
  let chartContainer: HTMLDivElement;
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  // Types
  interface PlanetData {
    planet: string;
    sign: string;
    degree: number;
    minute: number;
    isRetrograde: boolean;
    angle: number;
    visualDegree: number;
  }

  interface HouseCusp {
    house: number;
    angle: number;
  }

  interface Aspect {
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
    color: string;
    weight: number;
    style: string;
  }

  // Reactive stores
  const chartState = writable({
    data: [] as PlanetData[],
    houseCusps: [] as HouseCusp[],
    aspects: [] as Aspect[],
    layout: CHART_LAYOUT.DESKTOP,
    isMobile: false,
    isTablet: false
  });

  const chartSettings = writable({
    showDegreeMarkers,
    showExtendedPlanets,
    showAspectLines,
    showPlanetLabels,
    zoomLevel
  });

  // Derived store for chart dimensions
  const chartDimensions = derived(chartState, ($chartState) => {
    const { layout } = $chartState;
    return {
      chartSize: layout.chartSize,
      zodiacOuterRadius: layout.zodiacOuterRadius,
      zodiacInnerRadius: layout.zodiacInnerRadius,
      planetRingRadius: layout.planetRingRadius,
      labelRadius: layout.labelRadius,
      houseLineInnerRadius: layout.houseLineInnerRadius,
      houseNumRadius: layout.houseNumRadius,
      aspectHubRadius: layout.aspectHubRadius
    };
  });

  // Chart constants
  const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const zodiacSymbols: Record<string, string> = {
    "Aries": "♈", "Taurus": "♉", "Gemini": "♊", "Cancer": "♋", "Leo": "♌", "Virgo": "♍",
    "Libra": "♎", "Scorpio": "♏", "Sagittarius": "♐", "Capricorn": "♑", "Aquarius": "♒", "Pisces": "♓"
  };
  const zodiacColors: Record<string, string> = {
    "Aries": "#e53935", "Taurus": "#43a047", "Gemini": "#fbc02d", "Cancer": "#039be5",
    "Leo": "#e53935", "Virgo": "#43a047", "Libra": "#fbc02d", "Scorpio": "#039be5",
    "Sagittarius": "#e53935", "Capricorn": "#43a047", "Aquarius": "#fbc02d", "Pisces": "#039be5"
  };
  const planetSymbols: Record<string, string> = {
    "Sun": "☉", "Moon": "☽", "Mercury": "☿", "Venus": "♀", "Mars": "♂", "Jupiter": "♃",
    "Saturn": "♄", "Uranus": "♅", "Neptune": "♆", "Pluto": "♇", "Node": "☊",
    "Lilith": "⚸", "Chiron": "⚷", "Fortune": "⊗", "Vertex": "Vx", 
    "ASC": "Asc", "MC": "MC", "DSC": "Dsc", "IC": "IC"
  };
  const extendedPlanetNames = ["Chiron", "Lilith", "Node", "Fortune", "Vertex"];
  const aspectDefs = {
    'Conjunction': { angle: 0, orb: 8, color: '#228B22', weight: 2.5, style: 'solid' },
    'Opposition': { angle: 180, orb: 8, color: '#FF0000', weight: 2.5, style: 'solid' },
    'Square': { angle: 90, orb: 8, color: '#FF0000', weight: 2.5, style: 'solid' },
    'Trine': { angle: 120, orb: 8, color: '#0000FF', weight: 2, style: 'solid' },
    'Sextile': { angle: 60, orb: 6, color: '#0000FF', weight: 2, style: 'dotted' },
    'Quincunx': { angle: 150, orb: 3, color: '#B8860B', weight: 1.5, style: 'dashed' }
  };
  const coreAspectBodies = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "ASC"];

  // Lifecycle
  onMount(() => {
    injectChartStyles();
    detectDeviceType();
    parseChartData();
    createChart();
    setupZoom();
  });

  onDestroy(() => {
    removeChartStyles();
  });

  // Reactive statements
  $: if (chartData) {
    parseChartData();
    // createChart() is called inside parseChartData's update callback now
  }

  $: if (showDegreeMarkers !== undefined || showExtendedPlanets !== undefined || 
         showAspectLines !== undefined || showPlanetLabels !== undefined) {
    chartSettings.update(settings => ({
      ...settings,
      showDegreeMarkers,
      showExtendedPlanets,
      showAspectLines,
      showPlanetLabels
    }));
    createChart();
  }

  // NOTE: The zoomLevel prop is removed to allow d3.zoom to manage its own state, preventing conflicts.
  // The user can now pan and zoom using mouse/touch gestures handled by D3.

  // Functions
  function detectDeviceType() {
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    
    chartState.update(state => ({
      ...state,
      isMobile,
      isTablet,
      layout: isMobile ? CHART_LAYOUT.MOBILE : isTablet ? CHART_LAYOUT.TABLET : CHART_LAYOUT.DESKTOP
    } as any));
  }

  function parseChartData() {
    const data = chartData.trim();
    if (!data) return;

    const parsedData = data.split('\n').filter(line => line.trim() !== '').map(line => {
      const parts = line.split(',');
      const name = parts[0].trim();
      const sign = parts[1].trim();
      const degreePart = parts[2].trim();
      const isRetrograde = parts.length > 3 && parts[3].trim() === 'R';
      
      const degreeMatch = degreePart.match(/^(\d+)°(\d+)'$/);
      if (!degreeMatch || !zodiacSigns.includes(sign)) {
        return null;
      }
      
      const degree = parseInt(degreeMatch[1]);
      const minute = parseInt(degreeMatch[2]);
      const signIndex = zodiacSigns.indexOf(sign);
      const absoluteDegree = signIndex * 30 + degree + minute / 60;

      return {
        planet: name,
        sign: sign,
        degree: degree,
        minute: minute,
        isRetrograde: isRetrograde,
        angle: absoluteDegree,
        visualDegree: absoluteDegree
      };
    }).filter(p => p !== null);

    const asc = parsedData.find(p => p.planet === 'ASC');
    if (!asc) return;

    const houseCusps: HouseCusp[] = [];
    for (let i = 0; i < 12; i++) {
      houseCusps.push({ house: i + 1, angle: (asc.angle + i * 30) % 360 });
    }

    // Add missing angles
    const mc = parsedData.find(p => p.planet === 'MC');
    if (mc && !parsedData.find(p => p.planet === 'IC')) {
      parsedData.push({ 
        planet: 'IC', 
        angle: (mc.angle + 180) % 360, 
        sign: zodiacSigns[Math.floor(((mc.angle + 180) % 360) / 30)], 
        degree: 0, 
        minute: 0,
        isRetrograde: false,
        visualDegree: (mc.angle + 180) % 360
      });
    }
    
    if (!parsedData.find(p => p.planet === 'DSC')) {
      parsedData.push({ 
        planet: 'DSC', 
        angle: (asc.angle + 180) % 360, 
        sign: zodiacSigns[Math.floor(((asc.angle + 180) % 360) / 30)], 
        degree: 0, 
        minute: 0,
        isRetrograde: false,
        visualDegree: (asc.angle + 180) % 360
      });
    }

    // Calculate visual degrees for clustering
    let planetsToDraw = parsedData.filter(p => planetSymbols[p.planet] && !['ASC', 'MC', 'DSC', 'IC'].includes(p.planet));
    if (!get(chartSettings).showExtendedPlanets) {
      planetsToDraw = planetsToDraw.filter(p => !extendedPlanetNames.includes(p.planet));
    }
    calculateVisualDegrees(planetsToDraw, parsedData);

    // Calculate aspects
    const aspects = calculateAspects(parsedData);

    chartState.update(state => ({
      ...state,
      data: parsedData,
      houseCusps,
      aspects
    }));
    
    // Create chart after state is updated
    createChart();
  }

  function calculateAspects(planets: PlanetData[]) {
    const aspects = [];
    const corePlanets = planets.filter(p => coreAspectBodies.includes(p.planet));
    
    for (let i = 0; i < corePlanets.length; i++) {
      for (let j = i + 1; j < corePlanets.length; j++) {
        const planet1 = corePlanets[i];
        const planet2 = corePlanets[j];
        const angleDiff = Math.abs(planet1.angle - planet2.angle);
        const angleDiff2 = Math.abs(360 - angleDiff);
        const minAngle = Math.min(angleDiff, angleDiff2);
        
        for (const [aspectName, aspectDef] of Object.entries(aspectDefs)) {
          if (Math.abs(minAngle - aspectDef.angle) <= aspectDef.orb) {
            aspects.push({
              planet1: planet1.planet,
              planet2: planet2.planet,
              aspect: aspectName,
              orb: Math.abs(minAngle - aspectDef.angle),
              color: aspectDef.color,
              weight: aspectDef.weight,
              style: aspectDef.style
            });
          }
        }
      }
    }
    
    return aspects;
  }

  function createChart() {
    if (!chartContainer) return;
    const { showAspectLines, showPlanetLabels } = get(chartSettings);
    const { data, houseCusps, aspects } = get(chartState);

    const asc = data.find((p: PlanetData) => p.planet === 'ASC');
    if (!asc) return;
    const ascAngle = asc.angle;
    
    const container = d3.select(chartContainer);
    container.html(''); // Clear previous chart

    const { chartSize } = get(chartDimensions);

    svg = container.append('svg')
      .attr('width', chartSize)
      .attr('height', chartSize)
      .attr('viewBox', `0 0 ${chartSize} ${chartSize}`)
      .style('cursor', 'grab');

    const g = svg.append('g')
      .attr('class', 'chart-group')
      .attr('transform', `translate(${chartSize / 2}, ${chartSize / 2})`);

    // Draw chart elements
    drawZodiacWheel(g, ascAngle);
    drawHouseLinesAndNumbers(g, ascAngle);
    if (showAspectLines) {
      drawAspects(g, ascAngle);
    }
    drawPlanets(g, ascAngle);
    
    setupZoom(); // Re-setup zoom for the new SVG
  }

  function drawZodiacWheel(g: d3.Selection<SVGGElement, unknown, null, undefined>, ascAngle: number) {
    const { zodiacOuterRadius, zodiacInnerRadius } = get(chartDimensions);
    const { isMobile } = get(chartState);
    const { showDegreeMarkers } = get(chartSettings);

    g.append('circle')
      .attr('r', zodiacOuterRadius)
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', isMobile ? 1 : 2);

    g.append('circle')
      .attr('r', zodiacInnerRadius)
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', isMobile ? 1 : 2);

    // Zodiac sign segments and symbols
    zodiacSigns.forEach((sign, index) => {
      const signStartDeg = (180 - ((index * 30) - ascAngle));
      const signMidDeg = (180 - ((index * 30 + 15) - ascAngle));
      const angleRad = signMidDeg * Math.PI / 180;
      const symbolRadius = zodiacInnerRadius + (isMobile ? 13 : 25);
      
      const x = Math.cos(angleRad) * symbolRadius;
      const y = Math.sin(angleRad) * symbolRadius;

      g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-family', "'Noto Sans Symbols', 'Arial', sans-serif")
        .attr('font-size', isMobile ? 10 : 24)
        .attr('fill', zodiacColors[sign])
        .text(zodiacSymbols[sign]);
    });

    // Degree tick marks
    for (let i = 0; i < 360; i++) {
      const angle = (180 - (i - ascAngle)) * Math.PI / 180;
      let tickLength = 4;
      let stroke = '#ddd';
      let strokeWidth = 1;

      if (i % 30 === 0) { // Zodiac sign dividers
        tickLength = 20; stroke = '#aaa'; strokeWidth = 1.5;
      } else if (i % 10 === 0) {
        tickLength = 10; stroke = '#ccc'; strokeWidth = 1;
      } else if (i % 5 === 0) {
        tickLength = 5; stroke = '#ddd'; strokeWidth = 1;
      } else if (!showDegreeMarkers) {
        continue;
      }

      const x1 = Math.cos(angle) * (zodiacInnerRadius);
      const y1 = Math.sin(angle) * (zodiacInnerRadius);
      const x2 = Math.cos(angle) * (zodiacInnerRadius + tickLength);
      const y2 = Math.sin(angle) * (zodiacInnerRadius + tickLength);
      
      g.append('line')
        .attr('x1', x1).attr('y1', y1)
        .attr('x2', x2).attr('y2', y2)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth);
    }
  }

  function drawHouseLinesAndNumbers(g: d3.Selection<SVGGElement, unknown, null, undefined>, ascAngle: number) {
    const { houseCusps, data, isMobile } = get(chartState);
    const { zodiacInnerRadius, houseLineInnerRadius, houseNumRadius } = get(chartDimensions);
    const axes = data.filter((p: PlanetData) => ['ASC', 'MC', 'DSC', 'IC'].includes(p.planet));

    houseCusps.forEach((cusp: HouseCusp) => {
      const angle = (180 - (cusp.angle - ascAngle)) * Math.PI / 180;
      const isAxis = axes.some((ax: PlanetData) => Math.abs(ax.angle - cusp.angle) < 0.1);
      
      g.append('line')
        .attr('x1', Math.cos(angle) * houseLineInnerRadius)
        .attr('y1', Math.sin(angle) * houseLineInnerRadius)
        .attr('x2', Math.cos(angle) * zodiacInnerRadius)
        .attr('y2', Math.sin(angle) * zodiacInnerRadius)
        .attr('stroke', isAxis ? '#777' : '#ddd')
        .attr('stroke-width', isAxis ? (isMobile ? 1.2 : 2) : 1);
    });

    axes.forEach((point: PlanetData) => {
      const angle = (180 - (point.angle - ascAngle)) * Math.PI / 180;
      const textAnchor = Math.cos(angle) > 0.1 ? 'start' : Math.cos(angle) < -0.1 ? 'end' : 'middle';
      const xOffset = textAnchor === 'start' ? 6 : textAnchor === 'end' ? -6 : 0;
      
      g.append('text')
        .attr('x', Math.cos(angle) * (zodiacInnerRadius - 10) + xOffset)
        .attr('y', Math.sin(angle) * (zodiacInnerRadius - 10))
        .attr('text-anchor', textAnchor)
        .attr('dominant-baseline', 'middle')
        .attr('font-size', isMobile ? 10 : 14)
        .attr('font-weight', 'bold')
        .attr('fill', '#555')
        .text(planetSymbols[point.planet]);
    });

    houseCusps.forEach((cusp: HouseCusp) => {
      const midpointAngle = (180 - ((cusp.angle + 15) - ascAngle)) * Math.PI / 180;
      const x = Math.cos(midpointAngle) * houseNumRadius;
      const y = Math.sin(midpointAngle) * houseNumRadius;
      g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', isMobile ? 9 : 14)
        .attr('fill', '#ccc')
        .text(cusp.house);
    });
  }

  function drawAspects(g: d3.Selection<SVGGElement, unknown, null, undefined>, ascAngle: number) {
    const { aspects, data } = get(chartState);
    const { aspectHubRadius } = get(chartDimensions);

    g.append('circle')
      .attr('r', aspectHubRadius)
      .attr('fill', 'none')
      .attr('stroke', '#eee');

    aspects.forEach((aspect: Aspect) => {
      const planet1 = data.find((p: PlanetData) => p.planet === aspect.planet1);
      const planet2 = data.find((p: PlanetData) => p.planet === aspect.planet2);
      if (!planet1 || !planet2) return;

      const angle1 = (180 - (planet1.visualDegree - ascAngle)) * Math.PI / 180;
      const angle2 = (180 - (planet2.visualDegree - ascAngle)) * Math.PI / 180;
      
      const line = g.append('line')
        .attr('class', 'aspect-line')
        .attr('x1', Math.cos(angle1) * aspectHubRadius)
        .attr('y1', Math.sin(angle1) * aspectHubRadius)
        .attr('x2', Math.cos(angle2) * aspectHubRadius)
        .attr('y2', Math.sin(angle2) * aspectHubRadius)
        .attr('stroke', aspect.color)
        .attr('stroke-width', aspect.weight)
        .attr('stroke-dasharray', aspect.style === 'dotted' ? '1,3' : aspect.style === 'dashed' ? '4,4' : 'none');
        
      line.on('click', (event) => {
        event.stopPropagation();
        const interpretation = getAspectInterpretation(aspect.aspect, aspect.planet1, aspect.planet2);
        showInterpretation(event, interpretation, `Aspect: ${aspect.planet1} ${aspect.aspect} ${aspect.planet2}`);
      });
    });
  }

  function drawPlanets(g: d3.Selection<SVGGElement, unknown, null, undefined>, ascAngle: number) {
    const { data, isMobile } = get(chartState);
    const { showExtendedPlanets, showPlanetLabels } = get(chartSettings);
    const { planetRingRadius, zodiacInnerRadius, labelRadius } = get(chartDimensions);

    let planetsToDraw = data.filter((p: PlanetData) => planetSymbols[p.planet] && !['ASC', 'MC', 'DSC', 'IC'].includes(p.planet));
    if (!showExtendedPlanets) {
      planetsToDraw = planetsToDraw.filter((p: PlanetData) => !extendedPlanetNames.includes(p.planet));
    }

    const planetGroups = g.selectAll('.planet-group')
      .data(planetsToDraw, (d: any) => d.planet);

    planetGroups.enter()
      .append('g')
      .attr('class', 'planet-group')
      .each(function(p: any) {
        const group = d3.select(this);
        const displayAngle = (180 - (p.visualDegree - ascAngle));
        const angleRad = displayAngle * Math.PI / 180;

        // Planet glyph
        group.append('text')
          .attr('class', 'planet-glyph')
          .attr('x', Math.cos(angleRad) * planetRingRadius)
          .attr('y', Math.sin(angleRad) * planetRingRadius)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('font-family', "'Noto Sans Symbols', 'Arial', sans-serif")
          .attr('font-size', isMobile ? 16 : 28)
          .attr('fill', p.isRetrograde ? '#e53935' : '#333')
          .style('cursor', 'pointer')
          .text(planetSymbols[p.planet])
          .on('click', (event) => {
            event.stopPropagation();
            const interpretation = getPlanetInterpretation(p.planet, p.sign, p.house);
            showInterpretation(event, interpretation, `Planet: ${p.planet} in ${p.sign} (House ${p.house})`);
          });

        if (showPlanetLabels) {
          const labelX = Math.cos(angleRad) * labelRadius;
          const labelY = Math.sin(angleRad) * labelRadius;
          const rotation = (displayAngle > 90 && displayAngle < 270) ? displayAngle + 90 : displayAngle + 90;

          group.append('line')
              .attr('class', 'planet-notch')
              .style('pointer-events', 'none')
              .attr('x1', Math.cos(angleRad) * zodiacInnerRadius)
              .attr('y1', Math.sin(angleRad) * zodiacInnerRadius)
              .attr('x2', Math.cos(angleRad) * (planetRingRadius + (isMobile ? 10 : 20)))
              .attr('y2', Math.sin(angleRad) * (planetRingRadius + (isMobile ? 10 : 20)))
              .attr('stroke', '#000')
              .attr('stroke-width', 1);

          const labelGroup = group.append('g')
            .attr('class', 'planet-label-group')
            .attr('transform', `translate(${labelX}, ${labelY}) rotate(${rotation})`);
          
          if (isMobile) {
            const labelText = labelGroup.append('text')
              .attr('text-anchor', 'middle')
              .attr('y', 4)
              .attr('font-size', 9);
            
            labelText.append('tspan').text(`${p.degree}°`);
            labelText.append('tspan').style('font-family', "'Noto Sans Symbols', 'Arial', sans-serif").style('fill', zodiacColors[p.sign]).text(zodiacSymbols[p.sign]);
            if (p.isRetrograde) {
                labelText.append('tspan').text('Rx');
            }
          } else {
            labelGroup.append('text')
              .attr('class', 'planet-label-degree')
              .attr('text-anchor', 'middle')
              .attr('y', -8)
              .style('font-size', '12px')
              .style('font-weight', 'bold')
              .text(p.degree);

            labelGroup.append('text')
              .attr('class', 'planet-label-sign')
              .attr('text-anchor', 'middle')
              .attr('y', 5)
              .style('font-family', "'Noto Sans Symbols', 'Arial', sans-serif")
              .style('font-size', '10px')
              .style('fill', zodiacColors[p.sign])
              .text(zodiacSymbols[p.sign]);

            labelGroup.append('text')
              .attr('class', 'planet-label-minute')
              .attr('text-anchor', 'middle')
              .attr('y', 20)
              .style('font-size', '11px')
              .text(p.minute.toString().padStart(2, '0'));
            
            if (p.isRetrograde) {
              labelGroup.append('text')
                .attr('class', 'retrograde-label')
                .attr('x', 0)
                .attr('y', 34)
                .style('font-size', '10px')
                .style('fill', '#e53935')
                .text('Rx');
            }
          }
        }
      });
      
    planetGroups.exit().remove();
  }

  // Clustering functions
  function findClusters(planets: PlanetData[]) {
    if (planets.length === 0) return [];
    let sorted = [...planets].sort((a, b) => a.angle - b.angle);
    let clusters: PlanetData[][] = [[sorted[0]]];
    for (let i = 1; i < sorted.length; i++) {
      if (Math.abs(sorted[i].angle - sorted[i - 1].angle) < 12) {
        clusters[clusters.length - 1].push(sorted[i]);
      } else {
        clusters.push([sorted[i]]);
      }
    }
    return clusters;
  }

  function calculateVisualDegrees(planetsToDraw: PlanetData[], allPlanets: PlanetData[]) {
    let clusters = findClusters(planetsToDraw);
    clusters.forEach(cluster => {
      const clusterSize = cluster.length;
      if (clusterSize > 1) {
        const totalArc = (clusterSize - 1) * 9;
        const avgAngle = cluster.reduce((sum, p) => sum + p.angle, 0) / clusterSize;
        const startAngle = avgAngle - totalArc / 2;
        cluster.forEach((p: PlanetData, i: number) => {
          const originalPlanet = allPlanets.find(cp => cp.planet === p.planet);
          if (originalPlanet) {
            originalPlanet.visualDegree = startAngle + i * (totalArc / (clusterSize - 1));
          }
        });
      }
    });
  }

  // Interpretation functions
  let tooltip: any;
  let tooltipPinned = false;

  function getPlanetInterpretation(planet: string, sign: string, house: number) {
    const planetInterpretations = (interpretations.planets as any)[planet];
    return `
      <h2>${planet} in ${sign}</h2>
      <p><strong>${planet}:</strong> ${planetInterpretations.meaning}</p>
      <p><strong>In ${sign}:</strong> ${planetInterpretations.sign_interpretations[sign]}</p>
      <p><strong>House:</strong> ${house}</p>
    `;
  }

  function getAspectInterpretation(aspect: string, planet1: string, planet2: string) {
    const aspectData = (interpretations.aspects as any)[aspect];
    const planetPair = `${planet1}_${planet2}`;
    const reversePlanetPair = `${planet2}_${planet1}`;
    const specificInterpretation = aspectData.planets[planetPair] || aspectData.planets[reversePlanetPair];

    return `
      <h2>${planet1} ${aspect} ${planet2}</h2>
      <p><strong>Orb:</strong> ${aspectData.orb.toFixed(1)}°</p>
      <p><strong>General:</strong> ${aspectData.general}</p>
      <p><strong>Specific:</strong> ${specificInterpretation}</p>
    `;
  }

  function showInterpretation(event: MouseEvent, interpretationHtml: string, title: string) {
    if (tooltip) {
      tooltip.remove();
    }

    tooltip = d3.select('body')
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('pointer-events', 'none');

    tooltip.html(interpretationHtml);

    const svgPoint = svg.node()?.createSVGPoint();
    if (svgPoint) {
      svgPoint.x = event.clientX;
      svgPoint.y = event.clientY;
      const clientPoint = svgPoint.matrixTransform(svg.node()?.getScreenCTM()?.inverse());

      tooltip.style('left', (clientPoint.x + 5) + 'px')
             .style('top', (clientPoint.y - 28) + 'px');
    }

    tooltip.transition()
      .duration(200)
      .style('opacity', .9);

    tooltip.on('mouseover', function() {
      tooltipPinned = true;
    }).on('mouseout', function() {
      tooltipPinned = false;
    });
  }

  function setupZoom() {
    if (!svg) return;
    const { chartSize } = get(chartDimensions);
    if (!chartSize) return;

    const g = svg.select('.chart-group');
    
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3]) // Set min/max zoom levels
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);
  }

  function updateZoom() {
    if (svg) {
      const zoom = d3.zoomTransform(svg.node() as Element);
      const newTransform = d3.zoomIdentity.scale(zoomLevel);
      svg.transition().duration(300).call(
        d3.zoom().transform as any,
        newTransform
      );
    }
  }

  // Expose methods for external use
  export function zoomIn() {
    const newZoom = Math.min(3, zoomLevel * 1.2);
    zoomLevel = newZoom;
  }

  export function zoomOut() {
    const newZoom = Math.max(0.5, zoomLevel / 1.2);
    zoomLevel = newZoom;
  }

  export function zoomReset() {
    zoomLevel = 1;
  }

  export function updateChart(newData: string) {
    chartData = newData;
  }
</script>

<div class="chart-container" bind:this={chartContainer}>
  <!-- Chart will be rendered here by D3 -->
</div>

<style>
  .chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 600px;
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fafafa;
    overflow: hidden;
  }

  :global(.chart-svg) {
    max-width: 100%;
    height: auto;
  }
</style> 