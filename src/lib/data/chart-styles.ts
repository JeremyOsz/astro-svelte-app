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
      transitHouseNumRadius: 390,
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
      transitZodiacOuterRadius: 280,
      transitZodiacInnerRadius: 260,
      transitPlanetRingRadius: 240,
      transitLabelRadius: 210,
      transitHouseLineInnerRadius: 180,
      transitHouseNumRadius: 190,
      transitAspectHubRadius: 120
    },
    MOBILE: {
      chartSize: 350,
      // Mobile radii scaled proportionally from desktop (350/800 = 0.4375 ratio)
      zodiacOuterRadius: 153, // 350 * 0.4375
      zodiacInnerRadius: 131, // 300 * 0.4375
      planetRingRadius: 118, // 270 * 0.4375
      labelRadius: 101, // 230 * 0.4375
      houseLineInnerRadius: 74, // 170 * 0.4375
      houseNumRadius: 79, // 180 * 0.4375
      aspectHubRadius: 74, // 170 * 0.4375
      // --- Transit (outer wheel) radii ---
      transitZodiacOuterRadius: 158, // 360 * 0.4375
      transitZodiacInnerRadius: 188, // 430 * 0.4375
      transitPlanetRingRadius: 175, // 400 * 0.4375
      transitLabelRadius: 171, // 390 * 0.4375
      transitHouseLineInnerRadius: 140, // 320 * 0.4375
      transitHouseNumRadius: 171, // 390 * 0.4375
      transitAspectHubRadius: 74 // 170 * 0.4375
    }
  } as const;
  
  export const CLUSTER_THRESHOLD = 12;

// Removed legacy CSS-in-JS exports (CHART_STYLES, injectChartStyles, removeChartStyles)
// All styling is now handled inside Svelte <style> blocks. 