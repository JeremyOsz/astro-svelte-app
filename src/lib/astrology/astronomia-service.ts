import { ZODIAC_SIGNS } from '../data/astrological-data';

export interface PlanetPosition {
  name: string;
  longitude: number;
  latitude: number;
  distance: number;
  sign: string;
  degree: number;
  house?: number;
}

export interface BirthChart {
  planets: PlanetPosition[];
  houses: number[];
  ascendant: number;
  mc: number;
  date: Date;
  latitude: number;
  longitude: number;
}

export interface TransitData {
  planet: string;
  currentLongitude: number;
  currentSign: string;
  currentDegree: number;
  natalLongitude: number;
  natalSign: string;
  natalDegree: number;
  aspect?: {
    type: string;
    orb: number;
    exact: boolean;
  };
}

export function getSignByDegree(degree: number): string {
  const normalizedDegree = degree % 360;
  const signIndex = Math.floor(normalizedDegree / 30);
  return ZODIAC_SIGNS[signIndex];
}

export function getDegreeInSign(degree: number): number {
  return (degree % 30);
}

// Calculate aspects between two longitudes
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