import * as d3 from 'd3';
import {
  PLANET_IN_SIGN_INTERPRETATIONS,
  SIGN_IN_HOUSE_INTERPRETATIONS,
  getEnhancedTransitInterpretation,
  getTransitPlanetInHouseMeaning,
  getTransitPlanetInSignMeaning,
  PLANET_INTERPRETATIONS,
  ASPECT_INTERPRETATIONS,
  HOUSES
} from '../../data/interpretations';

let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
let tooltipPinned = false;
let pinnedData: any = null;

export function createTransitTooltip() {
  if (d3.select('.transit-chart-tooltip').empty()) {
    tooltip = d3.select('body')
      .append('div')
      .attr('class', 'transit-chart-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('pointer-events', 'none');
  } else {
    tooltip = d3.select('.transit-chart-tooltip');
  }
}

export function handleTransitMouseOver(event: MouseEvent, d: any) {
  if (tooltipPinned) return;

  let interpretationHtml, title;
  if (d.aspect) { // It's an aspect
    if (d.isTransitAspect) {
      title = `Transit Aspect: <span style="color: #ff9500;">${d.planet1}</span> ${d.aspect} <span style="color: #333;">${d.planet2}</span>`;
      interpretationHtml = getTransitAspectInterpretation(d.aspect, d.planet1, d.planet2, d.orb);
    } else {
      title = `Natal Aspect: ${d.planet1} ${d.aspect} ${d.planet2}`;
      interpretationHtml = getNatalAspectInterpretation(d.aspect, d.planet1, d.planet2, d.orb);
    }
  } else if (d.planet) { // It's a planet
    if (d.isTransit) {
      title = `Transit Planet: <span style="color: #ff9500;">${d.planet}</span> in ${d.sign} (House ${d.house})`;
      interpretationHtml = getTransitPlanetInterpretation(d);
    } else {
      title = `Natal Planet: <span style="color: #333;">${d.planet}</span> in ${d.sign} (House ${d.house})`;
      interpretationHtml = getNatalPlanetInterpretation(d);
    }
  } else if (d.sign && d.house !== undefined && !d.planet) { // It's a sign
    title = `Sign: ${d.sign} in House ${d.house}`;
    interpretationHtml = getSignInterpretation(d.sign, d.house);
  } else { // Fallback
    title = "Unknown element";
    interpretationHtml = "No interpretation available.";
  }

  showTransitInterpretation(event, interpretationHtml, title);
}

export function handleTransitMouseOut() {
  if (tooltipPinned) return;
  hideTransitInterpretation();
}

export function handleTransitClick(event: MouseEvent, d: any) {
  event.stopPropagation();
  if (tooltipPinned && pinnedData === d) {
    tooltipPinned = false;
    pinnedData = null;
    hideTransitInterpretation();
  } else {
    pinnedData = d;
    handleTransitMouseOver(event, d);
    tooltipPinned = true;
  }
}

function getTransitPlanetInterpretation(planetData: any) {
  const { planet, sign, house, degree, minute, isRetrograde } = planetData;
  const planetInSign = (PLANET_IN_SIGN_INTERPRETATIONS as any)[planet]?.[sign] || "No interpretation available.";
  const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[sign]?.[house] || "No interpretation available.";
  const planetMeaning = (PLANET_INTERPRETATIONS as any)[planet]?.description || "";

  // Format position
  const position = `${degree}°${minute.toString().padStart(2, '0')}'`;
  const retrogradeText = isRetrograde ? ' (Retrograde)' : '';
  const planetTypeText = `<p><strong>Type:</strong> <span style="color: #ff9500; font-weight: bold;">Transit planet</span> - current position at the time of the transit chart</p>`;
  
  // Enhanced transit meanings
      const houseMeaning = getTransitPlanetInHouseMeaning(planet, house, sign);
  const signMeaning = getTransitPlanetInSignMeaning(planet, sign);
  const enhancedTransitInfo = `
    <p><strong>Current Transit Meaning:</strong></p>
    <div style="margin-left: 1rem; margin-bottom: 1rem;">
      <p><strong>House ${house}:</strong> ${houseMeaning}</p>
      <p><strong>${sign}:</strong> ${signMeaning}</p>
    </div>
  `;
  
  return `
    <div class="interpretation-content">
      <h3>${planet} in ${sign} (House ${house})</h3>
      ${planetTypeText}
      <p><strong>Position:</strong> ${position} ${sign}${retrogradeText}</p>
      <p><strong>${planet}:</strong> ${planetMeaning}</p>
      <p><strong>In ${sign}:</strong> ${planetInSign}</p>
      ${enhancedTransitInfo}
    </div>
  `;
}

function getNatalPlanetInterpretation(planetData: any) {
  const { planet, sign, house, degree, minute, isRetrograde } = planetData;
  const planetInSign = (PLANET_IN_SIGN_INTERPRETATIONS as any)[planet]?.[sign] || "No interpretation available.";
  const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[sign]?.[house] || "No interpretation available.";
  const planetMeaning = (PLANET_INTERPRETATIONS as any)[planet]?.description || "";

  // Format position
  const position = `${degree}°${minute.toString().padStart(2, '0')}'`;
  const retrogradeText = isRetrograde ? ' (Retrograde)' : '';
  const planetTypeText = `<p><strong>Type:</strong> <span style="color: #333; font-weight: bold;">Natal planet</span> - position at the time of birth</p>`;
  
  return `
    <div class="interpretation-content">
      <h3>${planet} in ${sign} (House ${house})</h3>
      ${planetTypeText}
      <p><strong>Position:</strong> ${position} ${sign}${retrogradeText}</p>
      <p><strong>${planet}:</strong> ${planetMeaning}</p>
      <p><strong>In ${sign}:</strong> ${planetInSign}</p>
      <p><strong>In House ${house}:</strong> ${signInHouse}</p>
    </div>
  `;
}

function getTransitAspectInterpretation(aspect: string, planet1: string, planet2: string, orbValue?: number) {
  const aspectData = (ASPECT_INTERPRETATIONS as any)[aspect];
  
  let detailedInfo = '';
  if (aspectData) {
    const orbInfo = orbValue !== undefined ? `${orbValue.toFixed(2)}°` : aspectData.orb;
    detailedInfo = `
      <p><strong>Orb:</strong> ${orbInfo}</p>
      <p><strong>Nature:</strong> ${aspectData.nature}</p>
    `;
  }
  
  // Use enhanced interpretation for transit aspects
  const enhancedInterpretation = getEnhancedTransitInterpretation(aspect, planet1, planet2);
  const interpretationHtml = `<p><strong>Interpretation:</strong></p><div style="margin-left: 1rem;">${enhancedInterpretation.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #059669;">$1</strong>')}</div>`;
  
  const aspectTypeText = `<p><strong>Type:</strong> Transit aspect</p>
     <p><span style="color: #ff9500; font-weight: bold;">${planet1}</span> (transit) ${aspect} <span style="color: #333; font-weight: bold;">${planet2}</span> (natal)</p>`;
    
  return `
    <div class="interpretation-content">
      <h3>${planet1} ${aspect} ${planet2}</h3>
      ${aspectTypeText}
      ${detailedInfo}
      ${interpretationHtml}
    </div>
  `;
}

function getNatalAspectInterpretation(aspect: string, planet1: string, planet2: string, orbValue?: number) {
  const aspectData = (ASPECT_INTERPRETATIONS as any)[aspect];
  
  let detailedInfo = '';
  if (aspectData) {
    const orbInfo = orbValue !== undefined ? `${orbValue.toFixed(2)}°` : aspectData.orb;
    detailedInfo = `
      <p><strong>Orb:</strong> ${orbInfo}</p>
      <p><strong>Nature:</strong> ${aspectData.nature}</p>
    `;
  }
  
  const aspectTypeText = `<p><strong>Type:</strong> Natal aspect - both planets are from the birth chart</p>`;
    
  return `
    <div class="interpretation-content">
      <h3>${planet1} ${aspect} ${planet2}</h3>
      ${aspectTypeText}
      ${detailedInfo}
      <p><strong>Note:</strong> This is a natal aspect shown for reference in the transit chart.</p>
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

function showTransitInterpretation(event: MouseEvent, interpretationHtml: string, title: string) {
  if (!tooltip) createTransitTooltip();

  tooltip.html(`<div class="tooltip-header">${title}</div><div class="tooltip-body">${interpretationHtml}</div>`);

  tooltip.transition()
    .duration(200)
    .style('opacity', 1);

  positionTransitTooltip(event);
}

function hideTransitInterpretation() {
  if (tooltip) {
    tooltip.transition().duration(200).style('opacity', 0).on('end', () => {
      tooltip.style('pointer-events', 'none');
    });
  }
}

function positionTransitTooltip(event: MouseEvent) {
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

export function unpinTransitTooltip() {
    if (tooltipPinned) {
        tooltipPinned = false;
        pinnedData = null;
        hideTransitInterpretation();
    }
}

export { getTransitPlanetInterpretation, getTransitAspectInterpretation, getNatalPlanetInterpretation, getNatalAspectInterpretation, getSignInterpretation }; 