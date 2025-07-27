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
      aspectHubRadius: 170,
      // --- Transit (outer wheel) radii ---
      transitZodiacOuterRadius: 360,
      transitZodiacInnerRadius: 430,
      transitPlanetRingRadius: 400,
      transitLabelRadius: 390,
      transitHouseLineInnerRadius: 320,
      transitHouseNumRadius: 330,
      transitAspectHubRadius: 170
    },
    TABLET: {
      chartSize: 600,
      zodiacOuterRadius: 250,
      zodiacInnerRadius: 220,
      planetRingRadius: 200,
      labelRadius: 170,
      houseLineInnerRadius: 120,
      houseNumRadius: 130,
      aspectHubRadius: 120,
      // --- Transit (outer wheel) radii ---
      transitZodiacOuterRadius: 340,
      transitZodiacInnerRadius: 300,
      transitPlanetRingRadius: 270,
      transitLabelRadius: 240,
      transitHouseLineInnerRadius: 200,
      transitHouseNumRadius: 210,
      transitAspectHubRadius: 200
    },
    MOBILE: {
      chartSize: 350,
      zodiacOuterRadius: 170,
      zodiacInnerRadius: 140,
      planetRingRadius: 125,
      labelRadius: 100,
      houseLineInnerRadius: 100,
      houseNumRadius: 110,
      aspectHubRadius: 100,
      // --- Transit (outer wheel) radii ---
      transitZodiacOuterRadius: 230,
      transitZodiacInnerRadius: 200,
      transitPlanetRingRadius: 180,
      transitLabelRadius: 150,
      transitHouseLineInnerRadius: 135,
      transitHouseNumRadius: 145,
      transitAspectHubRadius: 135
    }
  } as const;
  
  export const CLUSTER_THRESHOLD = 12;

// Removed legacy CSS-in-JS exports (CHART_STYLES, injectChartStyles, removeChartStyles)
// All styling is now handled inside Svelte <style> blocks. 