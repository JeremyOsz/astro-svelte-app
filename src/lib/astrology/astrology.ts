// Astrological constants and utilities
// Note: This is a mock implementation. For production use, integrate with Swiss Ephemeris

import { ZODIAC_DETAILED, getSignByDegree } from '../data/astrological-data';

// Re-export the detailed zodiac data for backward compatibility
export const ZODIAC_SIGNS = ZODIAC_DETAILED;

// Re-export utility functions
export { getSignByDegree };

// Additional utility functions specific to this module
export function getSignByDegreeWithDetails(degree: number) {
  const normalizedDegree = degree % 360;
  const signIndex = Math.floor(normalizedDegree / 30);
  return ZODIAC_DETAILED[signIndex];
}

export function getElementBySign(signName: string): string {
  const sign = ZODIAC_DETAILED.find(s => s.name === signName);
  return sign?.element || '';
}

export function getQualityBySign(signName: string): string {
  const sign = ZODIAC_DETAILED.find(s => s.name === signName);
  return sign?.quality || '';
}

export function getRulerBySign(signName: string): string {
  const sign = ZODIAC_DETAILED.find(s => s.name === signName);
  return sign?.ruler || '';
}

export const DEGREES_PER_SIGN = 30;

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

export function getDegreeInSign(degree: number): number {
  return (degree % 30);
}

export function calculateAspect(long1: number, long2: number): { type: string; orb: number; exact: boolean } | undefined {
  const diff = Math.abs(long1 - long2);
  const orb = Math.min(diff, 360 - diff);
  
  const aspects = [
    { type: 'Conjunction', degrees: 0, orb: 8 },
    { type: 'Sextile', degrees: 60, orb: 4 },
    { type: 'Square', degrees: 90, orb: 8 },
    { type: 'Trine', degrees: 120, orb: 8 },
    { type: 'Opposition', degrees: 180, orb: 8 }
  ];
  
  for (const aspect of aspects) {
    if (Math.abs(orb - aspect.degrees) <= aspect.orb) {
      return {
        type: aspect.type,
        orb: Math.abs(orb - aspect.degrees),
        exact: Math.abs(orb - aspect.degrees) <= 1
      };
    }
  }
  
  return undefined;
} 