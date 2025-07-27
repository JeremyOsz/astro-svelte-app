<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { writable, derived, get } from 'svelte/store';
  import * as d3 from 'd3';
  import { CHART_LAYOUT } from '../data/chart-styles';
  import { 
    createBriefTooltip, 
    showBriefTooltip, 
    hideBriefTooltip 
  } from './brief-tooltip';
  import ChartElementDialog from './ChartElementDialog.svelte';
  import { chartStore } from '../stores/chart-store';

  // Props (removed chartData prop since we'll use the store directly)
  export let showDegreeMarkers: boolean = true;
  export let showExtendedPlanets: boolean = true;
  export let showAspectLines: boolean = true;
  export let showPlanetLabels: boolean = true;
  export let zoomLevel: number = 1;

  // Transit chart raw data (outer wheel)
  export let transitData: string | null = null;

  // Chart container reference
  let chartContainer: HTMLDivElement;
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  
  // Reset button state
  let showResetButton = false;
  let currentTransform = d3.zoomIdentity;
  let zoomBehavior: d3.ZoomBehavior<Element, unknown> | null = null;

  // Dialog state
  let dialogOpen = false;
  let selectedElementData: any = null;

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

  // Separate state for transit (outer wheel)
  const transitState = writable({
    data: [] as PlanetData[],
    houseCusps: [] as HouseCusp[],
    aspects: [] as Aspect[]
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
    // layout contains both natal and transit radii now; expose them all
    return { ...$chartState.layout } as const;
  });

  // Utility to pick the right radius depending on inner (natal) vs outer (transit)
  function getRadius(name: string, isInner: boolean) {
    const dims: Record<string, number> = get(chartDimensions) as any;
    if (isInner) return dims[name];
    const transitKey = `transit${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    return dims[transitKey];
  }

  // New event handlers for tooltip and dialog
  function handleElementHover(event: MouseEvent, data: any) {
    const { isMobile } = get(chartState);
    if (!isMobile) {
      showBriefTooltip(event, data);
    }
  }

  function handleElementLeave() {
    const { isMobile } = get(chartState);
    if (!isMobile) {
      hideBriefTooltip();
    }
  }

  function handleElementClick(event: MouseEvent, data: any) {
    event.stopPropagation();
    selectedElementData = data;
    dialogOpen = true;
    hideBriefTooltip();
  }

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
    createBriefTooltip();
    
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
          parseChartData(chartData, 'chart');
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

  // --- Reactively parse transit data when provided ---
  let lastTransitHash: string | null = null;
  $: if (transitData && chartContainer) {
    const currentHash = transitData;
    console.log('D3BiWheel: Transit data reactive block triggered:', { 
      hasTransitData: !!transitData, 
      transitDataLength: transitData?.length,
      currentHash, 
      lastTransitHash,
      willParse: currentHash !== lastTransitHash && transitData.trim()
    });
    if (currentHash !== lastTransitHash && transitData.trim()) {
      lastTransitHash = currentHash;
      console.log('D3BiWheel: Parsing new transit data');
      parseChartData(transitData, 'transit');
    }
  }

  // When container is bound, ensure natal data parsed if we previously skipped due to timing
  $: if (chartContainer && !chartStateDataInitialized()) {
    const storeData = get(chartStore).chartData;
    if (storeData) {
      console.log('D3Chart: Container now ready, parsing stored natal chart data');
      currentChartData = storeData;
      parseChartData(storeData, 'chart');
    }
  }

  function chartStateDataInitialized() {
    const data = get(chartState).data;
    return Array.isArray(data) && data.length > 0;
  }

  // Reactive statement to trigger chart redraw when either state changes
  $: if (get(chartState).data.length > 0 || get(transitState).data.length > 0) {
    if (chartContainer) {
      console.log('D3BiWheel: State change detected, redrawing chart');
      createChart();
    }
  }

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

  /**
   * Parse incoming chart CSV and populate either natal (chart) or transit store.
   * The parsing logic is identical; we just update the chosen store.
   */
  function parseChartData(data: string, target: 'chart' | 'transit' = 'chart') {
    const trimmedData = data?.trim();
    if (!trimmedData) {
      console.log('D3Chart: No data to parse');
      return;
    }

    console.log('D3Chart: Parsing chart data:', trimmedData);
    console.log('D3Chart: Data lines:', trimmedData.split('\n'));

    const lines = trimmedData.split('\n').filter((line: string) => line.trim() !== '');
    const parsedData: PlanetData[] = [];
    let houseCusps: HouseCusp[] = [];
    let hasApiHouseCusps = false;

    // First pass: look for house cusps line
    const houseCuspsLine = lines.find(line => line.startsWith('#HOUSES:'));
    if (houseCuspsLine) {
      const houseCuspsStr = houseCuspsLine.replace('#HOUSES:', '');
      const houseCuspDegrees = houseCuspsStr.split(',').map(deg => parseFloat(deg.trim()));
      if (houseCuspDegrees.length === 12 && houseCuspDegrees.every(deg => !isNaN(deg))) {
        houseCusps = houseCuspDegrees.map((angle, index) => ({ house: index + 1, angle }));
        hasApiHouseCusps = true;
        console.log('D3Chart: Using API house cusps:', houseCusps);
      }
    }

    // Second pass: parse planets
    lines.forEach((line: string) => {
      if (line.startsWith('#')) return; // Skip comment lines
      
      const parts = line.split(',');
      let name = parts[0].trim();
      const sign = parts[1].trim();
      const degreePart = parts[2].trim();
      
      // Check for house number (4th part) and retrograde (5th part)
      let houseNumber: number | undefined;
      let isRetrograde = false;
      
      if (parts.length > 3) {
        const part3 = parts[3].trim();
        if (part3 === 'R') {
          isRetrograde = true;
        } else if (!isNaN(parseInt(part3))) {
          houseNumber = parseInt(part3);
          isRetrograde = parts.length > 4 && parts[4].trim() === 'R';
        }
      }
      
      // Normalize planet names to match the expected format
      if (name === 'Asc') name = 'ASC';
      if (name === 'Mc') name = 'MC';
      if (name === 'Dsc') name = 'DSC';
      if (name === 'Ic') name = 'IC';
      
      const degreeMatch = degreePart.match(/^(\d+)°(\d+)'$/);
      if (!degreeMatch || !zodiacSigns.includes(sign)) {
        return;
      }
      
      const degree = parseInt(degreeMatch[1]);
      const minute = parseInt(degreeMatch[2]);
      const signIndex = zodiacSigns.indexOf(sign);
      const absoluteDegree = signIndex * 30 + degree + minute / 60;

      const planetData: PlanetData = {
        planet: name,
        sign: sign,
        degree: degree,
        minute: minute,
        isRetrograde: isRetrograde,
        angle: absoluteDegree,
        visualDegree: absoluteDegree
      };

      // Use API house number if available, otherwise calculate
      if (houseNumber !== undefined) {
        (planetData as any).house = houseNumber;
        console.log(`D3Chart: Using API house for ${name}: ${houseNumber}`);
      }

      parsedData.push(planetData);
    });

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

    // If we don't have API house cusps, calculate them using whole sign system
    if (!hasApiHouseCusps) {
      const ascSignIndex = zodiacSigns.indexOf(asc.sign);
      for (let i = 0; i < 12; i++) {
        const signIndex = (ascSignIndex + i) % 12;
        const angle = signIndex * 30; // 0, 30, 60, ...
        houseCusps.push({ house: i + 1, angle });
      }
      console.log('D3Chart: Calculated house cusps (whole sign):', houseCusps);
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

    // Assign houses to planets if not already assigned by API
    parsedData.forEach((planet: PlanetData) => {
      if ((planet as any).house === undefined) {
        // Calculate house based on house cusps
        const planetAngle = planet.angle;
        let houseNumber = 1;
        
        for (let i = 0; i < houseCusps.length; i++) {
          const cusp1 = houseCusps[i];
          const cusp2 = houseCusps[(i + 1) % 12];
          const angle1 = cusp1.angle;
          let angle2 = cusp2.angle;

          // Handle wrap-around for the 12th house to 1st house transition
          if (angle2 < angle1) {
            angle2 += 360;
          }

          let testAngle = planetAngle;
          if (testAngle < angle1) {
            testAngle += 360;
          }
          
          if (testAngle >= angle1 && testAngle < angle2) {
            houseNumber = cusp1.house;
            break;
          }
        }
        
        (planet as any).house = houseNumber;
        console.log(`D3Chart: Calculated house for ${planet.planet}: ${houseNumber}`);
      }
    });

    // Calculate visual degrees for clustering
    let planetsToDraw = parsedData.filter(p => planetSymbols[p.planet] && !['ASC', 'MC', 'DSC', 'IC'].includes(p.planet));
    if (!get(chartSettings).showExtendedPlanets) {
      planetsToDraw = planetsToDraw.filter(p => !extendedPlanetNames.includes(p.planet));
    }
    calculateVisualDegrees(planetsToDraw, parsedData, target === 'transit'); // false for natal, true for transit

    // Calculate aspects
    const aspects = calculateAspects(parsedData);

    const updateStore = target === 'chart' ? chartState : transitState;
    updateStore.update(state => ({
      ...state,
      data: parsedData,
      houseCusps,
      aspects
    }));

    // Trigger redraw when either natal or transit data updates
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
          const orb = Math.abs(minAngle - aspectDef.angle);
          if (orb <= aspectDef.orb && orb < 3) {
            aspects.push({
              planet1: planet1.planet,
              planet2: planet2.planet,
              aspect: aspectName,
              orb: orb,
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

  function calculateTransitToNatalAspects(natalPlanets: PlanetData[], transitPlanets: PlanetData[]) {
    const aspects = [];
    const natalCorePlanets = natalPlanets.filter(p => coreAspectBodies.includes(p.planet));
    const transitCorePlanets = transitPlanets.filter(p => coreAspectBodies.includes(p.planet));
    
    // Calculate aspects from transit planets TO natal planets
    for (const transitPlanet of transitCorePlanets) {
      for (const natalPlanet of natalCorePlanets) {
        const angleDiff = Math.abs(transitPlanet.angle - natalPlanet.angle);
        const angleDiff2 = Math.abs(360 - angleDiff);
        const minAngle = Math.min(angleDiff, angleDiff2);
        
        for (const [aspectName, aspectDef] of Object.entries(aspectDefs)) {
          const orb = Math.abs(minAngle - aspectDef.angle);
          if (orb <= aspectDef.orb && orb < 3) {
            aspects.push({
              planet1: transitPlanet.planet, // Transit planet (FROM)
              planet2: natalPlanet.planet,   // Natal planet (TO)
              aspect: aspectName,
              orb: orb,
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
    const natal = get(chartState);
    const trans = get(transitState);
    const { data, houseCusps } = natal;

    const asc = data.find((p: PlanetData) => p.planet === 'ASC');
    if (!asc) {
      console.log('D3Chart: No ASC found in data');
      return;
    }
    const ascAngle = asc.angle;
    console.log('D3Chart: ASC angle:', ascAngle);
    console.log('D3Chart: House cusps:', houseCusps);
    
    const container = d3.select(chartContainer);
    console.log('D3Chart: Container selected:', container.node());
    container.html(''); // Clear previous chart
    globalDefs = null; // Reset globalDefs when clearing chart
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
    // Use the 1st house cusp angle from the API (or calculated whole sign)
    const house1CuspAngle = houseCusps[0].angle;
    console.log('D3Chart: Using house 1 cusp angle:', house1CuspAngle);
    
    // ---- INNER (NATAL) WHEEL ----
    drawZodiacWheel(g, house1CuspAngle, true);
    drawHouseLinesAndNumbers(g, house1CuspAngle, true);
    drawPlanets(g, house1CuspAngle, true);

    // ---- OUTER (TRANSIT) WHEEL (draw only if data present) ----
    console.log('D3BiWheel: Transit data check:', { 
      transitDataLength: trans.data.length, 
      transitData: trans.data.map(p => p.planet),
      hasTransitData: !!transitData 
    });
    if (trans.data.length) {
      console.log('D3BiWheel: Drawing outer transit wheel');
      drawZodiacWheel(g, house1CuspAngle, false);
      drawPlanets(g, house1CuspAngle, false);
      
      // Draw transit-to-natal aspects (only when we have transit data)
      if (showAspectLines) {
        console.log('D3BiWheel: Drawing transit-to-natal aspects');
        drawAspects(g, house1CuspAngle, false);
      }
    } else {
      console.log('D3BiWheel: No transit data to draw');
      // No aspects to draw when there's no transit data
    }
    
    setupZoom(); // Re-setup zoom for the new SVG
    console.log('D3Chart: Zoom setup complete');
  }

  function drawZodiacWheel(g: d3.Selection<SVGGElement, unknown, null, undefined>, house1CuspAngle: number, isInner: boolean) {
    const { isMobile } = get(chartState);
    const { showDegreeMarkers } = get(chartSettings);

    // Only draw zodiac ring for natal (inner wheel)
    if (!isInner) return;

    const zodiacOuterRadius = getRadius('zodiacOuterRadius', true); // natal outer
    const zodiacInnerRadius = getRadius('zodiacInnerRadius', true); // natal inner
    const transitOuterRadius = getRadius('zodiacOuterRadius', false); // transit outer

    // Draw the single zodiac ring (natal inner to transit outer)
    g.append('circle')
      .attr('r', zodiacInnerRadius)
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', isMobile ? 1 : 2);

    g.append('circle')
      .attr('r', transitOuterRadius)
      .attr('fill', 'none')
      .attr('stroke', '#aaa')
      .attr('stroke-width', isMobile ? 0.8 : 1);

    // Get the Ascendant to determine the starting sign
    const { data } = get(chartState);
    const asc = data.find((p: PlanetData) => p.planet === 'ASC');
    if (!asc) {
      console.log('D3Chart: No ASC found for zodiac wheel');
      return;
    }
    
    // Calculate the offset to make the Ascendant's sign start at the top (0°)
    const ascSignIndex = zodiacSigns.indexOf(asc.sign);
    const ascSignStartAngle = ascSignIndex * 30; // 0° of the Ascendant's sign
    const zodiacOffset = ascSignStartAngle - house1CuspAngle;
    
    console.log('D3Chart: Zodiac wheel setup:', {
      ascSign: asc.sign,
      ascSignIndex,
      ascSignStartAngle,
      targetAngle: 360,
      zodiacOffset
    });

    // Zodiac sign segments and symbols
    zodiacSigns.forEach((sign, index) => {
      // Calculate the visual position of each sign relative to the Ascendant's sign
      const signAngle = (index * 30 + 15) % 360; // Midpoint of the sign
      const adjustedSignAngle = signAngle - zodiacOffset;
      const displayAngle = (180 - adjustedSignAngle) * Math.PI / 180;
      
      const symbolRadius = zodiacInnerRadius + (isMobile ? 13 : 25); // natal side
      const x = Math.cos(displayAngle) * symbolRadius;
      const y = Math.sin(displayAngle) * symbolRadius;

      // Calculate which house this sign is in
      const { houseCusps } = get(chartState);
      let houseNumber = 0;
      
      // For Whole Sign system, the house is determined by the sign's position relative to the Ascendant's sign
      const ascSignIndex = zodiacSigns.indexOf(asc.sign);
      const signIndex = zodiacSigns.indexOf(sign);
      const houseOffset = (signIndex - ascSignIndex + 12) % 12;
      houseNumber = houseOffset + 1;

      // Create sign data object for tooltip
      const signData = {
        sign: sign,
        house: houseNumber,
        angle: signAngle
      };

      // Create a group for the sign and its hover area
      const signGroup = g.append('g');
      
      // Add invisible hover area with larger radius for easier interaction
      signGroup.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', isMobile ? 12 : 16) // Larger hover radius
        .attr('fill', 'transparent')
        .style('cursor', 'pointer')
        .on('mouseover', (!isMobile ? function(this: SVGCircleElement, event: MouseEvent) {
          const filterUrl = ensureGlowFilterForSign(g, sign);
          d3.select(this.parentNode as SVGGElement).style('filter', filterUrl);
          handleElementHover(event, signData);
        } : null) as any)
        .on('mouseout', (!isMobile ? function(this: SVGCircleElement, event: MouseEvent) {
          d3.select(this.parentNode as SVGGElement).style('filter', null);
          handleElementLeave();
        } : null) as any)
        .on('click', (event) => handleElementClick(event, signData));

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

    // Degree tick marks - draw on both sides of the zodiac ring
    for (let i = 0; i < 360; i++) {
      // Hide most degree tick marks on mobile; keep only sign dividers
      if (isMobile && i % 30 !== 0) continue;

      const adjustedAngle = i - zodiacOffset;
      const displayAngle = (180 - adjustedAngle) * Math.PI / 180;
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

      // Inner tick marks (natal side)
      const x1 = Math.cos(displayAngle) * (zodiacInnerRadius);
      const y1 = Math.sin(displayAngle) * (zodiacInnerRadius);
      const x2 = Math.cos(displayAngle) * (zodiacInnerRadius + tickLength);
      const y2 = Math.sin(displayAngle) * (zodiacInnerRadius + tickLength);
      
      g.append('line')
        .attr('x1', x1).attr('y1', y1)
        .attr('x2', x2).attr('y2', y2)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth);

      // Outer tick marks (transit side)
      const x3 = Math.cos(displayAngle) * (transitOuterRadius);
      const y3 = Math.sin(displayAngle) * (transitOuterRadius);
      const x4 = Math.cos(displayAngle) * (transitOuterRadius - tickLength);
      const y4 = Math.sin(displayAngle) * (transitOuterRadius - tickLength);
      
      g.append('line')
        .attr('x1', x3).attr('y1', y3)
        .attr('x2', x4).attr('y2', y4)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth);
    }
  }

  function drawHouseLinesAndNumbers(g: d3.Selection<SVGGElement, unknown, null, undefined>, house1CuspAngle: number, isInner: boolean) {
    const { houseCusps, data, isMobile } = get(chartState);
    const zodiacInnerRadius = getRadius('zodiacInnerRadius', isInner);
    const houseLineInnerRadius = getRadius('houseLineInnerRadius', isInner);
    const houseNumRadius = getRadius('houseNumRadius', isInner);
    const axes = data.filter((p: PlanetData) => ['ASC', 'MC', 'DSC', 'IC'].includes(p.planet));

    // Get the Ascendant to calculate the zodiac offset (same as in drawZodiacWheel)
    const asc = data.find((p: PlanetData) => p.planet === 'ASC');
    if (!asc) {
      console.log('D3Chart: No ASC found for house line positioning');
      return;
    }
    
    const ascSignIndex = zodiacSigns.indexOf(asc.sign);
    const ascSignStartAngle = ascSignIndex * 30;
    // Use same rotation offset as zodiac wheel
    const zodiacOffset = ascSignStartAngle - 360; // 270° puts House 1 on the left

    // Draw house lines at the actual cusp angles
    houseCusps.forEach((cusp: HouseCusp) => {
      const adjustedAngle = cusp.angle - zodiacOffset;
      const angle = (180 - adjustedAngle) * Math.PI / 180;
      const isAxis = axes.some((ax: PlanetData) => Math.abs(ax.angle - cusp.angle) < 0.1);
      
      g.append('line')
        .attr('x1', Math.cos(angle) * houseLineInnerRadius)
        .attr('y1', Math.sin(angle) * houseLineInnerRadius)
        .attr('x2', Math.cos(angle) * zodiacInnerRadius)
        .attr('y2', Math.sin(angle) * zodiacInnerRadius)
        .attr('stroke', isAxis ? '#777' : '#ddd')
        .attr('stroke-width', isAxis ? (isMobile ? 1.2 : 2) : 1);
    });

    // Draw axis labels (ASC, MC, DSC, IC)
    axes.forEach((point: PlanetData) => {
      const adjustedAngle = point.angle - zodiacOffset;
      const angle = (180 - adjustedAngle) * Math.PI / 180;
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

    // Draw house numbers at the midpoint of each house
    houseCusps.forEach((cusp: HouseCusp, index: number) => {
      // For Whole Sign system, each house spans exactly 30° starting from the Ascendant's sign
      // House 1 starts at 0° of the Ascendant's sign, House 2 at 30°, etc.
      const houseStartAngle = (index * 30) + ascSignStartAngle;
      const houseMidpointAngle = houseStartAngle + 15; // 15° into each 30° house
      
      const adjustedDisplayAngle = houseMidpointAngle - zodiacOffset;
      const displayAngle = (180 - adjustedDisplayAngle) * Math.PI / 180;
      const x = Math.cos(displayAngle) * houseNumRadius;
      const y = Math.sin(displayAngle) * houseNumRadius;
      
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

  function drawAspects(g: d3.Selection<SVGGElement, unknown, null, undefined>, house1CuspAngle: number, isInner: boolean) {
    const { data, isMobile } = get(chartState);
    const transitData = get(transitState).data;
    
    // For natal aspects, use the regular aspects within natal data
    // For transit aspects, we need to calculate transit-to-natal aspects
    let aspects: Aspect[];
    if (isInner) {
      aspects = get(chartState).aspects;
    } else {
      // Calculate transit-to-natal aspects
      aspects = calculateTransitToNatalAspects(data, transitData);
    }
    
    const aspectHubRadius = getRadius('aspectHubRadius', isInner);

    // Get the Ascendant to calculate the zodiac offset (same as in drawZodiacWheel)
    const asc = data.find((p: PlanetData) => p.planet === 'ASC');
    if (!asc) {
      console.log('D3Chart: No ASC found for aspect positioning');
      return;
    }
    
    const ascSignIndex = zodiacSigns.indexOf(asc.sign);
    const ascSignStartAngle = ascSignIndex * 30;
    // Use same rotation offset as zodiac wheel
    const zodiacOffset = ascSignStartAngle - 360; // 270° puts House 1 on the left

    g.append('circle')
      .attr('r', aspectHubRadius)
      .attr('fill', 'none')
      .attr('stroke', '#eee');

    aspects.forEach((aspect: Aspect) => {
      let planet1, planet2;
      
      if (isInner) {
        // Natal aspects: both planets are in natal data
        planet1 = data.find((p: PlanetData) => p.planet === aspect.planet1);
        planet2 = data.find((p: PlanetData) => p.planet === aspect.planet2);
      } else {
        // Transit-to-natal aspects: planet1 is transit, planet2 is natal
        planet1 = transitData.find((p: PlanetData) => p.planet === aspect.planet1);
        planet2 = data.find((p: PlanetData) => p.planet === aspect.planet2);
      }
      
      if (!planet1 || !planet2) return;

      const adjustedAngle1 = planet1.visualDegree - zodiacOffset;
      const adjustedAngle2 = planet2.visualDegree - zodiacOffset;
      const angle1 = (180 - adjustedAngle1) * Math.PI / 180;
      const angle2 = (180 - adjustedAngle2) * Math.PI / 180;
      
      // For transit aspects, we draw within the transit aspect hub radius
      // but the line represents the connection between transit and natal planets
      let radius1, radius2;
      if (isInner) {
        // Natal aspects: both planets use natal radius
        radius1 = radius2 = aspectHubRadius;
      } else {
        // Transit aspects: both points within transit aspect hub radius
        // but planet1 is transit, planet2 is natal (logically)
        radius1 = radius2 = aspectHubRadius;
      }
      
      const aspectGroup = g.append('g').attr('class', 'aspect-group');

      // Visible line for display
      aspectGroup.append('line')
        .attr('x1', Math.cos(angle1) * radius1)
        .attr('y1', Math.sin(angle1) * radius1)
        .attr('x2', Math.cos(angle2) * radius2)
        .attr('y2', Math.sin(angle2) * radius2)
        .attr('stroke', aspect.color)
        .attr('stroke-width', isMobile ? aspect.weight * 0.6 : aspect.weight)
        .attr('stroke-dasharray', aspect.style === 'dotted' ? '1,3' : aspect.style === 'dashed' ? '4,4' : 'none')
        .style('pointer-events', 'none');

      // Invisible wider line for interaction
      aspectGroup.append('line')
        .attr('class', 'aspect-interaction-line')
        .attr('x1', Math.cos(angle1) * radius1)
        .attr('y1', Math.sin(angle1) * radius1)
        .attr('x2', Math.cos(angle2) * radius2)
        .attr('y2', Math.sin(angle2) * radius2)
        .attr('stroke', 'transparent')
        .attr('stroke-width', 15) // Wider for easier hovering
        .style('cursor', 'pointer')
        .on('mouseover', (!isMobile ? function(this: SVGLineElement, event: MouseEvent) {
          const filterUrl = ensureGlowFilterForAspect(g, aspect.color);
          d3.select(this.parentNode as SVGGElement).style('filter', filterUrl);
          // Add transit/natal information to the aspect data
          const aspectDataWithType = { ...aspect, isTransitAspect: !isInner };
          handleElementHover(event, aspectDataWithType);
        } : null) as any)
        .on('mouseout', (!isMobile ? function(this: SVGLineElement, event: MouseEvent) {
          d3.select(this.parentNode as SVGGElement).style('filter', null);
          handleElementLeave();
        } : null) as any)
        .on('click', (event) => {
          const aspectDataWithType = { ...aspect, isTransitAspect: !isInner };
          handleElementClick(event, aspectDataWithType);
        });
    });
  }

  function drawPlanets(g: d3.Selection<SVGGElement, unknown, null, undefined>, house1CuspAngle: number, isInner: boolean) {
    const data = isInner ? get(chartState).data : get(transitState).data;
    const { isMobile } = get(chartState);
    const { showExtendedPlanets, showPlanetLabels } = get(chartSettings);
    const planetRingRadius = getRadius('planetRingRadius', isInner);
    const zodiacInnerRadius = getRadius('zodiacInnerRadius', isInner);
    const labelRadius = getRadius('labelRadius', isInner);

    // For natal planets, use the natal chart's Ascendant for positioning
    // For transit planets, use the natal chart's Ascendant but position planets at their absolute zodiac positions
    const natalData = get(chartState).data;
    const natalAsc = natalData.find((p: PlanetData) => p.planet === 'ASC');
    if (!natalAsc) {
      console.log('D3Chart: No natal ASC found for planet positioning');
      return;
    }
    
    const natalAscSignIndex = zodiacSigns.indexOf(natalAsc.sign);
    const natalAscSignStartAngle = natalAscSignIndex * 30;
    
    let zodiacOffset: number;
    zodiacOffset = natalAscSignStartAngle;

    // Define a glow filter for each sign color (if not already present)
    const defs = getDefs(g);

    // Apply clustering to prevent overlap, especially for transit labels
    let planetsToDraw = data.filter((p: PlanetData) => planetSymbols[p.planet] && !['ASC', 'MC', 'DSC', 'IC'].includes(p.planet));
    if (!showExtendedPlanets) {
      planetsToDraw = planetsToDraw.filter((p: PlanetData) => !extendedPlanetNames.includes(p.planet));
    }

    // Calculate visual degrees for clustering (prevent overlap)
    calculateVisualDegrees(planetsToDraw, data, !isInner); // true for transit, false for natal

    // Create planet groups with clustered positions
    planetsToDraw.forEach((p: PlanetData) => {
      const group = g.append('g').attr('class', 'planet-group');
      const adjustedAngle = p.visualDegree - zodiacOffset;
      const displayAngle = (180 - adjustedAngle);
      const angleRad = displayAngle * Math.PI / 180;

      // Position planets differently for natal vs transit
      let planetRadius: number;
      if (isInner) {
        // Natal planets: inside the zodiac ring
        planetRadius = planetRingRadius;
      } else {
        // Transit planets: outside the zodiac ring (mirror natal)
        const transitOuterRadius = getRadius('zodiacOuterRadius', false);
        planetRadius = transitOuterRadius + (isMobile ? 15 : 25);
      }

      // Transparent circle for hover area (larger for easier interaction)
      group.append('circle')
        .attr('class', 'planet-hover-area')
        .attr('cx', Math.cos(angleRad) * planetRadius)
        .attr('cy', Math.sin(angleRad) * planetRadius)
        .attr('r', isMobile ? 12 : 20)
        .attr('fill', 'transparent')
        .style('cursor', 'pointer')
        .on('mouseover', function(this: SVGCircleElement, event: MouseEvent) {
          const filterUrl = ensureGlowFilterForSign(g, p.sign);
          d3.select(this.parentNode as SVGGElement).style('filter', filterUrl);
          // Add transit/natal information to the planet data
          const planetDataWithType = { ...p, isTransit: !isInner };
          handleElementHover(event, planetDataWithType);
        })
        .on('mouseout', function(this: SVGCircleElement, event: MouseEvent) {
          d3.select(this.parentNode as SVGGElement).style('filter', null);
          handleElementLeave();
        })
        .on('click', (event) => {
          const planetDataWithType = { ...p, isTransit: !isInner };
          handleElementClick(event, planetDataWithType);
        });

      // Planet glyph
      group.append('text')
        .attr('class', 'planet-glyph')
        .attr('x', Math.cos(angleRad) * planetRadius)
        .attr('y', Math.sin(angleRad) * planetRadius)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-family', "'Noto Sans Symbols', 'Arial', sans-serif")
        .attr('font-size', isMobile ? 16 : 28)
        .attr('fill', isInner ? (p.isRetrograde ? '#e53935' : '#333') : (p.isRetrograde ? '#ff8c42' : '#ff9500'))
        .style('pointer-events', 'none'); // Pass events to the hover area
        

      // Add the text after the glyph so it's on top
      group.select('.planet-glyph').text(planetSymbols[p.planet]);

      if (showPlanetLabels && !isMobile) {
        // Position labels differently for natal vs transit
        let labelX: number, labelY: number, rotation: number;
        if (isInner) {
          // Natal labels: inside pointing inward
          labelX = Math.cos(angleRad) * labelRadius;
          labelY = Math.sin(angleRad) * labelRadius;
          rotation = (displayAngle > 90 && displayAngle < 270) ? displayAngle + 90 : displayAngle - 90;
        } else {
          // Transit labels: outside pointing outward (mirror natal)
          const transitOuterRadius = getRadius('zodiacOuterRadius', false);
          const labelRadius = transitOuterRadius + (isMobile ? 20 : 35);
          // Add offset to prevent overlap with planet symbol
          const offsetDistance = isMobile ? 18 : 40;
          labelX = Math.cos(angleRad) * (labelRadius + offsetDistance);
          labelY = Math.sin(angleRad) * (labelRadius + offsetDistance);
          rotation = (displayAngle > 90 && displayAngle < 270) ? displayAngle - 90 : displayAngle + 90;
        }

        group.append('line')
          .attr('class', 'planet-notch')
          .style('pointer-events', 'none')
          .attr('x1', Math.cos(angleRad) * (isInner ? zodiacInnerRadius : getRadius('zodiacOuterRadius', false)))
          .attr('y1', Math.sin(angleRad) * (isInner ? zodiacInnerRadius : getRadius('zodiacOuterRadius', false)))
          .attr('x2', Math.cos(angleRad) * (isInner ? (planetRadius + (isMobile ? 10 : 20)) : (planetRadius - (isMobile ? 8 : 15))))
          .attr('y2', Math.sin(angleRad) * (isInner ? (planetRadius + (isMobile ? 10 : 20)) : (planetRadius - (isMobile ? 8 : 15))))
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
          
                      labelText.append('tspan').style('fill', '#888').text(`${p.degree}°`);
          labelText.append('tspan').style('font-family', "'Noto Sans Symbols', 'Arial', sans-serif").style('fill', zodiacColors[p.sign]).text(zodiacSymbols[p.sign]);
          if (p.isRetrograde) {
            labelText.append('tspan').style('fill', isInner ? '#e53935' : '#ff8c42').text('Rx');
          }
        } else {
          labelGroup.append('text')
            .attr('class', 'planet-label-degree')
            .attr('text-anchor', 'middle')
            .attr('y', -8)
            .style('font-size', '10px')
            .style('font-weight', 'normal')
            .style('fill', '#888')
            .text(p.degree);

          labelGroup.append('text')
            .attr('class', 'planet-label-sign')
            .attr('text-anchor', 'middle')
            .attr('y', 5)
            .style('font-family', "'Noto Sans Symbols', 'Arial', sans-serif")
            .style('font-size', '9px')
            .style('fill', zodiacColors[p.sign])
            .text(zodiacSymbols[p.sign]);

          labelGroup.append('text')
            .attr('class', 'planet-label-minute')
            .attr('text-anchor', 'middle')
            .attr('y', 20)
            .style('font-size', '9px')
            .style('fill', '#aaa')
            .text(p.minute.toString().padStart(2, '0'));
          
          if (p.isRetrograde) {
            labelGroup.append('text')
              .attr('class', 'retrograde-label')
              .attr('x', 0)
              .attr('y', 34)
              .style('font-size', '10px')
              .style('fill', isInner ? '#e53935' : '#ff8c42')
              .text('Rx');
          }
        }
      }
    });
  }

  // Clustering functions
  function findClusters(planets: PlanetData[], clusterThreshold = 4) {
    if (planets.length === 0) return [];
    let sorted = [...planets].sort((a, b) => a.angle - b.angle);
    let clusters: PlanetData[][] = [];
    if (sorted.length > 0) {
      clusters.push([sorted[0]]);
      for (let i = 1; i < sorted.length; i++) {
        if (Math.abs(sorted[i].angle - sorted[i - 1].angle) < clusterThreshold) {
          clusters[clusters.length - 1].push(sorted[i]);
        } else {
          clusters.push([sorted[i]]);
        }
      }
    }
    return clusters;
  }

  function calculateVisualDegrees(planetsToDraw: PlanetData[], allPlanets: PlanetData[], isTransit: boolean) {
    // Reset all visual degrees to their actual angle first
    allPlanets.forEach(p => {
      p.visualDegree = p.angle;
    });

    const clusterSpread = isTransit ? 8 : 4; // Wider spread for transit to prevent label overlap
    let clusters = findClusters(planetsToDraw);

    clusters.forEach(cluster => {
      const clusterSize = cluster.length;
      if (clusterSize > 1) {
        const avgAngle = cluster.reduce((sum, p) => sum + p.angle, 0) / clusterSize;
        const totalArc = (clusterSize - 1) * clusterSpread;
        let startAngle = avgAngle - totalArc / 2;

        cluster.forEach((p: PlanetData, i: number) => {
          const originalPlanet = allPlanets.find(cp => cp.planet === p.planet);
          if (originalPlanet) {
            originalPlanet.visualDegree = startAngle + i * clusterSpread;
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
    
    zoomBehavior = d3.zoom()
      .scaleExtent([0.5, 3]) // Set min/max zoom levels
      .on('zoom', (event) => {
        // Apply the transform to the chart group
        const transform = event.transform;
        currentTransform = transform;
        g.attr('transform', `translate(${chartSize / 2}, ${chartSize / 2}) scale(${transform.k}) translate(${transform.x / transform.k}, ${transform.y / transform.k})`);
        
        // Show reset button if not at initial position (scale not 1 or any translation)
        showResetButton = Math.abs(transform.k - 1) > 0.01 || Math.abs(transform.x) > 0.01 || Math.abs(transform.y) > 0.01;
        
        // Debug logging
        console.log('Zoom transform:', { k: transform.k, x: transform.x, y: transform.y, showReset: showResetButton });
        
        // Force reactivity update
        showResetButton = showResetButton;
      });

    // Apply zoom behavior to the SVG
    svg.call(zoomBehavior as any)
      .on('click', () => hideBriefTooltip());
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
    if (svg && zoomBehavior) {
      const currentTransform = d3.zoomTransform(svg.node() as Element);
      const newScale = Math.min(3, currentTransform.k * 1.2);
      const newTransform = d3.zoomIdentity.scale(newScale).translate(currentTransform.x, currentTransform.y);
      
      svg.transition().duration(300).call(
        zoomBehavior.transform as any,
        newTransform
      );
    }
  }

  export function zoomOut() {
    if (svg && zoomBehavior) {
      const currentTransform = d3.zoomTransform(svg.node() as Element);
      const newScale = Math.max(0.5, currentTransform.k / 1.2);
      const newTransform = d3.zoomIdentity.scale(newScale).translate(currentTransform.x, currentTransform.y);
      
      svg.transition().duration(300).call(
        zoomBehavior.transform as any,
        newTransform
      );
    }
  }

  export function zoomReset() {
    if (svg && zoomBehavior) {
      svg.transition().duration(300).call(
        zoomBehavior.transform as any,
        d3.zoomIdentity
      );
      showResetButton = false;
    }
  }

  export function updateChart(newData: string) {
    // This function is no longer needed as chartData is managed by the store
    // chartData = newData; 
  }

  // --- Glow filter utilities ---
  let globalDefs: d3.Selection<SVGDefsElement, unknown, null, undefined> | null = null;

  function getDefs(g: d3.Selection<any, unknown, null, undefined>) {
    if (!globalDefs) {
      globalDefs = g.select('defs').empty() ? g.append('defs') : g.select('defs');
    }
    return globalDefs;
  }

  function ensureGlowFilterForSign(g: d3.Selection<any, unknown, null, undefined>, sign: string) {
    const defs = getDefs(g);
    const filterId = `glow-${sign}`;
    if (defs.select(`#${filterId}`).empty()) {
      const filter = defs.append('filter')
        .attr('id', filterId)
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
      filter.append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', '3.5')
        .attr('result', 'blur');
      filter.append('feFlood')
        .attr('flood-color', zodiacColors[sign])
        .attr('flood-opacity', '1')
        .attr('result', 'color');
      filter.append('feComposite')
        .attr('in', 'color')
        .attr('in2', 'blur')
        .attr('operator', 'in')
        .attr('result', 'coloredBlur');
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    }
    return `url(#${filterId})`;
  }

  function ensureGlowFilterForAspect(g: d3.Selection<any, unknown, null, undefined>, color: string) {
    const defs = getDefs(g);
    const filterId = `glow-aspect-${color.replace('#', '')}`;
    if (defs.select(`#${filterId}`).empty()) {
      const filter = defs.append('filter')
        .attr('id', filterId)
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
      filter.append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', '3.5')
        .attr('result', 'blur');
      filter.append('feFlood')
        .attr('flood-color', color)
        .attr('flood-opacity', '1')
        .attr('result', 'color');
      filter.append('feComposite')
        .attr('in', 'color')
        .attr('in2', 'blur')
        .attr('operator', 'in')
        .attr('result', 'coloredBlur');
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    }
    return `url(#${filterId})`;
  }
</script>

  <div class="chart-wrapper">
    <div class="chart-container" bind:this={chartContainer}>
      <!-- Chart will be rendered here by D3 -->
    </div>
    
    <!-- Chart controls - positioned outside the chart container -->
    <div class="chart-controls">
      <button 
        class="control-button zoom-in-button"
        on:click={zoomIn}
        title="Zoom in"
      >
        +
      </button>
      <button 
        class="control-button zoom-out-button"
        on:click={zoomOut}
        title="Zoom out"
      >
        −
      </button>
      <button 
        class="control-button reset-button"
        on:click={zoomReset}
        title="Reset zoom and position"
      >
        ↺
      </button>
    </div>
  </div>

  <!-- Chart Element Details Dialog -->
  <ChartElementDialog 
    bind:open={dialogOpen}
    elementData={selectedElementData}
  />

<style>
  .chart-wrapper {
    position: relative;
    width: 100%;
    /* Remove height constraint to allow wrapper to grow with chart */
  }

  .chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 600px;
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fafafa;
    position: relative;
    touch-action: pan-x pan-y pinch-zoom;
    width: 100%;
    max-width: 100%;
  }

  .chart-controls {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 10;
  }

  .control-button {
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #ddd;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 16px;
    font-weight: bold;
    color: #666;
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .control-button:hover {
    background: rgba(255, 255, 255, 1);
    border-color: #999;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .control-button:active {
    transform: scale(0.95);
  }

  .zoom-in-button {
    font-size: 18px;
  }

  .zoom-out-button {
    font-size: 18px;
  }

  .reset-button {
    font-size: 14px;
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

/* Brief tooltip styles */
:global(.brief-chart-tooltip) {
  position: absolute;
  background: #fff;
  color: #000;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 140px;
}

:global(.brief-tooltip-content) {
  text-align: center;
}

:global(.brief-tooltip-main) {
  opacity: 1;
  font-weight: 600;
}

/* --- Tablet responsiveness tweaks --- */
@media (min-width: 768px) and (max-width: 1023px) {
  .chart-container {
    min-height: 500px;
    width: 100%;
    max-width: 100%;
    padding: 12px;
    touch-action: pan-x pan-y pinch-zoom;
    -webkit-overflow-scrolling: touch;
  }

  .chart-controls {
    top: 14px;
    right: 14px;
    gap: 7px;
  }

  .control-button {
    width: 34px;
    height: 34px;
    font-size: 15px;
  }

  .zoom-in-button {
    font-size: 17px;
  }

  .zoom-out-button {
    font-size: 17px;
  }

  .reset-button {
    font-size: 13px;
  }

  /* Tablet-optimized tooltip */
  :global(.chart-tooltip) {
    min-width: 280px;
    max-width: 380px;
  }

  :global(.tooltip-header) {
    padding: 14px 18px 0 18px;
    font-size: 20px;
  }

  :global(.tooltip-body) {
    padding: 9px 18px 16px 18px;
    font-size: 13.5px;
    line-height: 1.6;
  }

  :global(.interpretation-content h3) {
    font-size: 15px;
    margin: 0 0 9px;
  }

  :global(.interpretation-content p) {
    font-size: 13.5px;
    margin: 0 0 9px;
  }
}

/* --- Mobile responsiveness tweaks --- */
@media (max-width: 767px) {
  .chart-container {
    min-height: 360px;
    width: 100%;
    max-width: 100%;
    padding: 8px;
    touch-action: pan-x pan-y pinch-zoom;
    -webkit-overflow-scrolling: touch;
  }

  .chart-controls {
    top: 12px;
    right: 12px;
    gap: 6px;
  }

  .control-button {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .zoom-in-button {
    font-size: 16px;
  }

  .zoom-out-button {
    font-size: 16px;
  }

  .reset-button {
    font-size: 12px;
  }

  /* Smaller tooltip on mobile */
  :global(.chart-tooltip) {
    min-width: 260px;
    max-width: 320px;
  }

  :global(.tooltip-header) {
    padding: 12px 16px 0 16px;
    font-size: 18px;
  }

  :global(.tooltip-body) {
    padding: 8px 16px 14px 16px;
    font-size: 13px;
    line-height: 1.5;
  }

  :global(.interpretation-content h3) {
    font-size: 14px;
    margin: 0 0 8px;
  }

  :global(.interpretation-content p) {
    font-size: 13px;
    margin: 0 0 8px;
  }
}
</style> 