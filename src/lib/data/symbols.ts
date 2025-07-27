// Centralized astrological symbols and colors
// This file re-exports symbols and colors from astrological-data.ts for easy importing

import {
  PLANET_SYMBOLS,
  ZODIAC_SIGNS,
  ZODIAC_SYMBOLS,
  ZODIAC_COLORS,
  ASPECT_SYMBOLS,
  ASPECT_DEFINITIONS,
  TRANSIT_COLORS,
  EXTENDED_PLANET_NAMES,
  CORE_ASPECT_BODIES
} from './astrological-data';

export {
  PLANET_SYMBOLS,
  ZODIAC_SIGNS,
  ZODIAC_SYMBOLS,
  ZODIAC_COLORS,
  ASPECT_SYMBOLS,
  ASPECT_DEFINITIONS,
  TRANSIT_COLORS,
  EXTENDED_PLANET_NAMES,
  CORE_ASPECT_BODIES
};

// Utility functions for getting symbols and colors
export function getPlanetSymbol(planet: string): string {
  return PLANET_SYMBOLS[planet] || planet;
}

export function getZodiacSymbol(sign: string): string {
  return ZODIAC_SYMBOLS[sign] || sign;
}

export function getAspectSymbol(aspect: string): string {
  return ASPECT_SYMBOLS[aspect] || aspect;
}

export function getAspectColor(aspect: string): string {
  return (ASPECT_DEFINITIONS as any)[aspect]?.color || '#666';
}

export function getTransitColor(planet: string): string {
  return TRANSIT_COLORS[planet] || '#ff9500';
}

export function getZodiacColor(sign: string): string {
  return ZODIAC_COLORS[sign] || '#666';
} 