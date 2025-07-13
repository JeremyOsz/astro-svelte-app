import { ZODIAC_SIGNS, PLANETS, DEGREES_PER_SIGN, WHOLE_SIGN_HOUSES } from '../data/astrological-data';

// Re-export constants that are safe for client-side use
export { ZODIAC_SIGNS, PLANETS, DEGREES_PER_SIGN, WHOLE_SIGN_HOUSES };

// Utility functions that can be used on both client and server
export function getSignByDegree(degree: number): string {
  const normalizedDegree = degree % 360;
  const signIndex = Math.floor(normalizedDegree / 30);
  return ZODIAC_SIGNS[signIndex];
}

export function getDegreeInSign(degree: number): number {
  return (degree % 30);
} 