import { describe, expect, it } from 'vitest';
import {
  calculateTransitAspectRows,
  classifyOrbStrength,
  DEFAULT_TRANSIT_ORB_LIMITS,
  sortTransitAspectRows,
  type TransitAspectRow
} from '../../../src/lib/astrology/transit-aspects';

function planet(name: string, longitude: number) {
  return {
    name,
    longitude,
    latitude: 0,
    distance: 1,
    sign: 'Aries',
    degree: longitude % 30
  };
}

function chart(planets: ReturnType<typeof planet>[]) {
  return {
    planets,
    houses: Array.from({ length: 12 }, (_, index) => ({
      house: index + 1,
      longitude: index * 30
    })),
    ascendant: 0,
    mc: 90,
    date: new Date('1990-01-01T12:00:00Z'),
    latitude: 0,
    longitude: 0
  };
}

describe('transit aspect helpers', () => {
  it('classifies exact, strong, and wide orb bands', () => {
    expect(classifyOrbStrength(0.5, 6)).toBe('Exact');
    expect(classifyOrbStrength(2.5, 6)).toBe('Strong');
    expect(classifyOrbStrength(4.5, 6)).toBe('Wide');
  });

  it('includes trines up to the default 6 degree transit orb', () => {
    const rows = calculateTransitAspectRows(
      chart([planet('Sun', 0)]),
      chart([planet('Jupiter', 125.9)])
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      transitPlanet: 'Jupiter',
      aspect: 'Trine',
      natalPlanet: 'Sun',
      orbStrength: 'Wide'
    });
    expect(rows[0].orb).toBeCloseTo(5.9);
  });

  it('excludes trines beyond the default 6 degree transit orb', () => {
    const rows = calculateTransitAspectRows(
      chart([planet('Sun', 0)]),
      chart([planet('Jupiter', 126.1)])
    );

    expect(rows).toHaveLength(0);
  });

  it('uses a 4 degree default orb for sextiles', () => {
    const included = calculateTransitAspectRows(
      chart([planet('Sun', 0)]),
      chart([planet('Venus', 63.9)])
    );
    const excluded = calculateTransitAspectRows(
      chart([planet('Sun', 0)]),
      chart([planet('Venus', 64.1)])
    );

    expect(included).toHaveLength(1);
    expect(included[0].aspect).toBe('Sextile');
    expect(included[0].maxOrb).toBe(DEFAULT_TRANSIT_ORB_LIMITS.Sextile);
    expect(excluded).toHaveLength(0);
  });

  it('excludes quincunx from the default main transit view', () => {
    const rows = calculateTransitAspectRows(
      chart([planet('Sun', 0)]),
      chart([planet('Mars', 150)])
    );

    expect(rows).toHaveLength(0);
  });

  it('sorts by orb band, slower transit planets, hard aspects, then planet order', () => {
    const baseRow: TransitAspectRow = {
      transitPlanet: 'Mars',
      transitSymbol: '♂',
      aspect: 'Trine',
      aspectSymbol: '△',
      natalPlanet: 'Sun',
      natalSymbol: '☉',
      orb: 2,
      maxOrb: 6,
      orbStrength: 'Strong',
      transitLongitude: 0,
      natalLongitude: 0,
      transitHouse: 1,
      transitSign: 'Aries',
      color: '#0000FF',
      weight: 2,
      style: 'solid'
    };

    const rows = sortTransitAspectRows([
      { ...baseRow, transitPlanet: 'Mars', aspect: 'Square', natalPlanet: 'Mercury', orbStrength: 'Wide', orb: 4 },
      { ...baseRow, transitPlanet: 'Pluto', aspect: 'Trine', natalPlanet: 'Sun', orbStrength: 'Strong', orb: 2.8 },
      { ...baseRow, transitPlanet: 'Mars', aspect: 'Opposition', natalPlanet: 'Moon', orbStrength: 'Strong', orb: 2.1 },
      { ...baseRow, transitPlanet: 'Pluto', aspect: 'Square', natalPlanet: 'Moon', orbStrength: 'Strong', orb: 2.2 },
      { ...baseRow, transitPlanet: 'Saturn', aspect: 'Conjunction', natalPlanet: 'Sun', orbStrength: 'Exact', orb: 0.8 },
      { ...baseRow, transitPlanet: 'Pluto', aspect: 'Sextile', natalPlanet: 'Mercury', orbStrength: 'Wide', orb: 4 }
    ]);

    expect(rows.map((row) => `${row.transitPlanet} ${row.aspect} ${row.natalPlanet}`)).toEqual([
      'Saturn Conjunction Sun',
      'Pluto Square Moon',
      'Pluto Trine Sun',
      'Mars Opposition Moon',
      'Pluto Sextile Mercury',
      'Mars Square Mercury'
    ]);
  });
});
