import { describe, expect, it } from 'vitest';
import { createPersonSchema, importPeopleSchema, updatePersonSchema } from '$lib/server/people-validation';

describe('people validation schemas', () => {
  const validPerson = {
    name: 'Alice Example',
    birthData: {
      date: '1990-01-01',
      time: '10:30',
      place: 'London, United Kingdom',
      latitude: 51.5074,
      longitude: -0.1278
    },
    chartData: 'Sun,Aries,10d00'
  };

  it('accepts valid create payload', () => {
    expect(createPersonSchema.safeParse(validPerson).success).toBe(true);
  });

  it('rejects create payload with empty name', () => {
    const result = createPersonSchema.safeParse({ ...validPerson, name: '   ' });
    expect(result.success).toBe(false);
  });

  it('rejects empty update payload', () => {
    const result = updatePersonSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('accepts update payload with one field', () => {
    const result = updatePersonSchema.safeParse({ name: 'Updated Name' });
    expect(result.success).toBe(true);
  });

  it('accepts valid import payload', () => {
    const result = importPeopleSchema.safeParse({ people: [validPerson] });
    expect(result.success).toBe(true);
  });
});
