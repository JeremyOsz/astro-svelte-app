// Consolidated astrological data
// This file contains all the astrological constants, symbols, and reference data

// Core zodiac data
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

// Enhanced zodiac data with elements, qualities, and rulers
export const ZODIAC_DETAILED = [
  { name: 'Aries', element: 'Fire', quality: 'Cardinal', ruler: 'Mars', symbol: '♈', startDegree: 0, endDegree: 30 },
  { name: 'Taurus', element: 'Earth', quality: 'Fixed', ruler: 'Venus', symbol: '♉', startDegree: 30, endDegree: 60 },
  { name: 'Gemini', element: 'Air', quality: 'Mutable', ruler: 'Mercury', symbol: '♊', startDegree: 60, endDegree: 90 },
  { name: 'Cancer', element: 'Water', quality: 'Cardinal', ruler: 'Moon', symbol: '♋', startDegree: 90, endDegree: 120 },
  { name: 'Leo', element: 'Fire', quality: 'Fixed', ruler: 'Sun', symbol: '♌', startDegree: 120, endDegree: 150 },
  { name: 'Virgo', element: 'Earth', quality: 'Mutable', ruler: 'Mercury', symbol: '♍', startDegree: 150, endDegree: 180 },
  { name: 'Libra', element: 'Air', quality: 'Cardinal', ruler: 'Venus', symbol: '♎', startDegree: 180, endDegree: 210 },
  { name: 'Scorpio', element: 'Water', quality: 'Fixed', ruler: 'Pluto', symbol: '♏', startDegree: 210, endDegree: 240 },
  { name: 'Sagittarius', element: 'Fire', quality: 'Mutable', ruler: 'Jupiter', symbol: '♐', startDegree: 240, endDegree: 270 },
  { name: 'Capricorn', element: 'Earth', quality: 'Cardinal', ruler: 'Saturn', symbol: '♑', startDegree: 270, endDegree: 300 },
  { name: 'Aquarius', element: 'Air', quality: 'Fixed', ruler: 'Uranus', symbol: '♒', startDegree: 300, endDegree: 330 },
  { name: 'Pisces', element: 'Water', quality: 'Mutable', ruler: 'Neptune', symbol: '♓', startDegree: 330, endDegree: 360 }
] as const;

// Planet data
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

// Aspect definitions
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

// Utility functions
export function getSignByDegree(degree: number): string {
  const normalizedDegree = degree % 360;
  const signIndex = Math.floor(normalizedDegree / 30);
  return ZODIAC_SIGNS[signIndex];
}

export function getSignDetails(signName: string) {
  return ZODIAC_DETAILED.find(sign => sign.name === signName);
}

export const DEGREES_PER_SIGN = 30;
export const WHOLE_SIGN_HOUSES = Array.from({ length: 12 }, (_, i) => i + 1); 