import { ASPECT_DEFINITIONS, CORE_ASPECT_BODIES, ZODIAC_SIGNS } from '$lib/data/astrological-data';
import type { BirthChart, PlanetPosition } from '$lib/types/types';

export type HouseSystem = 'whole_sign' | 'placidus';

export interface AstrologyBirthData {
  date: string;
  time: string;
  place?: string;
  latitude: number;
  longitude: number;
  house_system?: HouseSystem;
}

export interface ParsedChartPlacement {
  planet: string;
  sign: string;
  degree: number;
  minute: number;
  house: number;
  longitude: number;
  retrograde: boolean;
}

export interface ParsedChartAspect {
  planet1: string;
  planet2: string;
  aspect: string;
  orb: number;
}

export interface ParsedChartData {
  placements: ParsedChartPlacement[];
  houseCusps: number[];
  aspects: ParsedChartAspect[];
}

const NAME_MAPPINGS: Record<string, string> = {
  'North Node': 'Node',
  'Part of Fortune': 'Fortune',
  Ascendant: 'ASC',
  Midheaven: 'MC'
};
const ZODIAC_SIGN_NAMES = ZODIAC_SIGNS as readonly string[];

function normalizeName(name: string): string {
  return NAME_MAPPINGS[name] || name;
}

function longitudeToSignDegree(longitude: number) {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degreeInSign = normalized % 30;
  const degrees = Math.floor(degreeInSign);
  const minutes = Math.floor((degreeInSign - degrees) * 60);

  return {
    sign: ZODIAC_SIGNS[signIndex] || 'Aries',
    degrees,
    minutes,
    longitude: normalized
  };
}

function getObjectLongitude(object: any): number | null {
  if (typeof object?.longitude === 'number') return object.longitude;
  if (typeof object?.longitude?.raw === 'number') return object.longitude.raw;
  return null;
}

function getObjectHouse(object: any): string | number {
  if (typeof object?.house === 'number') return object.house;
  if (typeof object?.house?.number === 'number') return object.house.number;
  return '';
}

function getHouseCusps(apiResponse: any): number[] {
  const houses = apiResponse?.houses || apiResponse?.native?.houses;
  if (Array.isArray(houses)) {
    return houses
      .map((house: any) => (typeof house === 'number' ? house : house?.longitude))
      .filter((house: unknown): house is number => typeof house === 'number' && Number.isFinite(house));
  }

  const houseCusps: number[] = [];
  if (apiResponse?.objects) {
    Object.values(apiResponse.objects).forEach((object: any) => {
      if (object?.name?.includes?.('House')) {
        const longitude = getObjectLongitude(object);
        if (longitude !== null) houseCusps.push(longitude);
      }
    });
  }

  return houseCusps.sort((a, b) => a - b);
}

export function transformChartData(apiResponse: any): string {
  const lines: string[] = [];
  const houseCusps = getHouseCusps(apiResponse);

  if (apiResponse?.objects) {
    Object.values(apiResponse.objects).forEach((object: any) => {
      const longitude = getObjectLongitude(object);
      if (!object?.name || longitude === null || object.name.includes('House')) return;

      const name = normalizeName(object.name);
      const { sign, degrees, minutes } = longitudeToSignDegree(longitude);
      const house = getObjectHouse(object);
      let line = `${name},${sign},${degrees}°${minutes.toString().padStart(2, '0')}'`;

      if (house !== '') line += `,${house}`;
      if (object?.movement?.retrograde || object?.retrograde) line += ',R';

      lines.push(line);
    });
  } else if (Array.isArray(apiResponse?.planets)) {
    apiResponse.planets.forEach((planet: any) => {
      const longitude =
        typeof planet.longitude === 'number'
          ? planet.longitude
          : typeof planet.longitude?.raw === 'number'
            ? planet.longitude.raw
            : null;
      if (!planet?.name || longitude === null) return;

      const sign =
        typeof planet.sign === 'string'
          ? planet.sign
          : planet.sign?.name || longitudeToSignDegree(longitude).sign;
      const degree = Number.isFinite(planet.degree)
        ? planet.degree
        : longitudeToSignDegree(longitude).degrees;
      const degrees = Math.floor(degree);
      const minutes = Math.floor((degree - degrees) * 60);
      const house = getObjectHouse(planet);

      let line = `${normalizeName(planet.name)},${sign},${degrees}°${minutes.toString().padStart(2, '0')}'`;
      if (house !== '') line += `,${house}`;
      if (planet?.movement?.retrograde || planet?.retrograde) line += ',R';
      lines.push(line);
    });
  }

  const ascendant = apiResponse?.native?.ascendant?.longitude ?? apiResponse?.ascendant;
  if (typeof ascendant === 'number' && !lines.some((line) => line.startsWith('ASC,'))) {
    const { sign, degrees, minutes } = longitudeToSignDegree(ascendant);
    lines.push(`ASC,${sign},${degrees}°${minutes.toString().padStart(2, '0')}'`);
  }

  const mc = apiResponse?.native?.mc?.longitude ?? apiResponse?.mc;
  if (typeof mc === 'number' && !lines.some((line) => line.startsWith('MC,'))) {
    const { sign, degrees, minutes } = longitudeToSignDegree(mc);
    lines.push(`MC,${sign},${degrees}°${minutes.toString().padStart(2, '0')}'`);
  }

  if (houseCusps.length === 12) {
    lines.push(`#HOUSES:${houseCusps.join(',')}`);
  }

  return lines.join('\n');
}

export function parseChartData(chartData: string): ParsedChartData {
  const placements: ParsedChartPlacement[] = [];
  const houseCuspsLine = chartData
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('#HOUSES:'));
  const houseCusps =
    houseCuspsLine
      ?.replace('#HOUSES:', '')
      .split(',')
      .map((value) => Number.parseFloat(value.trim()))
      .filter((value) => Number.isFinite(value)) ?? [];

  chartData.split('\n').forEach((line) => {
    if (!line.trim() || line.startsWith('#')) return;

    const [rawPlanet, rawSign, rawDegree, ...extras] = line.split(',').map((part) => part.trim());
    const degreeMatch = rawDegree?.match(/^(\d+)°(\d+)'$/);
    if (!rawPlanet || !rawSign || !degreeMatch || !ZODIAC_SIGN_NAMES.includes(rawSign)) return;

    const degree = Number.parseInt(degreeMatch[1], 10);
    const minute = Number.parseInt(degreeMatch[2], 10);
    const signIndex = ZODIAC_SIGN_NAMES.indexOf(rawSign);
    const longitude = signIndex * 30 + degree + minute / 60;
    const houseValue = extras.find((part) => /^\d+$/.test(part));

    placements.push({
      planet: normalizeName(rawPlanet),
      sign: rawSign,
      degree,
      minute,
      longitude,
      house: houseValue ? Number.parseInt(houseValue, 10) : 0,
      retrograde: extras.includes('R')
    });
  });

  const ascendant = placements.find((placement) => placement.planet === 'ASC');
  if (ascendant) {
    const ascSignIndex = ZODIAC_SIGN_NAMES.indexOf(ascendant.sign);
    placements.forEach((placement) => {
      if (!placement.house) {
        const planetSignIndex = ZODIAC_SIGN_NAMES.indexOf(placement.sign);
        placement.house = ((planetSignIndex - ascSignIndex + 12) % 12) + 1;
      }
    });
  }

  const aspects: ParsedChartAspect[] = [];
  const corePlacements = placements.filter((placement) => CORE_ASPECT_BODIES.includes(placement.planet));
  for (let i = 0; i < corePlacements.length; i += 1) {
    for (let j = i + 1; j < corePlacements.length; j += 1) {
      const p1 = corePlacements[i];
      const p2 = corePlacements[j];
      const angleDiff = Math.abs(p1.longitude - p2.longitude);
      const minAngle = Math.min(angleDiff, 360 - angleDiff);

      for (const [aspect, definition] of Object.entries(ASPECT_DEFINITIONS)) {
        if (Math.abs(minAngle - definition.angle) <= definition.orb) {
          aspects.push({
            planet1: p1.planet,
            planet2: p2.planet,
            aspect,
            orb: Number.parseFloat(Math.abs(minAngle - definition.angle).toFixed(2))
          });
        }
      }
    }
  }

  return { placements, houseCusps, aspects };
}

export function buildNatalChartFromChartData(
  birthData: AstrologyBirthData,
  chartData: string
): BirthChart {
  const parsed = parseChartData(chartData);
  const planets: PlanetPosition[] = parsed.placements.map((placement) => ({
    name: placement.planet,
    longitude: placement.longitude,
    latitude: 0,
    distance: 1,
    sign: placement.sign,
    degree: placement.degree + placement.minute / 60,
    house: placement.house,
    retrograde: placement.retrograde
  }));
  const ascendant = planets.find((planet) => planet.name === 'ASC')?.longitude ?? 0;
  const mc = planets.find((planet) => planet.name === 'MC')?.longitude ?? 0;
  const houses =
    parsed.houseCusps.length === 12
      ? parsed.houseCusps
      : Array.from({ length: 12 }, (_, index) => {
          const ascSignIndex = Math.floor(ascendant / 30);
          return ((ascSignIndex + index) % 12) * 30;
        });

  return {
    planets,
    houses,
    ascendant,
    mc,
    date: new Date(`${birthData.date}T${birthData.time || '12:00'}:00`),
    latitude: birthData.latitude,
    longitude: birthData.longitude
  };
}

function calculateHouseForPlanet(planetLongitude: number, houseCusps: number[]): number {
  if (!houseCusps.length) return 1;

  const normalizedLongitude = ((planetLongitude % 360) + 360) % 360;
  for (let i = 0; i < houseCusps.length; i += 1) {
    const currentCusp = ((houseCusps[i] % 360) + 360) % 360;
    let nextCusp = ((houseCusps[(i + 1) % houseCusps.length] % 360) + 360) % 360;
    let testLongitude = normalizedLongitude;

    if (nextCusp <= currentCusp) nextCusp += 360;
    if (testLongitude < currentCusp) testLongitude += 360;
    if (testLongitude >= currentCusp && testLongitude < nextCusp) return i + 1;
  }

  return 1;
}

export function convertTransitDataToChartData(transitData: any, natalChart?: BirthChart): string {
  const planets = Array.isArray(transitData?.planets)
    ? transitData.planets
    : transitData?.objects && typeof transitData.objects === 'object'
      ? Object.values(transitData.objects)
      : Array.isArray(transitData)
        ? transitData
        : [];

  const houseCusps = Array.isArray(natalChart?.houses)
    ? natalChart.houses
    : Array.isArray(transitData?.houses)
      ? transitData.houses.map((house: any) => (typeof house === 'number' ? house : house?.longitude || 0))
      : [];
  const lines: string[] = [];

  if (houseCusps.length === 12) {
    lines.push(`#HOUSES:${houseCusps.join(',')}`);
  }

  planets.forEach((planet: any) => {
    const longitude =
      typeof planet?.longitude === 'number'
        ? planet.longitude
        : typeof planet?.longitude?.raw === 'number'
          ? planet.longitude.raw
          : null;
    if (!planet?.name || longitude === null) return;

    const { sign, degrees, minutes } = longitudeToSignDegree(longitude);
    const house = calculateHouseForPlanet(longitude, houseCusps);
    const retrograde = planet?.movement?.retrograde || planet?.retrograde ? ',R' : '';
    lines.push(`${normalizeName(planet.name)},${planet.sign?.name || planet.sign || sign},${degrees}°${minutes.toString().padStart(2, '0')}',${house}${retrograde}`);
  });

  return lines.join('\n');
}

export function compactChartSummary(chartData: string): string {
  const parsed = parseChartData(chartData);
  const placements = parsed.placements
    .filter((placement) =>
      ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'ASC', 'MC'].includes(
        placement.planet
      )
    )
    .slice(0, 9)
    .map(
      (placement) =>
        `${placement.planet} ${placement.degree}°${placement.minute.toString().padStart(2, '0')}' ${placement.sign}${placement.house ? ` house ${placement.house}` : ''}${placement.retrograde ? ' retrograde' : ''}`
    );

  const aspects = parsed.aspects
    .slice(0, 8)
    .map((aspect) => `${aspect.planet1} ${aspect.aspect} ${aspect.planet2} orb ${aspect.orb}°`);

  return [
    `Placements: ${placements.join('; ') || 'none'}`,
    `Aspects: ${aspects.join('; ') || 'none'}`
  ].join('\n');
}
