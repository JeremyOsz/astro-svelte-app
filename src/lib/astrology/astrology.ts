// Astrological constants and utilities
// Note: This is a mock implementation. For production use, integrate with Swiss Ephemeris

export const ZODIAC_SIGNS = [
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
];

export const DEGREES_PER_SIGN = 30;

export function getSignByDegree(degree: number) {
  const normalizedDegree = degree % 360;
  const signIndex = Math.floor(normalizedDegree / DEGREES_PER_SIGN);
  return ZODIAC_SIGNS[signIndex];
}

export const WHOLE_SIGN_HOUSES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
];

// Mock planet IDs - in production, these would come from Swiss Ephemeris
export const PLANETS = [
  { id: 0, name: 'Sun' },
  { id: 1, name: 'Moon' },
  { id: 2, name: 'Mercury' },
  { id: 3, name: 'Venus' },
  { id: 4, name: 'Mars' },
  { id: 5, name: 'Jupiter' },
  { id: 6, name: 'Saturn' },
  { id: 7, name: 'Uranus' },
  { id: 8, name: 'Neptune' },
  { id: 9, name: 'Pluto' },
  { id: 10, name: 'North Node' }
];

// Aspect definitions
export const ASPECTS = {
  CONJUNCTION: { name: 'Conjunction', degrees: 0, orb: 8, color: '#228B22' },
  SEXTILE: { name: 'Sextile', degrees: 60, orb: 4, color: '#0000FF' },
  SQUARE: { name: 'Square', degrees: 90, orb: 8, color: '#FF0000' },
  TRINE: { name: 'Trine', degrees: 120, orb: 8, color: '#0000FF' },
  OPPOSITION: { name: 'Opposition', degrees: 180, orb: 8, color: '#FF0000' }
};

// Element colors
export const ELEMENT_COLORS = {
  Fire: '#e53935',
  Earth: '#43a047',
  Air: '#fbc02d',
  Water: '#039be5'
};

// Quality colors
export const QUALITY_COLORS = {
  Cardinal: '#e91e63',
  Fixed: '#9c27b0',
  Mutable: '#3f51b5'
}; 