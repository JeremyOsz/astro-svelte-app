import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  calculateBirthChartInputSchema,
  calculateDailyHoroscopeInputSchema,
  calculateSynastryInputSchema,
  calculateTransitsInputSchema
} from '../../../../src/lib/server/mcp/astrology-tools';

describe('MCP astrology tool schemas', () => {
  it('accepts birth chart input and defaults unknown time to noon', () => {
    const parsed = z.object(calculateBirthChartInputSchema).parse({
      date: '1990-01-01',
      place: 'London, UK',
      latitude: 51.5072,
      longitude: -0.1276
    });

    expect(parsed.time).toBe('12:00');
  });

  it('rejects missing coordinates for birth chart input', () => {
    const result = z.object(calculateBirthChartInputSchema).safeParse({
      date: '1990-01-01',
      time: '12:00',
      place: 'London, UK',
      latitude: 51.5072
    });

    expect(result.success).toBe(false);
  });

  it('validates nested transit natal data and defaults transit time', () => {
    const parsed = z.object(calculateTransitsInputSchema).parse({
      natal: {
        date: '1990-01-01',
        time: '12:00',
        place: 'London, UK',
        latitude: 51.5072,
        longitude: -0.1276
      },
      transit_date: '2026-04-22'
    });

    expect(parsed.transit_time).toBe('12:00');
  });

  it('validates synastry relationship types', () => {
    const result = z.object(calculateSynastryInputSchema).safeParse({
      person1: {
        date: '1990-01-01',
        time: '12:00',
        latitude: 51,
        longitude: 0
      },
      person2: {
        date: '1991-01-01',
        time: '13:00',
        latitude: 40,
        longitude: -73
      },
      relationship_type: 'business'
    });

    expect(result.success).toBe(true);
  });

  it('accepts daily horoscope input without an explicit date', () => {
    const result = z.object(calculateDailyHoroscopeInputSchema).safeParse({
      natal: {
        date: '1990-01-01',
        time: '12:00',
        latitude: 51,
        longitude: 0
      }
    });

    expect(result.success).toBe(true);
  });
});
