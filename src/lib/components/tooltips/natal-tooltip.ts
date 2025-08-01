import * as d3 from 'd3';
import {
  PLANET_IN_SIGN_INTERPRETATIONS,
  SIGN_IN_HOUSE_INTERPRETATIONS,
  getDetailedAspectInterpretation,
  PLANET_INTERPRETATIONS,
  ASPECT_INTERPRETATIONS,
  HOUSES
} from '../../data/interpretations';

let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
let tooltipPinned = false;
let pinnedData: any = null;

export function createNatalTooltip() {
  if (d3.select('.natal-chart-tooltip').empty()) {
    tooltip = d3.select('body')
      .append('div')
      .attr('class', 'natal-chart-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('pointer-events', 'none');
  } else {
    tooltip = d3.select('.natal-chart-tooltip');
  }
}

export function handleNatalMouseOver(event: MouseEvent, d: any) {
  if (tooltipPinned) return;

  let interpretationHtml, title;
  if (d.aspect) { // It's an aspect
    title = `Natal Aspect: ${d.planet1} ${d.aspect} ${d.planet2}`;
    interpretationHtml = getNatalAspectInterpretation(d.aspect, d.planet1, d.planet2, d.orb);
  } else if (d.planet) { // It's a planet
    title = `Natal Planet: <span style="color: #333;">${d.planet}</span> in ${d.sign} (House ${d.house})`;
    interpretationHtml = getNatalPlanetInterpretation(d);
  } else if (d.sign && d.house !== undefined && !d.planet) { // It's a sign
    title = `Sign: ${d.sign} in House ${d.house}`;
    interpretationHtml = getNatalSignInterpretation(d.sign, d.house);
  } else { // Fallback
    title = "Unknown element";
    interpretationHtml = "No interpretation available.";
  }

  showNatalInterpretation(event, interpretationHtml, title);
}

export function handleNatalMouseOut() {
  if (tooltipPinned) return;
  hideNatalInterpretation();
}

export function handleNatalClick(event: MouseEvent, d: any) {
  event.stopPropagation();
  if (tooltipPinned && pinnedData === d) {
    tooltipPinned = false;
    pinnedData = null;
    hideNatalInterpretation();
  } else {
    pinnedData = d;
    handleNatalMouseOver(event, d);
    tooltipPinned = true;
  }
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

function getNatalAspectInterpretation(aspect: string, planet1: string, planet2: string, orbValue?: number) {
  const interpretation = getDetailedAspectInterpretation(aspect, planet1, planet2);
  const aspectData = (ASPECT_INTERPRETATIONS as any)[aspect];
  
  let detailedInfo = '';
  if (aspectData) {
    const orbInfo = orbValue !== undefined ? `${orbValue.toFixed(2)}°` : aspectData.orb;
    detailedInfo = `
      <p><strong>Orb:</strong> ${orbInfo}</p>
      <p><strong>Nature:</strong> ${aspectData.nature}</p>
    `;
  }
  
  // Split interpretation into general and specific parts
  const interpretationParts = interpretation.split('\n\n');
  const generalInterpretation = interpretationParts[0] || '';
  const specificInterpretation = interpretationParts[1] || '';
  
  let interpretationHtml = '';
  if (generalInterpretation) {
    interpretationHtml += `<p><strong>General:</strong> ${generalInterpretation}</p>`;
  }
  if (specificInterpretation) {
    interpretationHtml += `<p><strong>Specific:</strong> ${specificInterpretation}</p>`;
  }
  
  const aspectTypeText = `<p><strong>Type:</strong> Natal aspect - both planets are from the birth chart</p>`;
    
  return `
    <div class="interpretation-content">
      <h3>${planet1} ${aspect} ${planet2}</h3>
      ${aspectTypeText}
      ${detailedInfo}
      ${interpretationHtml}
    </div>
  `;
}

function getNatalSignInterpretation(sign: string, house: number) {
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

function showNatalInterpretation(event: MouseEvent, interpretationHtml: string, title: string) {
  if (!tooltip) createNatalTooltip();

  tooltip.html(`<div class="tooltip-header">${title}</div><div class="tooltip-body">${interpretationHtml}</div>`);

  tooltip.transition()
    .duration(200)
    .style('opacity', 1);

  positionNatalTooltip(event);
}

function hideNatalInterpretation() {
  if (tooltip) {
    tooltip.transition().duration(200).style('opacity', 0).on('end', () => {
      tooltip.style('pointer-events', 'none');
    });
  }
}

function positionNatalTooltip(event: MouseEvent) {
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

export function unpinNatalTooltip() {
    if (tooltipPinned) {
        tooltipPinned = false;
        pinnedData = null;
        hideNatalInterpretation();
    }
}

export { getNatalPlanetInterpretation, getNatalAspectInterpretation, getNatalSignInterpretation }; 