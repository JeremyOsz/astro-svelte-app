import * as d3 from 'd3';
import {
  PLANET_IN_SIGN_INTERPRETATIONS,
  SIGN_IN_HOUSE_INTERPRETATIONS,
  getDetailedAspectInterpretation,
  getEnhancedTransitInterpretation,
  getTransitPlanetInHouseMeaning,
  getTransitPlanetInSignMeaning,
  PLANET_INTERPRETATIONS,
  ASPECT_INTERPRETATIONS,
  HOUSES
} from '../../data/interpretations/index';

let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
let tooltipPinned = false;
let pinnedData: any = null;

export function createTooltip() {
  if (d3.select('.chart-tooltip').empty()) {
    tooltip = d3.select('body')
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('pointer-events', 'none');
  } else {
    tooltip = d3.select('.chart-tooltip');
  }
}

export function handleMouseOver(event: MouseEvent, d: any) {
  if (tooltipPinned) return;

  let interpretationHtml, title;
  if (d.aspect) { // It's an aspect
    const aspectType = d.isTransitAspect ? 'Transit' : 'Natal';
    if (d.isTransitAspect) {
      title = `${aspectType} Aspect: <span style="color: #ff9500;">${d.planet1}</span> ${d.aspect} <span style="color: #333;">${d.planet2}</span>`;
    } else {
      title = `${aspectType} Aspect: ${d.planet1} ${d.aspect} ${d.planet2}`;
    }
    interpretationHtml = getAspectInterpretation(d.aspect, d.planet1, d.planet2, d.orb, d.isTransitAspect);
  } else if (d.planet) { // It's a planet
    const planetType = d.isTransit ? 'Transit' : 'Natal';
    const planetColor = d.isTransit ? '#ff9500' : '#333';
    title = `${planetType} Planet: <span style="color: ${planetColor};">${d.planet}</span> in ${d.sign} (House ${d.house})`;
    interpretationHtml = getPlanetInterpretation(d);
  } else if (d.sign && d.house !== undefined && !d.planet) { // It's a sign (no planet property)
    title = `Sign: ${d.sign} in House ${d.house}`;
    interpretationHtml = getSignInterpretation(d.sign, d.house);
  } else { // Fallback
    title = "Unknown element";
    interpretationHtml = "No interpretation available.";
  }

  showInterpretation(event, interpretationHtml, title);
}

export function handleMouseOut() {
  if (tooltipPinned) return;
  hideInterpretation();
}

export function handleClick(event: MouseEvent, d: any) {
  event.stopPropagation();
  if (tooltipPinned && pinnedData === d) {
    tooltipPinned = false;
    pinnedData = null;
    hideInterpretation();
  } else {
    pinnedData = d;
    handleMouseOver(event, d); // Show tooltip first
    tooltipPinned = true;      // Then pin it so future hovers don't overwrite
  }
}

export { getPlanetInterpretation, getAspectInterpretation, getSignInterpretation };

function getPlanetInterpretation(planetData: any) {
  const { planet, sign, house, degree, minute, isRetrograde, isTransit } = planetData;
  const planetInSign = (PLANET_IN_SIGN_INTERPRETATIONS as any)[planet]?.[sign] || "No interpretation available.";
  const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[sign]?.[house] || "No interpretation available.";
  const planetMeaning = (PLANET_INTERPRETATIONS as any)[planet]?.description || "";

  // Format position
  const position = `${degree}°${minute.toString().padStart(2, '0')}'`;
  const retrogradeText = isRetrograde ? ' (Retrograde)' : '';
  const planetTypeText = isTransit ? 
    `<p><strong>Type:</strong> <span style="color: #ff9500; font-weight: bold;">Transit planet</span> - current position at the time of the transit chart</p>` : 
    `<p><strong>Type:</strong> <span style="color: #333; font-weight: bold;">Natal planet</span> - position at the time of birth</p>`;
  
  let enhancedTransitInfo = '';
  if (isTransit) {
    const houseMeaning = getTransitPlanetInHouseMeaning(planet, house, sign);
    const signMeaning = getTransitPlanetInSignMeaning(planet, sign);
    enhancedTransitInfo = `
      <p><strong>Current Transit Meaning:</strong></p>
      <div style="margin-left: 1rem; margin-bottom: 1rem;">
        <p><strong>House ${house}:</strong> ${houseMeaning}</p>
        <p><strong>${sign}:</strong> ${signMeaning}</p>
      </div>
    `;
  }
  
  return `
    <div class="interpretation-content">
      <h3>${planet} in ${sign} (House ${house})</h3>
      ${planetTypeText}
      <p><strong>Position:</strong> ${position} ${sign}${retrogradeText}</p>
      <p><strong>${planet}:</strong> ${planetMeaning}</p>
      <p><strong>In ${sign}:</strong> ${planetInSign}</p>
      <p><strong>In House ${house}:</strong> ${signInHouse}</p>
      ${enhancedTransitInfo}
    </div>
  `;
}

function getAspectInterpretation(aspect: string, planet1: string, planet2: string, orbValue?: number, isTransitAspect?: boolean) {
  const aspectData = (ASPECT_INTERPRETATIONS as any)[aspect];
  
  let detailedInfo = '';
  if (aspectData) {
    const orbInfo = orbValue !== undefined ? `${orbValue.toFixed(2)}°` : aspectData.orb;
    detailedInfo = `
      <p><strong>Orb:</strong> ${orbInfo}</p>
      <p><strong>Nature:</strong> ${aspectData.nature}</p>
    `;
  }
  
  let interpretationHtml = '';
  const aspectTypeText = isTransitAspect ? 
    `<p><strong>Type:</strong> Transit aspect</p>
     <p><span style="color: #ff9500; font-weight: bold;">${planet1}</span> (transit) ${aspect} <span style="color: #333; font-weight: bold;">${planet2}</span> (natal)</p>` : 
    `<p><strong>Type:</strong> Natal aspect - both planets are from the birth chart</p>`;
  
  // Use enhanced interpretation for transit aspects
  if (isTransitAspect) {
    const enhancedInterpretation = getEnhancedTransitInterpretation(aspect, planet1, planet2);
    interpretationHtml = `<p><strong>Interpretation:</strong></p><div style="margin-left: 1rem;">${enhancedInterpretation.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #059669;">$1</strong>')}</div>`;
  } else {
    // Use regular interpretation for natal aspects
    const interpretation = getDetailedAspectInterpretation(aspect, planet1, planet2);
    const interpretationParts = interpretation.split('\n\n');
    const generalInterpretation = interpretationParts[0] || '';
    const specificInterpretation = interpretationParts[1] || '';
    
    if (generalInterpretation) {
      interpretationHtml += `<p><strong>General:</strong> ${generalInterpretation}</p>`;
    }
    if (specificInterpretation) {
      interpretationHtml += `<p><strong>Specific:</strong> ${specificInterpretation}</p>`;
    }
  }
    
  return `
    <div class="interpretation-content">
      <h3>${planet1} ${aspect} ${planet2}</h3>
      ${aspectTypeText}
      ${detailedInfo}
      ${interpretationHtml}
    </div>
  `;
}

function getSignInterpretation(sign: string, house: number) {
  const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[sign]?.[house] || "No interpretation available.";
  const houseKey = `${house}${house === 1 ? 'st' : house === 2 ? 'nd' : house === 3 ? 'rd' : 'th'}`;
  const houseGeneral = HOUSES[houseKey] || "House information not available.";
  
  return `
    <div class="interpretation-content">
      <h3>${sign} in House ${house}</h3>
      <p><strong>House ${house} represents:</strong> ${houseGeneral}</p>
      <p><strong>${sign} in House ${house}:</strong> ${signInHouse}</p>
    </div>
  `;
}

function showInterpretation(event: MouseEvent, interpretationHtml: string, title: string) {
  if (!tooltip) createTooltip();

  tooltip.html(`<div class="tooltip-header">${title}</div><div class="tooltip-body">${interpretationHtml}</div>`);

  tooltip.transition()
    .duration(200)
    .style('opacity', 1);

  positionTooltip(event);
}

function hideInterpretation() {
  if (tooltip) {
    tooltip.transition().duration(200).style('opacity', 0).on('end', () => {
      tooltip.style('pointer-events', 'none');
    });
  }
}

function positionTooltip(event: MouseEvent) {
  if (!tooltip) return;

  const tooltipNode = tooltip.node() as HTMLElement;
  const { width, height } = tooltipNode.getBoundingClientRect();

  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Get scroll position
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  
  // Calculate initial position (more generous offset)
  let left = event.pageX + 20;
  let top = event.pageY - 20;

  // Check if tooltip would go off the right edge
  if (left + width > viewportWidth + scrollX - 20) {
    left = event.pageX - width - 20;
  }
  
  // Check if tooltip would go off the left edge
  if (left < scrollX + 20) {
    left = scrollX + 20;
  }
  
  // Check if tooltip would go off the bottom edge
  if (top + height > viewportHeight + scrollY - 20) {
    top = event.pageY - height - 20;
  }
  
  // Check if tooltip would go off the top edge
  if (top < scrollY + 20) {
    top = scrollY + 20;
  }

  // Ensure tooltip stays within viewport bounds
  left = Math.max(scrollX + 20, Math.min(left, viewportWidth + scrollX - width - 20));
  top = Math.max(scrollY + 20, Math.min(top, viewportHeight + scrollY - height - 20));

  tooltip.style('left', left + 'px')
         .style('top', top + 'px')
         .style('pointer-events', 'auto');
}

export function unpinTooltip() {
    if (tooltipPinned) {
        tooltipPinned = false;
        pinnedData = null;
        hideInterpretation();
    }
} 