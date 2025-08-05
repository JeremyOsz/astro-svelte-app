<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { writable, derived, get } from 'svelte/store';
  import * as d3 from 'd3';
  import { CHART_LAYOUT } from '../data/chart-styles';
  import ChartElementDialog from '../components/dialogs/ChartElementDialog.svelte';
  import { chartStore } from '../stores/chart-store';
  import { 
    createBriefTooltip, 
    showBriefTooltip, 
    hideBriefTooltip 
  } from '../components/tooltips/brief-tooltip';
  import { debounce } from '../utils/index';

  // Props (removed chartData prop since we'll use the store directly)
  export let showDegreeMarkers: boolean = true;
  export let showExtendedPlanets: boolean = true;
  export let showAspectLines: boolean = true;
  export let showPlanetLabels: boolean = true;
  export let zoomLevel: number = 1;

  // Chart container reference
  let chartContainer: HTMLDivElement;
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  
  // Reset button state
  let showResetButton = false;
  let currentTransform = d3.zoomIdentity;
  let zoomBehavior: d3.ZoomBehavior<Element, unknown> | null = null;

  // Mobile-specific state
  let isMobile = false;
  let isTablet = false;
  let touchStartTime = 0;
  let touchStartPosition = { x: 0, y: 0 };
  let lastTapTime = 0;
  let tapCount = 0;

  // Dialog state
  let dialogOpen = false;
  let selectedElementData: any = null;
  
  // Debug dialog state changes
  $: if (dialogOpen) {
    // Removed console.log for performance
  }

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
    isTransitAspect?: boolean;
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
    const { isMobile, isTablet } = $chartState;
    
    // Get container width for responsive sizing
    const containerWidth = chartContainer?.clientWidth || layout.chartSize;
    const containerHeight = chartContainer?.clientHeight || layout.chartSize;
    
    // Use the smaller dimension to maintain aspect ratio, but allow it to grow
    const responsiveSize = Math.min(containerWidth, containerHeight, layout.chartSize);
    
    // Scale all radii proportionally based on the responsive size
    const scaleFactor = responsiveSize / layout.chartSize;
    
    const dimensions = {
      chartSize: responsiveSize,
      containerWidth,
      containerHeight,
      scaleFactor,
      zodiacOuterRadius: layout.zodiacOuterRadius * scaleFactor,
      zodiacInnerRadius: layout.zodiacInnerRadius * scaleFactor,
      planetRingRadius: layout.planetRingRadius * scaleFactor,
      labelRadius: layout.labelRadius * scaleFactor,
      houseLineInnerRadius: layout.houseLineInnerRadius * scaleFactor,
      houseNumRadius: layout.houseNumRadius * scaleFactor,
      aspectHubRadius: layout.aspectHubRadius * scaleFactor
    };
    return dimensions;
  });

  // Update CSS custom property when chart dimensions change (debounced)
  let dimensionUpdateTimeout: NodeJS.Timeout;
  $: if (chartContainer && $chartDimensions) {
    if (dimensionUpdateTimeout) {
      clearTimeout(dimensionUpdateTimeout);
    }
    dimensionUpdateTimeout = setTimeout(() => {
      chartContainer.style.setProperty('--chart-size', `${$chartDimensions.chartSize}px`);
    }, 50);
  }

  // Resize observer for responsive chart
  let resizeObserver: ResizeObserver | null = null;

  // Import centralized symbols and colors
  import { 
    ZODIAC_SIGNS,
    ZODIAC_SYMBOLS,
    ZODIAC_COLORS,
    PLANET_SYMBOLS,
    EXTENDED_PLANET_NAMES,
    ASPECT_DEFINITIONS,
    CORE_ASPECT_BODIES,
    getAspectColorByChartType
  } from '../data/symbols';

  // Chart constants - use centralized data
  const zodiacSigns = ZODIAC_SIGNS;
  const zodiacSymbols = ZODIAC_SYMBOLS;
  const zodiacColors = ZODIAC_COLORS;
  const planetSymbols = PLANET_SYMBOLS;
  const extendedPlanetNames = EXTENDED_PLANET_NAMES;
  const aspectDefs = ASPECT_DEFINITIONS;
  const coreAspectBodies = CORE_ASPECT_BODIES;

  // Lifecycle
  onMount(() => {
    detectDeviceType();
    createBriefTooltip();
    
    // Set up resize observer for responsive chart with debouncing
    if (chartContainer) {
      const debouncedCreateChart = debounce(() => {
        if (currentChartData) {
          createChart();
        }
      }, 250); // 250ms debounce for resize events
      
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Force chart recreation when container size changes (debounced)
          debouncedCreateChart();
        }
      });
      resizeObserver.observe(chartContainer);
    }
    
    // Debounce chart updates to prevent excessive re-renders
    let updateTimeout: NodeJS.Timeout;
    
    // Manual subscription to chart store
    chartStoreUnsubscribe = chartStore.subscribe((state) => {
      const { chartData, error, isLoading, version } = state;
      
      // Clear any pending update
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      
      // Only process if we have new data and container is ready
      if (chartData && version > currentVersion && chartContainer) {
        // Debounce chart updates to prevent excessive re-renders
        updateTimeout = setTimeout(() => {
          currentChartData = chartData;
          currentVersion = version;
          
          if (chartData.trim()) {
            parseChartData(chartData);
          } else {
            // Clear the chart if no data
            d3.select(chartContainer).html('');
          }
        }, 100); // 100ms debounce
      }
    });
  });

  // Debug chart container binding (optimized to prevent unnecessary re-observing)
  let lastContainer: HTMLDivElement | null = null;
  $: if (chartContainer && chartContainer !== lastContainer) {
    lastContainer = chartContainer;
    // Re-observe if container changes
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver.observe(chartContainer);
    }
  }

  // Cleanup subscription
  onDestroy(() => {
    if (chartStoreUnsubscribe) {
      chartStoreUnsubscribe();
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    // Clear any pending timeouts
    if (dimensionUpdateTimeout) {
      clearTimeout(dimensionUpdateTimeout);
    }
    if (settingsUpdateTimeout) {
      clearTimeout(settingsUpdateTimeout);
    }
  });

  // Optimized settings update with debouncing to prevent excessive chart recreations
  let settingsUpdateTimeout: NodeJS.Timeout;
  let lastSettings = {
    showDegreeMarkers,
    showExtendedPlanets,
    showAspectLines,
    showPlanetLabels
  };
  
  $: {
    const currentSettings = {
      showDegreeMarkers,
      showExtendedPlanets,
      showAspectLines,
      showPlanetLabels
    };
    
    // Only update if settings actually changed
    if (JSON.stringify(currentSettings) !== JSON.stringify(lastSettings)) {
      lastSettings = currentSettings;
      
      if (settingsUpdateTimeout) {
        clearTimeout(settingsUpdateTimeout);
      }
      
      settingsUpdateTimeout = setTimeout(() => {
        chartSettings.update(settings => ({
          ...settings,
          ...currentSettings
        }));
        
        // Only recreate chart if we have data and container
        if (currentChartData && chartContainer) {
          createChart();
        }
      }, 100); // 100ms debounce for settings changes
    }
  }

  // NOTE: The zoomLevel prop is removed to allow d3.zoom to manage its own state, preventing conflicts.
  // The user can now pan and zoom using mouse/touch gestures handled by D3.

  // Functions
  function detectDeviceType() {
    const width = window.innerWidth;
    isMobile = width < 768;
    isTablet = width >= 768 && width < 1024;
    const layout = isMobile ? CHART_LAYOUT.MOBILE : isTablet ? CHART_LAYOUT.TABLET : CHART_LAYOUT.DESKTOP;
    
    chartState.update(state => ({
      ...state,
      isMobile,
      isTablet,
      layout
    } as any));
  }

  // Mobile touch handling
  function handleTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      touchStartTime = Date.now();
      touchStartPosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    }
  }

  function handleTouchEnd(event: TouchEvent) {
    if (event.touches.length === 0) {
      const touchDuration = Date.now() - touchStartTime;
      const touchDistance = Math.sqrt(
        Math.pow(event.changedTouches[0].clientX - touchStartPosition.x, 2) +
        Math.pow(event.changedTouches[0].clientY - touchStartPosition.y, 2)
      );

      // Single tap detection (less than 300ms and small movement)
      if (touchDuration < 300 && touchDistance < 10) {
        const currentTime = Date.now();
        if (currentTime - lastTapTime < 300) {
          tapCount++;
          if (tapCount === 2) {
            // Double tap - reset zoom
            resetZoom();
            tapCount = 0;
          }
        } else {
          tapCount = 1;
        }
        lastTapTime = currentTime;
      }
    }
  }

  function resetZoom() {
    if (svg && zoomBehavior) {
      svg.transition().duration(300).call(
        zoomBehavior.transform as any,
        d3.zoomIdentity
      );
      showResetButton = false;
    }
  }

  function parseChartData(data: string) {
    const trimmedData = data?.trim();
    if (!trimmedData) {
      return;
    }

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
      if (!degreeMatch || !zodiacSigns.includes(sign as typeof zodiacSigns[number])) {
        return;
      }
      
      const degree = parseInt(degreeMatch[1]);
      const minute = parseInt(degreeMatch[2]);
      const signIndex = zodiacSigns.indexOf(sign as typeof zodiacSigns[number]);
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
      }

      parsedData.push(planetData);
    });

    // Debug specific planet positions
    const sun = parsedData.find(p => p.planet === 'Sun');
    const moon = parsedData.find(p => p.planet === 'Moon');
    const asc = parsedData.find(p => p.planet === 'ASC');
    if (!asc) {
      return;
    }

    // If we don't have API house cusps, calculate them using whole sign system
    if (!hasApiHouseCusps) {
      const ascSignIndex = zodiacSigns.indexOf(asc.sign as typeof zodiacSigns[number]);
      for (let i = 0; i < 12; i++) {
        const signIndex = (ascSignIndex + i) % 12;
        const angle = signIndex * 30; // 0, 30, 60, ...
        houseCusps.push({ house: i + 1, angle });
      }
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
      }
    });

    // Calculate visual degrees for clustering
    let planetsToDraw = parsedData.filter(p => planetSymbols[p.planet] && !['ASC', 'MC', 'DSC', 'IC'].includes(p.planet));
    if (!get(chartSettings).showExtendedPlanets) {
      planetsToDraw = planetsToDraw.filter(p => !extendedPlanetNames.includes(p.planet));
    }
    calculateVisualDegrees(planetsToDraw, parsedData); // Use simple clustering with larger chart

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
            const aspect = {
              planet1: planet1.planet,
              planet2: planet2.planet,
              aspect: aspectName,
              orb: Math.abs(minAngle - aspectDef.angle),
              color: aspectDef.color,
              weight: aspectDef.weight,
              style: aspectDef.style,
              isTransitAspect: false // This is a natal chart
            };
            aspects.push(aspect);
          }
        }
      }
    }
    
    return aspects;
  }

  function createChart() {
    if (!chartContainer) {
      return;
    }
    const { showAspectLines, showPlanetLabels } = get(chartSettings);
    const { data, houseCusps, aspects } = get(chartState);

    const asc = data.find((p: PlanetData) => p.planet === 'ASC');
    if (!asc) {
      return;
    }
    const ascAngle = asc.angle;

    const container = d3.select(chartContainer);
    container.html(''); // Clear previous chart

    const { chartSize } = get(chartDimensions);

    const { containerWidth, containerHeight } = get(chartDimensions);
    
    svg = container.append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${chartSize} ${chartSize}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('cursor', 'grab');

    const g = svg.append('g')
      .attr('class', 'chart-group')
      .attr('transform', `translate(${chartSize / 2}, ${chartSize / 2})`);

    // Use the 1st house cusp angle from the API (or calculated whole sign)
    const house1CuspAngle = houseCusps[0].angle;
    
    // Draw chart elements
    drawZodiacWheel(g, house1CuspAngle);
    drawHouseLinesAndNumbers(g, house1CuspAngle);
    if (showAspectLines) {
      drawAspects(g, house1CuspAngle);
    }
    drawPlanets(g, house1CuspAngle);
    
    setupZoom(); // Re-setup zoom for the new SVG
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

    // Get the Ascendant to determine the starting sign
    const { data } = get(chartState);
    const asc = data.find((p: PlanetData) => p.planet === 'ASC');
    if (!asc) {
      return;
    }
    
    // Calculate the offset to make the Ascendant's sign start at the top (0°)
    const ascSignIndex = zodiacSigns.indexOf(asc.sign as typeof zodiacSigns[number]);
    const ascSignStartAngle = ascSignIndex * 30; // 0° of the Ascendant's sign
    const zodiacOffset = ascSignStartAngle - house1CuspAngle;

    // Zodiac sign segments and symbols
    zodiacSigns.forEach((sign, index) => {
      // Calculate the visual position of each sign relative to the Ascendant's sign
      const signAngle = (index * 30 + 15) % 360; // Midpoint of the sign
      const adjustedSignAngle = signAngle - zodiacOffset;
      const displayAngle = (180 - adjustedSignAngle) * Math.PI / 180;
      
      const symbolRadius = zodiacInnerRadius + (isMobile ? 13 : 25);
      const x = Math.cos(displayAngle) * symbolRadius;
      const y = Math.sin(displayAngle) * symbolRadius;

      // Calculate which house this sign is in
      const { houseCusps } = get(chartState);
      let houseNumber = 0;
      
      // For Whole Sign system, the house is determined by the sign's position relative to the Ascendant's sign
      const ascSignIndex = zodiacSigns.indexOf(asc.sign as typeof zodiacSigns[number]);
      const signIndex = zodiacSigns.indexOf(sign);
      const houseOffset = (signIndex - ascSignIndex + 12) % 12;
      houseNumber = houseOffset + 1;

      // Create sign data object for tooltip
      const signData = {
        sign: sign,
        house: houseNumber,
        angle: signAngle,
        isTransit: false // This is a natal chart
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
        .on('mouseover', function(this: SVGCircleElement, event: MouseEvent) {
          const filterUrl = ensureGlowFilterForSign(g, sign);
          d3.select(this.parentNode as SVGGElement).style('filter', filterUrl);
          showBriefTooltip(event, signData);
        })
        .on('mouseout', function(this: SVGCircleElement) {
          d3.select(this.parentNode as SVGGElement).style('filter', null);
          hideBriefTooltip();
        })
        .on('click', () => {
          selectedElementData = signData;
          dialogOpen = true;
          hideBriefTooltip();
        });

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

      const x1 = Math.cos(displayAngle) * (zodiacInnerRadius);
      const y1 = Math.sin(displayAngle) * (zodiacInnerRadius);
      const x2 = Math.cos(displayAngle) * (zodiacInnerRadius + tickLength);
      const y2 = Math.sin(displayAngle) * (zodiacInnerRadius + tickLength);
      
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

    // Get the Ascendant to calculate the zodiac offset (same as in drawZodiacWheel)
    const asc = data.find((p: PlanetData) => p.planet === 'ASC');
    if (!asc) {
      return;
    }
    
    const ascSignIndex = zodiacSigns.indexOf(asc.sign as typeof zodiacSigns[number]);
    const ascSignStartAngle = ascSignIndex * 30;
    const zodiacOffset = ascSignStartAngle - house1CuspAngle;

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
      
      const axisGroup = g.append('g').attr('class', 'axis-group');
      
      // Invisible hover area
      axisGroup.append('circle')
        .attr('cx', Math.cos(angle) * (zodiacInnerRadius - 10) + xOffset)
        .attr('cy', Math.sin(angle) * (zodiacInnerRadius - 10))
        .attr('r', isMobile ? 12 : 16)
        .attr('fill', 'transparent')
        .style('cursor', 'pointer')
        .on('mouseover', function(this: SVGCircleElement, event: MouseEvent) {
          const filterUrl = ensureGlowFilterForSign(g, point.sign);
          d3.select(this.parentNode as SVGGElement).style('filter', filterUrl);
          showBriefTooltip(event, point);
        })
        .on('mouseout', function(this: SVGCircleElement) {
          d3.select(this.parentNode as SVGGElement).style('filter', null);
          hideBriefTooltip();
        })
        .on('click', () => {
          selectedElementData = point;
          dialogOpen = true;
          hideBriefTooltip();
        });
      
      // Axis label text
      axisGroup.append('text')
        .attr('x', Math.cos(angle) * (zodiacInnerRadius - 10) + xOffset)
        .attr('y', Math.sin(angle) * (zodiacInnerRadius - 10))
        .attr('text-anchor', textAnchor)
        .attr('dominant-baseline', 'middle')
        .attr('font-size', isMobile ? 10 : 14)
        .attr('font-weight', 'bold')
        .attr('fill', '#555')
        .style('pointer-events', 'none')
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

  function drawAspects(g: d3.Selection<SVGGElement, unknown, null, undefined>, house1CuspAngle: number) {
    const { aspects, data, isMobile } = get(chartState);
    const { aspectHubRadius } = get(chartDimensions);

    // Get the Ascendant to calculate the zodiac offset (same as in drawZodiacWheel)
    const asc = data.find((p: PlanetData) => p.planet === 'ASC');
    if (!asc) {
      return;
    }
    
    const ascSignIndex = zodiacSigns.indexOf(asc.sign as typeof zodiacSigns[number]);
    const ascSignStartAngle = ascSignIndex * 30;
    const zodiacOffset = ascSignStartAngle - house1CuspAngle;

    g.append('circle')
      .attr('r', aspectHubRadius)
      .attr('fill', 'none')
      .attr('stroke', '#eee');

    aspects.forEach((aspect: Aspect) => {
      const planet1 = data.find((p: PlanetData) => p.planet === aspect.planet1);
      const planet2 = data.find((p: PlanetData) => p.planet === aspect.planet2);
      if (!planet1 || !planet2) return;

      const adjustedAngle1 = planet1.visualDegree - zodiacOffset;
      const adjustedAngle2 = planet2.visualDegree - zodiacOffset;
      const angle1 = (180 - adjustedAngle1) * Math.PI / 180;
      const angle2 = (180 - adjustedAngle2) * Math.PI / 180;
      
      const aspectGroup = g.append('g').attr('class', 'aspect-group');

      // Visible line for display
      aspectGroup.append('line')
        .attr('x1', Math.cos(angle1) * aspectHubRadius)
        .attr('y1', Math.sin(angle1) * aspectHubRadius)
        .attr('x2', Math.cos(angle2) * aspectHubRadius)
        .attr('y2', Math.sin(angle2) * aspectHubRadius)
        .attr('stroke', getAspectColorByChartType(aspect.aspect, 'natal'))
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
        .on('mouseover', function(this: SVGLineElement, event: MouseEvent) {
          const filterUrl = ensureGlowFilterForAspect(g, getAspectColorByChartType(aspect.aspect, 'natal'));
          d3.select(this.parentNode as SVGGElement).style('filter', filterUrl);
          showBriefTooltip(event, aspect);
        })
        .on('mouseout', function(this: SVGLineElement) {
          d3.select(this.parentNode as SVGGElement).style('filter', null);
          hideBriefTooltip();
        })
        .on('click', () => {
          selectedElementData = aspect;
          dialogOpen = true;
          hideBriefTooltip();
        });
    });
  }

  function drawPlanets(g: d3.Selection<SVGGElement, unknown, null, undefined>, house1CuspAngle: number) {
    const { data, isMobile } = get(chartState);
    const { showExtendedPlanets, showPlanetLabels } = get(chartSettings);
    const { planetRingRadius, zodiacInnerRadius, labelRadius } = get(chartDimensions);

    // Get the Ascendant to calculate the zodiac offset (same as in drawZodiacWheel)
    const asc = data.find((p: PlanetData) => p.planet === 'ASC');
    if (!asc) {
      return;
    }
    
    const ascSignIndex = zodiacSigns.indexOf(asc.sign as typeof zodiacSigns[number]);
    const ascSignStartAngle = ascSignIndex * 30;
    const zodiacOffset = ascSignStartAngle - house1CuspAngle;

    // Define a glow filter for each sign color (if not already present)
    const defs = getDefs(g);

    let planetsToDraw = data.filter((p: PlanetData) => planetSymbols[p.planet] && !['ASC', 'MC', 'DSC', 'IC'].includes(p.planet));
    if (!showExtendedPlanets) {
      planetsToDraw = planetsToDraw.filter((p: PlanetData) => !extendedPlanetNames.includes(p.planet));
    }

    // Simple approach: create planet groups directly without D3 data binding
    planetsToDraw.forEach((p: PlanetData) => {
      const adjustedAngle = p.visualDegree - zodiacOffset;
      const displayAngle = (180 - adjustedAngle);
      const angleRad = displayAngle * Math.PI / 180;
      const x = Math.cos(angleRad) * planetRingRadius;
      const y = Math.sin(angleRad) * planetRingRadius;
      
      const group = g.append('g')
        .attr('class', 'planet-group')
        .attr('data-planet', p.planet)
        .attr('transform', `translate(${x}, ${y})`);

      // Calculate optimal hover radius based on clustering
      const hoverRadius = calculateOptimalHoverRadius(p, planetsToDraw, isMobile);
      const clusterInfo = getPlanetClusterInfo(planetsToDraw, p);

      // Transparent circle for larger hover area
      group.append('circle')
        .attr('class', 'planet-hover-area')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', hoverRadius)
        .attr('fill', 'transparent')
        .style('cursor', 'pointer')
        .on('mouseover', function(this: SVGCircleElement, event: MouseEvent) {
          const filterUrl = ensureGlowFilterForSign(g, p.sign);
          d3.select(this.parentNode as SVGGElement).style('filter', filterUrl);
          
          // Add visual indicator for clustered planets
          if (clusterInfo.isInCluster) {
            d3.select(this).style('stroke', '#ff6b6b').style('stroke-width', '2').style('stroke-dasharray', '3,3');
          }
          
          // Enhance tooltip data for clustered planets
          const enhancedPlanetData = {
            ...p,
            isInCluster: clusterInfo.isInCluster,
            clusterSize: clusterInfo.clusterSize
          };
          
          showBriefTooltip(event, enhancedPlanetData);
        })
        .on('mouseout', function(this: SVGCircleElement) {
          d3.select(this.parentNode as SVGGElement).style('filter', null);
          d3.select(this).style('stroke', null).style('stroke-width', null).style('stroke-dasharray', null);
          hideBriefTooltip();
        })
        .on('click', () => {
          selectedElementData = p;
          dialogOpen = true;
          hideBriefTooltip();
        });

      // Planet glyph
      group.append('text')
        .attr('class', 'planet-glyph')
        .attr('x', 0)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-family', "'Noto Sans Symbols', 'Arial', sans-serif")
        .attr('font-size', isMobile ? 16 : 28)
        .attr('fill', p.isRetrograde ? '#e53935' : '#333')
        .style('pointer-events', 'none'); // Pass events to the hover area
      
      // Add subtle visual indicator for clustered planets
      if (clusterInfo.isInCluster) {
        group.select('.planet-glyph').style('filter', 'drop-shadow(0 0 2px rgba(255, 107, 107, 0.3))');
        
        // Add a subtle background circle for clustered planets to make them more visible
        group.insert('circle', '.planet-hover-area')
          .attr('class', 'cluster-indicator')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', hoverRadius * 0.8)
          .attr('fill', 'rgba(255, 107, 107, 0.05)')
          .attr('stroke', 'rgba(255, 107, 107, 0.2)')
          .attr('stroke-width', 0.5)
          .style('pointer-events', 'none');
      }
        

      // Add the text after the glyph so it's on top
      group.select('.planet-glyph').text(planetSymbols[p.planet]);

      if (showPlanetLabels && !isMobile) {
        const labelX = Math.cos(angleRad) * labelRadius;
        const labelY = Math.sin(angleRad) * labelRadius;
        const rotation = (displayAngle > 90 && displayAngle < 270) ? displayAngle + 90 : displayAngle - 90;

        // Removed planet notch lines - they were causing positioning issues

        const labelGroup = group.append('g')
          .attr('class', 'planet-label-group')
          .attr('transform', `translate(${labelX - x}, ${labelY - y}) rotate(${rotation})`);
        
        if (isMobile) {
          const labelText = labelGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', 4)
            .attr('font-size', 9);
          
          labelText.append('tspan').text(`${p.degree}°`);
          labelText.append('tspan')
            .style('font-family', "'Noto Sans Symbols'")
            .style('font-variant-emoji', 'none')
            .style('-webkit-font-variant-emoji', 'none')
            .style('font-feature-settings', '"emoji" 0')
            .style('-webkit-font-feature-settings', '"emoji" 0')
            .style('fill', zodiacColors[p.sign])
            .text(zodiacSymbols[p.sign]);
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
            .style('font-family', "'Noto Sans Symbols'")
            .style('font-variant-emoji', 'none')
            .style('-webkit-font-variant-emoji', 'none')
            .style('font-feature-settings', '"emoji" 0')
            .style('-webkit-font-feature-settings', '"emoji" 0')
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

  function calculateVisualDegrees(planetsToDraw: PlanetData[], allPlanets: PlanetData[]) {
    // Reset all visual degrees to their actual angle first
    allPlanets.forEach(p => {
      p.visualDegree = p.angle;
    });

    const clusterSpread = 6; // Increased from 5 to 6 degrees for better separation with larger chart
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



  // Enhanced clustering detection for hover areas
  function getPlanetClusterInfo(planets: PlanetData[], targetPlanet: PlanetData, clusterThreshold = 5) {
    const nearbyPlanets = planets.filter(p => 
      p.planet !== targetPlanet.planet && 
      Math.abs(p.visualDegree - targetPlanet.visualDegree) < clusterThreshold
    );
    
    return {
      isInCluster: nearbyPlanets.length > 0,
      clusterSize: nearbyPlanets.length + 1,
      nearbyPlanets
    };
  }

  function calculateOptimalHoverRadius(planet: PlanetData, allPlanets: PlanetData[], isMobile: boolean) {
    const clusterInfo = getPlanetClusterInfo(allPlanets, planet);
    const baseRadius = isMobile ? 14 : 24; // Increased from 12/20 to 14/24 for better selection
    
    if (clusterInfo.isInCluster) {
      // Reduce hover radius for clustered planets to prevent overlap
      const reductionFactor = Math.max(0.4, 1 - (clusterInfo.clusterSize * 0.15));
      return Math.max(8, baseRadius * reductionFactor); // Increased minimum from 6 to 8
    }
    
    return baseRadius;
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
        
        // Show reset button if not at initial position (scale not 0.8 or any translation)
        showResetButton = Math.abs(transform.k - 0.8) > 0.01 || Math.abs(transform.x) > 0.01 || Math.abs(transform.y) > 0.01;
        

        
        // Debug logging
        
        // Force reactivity update
        showResetButton = showResetButton;
      });

    // Apply zoom behavior to the SVG and set initial zoom to 0.8 (slightly zoomed out)
    svg.call(zoomBehavior as any);
    svg.call(zoomBehavior.transform as any, d3.zoomIdentity.scale(0.8));
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
        d3.zoomIdentity.scale(0.8) // Reset to default zoom level (slightly zoomed out)
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

  <div class="relative w-full">
    <div 
      class="chart-container flex justify-center items-center border border-gray-200 rounded bg-gray-50 overflow-hidden relative touch-pan-x touch-pan-y w-full h-full"
      style="aspect-ratio: 1; min-height: 450px; max-height: 1000px;"
      bind:this={chartContainer}
      on:touchstart={handleTouchStart}
      on:touchend={handleTouchEnd}
    >
      <!-- Chart will be rendered here by D3 -->
    </div>
    
    <!-- Chart controls - positioned outside the chart container -->
    <div class="absolute top-4 right-4 flex flex-col gap-2 z-10">
      <button 
        class="w-9 h-9 bg-white/95 border border-gray-300 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 text-base font-bold text-gray-600 backdrop-blur-sm shadow-md hover:bg-white hover:border-gray-400 hover:scale-105 hover:shadow-lg active:scale-95"
        on:click={zoomIn}
        title="Zoom in"
      >
        +
      </button>
      <button 
        class="w-9 h-9 bg-white/95 border border-gray-300 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 text-base font-bold text-gray-600 backdrop-blur-sm shadow-md hover:bg-white hover:border-gray-400 hover:scale-105 hover:shadow-lg active:scale-95"
        on:click={zoomOut}
        title="Zoom out"
      >
        −
      </button>
      <button 
        class="w-9 h-9 bg-white/95 border border-gray-300 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 text-sm font-bold text-gray-600 backdrop-blur-sm shadow-md hover:bg-white hover:border-gray-400 hover:scale-105 hover:shadow-lg active:scale-95"
        on:click={zoomReset}
        title="Reset zoom and position"
      >
        ↺
      </button>
    </div>
  </div>

  <!-- Chart Element Dialog -->
  <ChartElementDialog bind:open={dialogOpen} elementData={selectedElementData} chartType="natal" />

<style>
  :global(.chart-svg) {
    max-width: 100%;
    height: auto;
  }

  /* Ensure the chart container can grow to full width */
  .chart-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Brief tooltip styles */
  :global(.brief-chart-tooltip) {
    background: rgba(255, 255, 255, 0.8);
    color: black;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    pointer-events: none;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    max-width: 200px;
    white-space: nowrap;
  }

  :global(.brief-tooltip-content) {
    color: black;
  }

  :global(.brief-tooltip-main) {
    color: black;
    font-weight: 500;
  }
</style> 