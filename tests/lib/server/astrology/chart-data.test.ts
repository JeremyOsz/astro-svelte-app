import { describe, expect, it } from 'vitest';
import {
  buildNatalChartFromChartData,
  compactChartSummary,
  parseChartData,
  transformChartData
} from '../../../../src/lib/server/astrology/chart-data';

describe('server astrology chart data utilities', () => {
  it('transforms ephemeris object data into chart CSV with houses', () => {
    const chartData = transformChartData({
      objects: {
        sun: {
          name: 'Sun',
          longitude: { raw: 17.15 },
          house: { number: 1 },
          movement: { retrograde: false }
        },
        node: {
          name: 'North Node',
          longitude: { raw: 280.5 },
          house: { number: 10 },
          movement: { retrograde: true }
        },
        house1: {
          name: '1st House',
          longitude: { raw: 0 }
        }
      },
      houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
      ascendant: 0,
      mc: 270
    });

    expect(chartData).toContain("Sun,Aries,17°08',1");
    expect(chartData).toContain("Node,Capricorn,10°30',10,R");
    expect(chartData).toContain("ASC,Aries,0°00'");
    expect(chartData).toContain('#HOUSES:0,30,60,90,120,150,180,210,240,270,300,330');
  });

  it('parses chart CSV into placements and aspects', () => {
    const parsed = parseChartData(`Sun,Aries,10°00',1
Moon,Aries,12°00',1
ASC,Aries,0°00'
#HOUSES:0,30,60,90,120,150,180,210,240,270,300,330`);

    expect(parsed.placements).toHaveLength(3);
    expect(parsed.placements[0]).toMatchObject({
      planet: 'Sun',
      sign: 'Aries',
      degree: 10,
      house: 1
    });
    expect(parsed.aspects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          planet1: 'Sun',
          planet2: 'Moon',
          aspect: 'Conjunction'
        })
      ])
    );
  });

  it('builds natal chart objects from chart CSV and birth data', () => {
    const natalChart = buildNatalChartFromChartData(
      {
        date: '1990-01-01',
        time: '12:00',
        place: 'London',
        latitude: 51.5,
        longitude: -0.12
      },
      `Sun,Aries,10°00',1
ASC,Aries,0°00'
#HOUSES:0,30,60,90,120,150,180,210,240,270,300,330`
    );

    expect(natalChart.planets[0]).toMatchObject({
      name: 'Sun',
      longitude: 10
    });
    expect(natalChart.houses).toHaveLength(12);
    expect(natalChart.latitude).toBe(51.5);
  });

  it('creates compact model-facing summaries', () => {
    expect(compactChartSummary("Sun,Aries,10°00',1\nMoon,Cancer,12°00',4")).toContain(
      'Sun 10°00'
    );
  });
});
