// Consolidated chart styles
// This file contains all CSS styles for astrological charts


// Chart layout constants
export const CHART_LAYOUT = {
    DESKTOP: {
      chartSize: 800,
      zodiacOuterRadius: 350,
      zodiacInnerRadius: 300,
      planetRingRadius: 270,
      labelRadius: 230,
      houseLineInnerRadius: 170,
      houseNumRadius: 180,
      aspectHubRadius: 170
    },
    TABLET: {
      chartSize: 600,
      zodiacOuterRadius: 250,
      zodiacInnerRadius: 220,
      planetRingRadius: 200,
      labelRadius: 170,
      houseLineInnerRadius: 120,
      houseNumRadius: 130,
      aspectHubRadius: 120
    },
    MOBILE: {
      chartSize: 300,
      zodiacOuterRadius: 150,
      zodiacInnerRadius: 130,
      planetRingRadius: 115,
      labelRadius: 100,
      houseLineInnerRadius: 75,
      houseNumRadius: 80,
      aspectHubRadius: 75
    }
  } as const;
  
  export const CLUSTER_THRESHOLD = 12;

export const CHART_STYLES = `
/* Astrological Chart Styles */
.astrological-chart {
  font-family: 'Arial', sans-serif;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.chart-svg {
  max-width: 100%;
  height: auto;
}

/* Zodiac wheel styles */
.zodiac-wheel {
  fill: none;
  stroke: #333;
  stroke-width: 2;
}

.zodiac-segment {
  fill: none;
  stroke: #666;
  stroke-width: 1;
}

.zodiac-symbol {
  font-size: 14px;
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: middle;
}

/* Planet styles */
.planet-symbol {
  font-size: 16px;
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: middle;
  cursor: pointer;
  transition: all 0.2s ease;
}

.planet-symbol:hover {
  font-size: 18px;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
}

.planet-label {
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #333;
  font-weight: 500;
}

/* Detailed Planet Labels */
.planet-label-group text {
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'Arial', sans-serif;
}

.planet-label-degree {
  font-size: 12px;
  font-weight: bold;
}

.planet-label-sign {
  font-family: 'Noto Sans Symbols', 'Arial', sans-serif;
  font-size: 10px;
}

.planet-label-minute {
  font-size: 12px;
}

.retrograde-label {
  font-size: 10px;
  fill: #e53935;
  font-style: italic;
}

/* House styles */
.house-line {
  stroke: #999;
  stroke-width: 1;
  stroke-dasharray: 2,2;
}

.house-number {
  font-size: 12px;
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #666;
}

/* Aspect lines */
.aspect-line {
  stroke-width: 2;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.aspect-line:hover {
  opacity: 1;
  stroke-width: 3;
}

.aspect-conjunction {
  stroke: #228B22;
}

.aspect-opposition {
  stroke: #FF0000;
}

.aspect-square {
  stroke: #FF0000;
}

.aspect-trine {
  stroke: #0000FF;
}

.aspect-sextile {
  stroke: #0000FF;
  stroke-dasharray: 5,5;
}

.aspect-quincunx {
  stroke: #B8860B;
  stroke-dasharray: 10,5;
}

/* Degree markers */
.degree-marker {
  stroke: #ccc;
  stroke-width: 1;
}

.degree-label {
  font-size: 8px;
  fill: #999;
  text-anchor: middle;
  dominant-baseline: middle;
}

/* Tooltip styles */
.chart-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  max-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.chart-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.9) transparent transparent transparent;
}

/* Chart controls */
.chart-controls {
  display: flex;
  gap: 10px;
  margin: 10px 0;
  flex-wrap: wrap;
  align-items: center;
}

.chart-control {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-control:hover {
  background: #f0f0f0;
  border-color: #999;
}

.chart-control.active {
  background: #007bff;
  color: white;
  border-color: #0056b3;
}

.chart-control input[type="checkbox"] {
  margin: 0;
}

.chart-control label {
  margin: 0;
  cursor: pointer;
  font-size: 14px;
}

/* Zoom controls */
.zoom-controls {
  display: flex;
  gap: 5px;
  margin: 10px 0;
}

.zoom-button {
  padding: 5px 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.zoom-button:hover {
  background: #f0f0f0;
  border-color: #999;
}

.zoom-button:active {
  background: #e0e0e0;
}

/* Responsive design */
@media (max-width: 768px) {
  .chart-container {
    padding: 10px;
    margin: 10px 0;
  }
  
  .chart-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .chart-control {
    justify-content: space-between;
  }
  
  .zodiac-symbol {
    font-size: 12px;
  }
  
  .planet-symbol {
    font-size: 14px;
  }
  
  .planet-label {
    font-size: 8px;
  }
  
  .house-number {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .astrological-chart {
    padding: 10px;
  }
  
  .chart-container {
    padding: 5px;
  }
  
  .zodiac-symbol {
    font-size: 10px;
  }
  
  .planet-symbol {
    font-size: 12px;
  }
  
  .planet-label {
    font-size: 6px;
  }
  
  .house-number {
    font-size: 8px;
  }
}

/* Print styles */
@media print {
  .chart-controls,
  .zoom-controls {
    display: none;
  }
  
  .astrological-chart {
    box-shadow: none;
    border: 1px solid #ccc;
  }
  
  .chart-container {
    background: white;
    border: 1px solid #ccc;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .planet-symbol,
  .aspect-line,
  .chart-control,
  .zoom-button {
    transition: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .zodiac-wheel {
    stroke: #000;
    stroke-width: 3;
  }
  
  .zodiac-segment {
    stroke: #000;
    stroke-width: 2;
  }
  
  .house-line {
    stroke: #000;
    stroke-width: 2;
  }
  
  .planet-symbol {
    fill: #000;
  }
  
  .planet-label {
    fill: #000;
  }
  
  .house-number {
    fill: #000;
  }
  
  .degree-marker {
    stroke: #000;
    stroke-width: 2;
  }
  
  .degree-label {
    fill: #000;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .astrological-chart {
    background: #2d3748;
    color: #e2e8f0;
  }
  
  .chart-container {
    background: #1a202c;
  }
  
  .zodiac-wheel {
    stroke: #e2e8f0;
  }
  
  .zodiac-segment {
    stroke: #4a5568;
  }
  
  .zodiac-symbol {
    fill: #e2e8f0;
  }
  
  .planet-symbol {
    fill: #e2e8f0;
  }
  
  .planet-label {
    fill: #e2e8f0;
  }
  
  .house-line {
    stroke: #4a5568;
  }
  
  .house-number {
    fill: #e2e8f0;
  }
  
  .degree-marker {
    stroke: #4a5568;
  }
  
  .degree-label {
    fill: #a0aec0;
  }
  
  .chart-control {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  .chart-control:hover {
    background: #4a5568;
  }
  
  .chart-control.active {
    background: #3182ce;
    border-color: #2c5282;
  }
  
  .zoom-button {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  .zoom-button:hover {
    background: #4a5568;
  }
}
`;

// Function to inject styles into the document
export function injectChartStyles(): void {
  if (typeof document !== 'undefined') {
    const styleId = 'astrological-chart-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = CHART_STYLES;
  }
}

// Function to remove styles from the document
export function removeChartStyles(): void {
  if (typeof document !== 'undefined') {
    const styleElement = document.getElementById('astrological-chart-styles');
    if (styleElement) {
      styleElement.remove();
    }
  }
} 