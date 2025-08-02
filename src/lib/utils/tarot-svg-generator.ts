export function generateCelticCrossSVG(width: number = 500, height: number = 500): string {
  // Calculate responsive card dimensions based on container size
  const padding = 20;
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;
  
  // Calculate optimal card size that fits the layout
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
  
  // Define the Celtic Cross layout positions
  const positions = [
    // Central cross
    { x: startX + horizontalSpacing * 1.5, y: startY + verticalSpacing, number: 1, name: "Present" },
    { x: startX + horizontalSpacing * 1.5, y: startY + verticalSpacing, number: 2, name: "Challenge" },
    { x: startX + horizontalSpacing * 1.5, y: startY + verticalSpacing * 2, number: 3, name: "Foundation" },
    { x: startX + horizontalSpacing * 0.5, y: startY + verticalSpacing, number: 4, name: "Past" },
    { x: startX + horizontalSpacing * 2.5, y: startY + verticalSpacing, number: 6, name: "Future" },
    
    // Staff column (right side)
    { x: startX + horizontalSpacing * 3.5, y: startY + verticalSpacing * 0.5, number: 7, name: "Self" },
    { x: startX + horizontalSpacing * 3.5, y: startY + verticalSpacing * 1.5, number: 8, name: "Environment" },
    { x: startX + horizontalSpacing * 3.5, y: startY + verticalSpacing * 2.5, number: 9, name: "Hopes/Fears" },
    { x: startX + horizontalSpacing * 3.5, y: startY + verticalSpacing * 3.5, number: 10, name: "Outcome" },
    
    // Additional position for card 5 (above center)
    { x: startX + horizontalSpacing * 1.5, y: startY + verticalSpacing * 0, number: 5, name: "Crown" }
  ];

  // Generate SVG string
  let svg = '';
  
  positions.forEach(pos => {
    const fontSize = Math.max(8, Math.min(cardWidth / 6, 14));
    const nameFontSize = Math.max(6, Math.min(cardWidth / 8, 10));
    
    svg += `<rect x="${pos.x}" y="${pos.y}" width="${cardWidth}" height="${cardHeight}" rx="${cardRadius}" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>`;
    svg += `<text x="${pos.x + cardWidth/2}" y="${pos.y + cardHeight/2}" text-anchor="middle" dominant-baseline="middle" fill="#374151" font-size="${fontSize}" font-weight="bold">${pos.number}</text>`;
    svg += `<text x="${pos.x + cardWidth/2}" y="${pos.y + cardHeight/2 + cardHeight * 0.15}" text-anchor="middle" dominant-baseline="middle" fill="#6b7280" font-size="${nameFontSize}">${pos.name}</text>`;
  });
  
  return svg;
}

export function generateHorseshoeSVG(width: number = 600, height: number = 400): string {
  const cardWidth = 80;
  const cardHeight = 120;
  const cardRadius = 4;
  
  // Proper horseshoe shape positions - ascending left curve, descending right curve
  const positions = [
    { x: 50, y: 250, number: 1, name: "The Past" },           // Bottom left
    { x: 140, y: 180, number: 2, name: "The Present" },        // Left middle
    { x: 230, y: 120, number: 3, name: "Hidden Influences" },  // Top center
    { x: 320, y: 150, number: 4, name: "The Querent" },        // Right upper
    { x: 380, y: 200, number: 5, name: "Influence of Others" }, // Right middle
    { x: 380, y: 280, number: 6, name: "What Should the Querent Do" }, // Right lower
    { x: 320, y: 320, number: 7, name: "The Final Outcome" }   // Bottom right
  ];

  let svg = '';
  positions.forEach(pos => {
    svg += `<rect x="${pos.x}" y="${pos.y}" width="${cardWidth}" height="${cardHeight}" rx="${cardRadius}" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>`;
    svg += `<text x="${pos.x + cardWidth/2}" y="${pos.y + cardHeight/2}" text-anchor="middle" dominant-baseline="middle" fill="#374151" font-size="14" font-weight="bold">${pos.number}</text>`;
  });
  
  return svg;
}

export function generateLoveTriangleSVG(width: number = 600, height: number = 400): string {
  const cardWidth = 80;
  const cardHeight = 120;
  const cardRadius = 4;
  
  // Triangle shape positions
  const positions = [
    { x: 260, y: 50, number: 1, name: "Your Feelings" },
    { x: 160, y: 200, number: 2, name: "Partner's Feelings" },
    { x: 360, y: 200, number: 3, name: "Relationship" },
    { x: 160, y: 350, number: 4, name: "Past Influences" },
    { x: 360, y: 350, number: 5, name: "Future Potential" },
    { x: 260, y: 500, number: 6, name: "Advice" }
  ];

  let svg = '';
  positions.forEach(pos => {
    svg += `<rect x="${pos.x}" y="${pos.y}" width="${cardWidth}" height="${cardHeight}" rx="${cardRadius}" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>`;
    svg += `<text x="${pos.x + cardWidth/2}" y="${pos.y + cardHeight/2}" text-anchor="middle" dominant-baseline="middle" fill="#374151" font-size="14" font-weight="bold">${pos.number}</text>`;
  });
  
  return svg;
}

export function generateCareerPathSVG(width: number = 600, height: number = 400): string {
  const cardWidth = 80;
  const cardHeight = 120;
  const cardRadius = 4;
  
  // Vertical column positions
  const positions = [
    { x: 260, y: 50, number: 1, name: "Current Position" },
    { x: 160, y: 150, number: 2, name: "Strengths" },
    { x: 360, y: 150, number: 3, name: "Challenges" },
    { x: 160, y: 300, number: 4, name: "Opportunities" },
    { x: 360, y: 300, number: 5, name: "Recommended Action" }
  ];

  let svg = '';
  positions.forEach(pos => {
    svg += `<rect x="${pos.x}" y="${pos.y}" width="${cardWidth}" height="${cardHeight}" rx="${cardRadius}" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>`;
    svg += `<text x="${pos.x + cardWidth/2}" y="${pos.y + cardHeight/2}" text-anchor="middle" dominant-baseline="middle" fill="#374151" font-size="14" font-weight="bold">${pos.number}</text>`;
  });
  
  return svg;
}

export function generateSpiritualJourneySVG(width: number = 600, height: number = 400): string {
  const cardWidth = 80;
  const cardHeight = 120;
  const cardRadius = 4;
  
  // Diamond-like shape positions
  const positions = [
    { x: 260, y: 20, number: 1, name: "Soul Purpose" },
    { x: 160, y: 120, number: 2, name: "Past Life" },
    { x: 360, y: 120, number: 3, name: "Spiritual Gifts" },
    { x: 120, y: 220, number: 4, name: "Current Lessons" },
    { x: 400, y: 220, number: 5, name: "Spiritual Challenges" },
    { x: 260, y: 320, number: 6, name: "Higher Guidance" },
    { x: 160, y: 420, number: 7, name: "Spiritual Practices" },
    { x: 360, y: 420, number: 8, name: "Soul Evolution" }
  ];

  let svg = '';
  positions.forEach(pos => {
    svg += `<rect x="${pos.x}" y="${pos.y}" width="${cardWidth}" height="${cardHeight}" rx="${cardRadius}" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>`;
    svg += `<text x="${pos.x + cardWidth/2}" y="${pos.y + cardHeight/2}" text-anchor="middle" dominant-baseline="middle" fill="#374151" font-size="14" font-weight="bold">${pos.number}</text>`;
  });
  
  return svg;
} 