// Consolidated chart styles
// This file contains all CSS styles for astrological charts


// Chart layout constants
export const CHART_LAYOUT = {
    DESKTOP: {
      chartSize: 1000, // Increased from 800
      zodiacOuterRadius: 470, // Increased from 350
      zodiacInnerRadius: 400, // Increased from 300
      planetRingRadius: 370, // Increased from 270
      labelRadius: 315, // Increased from 230
      houseLineInnerRadius: 270, // Increased from 170
      houseNumRadius: 280, // Increased from 180
      aspectHubRadius: 270, // Increased from 170
      // --- Transit (outer wheel) radii ---
      transitZodiacOuterRadius: 460, // Increased from 360
      transitZodiacInnerRadius: 530, // Increased from 430
      transitPlanetRingRadius: 500, // Increased from 400
      transitLabelRadius: 490, // Increased from 390
      transitHouseLineInnerRadius: 420, // Increased from 320
      transitHouseNumRadius: 490, // Increased from 390
      transitAspectHubRadius: 270 // Increased from 170
    },
    TABLET: {
      chartSize: 750, // Increased from 600
      zodiacOuterRadius: 350, // Increased from 250
      zodiacInnerRadius: 320, // Increased from 220
      planetRingRadius: 300, // Increased from 200
      labelRadius: 270, // Increased from 170
      houseLineInnerRadius: 220, // Increased from 120
      houseNumRadius: 230, // Increased from 130
      aspectHubRadius: 220, // Increased from 120
      // --- Transit (outer wheel) radii ---
      transitZodiacOuterRadius: 380, // Increased from 280
      transitZodiacInnerRadius: 360, // Increased from 260
      transitPlanetRingRadius: 340, // Increased from 240
      transitLabelRadius: 310, // Increased from 210
      transitHouseLineInnerRadius: 280, // Increased from 180
      transitHouseNumRadius: 290, // Increased from 190
      transitAspectHubRadius: 220 // Increased from 120
    },
    MOBILE: {
      chartSize: 450, // Increased from 350
      // Mobile radii scaled proportionally from desktop (450/1000 = 0.45 ratio)
      zodiacOuterRadius: 203, // 450 * 0.45
      zodiacInnerRadius: 180, // 400 * 0.45
      planetRingRadius: 167, // 370 * 0.45
      labelRadius: 149, // 330 * 0.45
      houseLineInnerRadius: 122, // 270 * 0.45
      houseNumRadius: 126, // 280 * 0.45
      aspectHubRadius: 122, // 270 * 0.45
      // --- Transit (outer wheel) radii ---
      transitZodiacOuterRadius: 207, // 460 * 0.45
      transitZodiacInnerRadius: 239, // 530 * 0.45
      transitPlanetRingRadius: 225, // 500 * 0.45
      transitLabelRadius: 221, // 490 * 0.45
      transitHouseLineInnerRadius: 189, // 420 * 0.45
      transitHouseNumRadius: 221, // 490 * 0.45
      transitAspectHubRadius: 122 // 270 * 0.45
    }
  } as const;
  
  export const CLUSTER_THRESHOLD = 12;

// Removed legacy CSS-in-JS exports (CHART_STYLES, injectChartStyles, removeChartStyles)
// All styling is now handled inside Svelte <style> blocks. 