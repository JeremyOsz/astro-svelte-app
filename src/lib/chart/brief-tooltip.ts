import * as d3 from 'd3';

let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

// Aspect symbols for visual display
const aspectSymbols: Record<string, string> = {
  'Conjunction': '☌',
  'Opposition': '☍', 
  'Square': '□',
  'Trine': '△',
  'Sextile': '⚹',
  'Quincunx': '⚻'
};

// Aspect colors matching the chart lines
const aspectColors: Record<string, string> = {
  'Conjunction': '#228B22', // Green
  'Opposition': '#FF0000',  // Red
  'Square': '#FF0000',      // Red
  'Trine': '#0000FF',       // Blue
  'Sextile': '#0000FF',     // Blue
  'Quincunx': '#B8860B'     // Golden
};

export function createBriefTooltip() {
  if (d3.select('.brief-chart-tooltip').empty()) {
    tooltip = d3.select('body')
      .append('div')
      .attr('class', 'brief-chart-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('z-index', '1000');
  } else {
    tooltip = d3.select('.brief-chart-tooltip');
  }
}

export function showBriefTooltip(event: MouseEvent, data: any) {
  if (!tooltip) createBriefTooltip();

  let content = '';
  
  if (data.aspect) {
    const planet1Color = data.isTransitAspect ? '#ff9500' : '#000000'; // orange for transit, black for natal
    const planet2Color = '#000000'; // natal planet is always black
    const aspectSymbol = aspectSymbols[data.aspect] || data.aspect;
    const aspectColor = aspectColors[data.aspect] || '#B8860B';
    const orbText = data.orb !== undefined ? ` (${data.orb.toFixed(1)}°)` : '';
    content = `<span style="color: ${planet1Color}; font-weight: 700;">${data.planet1}</span> <span style="color: ${aspectColor}; font-weight: 600;">${aspectSymbol}</span> <span style="color: ${planet2Color}; font-weight: 700;">${data.planet2}</span>${orbText}`;
  } else if (data.planet) {
    const planetColor = data.isTransit ? '#ff9500' : '#000000'; // orange for transit, black for natal
    const degreeText = data.degree !== undefined ? ` ${data.degree}°${data.minute?.toString().padStart(2, '0') || '00'}` : '';
    content = `<span style="color: ${planetColor}; font-weight: 700;">${data.planet}</span> in ${data.sign}${degreeText}`;
  } else if (data.sign) {
    content = `${data.sign} in House ${data.house}`;
  }

  const tooltipHtml = `
    <div class="brief-tooltip-content">
      <div class="brief-tooltip-main" style="font-size: 14px; font-weight: 500;">
        ${content}
      </div>
    </div>
  `;

  tooltip.html(tooltipHtml);

  tooltip.transition()
    .duration(200)
    .style('opacity', 1);

  positionBriefTooltip(event);
}

export function hideBriefTooltip() {
  if (tooltip) {
    tooltip.transition().duration(200).style('opacity', 0);
  }
}

function positionBriefTooltip(event: MouseEvent) {
  if (!tooltip) return;

  const tooltipNode = tooltip.node() as HTMLElement;
  const { width, height } = tooltipNode.getBoundingClientRect();

  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Get scroll position
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  
  // Calculate initial position
  let left = event.pageX + 10;
  let top = event.pageY - 10;

  // Check if tooltip would go off the right edge
  if (left + width > viewportWidth + scrollX - 10) {
    left = event.pageX - width - 10;
  }
  
  // Check if tooltip would go off the left edge
  if (left < scrollX + 10) {
    left = scrollX + 10;
  }
  
  // Check if tooltip would go off the bottom edge
  if (top + height > viewportHeight + scrollY - 10) {
    top = event.pageY - height - 10;
  }
  
  // Check if tooltip would go off the top edge
  if (top < scrollY + 10) {
    top = scrollY + 10;
  }

  // Ensure tooltip stays within viewport bounds
  left = Math.max(scrollX + 10, Math.min(left, viewportWidth + scrollX - width - 10));
  top = Math.max(scrollY + 10, Math.min(top, viewportHeight + scrollY - height - 10));

  tooltip.style('left', left + 'px')
         .style('top', top + 'px');
} 