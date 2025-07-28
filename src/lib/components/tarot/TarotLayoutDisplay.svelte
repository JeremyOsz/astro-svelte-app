<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import type { TarotLayout } from '../../data/tarot-layouts';

  export let layout: TarotLayout;
  export let width = 600;
  export let height = 400;

  let svgElement: SVGSVGElement;
  let containerElement: HTMLDivElement;

  function renderLayout() {
    if (!svgElement) return;

    // Clear any existing content
    d3.select(svgElement).selectAll("*").remove();

    const svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height);

    if (layout.id === 'celtic-cross') {
      renderCelticCross(svg);
    } else {
      // Fallback to SVG string for other layouts
      svg.html(layout.svg);
    }
  }

  onMount(() => {
    renderLayout();
    
    // Add resize observer for responsive behavior
    if (containerElement) {
      const resizeObserver = new ResizeObserver(() => {
        renderLayout();
      });
      resizeObserver.observe(containerElement);
      
      return () => {
        resizeObserver.disconnect();
      };
    }
  });

  function renderCelticCross(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
    // Calculate responsive card dimensions based on container size
    const aspectRatio = width / height;
    const padding = 20;
    const availableWidth = width - padding * 2;
    const availableHeight = height - padding * 2;
    
    // Calculate optimal card size that fits the layout
    // Celtic Cross needs space for: central cross + staff column + spacing
    const maxCardWidth = Math.min(availableWidth / 6, availableHeight / 4);
    const maxCardHeight = maxCardWidth * 1.5; // Maintain card aspect ratio
    
    const cardWidth = Math.max(30, Math.min(maxCardWidth, 80));
    const cardHeight = Math.max(45, Math.min(maxCardHeight, 120));
    const cardRadius = Math.max(2, cardWidth / 20);
    
    // Calculate spacing based on card size
    const horizontalSpacing = cardWidth * 1.1;
    const verticalSpacing = cardHeight * 1.1;
    
    // Calculate layout bounds to center everything
    const layoutWidth = horizontalSpacing * 4; // Left to right: Past, Center, Future, Staff
    const layoutHeight = verticalSpacing * 3; // Top to bottom: Crown, Center, Foundation
    
    const startX = (width - layoutWidth) / 2;
    const startY = (height - layoutHeight) / 2;
    
    // Define the Celtic Cross layout positions with responsive positioning
    const positions = [
      // Central cross
      { x: startX + horizontalSpacing * 1.5, y: startY + verticalSpacing, number: 1, name: "Present" }, // Center
      { x: startX + horizontalSpacing * 1.5, y: startY + verticalSpacing, number: 2, name: "Challenge" }, // Overlapping center
      { x: startX + horizontalSpacing * 1.5, y: startY + verticalSpacing * 2, number: 3, name: "Foundation" }, // Below
      { x: startX + horizontalSpacing * 0.5, y: startY + verticalSpacing, number: 4, name: "Past" }, // Left
      { x: startX + horizontalSpacing * 2.5, y: startY + verticalSpacing, number: 6, name: "Future" }, // Right
      
      // Staff column (right side)
      { x: startX + horizontalSpacing * 3.5, y: startY + verticalSpacing * 0.5, number: 7, name: "Self" },
      { x: startX + horizontalSpacing * 3.5, y: startY + verticalSpacing * 1.5, number: 8, name: "Environment" },
      { x: startX + horizontalSpacing * 3.5, y: startY + verticalSpacing * 2.5, number: 9, name: "Hopes/Fears" },
      { x: startX + horizontalSpacing * 3.5, y: startY + verticalSpacing * 3.5, number: 10, name: "Outcome" },
      
      // Additional position for card 5 (above center)
      { x: startX + horizontalSpacing * 1.5, y: startY + verticalSpacing * 0, number: 5, name: "Crown" }
    ];

    // Create card groups
    const cardGroups = svg.selectAll('.card')
      .data(positions)
      .enter()
      .append('g')
      .attr('class', 'card')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Add card rectangles
    cardGroups.append('rect')
      .attr('width', cardWidth)
      .attr('height', cardHeight)
      .attr('rx', cardRadius)
      .attr('fill', '#f3f4f6')
      .attr('stroke', '#d1d5db')
      .attr('stroke-width', 2);

    // Add card numbers
    cardGroups.append('text')
      .attr('x', cardWidth/2)
      .attr('y', cardHeight/2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#374151')
      .attr('font-size', Math.max(8, Math.min(cardWidth / 6, 14)))
      .attr('font-weight', 'bold')
      .text(d => d.number);

    // Add card names (smaller text below number)
    cardGroups.append('text')
      .attr('x', cardWidth/2)
      .attr('y', cardHeight/2 + cardHeight * 0.15)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#6b7280')
      .attr('font-size', Math.max(6, Math.min(cardWidth / 8, 10)))
      .text(d => d.name);
  }
</script>

<div class="tarot-layout-display" bind:this={containerElement}>
  <svg bind:this={svgElement}></svg>
</div>

<style>
  .tarot-layout-display {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  svg {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    max-width: 100%;
    max-height: 100%;
    overflow: visible;
  }

  /* Ensure the container doesn't clip the content */
  :global(.tarot-layout-display svg) {
    overflow: visible;
  }

  /* For the preview cards, ensure they show the full layout */
  :global(.bg-gray-50 .tarot-layout-display) {
    overflow: visible;
    min-height: 200px;
  }

  /* For the modal detail view, give more space */
  :global(.bg-gray-50 .tarot-layout-display svg) {
    overflow: visible;
    min-width: 400px;
    min-height: 300px;
  }
</style> 