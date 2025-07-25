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
      chartSize: 350,
      zodiacOuterRadius: 170,
      zodiacInnerRadius: 140,
      planetRingRadius: 125,
      labelRadius: 100,
      houseLineInnerRadius: 100,
      houseNumRadius: 110,
      aspectHubRadius: 100
    }
  } as const;
  
  export const CLUSTER_THRESHOLD = 12;

// Removed legacy CSS-in-JS exports (CHART_STYLES, injectChartStyles, removeChartStyles)
// All styling is now handled inside Svelte <style> blocks. 