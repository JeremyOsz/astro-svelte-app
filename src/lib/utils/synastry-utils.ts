import { ASPECT_DEFINITIONS, ZODIAC_SIGNS } from '$lib/data/astrological-data';

export interface PlanetData {
  planet: string;
  sign: string;
  degree: number;
  minute: number;
  angle: number; // absolute ecliptic longitude 0-360
  house?: number;
}

export interface SynastryAspect {
  person1Planet: string;
  person2Planet: string;
  aspect: string;
  orb: number;
}

/**
 * Parse the CSV chartData returned from Swiss Ephemeris (or stored) into structured PlanetData.
 * Expected line format: "Sun, Aries, 15°23', 11" (optional house)
 */
export function parseChartCSV(chartData: string): PlanetData[] {
  if (!chartData) return [];
  const planets: PlanetData[] = [];
  const lines = chartData.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split(',');
    if (parts.length < 3) continue;

    let planet = parts[0].trim();
    const sign = parts[1].trim();
    const degreeStr = parts[2].trim();
    const housePart = parts.length >= 4 ? parts[3].trim() : undefined;

    // normalise angle names
    if (planet === 'Asc') planet = 'ASC';
    if (planet === 'Mc') planet = 'MC';
    if (planet === 'Dsc') planet = 'DSC';
    if (planet === 'Ic') planet = 'IC';

    const match = degreeStr.match(/(\d+)°(\d+)'/);
    if (!match) continue;
    const degree = parseInt(match[1]);
    const minute = parseInt(match[2]);
    const signIndex = ZODIAC_SIGNS.indexOf(sign as any);
    if (signIndex === -1) continue;
    const absolute = signIndex * 30 + degree + minute / 60;

    const data: PlanetData = {
      planet,
      sign,
      degree,
      minute,
      angle: absolute
    };
    if (housePart && !isNaN(parseInt(housePart))) {
      data.house = parseInt(housePart);
    }
    planets.push(data);
  }
  return planets;
}

export function calculateSynastryAspects(person1: PlanetData[], person2: PlanetData[]): SynastryAspect[] {
  const aspects: SynastryAspect[] = [];
  const corePlanets1 = person1.filter(p => !['ASC', 'MC', 'DSC', 'IC'].includes(p.planet));
  const corePlanets2 = person2.filter(p => !['ASC', 'MC', 'DSC', 'IC'].includes(p.planet));

  for (const p1 of corePlanets1) {
    for (const p2 of corePlanets2) {
      const angleDiff = Math.abs(p1.angle - p2.angle);
      const minAngle = Math.min(angleDiff, 360 - angleDiff);
      for (const [aspectName, def] of Object.entries(ASPECT_DEFINITIONS)) {
        const orb = Math.abs(minAngle - def.angle);
        if (orb <= def.orb) {
          aspects.push({
            person1Planet: p1.planet,
            person2Planet: p2.planet,
            aspect: aspectName,
            orb: parseFloat(orb.toFixed(2))
          });
          break;
        }
      }
    }
  }
  return aspects;
}
