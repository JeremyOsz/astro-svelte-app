// Consolidated astrological data
// This file contains all the astrological constants, symbols, and reference data

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

export const ZODIAC_SYMBOLS: Record<string, string> = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋', 
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏', 
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
};

export const ZODIAC_COLORS: Record<string, string> = {
  'Aries': '#e53935',      // Fire - Red
  'Taurus': '#43a047',     // Earth - Green
  'Gemini': '#fbc02d',     // Air - Yellow
  'Cancer': '#039be5',     // Water - Blue
  'Leo': '#e53935',        // Fire - Red
  'Virgo': '#43a047',      // Earth - Green
  'Libra': '#fbc02d',      // Air - Yellow
  'Scorpio': '#039be5',    // Water - Blue
  'Sagittarius': '#e53935',// Fire - Red
  'Capricorn': '#43a047',  // Earth - Green
  'Aquarius': '#fbc02d',   // Air - Yellow
  'Pisces': '#039be5'      // Water - Blue
};

export const PLANET_SYMBOLS: Record<string, string> = {
  'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀', 'Mars': '♂', 
  'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇', 
  'Node': '☊', 'Lilith': '⚸', 'Chiron': '⚷', 'Fortune': '⊗', 'Vertex': 'Vx', 
  'ASC': 'Asc', 'MC': 'MC', 'DSC': 'Dsc', 'IC': 'IC'
};

export const EXTENDED_PLANET_NAMES = ['Chiron', 'Lilith', 'Node', 'Fortune', 'Vertex'];

export const CORE_ASPECT_BODIES = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 
  'Saturn', 'Uranus', 'Neptune', 'Pluto', 'ASC'
];

export const ASPECT_DEFINITIONS = {
  'Conjunction': { angle: 0, orb: 8, color: '#228B22', weight: 2.5, style: 'solid' },
  'Opposition': { angle: 180, orb: 8, color: '#FF0000', weight: 2.5, style: 'solid' },
  'Square': { angle: 90, orb: 8, color: '#FF0000', weight: 2.5, style: 'solid' },
  'Trine': { angle: 120, orb: 8, color: '#0000FF', weight: 2, style: 'solid' },
  'Sextile': { angle: 60, orb: 6, color: '#0000FF', weight: 2, style: 'dotted' },
  'Quincunx': { angle: 150, orb: 3, color: '#B8860B', weight: 1.5, style: 'dashed' }
} as const;

export const PLANETS = {
  SUN: 0,
  MOON: 1,
  MERCURY: 2,
  VENUS: 3,
  MARS: 4,
  JUPITER: 5,
  SATURN: 6,
  URANUS: 7,
  NEPTUNE: 8,
  PLUTO: 9
} as const;

export const ASPECTS = [
  { name: 'Conjunction', angle: 0, orb: 8 },
  { name: 'Opposition', angle: 180, orb: 8 },
  { name: 'Trine', angle: 120, orb: 6 },
  { name: 'Square', angle: 90, orb: 6 },
  { name: 'Sextile', angle: 60, orb: 4 }
] as const;

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