import * as d3 from 'd3';

// Shared tooltip state management
let tooltipPinned = false;
let pinnedData: any = null;

export function getTooltipPinned() {
  return tooltipPinned;
}

export function setTooltipPinned(pinned: boolean) {
  tooltipPinned = pinned;
}

export function getPinnedData() {
  return pinnedData;
}

export function setPinnedData(data: any) {
  pinnedData = data;
}

// Shared tooltip positioning logic
export function positionTooltip(tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>, event: MouseEvent) {
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

// Shared tooltip show/hide logic
export function showTooltip(tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>, event: MouseEvent, interpretationHtml: string, title: string) {
  if (!tooltip) return;

  tooltip.html(`<div class="tooltip-header">${title}</div><div class="tooltip-body">${interpretationHtml}</div>`);

  tooltip.transition()
    .duration(200)
    .style('opacity', 1);

  positionTooltip(tooltip, event);
}

export function hideTooltip(tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>) {
  if (tooltip) {
    tooltip.transition().duration(200).style('opacity', 0).on('end', () => {
      tooltip.style('pointer-events', 'none');
    });
  }
}

// Shared click handler logic
export function handleTooltipClick(event: MouseEvent, d: any, tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>, mouseOverHandler: (event: MouseEvent, d: any) => void) {
  event.stopPropagation();
  if (tooltipPinned && pinnedData === d) {
    tooltipPinned = false;
    pinnedData = null;
    hideTooltip(tooltip);
  } else {
    pinnedData = d;
    mouseOverHandler(event, d);
    tooltipPinned = true;
  }
}

// Shared unpin function
export function unpinTooltip(tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>) {
  if (tooltipPinned) {
    tooltipPinned = false;
    pinnedData = null;
    hideTooltip(tooltip);
  }
}

// Shared tooltip creation
export function createTooltip(className: string) {
  let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  
  if (d3.select(`.${className}`).empty()) {
    tooltip = d3.select('body')
      .append('div')
      .attr('class', className)
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('pointer-events', 'none');
  } else {
    tooltip = d3.select(`.${className}`);
  }
  
  return tooltip;
} 