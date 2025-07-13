import * as d3 from 'd3';
import {
  PLANET_IN_SIGN_INTERPRETATIONS,
  SIGN_IN_HOUSE_INTERPRETATIONS,
  getDetailedAspectInterpretation,
  PLANET_INTERPRETATIONS,
  ASPECT_INTERPRETATIONS,
  HOUSES
} from '../data/interpretations';

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
    title = `Aspect: ${d.planet1} ${d.aspect} ${d.planet2}`;
    interpretationHtml = getAspectInterpretation(d.aspect, d.planet1, d.planet2, d.orb);
  } else if (d.planet) { // It's a planet
    title = `Planet: ${d.planet} in ${d.sign} (House ${d.house})`;
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
    tooltipPinned = true;
    pinnedData = d;
    handleMouseOver(event, d); // Show and pin the tooltip
  }
}

function getPlanetInterpretation(planetData: any) {
  const { planet, sign, house, degree, minute, isRetrograde } = planetData;
  const planetInSign = (PLANET_IN_SIGN_INTERPRETATIONS as any)[planet]?.[sign] || "No interpretation available.";
  const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[sign]?.[house] || "No interpretation available.";
  const planetMeaning = (PLANET_INTERPRETATIONS as any)[planet]?.description || "";

  // Format position
  const position = `${degree}°${minute.toString().padStart(2, '0')}'`;
  const retrogradeText = isRetrograde ? ' (Retrograde)' : '';
  
  return `
    <div class="interpretation-content">
      <h3>${planet} in ${sign} (House ${house})</h3>
      <p><strong>Position:</strong> ${position} ${sign}${retrogradeText}</p>
      <p><strong>${planet}:</strong> ${planetMeaning}</p>
      <p><strong>In ${sign}:</strong> ${planetInSign}</p>
      <p><strong>In House ${house}:</strong> ${signInHouse}</p>
    </div>
  `;
}

function getAspectInterpretation(aspect: string, planet1: string, planet2: string, orbValue?: number) {
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
  
  return `
    <div class="interpretation-content">
      <h3>${planet1} ${aspect} ${planet2}</h3>
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

  let left = event.pageX + 15;
  let top = event.pageY - 15;

  if (left + width > window.innerWidth) {
    left = event.pageX - width - 15;
  }
  if (top + height > window.innerHeight) {
    top = event.pageY - height;
  }
  if (top < 0) {
    top = 0;
  }
  if (left < 0) {
    left = 0;
  }

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