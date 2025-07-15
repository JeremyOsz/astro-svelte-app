<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { writable, derived, get } from 'svelte/store';
  import * as d3 from 'd3';
  import { CHART_LAYOUT } from '../data/chart-styles';
  import { 
    createTooltip, 
    handleMouseOver, 
    handleMouseOut, 
    handleClick, 
    unpinTooltip 
  } from './tooltip';
  import { chartStore } from '../stores/chart-store';

  // Props (removed chartData prop since we'll use the store directly)
  export let showDegreeMarkers: boolean = true;
  export let showExtendedPlanets: boolean = true;
  export let showAspectLines: boolean = true;
  export let showPlanetLabels: boolean = true;
  export let zoomLevel: number = 1;

  // Chart container reference
  let chartContainer: HTMLDivElement;
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  // Subscribe to the chart store - use manual subscription for better control
  let chartStoreUnsubscribe: () => void;
  let currentChartData: string | null = null;
  let currentVersion = 0;

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
    const dimensions = {
      chartSize: layout.chartSize,
      zodiacOuterRadius: layout.zodiacOuterRadius,
      zodiacInnerRadius: layout.zodiacInnerRadius,
      planetRingRadius: layout.planetRingRadius,
      labelRadius: layout.labelRadius,
      houseLineInnerRadius: layout.houseLineInnerRadius,
      houseNumRadius: layout.houseNumRadius,
      aspectHubRadius: layout.aspectHubRadius
    };
    console.log('D3Chart: Chart dimensions calculated:', dimensions);
    return dimensions;
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
    console.log('D3Chart: Component mounted');
    detectDeviceType();
    createTooltip();
    
    // Manual subscription to chart store
    chartStoreUnsubscribe = chartStore.subscribe((state) => {
      const { chartData, error, isLoading, version } = state;
      
      console.log('D3Chart: Store update received:', { 
        hasData: !!chartData, 
        dataLength: chartData?.length, 
        version, 
        currentVersion,
        hasContainer: !!chartContainer,
        error,
        isLoading 
      });
      
      // Only process if we have new data and container is ready
      if (chartData && version > currentVersion && chartContainer) {
        currentChartData = chartData;
        currentVersion = version;
        
        if (chartData.trim()) {
          console.log('D3Chart: Processing new chart data from store (version:', version, ')');
          console.log('D3Chart: Raw chart data:', chartData);
          parseChartData(chartData);
        } else {
          console.log('D3Chart: Chart data is empty, clearing chart');
          // Clear the chart if no data
          d3.select(chartContainer).html('');
        }
      } else {
        console.log('D3Chart: Skipping update - conditions not met:', {
          hasData: !!chartData,
          versionGreater: version > currentVersion,
          hasContainer: !!chartContainer
        });
      }
    });
  });

  // Debug chart container binding
  $: if (chartContainer) {
    console.log('D3Chart: Chart container bound:', chartContainer);
  }

  // Cleanup subscription
  onDestroy(() => {
    if (chartStoreUnsubscribe) {
      chartStoreUnsubscribe();
    }
  });

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
    const layout = isMobile ? CHART_LAYOUT.MOBILE : isTablet ? CHART_LAYOUT.TABLET : CHART_LAYOUT.DESKTOP;
    
    console.log('D3Chart: Device detection - width:', width, 'layout:', layout);
    
    chartState.update(state => ({
      ...state,
      isMobile,
      isTablet,
      layout
    } as any));
  }

  function parseChartData(data: string) {
    const trimmedData = data?.trim();
    if (!trimmedData) {
      console.log('D3Chart: No data to parse');
      return;
    }

    console.log('D3Chart: Parsing chart data:', trimmedData);
    console.log('D3Chart: Data lines:', trimmedData.split('\n'));

    const parsedData: PlanetData[] = trimmedData.split('\n').filter((line: string) => line.trim() !== '').map((line: string) => {
      const parts = line.split(',');
      let name = parts[0].trim();
      const sign = parts[1].trim();
      const degreePart = parts[2].trim();
      const isRetrograde = parts.length > 3 && parts[3].trim() === 'R';
      
      // Normalize planet names to match the expected format
      if (name === 'Asc') name = 'ASC';
      if (name === 'Mc') name = 'MC';
      if (name === 'Dsc') name = 'DSC';
      if (name === 'Ic') name = 'IC';
      
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
    }).filter((p): p is PlanetData => p !== null);

    console.log('D3Chart: Parsed data count:', parsedData.length);
    console.log('D3Chart: Parsed planets:', parsedData.map(p => p.planet));
    console.log('D3Chart: Looking for ASC in planets:', parsedData.map(p => p.planet).includes('ASC'));
    
    // Debug specific planet positions
    const sun = parsedData.find(p => p.planet === 'Sun');
    const moon = parsedData.find(p => p.planet === 'Moon');
    const asc = parsedData.find(p => p.planet === 'ASC');
    console.log('D3Chart: Key planet positions:', {
      Sun: sun ? `${sun.sign} ${sun.degree}°${sun.minute}'` : 'Not found',
      Moon: moon ? `${moon.sign} ${moon.degree}°${moon.minute}'` : 'Not found',
      ASC: asc ? `${asc.sign} ${asc.degree}°${asc.minute}'` : 'Not found'
    });
    if (!asc) {
      console.log('D3Chart: No ASC found in parsed data, cannot create chart');
      return;
    }
    console.log('D3Chart: Found ASC at angle:', asc.angle);

    const ascSignIndex = zodiacSigns.indexOf(asc.sign); // 0 = Aries, 1 = Taurus, etc.
    const ascDegree = asc.degree + asc.minute / 60;

    const houseCusps: HouseCusp[] = [];
    for (let i = 0; i < 12; i++) {
      const signIndex = (ascSignIndex + i) % 12;
      const angle = signIndex * 30; // 0, 30, 60, ...
      houseCusps.push({ house: i + 1, angle });
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

    // Assign houses to planets (whole sign system)
    parsedData.forEach((planet: PlanetData) => {
      const planetSignIndex = zodiacSigns.indexOf(planet.sign);
      (planet as any).house = ((planetSignIndex - ascSignIndex + 12) % 12) + 1;
    });

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
    console.log('D3Chart: createChart called');
    if (!chartContainer) {
      console.log('D3Chart: No chart container found');
      return;
    }
    const { showAspectLines, showPlanetLabels } = get(chartSettings);
    const { data, houseCusps, aspects } = get(chartState);


    
    const asc = data.find((p: PlanetData) => p.planet === 'ASC');
    if (!asc) {
      console.log('D3Chart: No ASC found in data');
      return;
    }
    const ascAngle = asc.angle;
    console.log('D3Chart: ASC angle:', ascAngle);
    
    const container = d3.select(chartContainer);
    console.log('D3Chart: Container selected:', container.node());
    container.html(''); // Clear previous chart
    console.log('D3Chart: Container cleared');

    const { chartSize } = get(chartDimensions);
    console.log('D3Chart: Chart size:', chartSize);

    svg = container.append('svg')
      .attr('width', chartSize)
      .attr('height', chartSize)
      .attr('viewBox', `0 0 ${chartSize} ${chartSize}`)
      .style('cursor', 'grab');
    console.log('D3Chart: SVG created:', svg.node());

    const g = svg.append('g')
      .attr('class', 'chart-group')
      .attr('transform', `translate(${chartSize / 2}, ${chartSize / 2})`);

    console.log('D3Chart: Drawing chart elements...');
    // Instead of rotating by ASC degree, rotate by 1st house cusp (whole sign: start of ASC sign)
    const house1CuspAngle = houseCusps[0].angle;
    // Draw chart elements
    drawZodiacWheel(g, house1CuspAngle);
    console.log('D3Chart: Zodiac wheel drawn');
    drawHouseLinesAndNumbers(g, house1CuspAngle);
    console.log('D3Chart: House lines drawn');
    if (showAspectLines) {
      drawAspects(g, house1CuspAngle);
      console.log('D3Chart: Aspects drawn');
    }
    drawPlanets(g, house1CuspAngle);
    console.log('D3Chart: Planets drawn');
    
    setupZoom(); // Re-setup zoom for the new SVG
    console.log('D3Chart: Zoom setup complete');
  }

  function drawZodiacWheel(g: d3.Selection<SVGGElement, unknown, null, undefined>, house1CuspAngle: number) {
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
      const signStartDeg = (180 - ((index * 30) - house1CuspAngle));
      const signMidDeg = (180 - ((index * 30 + 15) - house1CuspAngle));
      const angleRad = signMidDeg * Math.PI / 180;
      const symbolRadius = zodiacInnerRadius + (isMobile ? 13 : 25);
      
      const x = Math.cos(angleRad) * symbolRadius;
      const y = Math.sin(angleRad) * symbolRadius;

      // Calculate which house this sign is in
      // Use the actual sign angle in the astrological coordinate system
      const signAngle = (index * 30 + 15) % 360; // Use midpoint of the sign
      const { houseCusps } = get(chartState);
      let houseNumber = 0;
      
      // Find which house this sign falls into (same logic as planets)
      for (let i = 0; i < 12; i++) {
        const cusp1 = houseCusps[i];
        const cusp2 = houseCusps[(i + 1) % 12];
        const angle1 = cusp1.angle;
        let angle2 = cusp2.angle;

        // Handle wrap-around for the 12th house to 1st house transition
        if (angle2 < angle1) {
          angle2 += 360;
        }

        let testAngle = signAngle;
        if (testAngle < angle1) {
          testAngle += 360;
        }
        
        if (testAngle >= angle1 && testAngle < angle2) {
          houseNumber = cusp1.house;
          break;
        }
      }
      
      // Fallback for angles that might not have been caught
      if (houseNumber === 0) {
        houseNumber = houseCusps[11].house;
      }

      // Create sign data object for tooltip
      const signData = {
        sign: sign,
        house: houseNumber,
        angle: signAngle
      };

      // Create a group for the sign and its hover area
      const signGroup = g.append('g');
      
      // Add invisible hover area with smaller radius
      signGroup.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', isMobile ? 8 : 12) // Smaller hover radius
        .attr('fill', 'transparent')
        .style('cursor', 'pointer')
        .on('mouseover', (!isMobile ? ((event: any) => handleMouseOver(event, signData)) : null) as any)
        .on('mouseout', (!isMobile ? handleMouseOut : null) as any)
        .on('click', (event) => handleClick(event, signData));

      // Add the sign symbol
      signGroup.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-family', "'Noto Sans Symbols', 'Arial', sans-serif")
        .attr('font-size', isMobile ? 10 : 24)
        .attr('fill', zodiacColors[sign])
        .style('pointer-events', 'none') // Disable pointer events on text since circle handles them
        .text(zodiacSymbols[sign]);
    });

    // Degree tick marks
    for (let i = 0; i < 360; i++) {
      // Hide most degree tick marks on mobile; keep only sign dividers
      if (isMobile && i % 30 !== 0) continue;

      const angle = (180 - (i - house1CuspAngle)) * Math.PI / 180;
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

      // Reduce tick size and thickness on mobile for a cleaner look
      if (isMobile) {
        tickLength *= 0.7;
        strokeWidth *= 0.7;
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

  function drawHouseLinesAndNumbers(g: d3.Selection<SVGGElement, unknown, null, undefined>, house1CuspAngle: number) {
    const { houseCusps, data, isMobile } = get(chartState);
    const { zodiacInnerRadius, houseLineInnerRadius, houseNumRadius } = get(chartDimensions);
    const axes = data.filter((p: PlanetData) => ['ASC', 'MC', 'DSC', 'IC'].includes(p.planet));

    houseCusps.forEach((cusp: HouseCusp) => {
      const angle = (180 - (cusp.angle - house1CuspAngle)) * Math.PI / 180;
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
      const angle = (180 - (point.angle - house1CuspAngle)) * Math.PI / 180;
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
      const midpointAngle = (180 - ((cusp.angle + 15) - house1CuspAngle)) * Math.PI / 180;
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

  function drawAspects(g: d3.Selection<SVGGElement, unknown, null, undefined>, house1CuspAngle: number) {
    const { aspects, data, isMobile } = get(chartState);
    const { aspectHubRadius } = get(chartDimensions);

    g.append('circle')
      .attr('r', aspectHubRadius)
      .attr('fill', 'none')
      .attr('stroke', '#eee');

    aspects.forEach((aspect: Aspect) => {
      const planet1 = data.find((p: PlanetData) => p.planet === aspect.planet1);
      const planet2 = data.find((p: PlanetData) => p.planet === aspect.planet2);
      if (!planet1 || !planet2) return;

      const angle1 = (180 - (planet1.visualDegree - house1CuspAngle)) * Math.PI / 180;
      const angle2 = (180 - (planet2.visualDegree - house1CuspAngle)) * Math.PI / 180;
      
      const aspectGroup = g.append('g').attr('class', 'aspect-group');

      // Visible line for display
      aspectGroup.append('line')
        .attr('x1', Math.cos(angle1) * aspectHubRadius)
        .attr('y1', Math.sin(angle1) * aspectHubRadius)
        .attr('x2', Math.cos(angle2) * aspectHubRadius)
        .attr('y2', Math.sin(angle2) * aspectHubRadius)
        .attr('stroke', aspect.color)
        .attr('stroke-width', isMobile ? aspect.weight * 0.6 : aspect.weight)
        .attr('stroke-dasharray', aspect.style === 'dotted' ? '1,3' : aspect.style === 'dashed' ? '4,4' : 'none')
        .style('pointer-events', 'none');

      // Invisible wider line for interaction
      aspectGroup.append('line')
        .attr('class', 'aspect-interaction-line')
        .attr('x1', Math.cos(angle1) * aspectHubRadius)
        .attr('y1', Math.sin(angle1) * aspectHubRadius)
        .attr('x2', Math.cos(angle2) * aspectHubRadius)
        .attr('y2', Math.sin(angle2) * aspectHubRadius)
        .attr('stroke', 'transparent')
        .attr('stroke-width', 15) // Wider for easier hovering
        .style('cursor', 'pointer')
        .on('mouseover', (!isMobile ? ((event: any) => handleMouseOver(event, aspect)) : null) as any)
        .on('mouseout', (!isMobile ? handleMouseOut : null) as any)
        .on('click', (event) => handleClick(event, aspect));
    });
  }

  function drawPlanets(g: d3.Selection<SVGGElement, unknown, null, undefined>, house1CuspAngle: number) {
    const { data, isMobile } = get(chartState);
    const { showExtendedPlanets, showPlanetLabels } = get(chartSettings);
    const { planetRingRadius, zodiacInnerRadius, labelRadius } = get(chartDimensions);

    let planetsToDraw = data.filter((p: PlanetData) => planetSymbols[p.planet] && !['ASC', 'MC', 'DSC', 'IC'].includes(p.planet));
    if (!showExtendedPlanets) {
      planetsToDraw = planetsToDraw.filter((p: PlanetData) => !extendedPlanetNames.includes(p.planet));
    }



         // Simple approach: create planet groups directly without D3 data binding
     planetsToDraw.forEach((p: PlanetData) => {
       const group = g.append('g').attr('class', 'planet-group');
       const displayAngle = (180 - (p.visualDegree - house1CuspAngle));
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
          .on('mouseover', (!isMobile ? ((event: any) => handleMouseOver(event, p)) : null) as any)
          .on('mouseout', (!isMobile ? handleMouseOut : null) as any)
          .on('click', (event) => handleClick(event, p));

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
              .attr('stroke-width', isMobile ? 0.8 : 1);

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
        // Clamp the cluster arc to the sign boundaries
        const signIndex = zodiacSigns.indexOf(cluster[0].sign);
        const signStart = signIndex * 30;
        const signEnd = signStart + 30;
        const avgAngle = cluster.reduce((sum, p) => sum + p.angle, 0) / clusterSize;
        let startAngle = avgAngle - totalArc / 2;
        // Clamp startAngle and each planet's visualDegree to [signStart, signEnd)
        if (startAngle < signStart) startAngle = signStart;
        if (startAngle + totalArc > signEnd) startAngle = signEnd - totalArc;
        cluster.forEach((p: PlanetData, i: number) => {
          const originalPlanet = allPlanets.find(cp => cp.planet === p.planet);
          if (originalPlanet) {
            let vdeg = startAngle + i * (totalArc / (clusterSize - 1));
            if (vdeg < signStart) vdeg = signStart;
            if (vdeg >= signEnd) vdeg = signEnd - 0.01;
            originalPlanet.visualDegree = vdeg;
          }
        });
      }
    });
  }

  // Interpretation functions
  function setupZoom() {
    if (!svg) return;
    const { chartSize } = get(chartDimensions);
    if (!chartSize) return;

    const g = svg.select('.chart-group');
    if (!g.node()) return;
    
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3]) // Set min/max zoom levels
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any)
      .on('click', unpinTooltip);
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
    // This function is no longer needed as chartData is managed by the store
    // chartData = newData; 
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
    position: relative;
  }

  :global(.chart-svg) {
    max-width: 100%;
    height: auto;
  }

  :global(.chart-tooltip) {
  background: #fcf8ed;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.10);
  color: #222;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  min-width: 320px;
  max-width: 420px;
  padding: 0;
  z-index: 1001;
  transition: opacity 0.2s ease-in-out;
}

:global(.tooltip-header) {
  background-color: #fcf8ed;
  padding: 16px 20px 0 20px;
  font-weight: 700;
  font-size: 22px;
  color: #222;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: none;
}
:global(.tooltip-body) {
  padding: 10px 20px 18px 20px;
  font-size: 14px;
  line-height: 1.7;
  color: #222;
}

:global(.interpretation-content h3) {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 700;
  color: #222;
}

:global(.interpretation-content p) {
  margin: 0 0 10px;
  font-size: 14px;
  color: #222;
}

:global(.interpretation-content p:last-child) {
  margin-bottom: 0;
}

/* --- Mobile responsiveness tweaks --- */
@media (max-width: 767px) {
  .chart-container {
    min-height: 360px;
    width: 100%;
    max-width: 100%;
    padding: 8px;
  }

  /* Ensure the SVG scales to container width */
  .chart-container svg {
    width: 100% !important;
    height: auto !important;
  }

  /* Smaller tooltip on mobile */
  :global(.chart-tooltip) {
    min-width: 260px;
    max-width: 320px;
  }
}
</style> 