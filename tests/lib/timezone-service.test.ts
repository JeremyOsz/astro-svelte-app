import { describe, it, expect } from 'vitest';
import { getBirthTimezone, findTimezoneForCoordinates, formatTimezoneOffset } from '$lib/services/timezone-service';

describe('Timezone Service - DST Detection', () => {
  const newYorkLat = 40.7128;
  const newYorkLng = -74.0060;
  const londonLat = 51.5074;
  const londonLng = -0.1278;

  describe('New York DST Detection', () => {
    it('should detect standard time in winter', () => {
      const result = getBirthTimezone(newYorkLat, newYorkLng, '2024-01-15', '12:00');
      
      expect(result.timezone).toBe('America/New_York');
      expect(result.offset).toBe(-5); // EST = UTC-5
      expect(result.isDST).toBe(false);
    });

    it('should detect daylight time in summer', () => {
      const result = getBirthTimezone(newYorkLat, newYorkLng, '2024-07-15', '12:00');
      
      expect(result.timezone).toBe('America/New_York');
      expect(result.offset).toBe(-4); // EDT = UTC-4
      expect(result.isDST).toBe(true);
    });

    it('should handle historical dates correctly', () => {
      // Test historical summer (DST should be active)
      const summer1990 = getBirthTimezone(newYorkLat, newYorkLng, '1990-06-15', '14:30');
      expect(summer1990.offset).toBe(-4); // EDT
      expect(summer1990.isDST).toBe(true);

      // Test historical winter (DST should be inactive)
      const winter1990 = getBirthTimezone(newYorkLat, newYorkLng, '1990-12-15', '14:30');
      expect(winter1990.offset).toBe(-5); // EST
      expect(winter1990.isDST).toBe(false);
    });
  });

  describe('London DST Detection', () => {
    it('should detect GMT in winter', () => {
      const result = getBirthTimezone(londonLat, londonLng, '2024-01-15', '12:00');
      
      expect(result.timezone).toBe('Europe/London');
      expect(result.offset).toBe(0); // GMT = UTC+0
      expect(result.isDST).toBe(false);
    });

    it('should detect BST in summer', () => {
      const result = getBirthTimezone(londonLat, londonLng, '2024-07-15', '12:00');
      
      expect(result.timezone).toBe('Europe/London');
      expect(result.offset).toBe(1); // BST = UTC+1
      expect(result.isDST).toBe(true);
    });

    it('should handle historical UK dates', () => {
      // Test historical summer
      const summer1985 = getBirthTimezone(londonLat, londonLng, '1985-06-15', '08:00');
      expect(summer1985.offset).toBe(1); // BST
      expect(summer1985.isDST).toBe(true);

      // Test historical winter
      const winter1985 = getBirthTimezone(londonLat, londonLng, '1985-12-25', '08:00');
      expect(winter1985.offset).toBe(0); // GMT
      expect(winter1985.isDST).toBe(false);
    });
  });

  describe('Timezone Detection', () => {
    it('should correctly identify New York timezone', () => {
      const timezone = findTimezoneForCoordinates(newYorkLat, newYorkLng);
      expect(timezone).toBe('America/New_York');
    });

    it('should correctly identify London timezone', () => {
      const timezone = findTimezoneForCoordinates(londonLat, londonLng);
      expect(timezone).toBe('Europe/London');
    });

    it('should handle coordinates outside defined regions', () => {
      // Test coordinates in the middle of the ocean
      const timezone = findTimezoneForCoordinates(0, 0);
      expect(timezone).toBe('Etc/GMT-0'); // Should fallback to UTC (GMT-0 = UTC+0)
    });
  });

  describe('Offset Formatting', () => {
    it('should format positive offsets correctly', () => {
      expect(formatTimezoneOffset(5)).toBe('UTC+5');
      expect(formatTimezoneOffset(5.5)).toBe('UTC+5:30');
    });

    it('should format negative offsets correctly', () => {
      expect(formatTimezoneOffset(-5)).toBe('UTC-5');
      expect(formatTimezoneOffset(-4.5)).toBe('UTC-4:30');
    });

    it('should format zero offset correctly', () => {
      expect(formatTimezoneOffset(0)).toBe('UTC+0');
    });
  });

  describe('DST Transition Demonstrations', () => {
    it('should show different offsets for same location, different dates', () => {
      // Same location, different seasons
      const winterNY = getBirthTimezone(newYorkLat, newYorkLng, '2024-01-15', '12:00');
      const summerNY = getBirthTimezone(newYorkLat, newYorkLng, '2024-07-15', '12:00');

      // Offsets should be different
      expect(winterNY.offset).not.toBe(summerNY.offset);
      expect(winterNY.offset).toBe(-5); // EST
      expect(summerNY.offset).toBe(-4); // EDT
      
      // DST status should be different
      expect(winterNY.isDST).toBe(false);
      expect(summerNY.isDST).toBe(true);
    });

    it('should handle DST transitions across decades', () => {
      // Test the same date in different decades
      const june1980 = getBirthTimezone(newYorkLat, newYorkLng, '1980-06-15', '12:00');
      const june2020 = getBirthTimezone(newYorkLat, newYorkLng, '2020-06-15', '12:00');

      // Both should be in DST with same offset (EDT)
      expect(june1980.isDST).toBe(true);
      expect(june2020.isDST).toBe(true);
      expect(june1980.offset).toBe(-4);
      expect(june2020.offset).toBe(-4);
    });
  });
}); 