import { julian } from 'astronomia';
import { Planet } from 'astronomia/planetposition';
import { apparentLongitude } from 'astronomia/solar';

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

// Planet definitions for astronomia
const PLANET_NAMES = [
  'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
];

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export function getSignByDegree(degree: number): string {
  const normalizedDegree = degree % 360;
  const signIndex = Math.floor(normalizedDegree / 30);
  return ZODIAC_SIGNS[signIndex];
}

export function getDegreeInSign(degree: number): number {
  return (degree % 30);
}

// Calculate house cusps using Placidus system
function calculateHouses(jd: number, latitude: number, longitude: number): number[] {
  // This is a simplified Placidus calculation
  // For more accurate results, you'd want to use a dedicated house calculation library
  
  // Calculate MC (Midheaven) - simplified
  const mc = (jd * 0.9856 + 280.4606) % 360;
  
  // Calculate Ascendant - simplified
  const asc = (mc + 90 + Math.atan2(Math.cos(latitude * Math.PI / 180), 
                                   Math.sin(latitude * Math.PI / 180) * Math.cos(mc * Math.PI / 180)) * 180 / Math.PI) % 360;
  
  // Generate house cusps (simplified)
  const houses = [];
  for (let i = 1; i <= 12; i++) {
    const houseCusp = (asc + (i - 1) * 30) % 360;
    houses.push(houseCusp);
  }
  
  return houses;
}

// Calculate planetary positions using astronomia
export function calculatePlanetaryPositions(jd: number): PlanetPosition[] {
  const positions: PlanetPosition[] = [];
  
  // Calculate Sun position
  const sunLong = apparentLongitude(jd);
  const sunSign = getSignByDegree(sunLong);
  const sunDegree = getDegreeInSign(sunLong);
  
  positions.push({
    name: 'Sun',
    longitude: sunLong,
    latitude: 0, // Sun's latitude is always 0
    distance: 1, // AU
    sign: sunSign,
    degree: sunDegree
  });
  
  // Calculate Moon position (simplified for now)
  // For now, we'll use a rough approximation
  // In a production app, you'd want to use proper Moon ephemeris
  const moonLong = (sunLong + 90) % 360; // Rough approximation
  const moonSign = getSignByDegree(moonLong);
  const moonDegree = getDegreeInSign(moonLong);
  
  positions.push({
    name: 'Moon',
    longitude: moonLong,
    latitude: 0, // Simplified
    distance: 384400, // km
    sign: moonSign,
    degree: moonDegree
  });
  
  // Calculate other planets
  PLANET_NAMES.forEach(planetName => {
    try {
      const planet = new Planet(jd, planetName);
      const long = planet.lon;
      const lat = planet.lat;
      const sign = getSignByDegree(long);
      const degree = getDegreeInSign(long);
      
      positions.push({
        name: planetName,
        longitude: long,
        latitude: lat,
        distance: planet.range,
        sign: sign,
        degree: degree
      });
    } catch (error) {
      console.warn(`Could not calculate position for ${planetName}:`, error);
    }
  });
  
  return positions;
}

// Calculate birth chart
export function calculateBirthChart(
  date: Date, 
  latitude: number, 
  longitude: number
): BirthChart {
  const jd = julian.DateToJD(date);
  
  const planets = calculatePlanetaryPositions(jd);
  const houses = calculateHouses(jd, latitude, longitude);
  
  // Calculate Ascendant and MC
  const mc = (jd * 0.9856 + 280.4606) % 360;
  const asc = (mc + 90 + Math.atan2(Math.cos(latitude * Math.PI / 180), 
                                   Math.sin(latitude * Math.PI / 180) * Math.cos(mc * Math.PI / 180)) * 180 / Math.PI) % 360;
  
  // Assign houses to planets
  planets.forEach(planet => {
    planet.house = assignHouse(planet.longitude, houses);
  });
  
  return {
    planets,
    houses,
    ascendant: asc,
    mc: mc,
    date,
    latitude,
    longitude
  };
}

// Assign planet to house
function assignHouse(planetLongitude: number, houses: number[]): number {
  for (let i = 0; i < houses.length; i++) {
    const nextHouse = houses[(i + 1) % 12];
    const currentHouse = houses[i];
    
    if (currentHouse <= nextHouse) {
      if (planetLongitude >= currentHouse && planetLongitude < nextHouse) {
        return i + 1;
      }
    } else {
      // Handle case where house spans 0°
      if (planetLongitude >= currentHouse || planetLongitude < nextHouse) {
        return i + 1;
      }
    }
  }
  return 1; // Default to first house
}

// Calculate transits
export function calculateTransits(
  natalChart: BirthChart,
  transitDate: Date
): TransitData[] {
  const jd = julian.DateToJD(transitDate);
  const transitPlanets = calculatePlanetaryPositions(jd);
  
  const transits: TransitData[] = [];
  
  transitPlanets.forEach(transitPlanet => {
    const natalPlanet = natalChart.planets.find(p => p.name === transitPlanet.name);
    
    if (natalPlanet) {
      const aspect = calculateAspect(transitPlanet.longitude, natalPlanet.longitude);
      
      transits.push({
        planet: transitPlanet.name,
        currentLongitude: transitPlanet.longitude,
        currentSign: transitPlanet.sign,
        currentDegree: transitPlanet.degree,
        natalLongitude: natalPlanet.longitude,
        natalSign: natalPlanet.sign,
        natalDegree: natalPlanet.degree,
        aspect
      });
    }
  });
  
  return transits;
}

// Calculate aspects between two longitudes
function calculateAspect(long1: number, long2: number): { type: string; orb: number; exact: boolean } | undefined {
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

// Calculate current planetary positions
export function getCurrentPlanetaryPositions(): PlanetPosition[] {
  const now = new Date();
  const jd = julian.DateToJD(now);
  return calculatePlanetaryPositions(jd);
} 