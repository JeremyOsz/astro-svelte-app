import type { Planet, TransitAspect } from '$lib/types/types';
import { ASPECT_DEFINITIONS } from '$lib/data/astrological-data';

export interface TransitPeriod {
  startDate: Date;
  endDate: Date;
  exactDate?: Date;
  isActive: boolean;
  orb: number;
  aspectType: string;
}

/**
 * Calculate the date range when a transit aspect is active
 * This is a simplified calculation - in practice, you'd want to use ephemeris data
 * to calculate exact ingress and egress dates
 */
export function calculateTransitPeriod(
  transitPlanet: Planet,
  natalPlanet: Planet,
  aspectType: string,
  currentDate: Date,
  orb: number
): TransitPeriod {
  const aspectDef = ASPECT_DEFINITIONS[aspectType as keyof typeof ASPECT_DEFINITIONS];
  if (!aspectDef) {
    return {
      startDate: currentDate,
      endDate: currentDate,
      isActive: true,
      orb,
      aspectType
    };
  }

  // Extract longitudes
  const transitLongitude = typeof transitPlanet.longitude === 'number' 
    ? transitPlanet.longitude 
    : transitPlanet.longitude.raw;
  
  const natalLongitude = typeof natalPlanet.longitude === 'number' 
    ? natalPlanet.longitude 
    : natalPlanet.longitude.raw;

  // Calculate current orb
  const angleDiff = Math.abs(transitLongitude - natalLongitude);
  const diff = Math.min(angleDiff, 360 - angleDiff);
  const currentOrb = Math.abs(diff - aspectDef.angle);

  // For now, we'll estimate the period based on the planet's speed
  // This is a simplified approach - in practice, you'd calculate exact dates
  const planetSpeeds: Record<string, number> = {
    'Sun': 1,      // ~1 degree per day
    'Moon': 13,    // ~13 degrees per day
    'Mercury': 1.4, // ~1.4 degrees per day
    'Venus': 1.2,  // ~1.2 degrees per day
    'Mars': 0.5,   // ~0.5 degrees per day
    'Jupiter': 0.08, // ~0.08 degrees per day
    'Saturn': 0.03, // ~0.03 degrees per day
    'Uranus': 0.01, // ~0.01 degrees per day
    'Neptune': 0.006, // ~0.006 degrees per day
    'Pluto': 0.003  // ~0.003 degrees per day
  };

  const planetSpeed = planetSpeeds[transitPlanet.name] || 0.5;
  const daysInOrb = Math.ceil(aspectDef.orb / planetSpeed);

  // Calculate estimated start and end dates
  const startDate = new Date(currentDate);
  startDate.setDate(startDate.getDate() - Math.floor(daysInOrb / 2));

  const endDate = new Date(currentDate);
  endDate.setDate(endDate.getDate() + Math.floor(daysInOrb / 2));

  // Check if aspect is currently exact (within 0.1 degrees)
  const isExact = currentOrb <= 0.1;
  const exactDate = isExact ? currentDate : undefined;

  return {
    startDate,
    endDate,
    exactDate,
    isActive: currentOrb <= aspectDef.orb,
    orb: currentOrb,
    aspectType
  };
}

/**
 * Format a date range for display
 */
export function formatTransitPeriod(period: TransitPeriod): string {
  const startStr = period.startDate.toLocaleDateString();
  const endStr = period.endDate.toLocaleDateString();
  
  if (period.exactDate) {
    const exactStr = period.exactDate.toLocaleDateString();
    return `Active: ${startStr} - ${endStr} (Exact: ${exactStr})`;
  }
  
  return `Active: ${startStr} - ${endStr}`;
}

/**
 * Get a more detailed description of the transit period
 */
export function getTransitPeriodDescription(period: TransitPeriod): string {
  const daysActive = Math.ceil((period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let description = `This transit is active for approximately ${daysActive} days. `;
  
  if (period.exactDate) {
    const today = new Date();
    const daysUntilExact = Math.ceil((period.exactDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExact > 0) {
      description += `The aspect will be exact in ${daysUntilExact} days. `;
    } else if (daysUntilExact < 0) {
      description += `The aspect was exact ${Math.abs(daysUntilExact)} days ago. `;
    } else {
      description += `The aspect is exact today! `;
    }
  }
  
  description += `The current orb is ${period.orb.toFixed(2)}°.`;
  
  return description;
}
