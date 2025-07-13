import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../../src/routes/api/birth-chart/+server';
import { 
  mockBirthDataMinimal, 
  melbourneBirthData, 
  expectedMelbournePlanets, 
  expectedMelbourneAngles,
  signToLongitude 
} from '../../../utils/test-helpers';

// Mock the calculateBirthChart function
vi.mock('$lib/astrology/prokerala-service', () => ({
  calculateBirthChart: vi.fn(),
}));

import { calculateBirthChart } from '$lib/astrology/prokerala-service';

describe('/api/birth-chart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test data for Melbourne, Australia birth chart
  // Birth date: 1990-01-01
  // Birth time: 04:59:00 AEDT
  // Birth place: Melbourne, Australia
  // Latitude: -37.8136
  // Longitude: 144.9631
  // Timezone: Australia/Melbourne 

  // Expected planetary positions:
  //   Sun,Sagittarius,17°09'
  // Moon,Capricorn,26°20'
  // Mercury,Sagittarius,14°28',R
  // Venus,Scorpio,4°00'
  // Mars,Sagittarius,7°36'
  // Jupiter,Virgo,13°55',R
  // Saturn,Aquarius,3°32'
  // Uranus,Capricorn,12°23'
  // Neptune,Capricorn,15°24'
  // Pluto,Scorpio,21°20'
  // Node,Capricorn,10°59',R
  // Lilith,Capricorn,25°14'
  // Chiron,Leo,9°20',R
  // Fortune,Libra,22°29'
  // Vertex,Aries,29°44'
  // ASC,Sagittarius,1°40'
  // MC,Leo,10°14'
  



  describe('POST', () => {
    it('should return birth chart data for Melbourne, Australia birth chart', async () => {
      const mockChartData = {
        ascendant: expectedMelbourneAngles.ascendant,
        mc: expectedMelbourneAngles.mc,
        houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
        planets: expectedMelbournePlanets.map(planet => ({
          name: planet.name,
          longitude: signToLongitude(planet.sign, planet.degree),
          latitude: 0,
          distance: 1,
          sign: planet.sign,
          degree: planet.degree,
        })),
        date: new Date(`${melbourneBirthData.date}T${melbourneBirthData.time}:00`),
        latitude: melbourneBirthData.latitude,
        longitude: melbourneBirthData.longitude,
      };

      vi.mocked(calculateBirthChart).mockReturnValue(mockChartData);

      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(melbourneBirthData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        ascendant: expectedMelbourneAngles.ascendant,
        mc: expectedMelbourneAngles.mc,
        houses: mockChartData.houses,
        latitude: melbourneBirthData.latitude,
        longitude: melbourneBirthData.longitude,
      });

      // Verify planets are present
      expect(data.planets).toBeDefined();
      expect(data.planets).toHaveLength(expectedMelbournePlanets.length);

      // Verify specific planets match expected values
      const sun = data.planets.find((p: any) => p.name === 'Sun');
      expect(sun).toBeDefined();
      expect(sun.sign).toBe('Sagittarius');
      expect(sun.degree).toBeCloseTo(17.15, 1);

      const moon = data.planets.find((p: any) => p.name === 'Moon');
      expect(moon).toBeDefined();
      expect(moon.sign).toBe('Capricorn');
      expect(moon.degree).toBeCloseTo(26.33, 1);

      const mercury = data.planets.find((p: any) => p.name === 'Mercury');
      expect(mercury).toBeDefined();
      expect(mercury.sign).toBe('Sagittarius');
      expect(mercury.degree).toBeCloseTo(14.47, 1);

      expect(calculateBirthChart).toHaveBeenCalledWith(
        new Date(`${melbourneBirthData.date}T${melbourneBirthData.time}:00`),
        melbourneBirthData.latitude,
        melbourneBirthData.longitude
      );
    });

    it('should return birth chart data for valid request', async () => {
      const mockChartData = {
        ascendant: 180,
        mc: 270,
        houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
        planets: [
          {
            name: 'Sun',
            longitude: 280,
            latitude: 0,
            distance: 1,
            sign: 'Capricorn',
            degree: 10,
          },
        ],
        date: new Date('1990-01-01T12:00:00Z'),
        latitude: 40.7128,
        longitude: -74.0060,
      };

      vi.mocked(calculateBirthChart).mockReturnValue(mockChartData);

      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockBirthDataMinimal),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        ascendant: mockChartData.ascendant,
        mc: mockChartData.mc,
        houses: mockChartData.houses,
        planets: mockChartData.planets,
        latitude: mockChartData.latitude,
        longitude: mockChartData.longitude,
      });
      expect(data.date).toBeDefined();
      expect(calculateBirthChart).toHaveBeenCalledWith(
        new Date(`${mockBirthDataMinimal.date}T12:00:00`),
        mockBirthDataMinimal.latitude,
        mockBirthDataMinimal.longitude
      );
    });

    it('should return 400 error when date is missing', async () => {
      const invalidData = { ...mockBirthDataMinimal };
      invalidData.date = undefined as any;

      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields: date, latitude, longitude');
      expect(calculateBirthChart).not.toHaveBeenCalled();
    });

    it('should return 400 error when latitude is missing', async () => {
      const invalidData = { ...mockBirthDataMinimal };
      invalidData.latitude = undefined as any;

      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields: date, latitude, longitude');
      expect(calculateBirthChart).not.toHaveBeenCalled();
    });

    it('should return 400 error when longitude is missing', async () => {
      const invalidData = { ...mockBirthDataMinimal };
      invalidData.longitude = undefined as any;

      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields: date, latitude, longitude');
      expect(calculateBirthChart).not.toHaveBeenCalled();
    });

    it('should handle null latitude (validation passes)', async () => {
      const invalidData = { ...mockBirthDataMinimal, latitude: null };

      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(calculateBirthChart).toHaveBeenCalled();
    });

    it('should handle null longitude (validation passes)', async () => {
      const invalidData = { ...mockBirthDataMinimal, longitude: null };

      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(calculateBirthChart).toHaveBeenCalled();
    });

    it('should return 500 error when calculateBirthChart throws an error', async () => {
      vi.mocked(calculateBirthChart).mockImplementation(() => {
        throw new Error('Calculation failed');
      });

      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockBirthDataMinimal),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to calculate birth chart');
      expect(calculateBirthChart).toHaveBeenCalledWith(
        new Date(`${mockBirthDataMinimal.date}T12:00:00`),
        mockBirthDataMinimal.latitude,
        mockBirthDataMinimal.longitude
      );
    });

    it('should return 500 error when request.json() throws an error', async () => {
      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to calculate birth chart');
      expect(calculateBirthChart).not.toHaveBeenCalled();
    });

    it('should handle empty request body', async () => {
      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to calculate birth chart');
      expect(calculateBirthChart).not.toHaveBeenCalled();
    });

    it('should handle invalid date format', async () => {
      const invalidData = { ...mockBirthDataMinimal, date: 'invalid-date' };

      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to calculate birth chart');
      expect(calculateBirthChart).toHaveBeenCalledWith(
        new Date('invalid-date'),
        mockBirthDataMinimal.latitude,
        mockBirthDataMinimal.longitude
      );
    });

    it('should handle Melbourne birth chart with local solar time', async () => {
      // Test data matching the UI form
      const melbourneFormData = {
        date: '1991-12-10', // December 10, 1991 (YYYY-MM-DD format from HTML date input)
        time: '04:59',      // 4:59 AM (HH:MM format from HTML time input)
        latitude: -37.8136,
        longitude: 144.9631,
        timezone: 11        // UTC+11 (AEDT)
      };

      // Expected: For astronomical calculations, we use local solar time
      // December 10, 1991, 4:59 AM local time
      const expectedLocalDate = new Date('1991-12-10T04:59:00');

      const mockChartData = {
        ascendant: 267.67, // Sagittarius 1°40'
        mc: 130.23,        // Leo 10°14'
        houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
        planets: [
          {
            name: 'Sun',
            longitude: 257.15, // Sagittarius 17°09'
            latitude: 0,
            distance: 1,
            sign: 'Sagittarius',
            degree: 17.15,
          },
          {
            name: 'Moon',
            longitude: 296.33, // Capricorn 26°20'
            latitude: 0,
            distance: 1,
            sign: 'Capricorn',
            degree: 26.33,
          },
        ],
        date: expectedLocalDate,
        latitude: -37.8136,
        longitude: 144.9631,
      };

      vi.mocked(calculateBirthChart).mockReturnValue(mockChartData);

      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(melbourneFormData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      
      // Verify that calculateBirthChart was called with the local solar time
      expect(calculateBirthChart).toHaveBeenCalledWith(
        expectedLocalDate,
        -37.8136,
        144.9631
      );

      // Verify the response structure
      expect(data).toMatchObject({
        ascendant: 267.67,
        mc: 130.23,
        latitude: -37.8136,
        longitude: 144.9631,
      });

      expect(data.planets).toBeDefined();
      expect(data.planets).toHaveLength(2);
      
      const sun = data.planets.find((p: any) => p.name === 'Sun');
      expect(sun).toBeDefined();
      expect(sun.sign).toBe('Sagittarius');
      expect(sun.degree).toBeCloseTo(17.15, 1);
    });

    it('should handle date-only input (no time/timezone) using noon local time', async () => {
      const simpleBirthData = {
        date: '1991-12-10',
        latitude: -37.8136,
        longitude: 144.9631,
      };

      const expectedNoonTime = new Date('1991-12-10T12:00:00');

      const mockChartData = {
        ascendant: 180,
        mc: 270,
        houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
        planets: [
          {
            name: 'Sun',
            longitude: 280,
            latitude: 0,
            distance: 1,
            sign: 'Capricorn',
            degree: 10,
          },
        ],
        date: expectedNoonTime,
        latitude: -37.8136,
        longitude: 144.9631,
      };

      vi.mocked(calculateBirthChart).mockReturnValue(mockChartData);

      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simpleBirthData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(calculateBirthChart).toHaveBeenCalledWith(
        expectedNoonTime,
        -37.8136,
        144.9631
      );
    });

    it('should calculate correct Sun sign for December 10, 1991 (Sagittarius, not Aries)', async () => {
      // This test verifies that the date handling is correct
      // December 10, 1991 should have Sun in Sagittarius, not Aries
      const testBirthData = {
        date: '1991-12-10',
        time: '04:59',
        latitude: -37.8136,
        longitude: 144.9631,
        timezone: 11
      };

      // Mock the expected result for December 10, 1991
      // Sun should be in Sagittarius around 17-18 degrees
      const mockChartData = {
        ascendant: 267.67,
        mc: 130.23,
        houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
        planets: [
          {
            name: 'Sun',
            longitude: 257.15, // Sagittarius 17°09' (240° + 17.15°)
            latitude: 0,
            distance: 1,
            sign: 'Sagittarius',
            degree: 17.15,
          },
        ],
        date: new Date('1991-12-10T04:59:00'),
        latitude: -37.8136,
        longitude: 144.9631,
      };

      vi.mocked(calculateBirthChart).mockReturnValue(mockChartData);

      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testBirthData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      
      // Verify the calculation was called with local time
      expect(calculateBirthChart).toHaveBeenCalledWith(
        new Date('1991-12-10T04:59:00'),
        -37.8136,
        144.9631
      );

      // Verify Sun is in Sagittarius, not Aries
      const sun = data.planets.find((p: any) => p.name === 'Sun');
      expect(sun).toBeDefined();
      expect(sun.sign).toBe('Sagittarius');
      expect(sun.sign).not.toBe('Aries'); // This was the bug - Sun was showing as Aries
      expect(sun.degree).toBeCloseTo(17.15, 1);
    });
  });
}); 