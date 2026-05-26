import type { NatalChart, Planet, TransitChart } from '$lib/types/types';
import { ASPECT_DEFINITIONS, PLANET_SYMBOLS } from '$lib/data/astrological-data';
import { ASPECT_SYMBOLS } from '$lib/data/symbols';

export const MAIN_TRANSIT_PLANETS = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto'
] as const;

export const MAJOR_TRANSIT_ASPECTS = [
  'Conjunction',
  'Opposition',
  'Square',
  'Trine',
  'Sextile'
] as const;

export const DEFAULT_TRANSIT_ORB_LIMITS = {
  Conjunction: 6,
  Opposition: 6,
  Square: 6,
  Trine: 6,
  Sextile: 4
} satisfies Record<MajorTransitAspect, number>;

export type MainTransitPlanet = (typeof MAIN_TRANSIT_PLANETS)[number];
export type MajorTransitAspect = (typeof MAJOR_TRANSIT_ASPECTS)[number];
export type OrbStrength = 'Exact' | 'Strong' | 'Wide';

export interface TransitAspectRow {
  transitPlanet: string;
  transitSymbol: string;
  aspect: string;
  aspectSymbol: string;
  natalPlanet: string;
  natalSymbol: string;
  orb: number;
  maxOrb: number;
  orbStrength: OrbStrength;
  transitLongitude: number;
  natalLongitude: number;
  transitHouse: number | null;
  transitSign: string;
  color: string;
  weight: number;
  style: string;
}

export interface TransitAspectOptions {
  aspects?: readonly string[];
  natalBodies?: readonly string[];
  transitBodies?: readonly string[];
  orbLimits?: Record<string, number>;
  includeNatalPoints?: boolean;
  includeMinorAspects?: boolean;
  sort?: boolean;
}

type PlanetLike = Partial<Planet> & {
  name?: string;
  planet?: string;
  angle?: number;
  longitude?: Planet['longitude'] | number;
};

const DEFAULT_SORT = true;
const SENSITIVE_POINTS = ['ASC', 'MC', 'DSC', 'IC', 'Node', 'S.Node', 'Lilith', 'Chiron', 'Fortune', 'Vertex'];
const HARD_ASPECTS = ['Conjunction', 'Opposition', 'Square'];
const PLANET_ORDER = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const TRANSIT_PRIORITY = ['Pluto', 'Neptune', 'Uranus', 'Saturn', 'Jupiter', 'Mars', 'Venus', 'Mercury', 'Sun', 'Moon'];

export function classifyOrbStrength(orb: number, _maxOrb: number): OrbStrength {
  if (orb <= 1) return 'Exact';
  if (orb <= 3) return 'Strong';
  return 'Wide';
}

export function formatTransitOrb(orb: number): string {
  const degrees = Math.floor(orb);
  const minutes = Math.round((orb - degrees) * 60);
  if (minutes === 60) {
    return `${degrees + 1}°00'`;
  }
  return `${degrees}°${String(minutes).padStart(2, '0')}'`;
}

export function calculateTransitAspectRows(
  natalChart: Pick<NatalChart, 'planets' | 'houses'> | null | undefined,
  currentTransits: Pick<TransitChart, 'planets' | 'objects'> | null | undefined,
  options: TransitAspectOptions = {}
): TransitAspectRow[] {
  const natalPlanets = getPlanets(natalChart);
  const transitPlanets = getPlanets(currentTransits);
  if (natalPlanets.length === 0 || transitPlanets.length === 0) return [];

  const aspectNames = options.aspects ?? (
    options.includeMinorAspects ? Object.keys(ASPECT_DEFINITIONS) : MAJOR_TRANSIT_ASPECTS
  );
  const natalBodies = options.natalBodies ?? (
    options.includeNatalPoints ? [...MAIN_TRANSIT_PLANETS, ...SENSITIVE_POINTS] : MAIN_TRANSIT_PLANETS
  );
  const transitBodies = options.transitBodies ?? MAIN_TRANSIT_PLANETS;
  const orbLimits: Record<string, number> = options.orbLimits ?? DEFAULT_TRANSIT_ORB_LIMITS;
  const shouldSort = options.sort ?? DEFAULT_SORT;

  const rows: TransitAspectRow[] = [];

  for (const transitPlanet of transitPlanets) {
    const transitName = getPlanetName(transitPlanet);
    if (!transitName || !transitBodies.includes(transitName)) continue;

    const transitLongitude = getLongitude(transitPlanet);
    if (transitLongitude === null) continue;

    for (const natalPlanet of natalPlanets) {
      const natalName = getPlanetName(natalPlanet);
      if (!natalName || !natalBodies.includes(natalName)) continue;

      const natalLongitude = getLongitude(natalPlanet);
      if (natalLongitude === null) continue;

      const diff = getAngularDistance(transitLongitude, natalLongitude);

      for (const aspectName of aspectNames) {
        const aspectDef = ASPECT_DEFINITIONS[aspectName as keyof typeof ASPECT_DEFINITIONS];
        if (!aspectDef) continue;

        const maxOrb = orbLimits[aspectName] ?? aspectDef.orb;
        const orb = Math.abs(diff - aspectDef.angle);
        if (orb > maxOrb) continue;

        rows.push({
          transitPlanet: transitName,
          transitSymbol: PLANET_SYMBOLS[transitName] || transitName,
          aspect: aspectName,
          aspectSymbol: ASPECT_SYMBOLS[aspectName] || aspectName,
          natalPlanet: natalName,
          natalSymbol: PLANET_SYMBOLS[natalName] || natalName,
          orb,
          maxOrb,
          orbStrength: classifyOrbStrength(orb, maxOrb),
          transitLongitude,
          natalLongitude,
          transitHouse: getHouseForLongitude(transitLongitude, natalChart?.houses ?? []),
          transitSign: getSignName(transitPlanet, transitLongitude),
          color: aspectDef.color,
          weight: aspectDef.weight,
          style: aspectDef.style
        });
        break;
      }
    }
  }

  return shouldSort ? sortTransitAspectRows(rows) : rows;
}

export function sortTransitAspectRows(rows: TransitAspectRow[]): TransitAspectRow[] {
  return [...rows].sort((a, b) => {
    const strengthDiff = orbStrengthRank(a.orbStrength) - orbStrengthRank(b.orbStrength);
    if (strengthDiff !== 0) return strengthDiff;

    const transitDiff = getTransitPriority(a.transitPlanet) - getTransitPriority(b.transitPlanet);
    if (transitDiff !== 0) return transitDiff;

    const aspectDiff = getAspectPriority(a.aspect) - getAspectPriority(b.aspect);
    if (aspectDiff !== 0) return aspectDiff;

    const planetDiff = getPlanetOrder(a.natalPlanet) - getPlanetOrder(b.natalPlanet);
    if (planetDiff !== 0) return planetDiff;

    return a.orb - b.orb;
  });
}

function getPlanets(chart: { planets?: PlanetLike[]; objects?: Record<string, PlanetLike> } | null | undefined): PlanetLike[] {
  if (!chart) return [];
  if (Array.isArray(chart.planets)) return chart.planets;
  if (chart.objects && typeof chart.objects === 'object') {
    return Object.values(chart.objects).filter((object) => object && getPlanetName(object) && getLongitude(object) !== null);
  }
  return [];
}

function getPlanetName(planet: PlanetLike): string {
  return planet.name || planet.planet || '';
}

function getLongitude(planet: PlanetLike): number | null {
  if (typeof planet.longitude === 'number') return normalizeDegree(planet.longitude);
  if (planet.longitude && typeof planet.longitude === 'object' && typeof planet.longitude.raw === 'number') {
    return normalizeDegree(planet.longitude.raw);
  }
  if (typeof planet.angle === 'number') return normalizeDegree(planet.angle);
  return null;
}

function getSignName(planet: PlanetLike, longitude: number): string {
  if (typeof planet.sign === 'string') return planet.sign;
  if (planet.sign && typeof planet.sign === 'object' && 'name' in planet.sign) return planet.sign.name;
  const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  return signNames[Math.floor(normalizeDegree(longitude) / 30)] || 'Aries';
}

function getAngularDistance(longitudeA: number, longitudeB: number): number {
  const angleDiff = Math.abs(normalizeDegree(longitudeA) - normalizeDegree(longitudeB));
  return Math.min(angleDiff, 360 - angleDiff);
}

function getHouseForLongitude(longitude: number, houses: any[]): number | null {
  if (!houses || houses.length === 0) return null;
  const normalizedLongitude = normalizeDegree(longitude);

  for (let index = 0; index < houses.length; index++) {
    const currentCusp = normalizeDegree(getHouseLongitude(houses[index]));
    const nextCusp = normalizeDegree(getHouseLongitude(houses[(index + 1) % houses.length]));
    let end = nextCusp;
    let testLongitude = normalizedLongitude;

    if (end <= currentCusp) end += 360;
    if (testLongitude < currentCusp) testLongitude += 360;

    if (testLongitude >= currentCusp && testLongitude < end) {
      return index + 1;
    }
  }

  return null;
}

function getHouseLongitude(house: any): number {
  if (typeof house === 'number') return house;
  return typeof house?.longitude === 'number' ? house.longitude : 0;
}

function normalizeDegree(degree: number): number {
  return ((degree % 360) + 360) % 360;
}

function orbStrengthRank(strength: OrbStrength): number {
  if (strength === 'Exact') return 0;
  if (strength === 'Strong') return 1;
  return 2;
}

function getTransitPriority(planet: string): number {
  const index = TRANSIT_PRIORITY.indexOf(planet);
  return index === -1 ? TRANSIT_PRIORITY.length : index;
}

function getAspectPriority(aspect: string): number {
  if (HARD_ASPECTS.includes(aspect)) return 0;
  return 1;
}

function getPlanetOrder(planet: string): number {
  const index = PLANET_ORDER.indexOf(planet);
  return index === -1 ? PLANET_ORDER.length : index;
}
