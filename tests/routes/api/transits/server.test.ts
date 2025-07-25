import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../../src/routes/api/transits/+server';

// Mock the Swiss Ephemeris service
vi.mock('$lib/astrology/swiss-ephemeris-service', () => ({
  SwissEphemerisService: {
    calculateTransits: vi.fn(),
  },
}));

import { SwissEphemerisService } from '$lib/astrology/swiss-ephemeris-service';

describe('/api/transits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should return transit data using Swiss Ephemeris API', async () => {
      const mockTransitData = {
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
        aspects: [
          {
            transitPlanet: 'Sun',
            natalPlanet: 'Moon',
            aspect: 'Conjunction',
            orb: 2.5,
          },
        ],
      };

      vi.mocked(SwissEphemerisService.calculateTransits).mockResolvedValue(mockTransitData);

      const mockNatalChart = {
        planets: [
          {
            name: 'Moon',
            longitude: 282.5,
            latitude: 0,
            distance: 1,
            sign: 'Capricorn',
            degree: 12.5,
          },
        ],
        date: new Date('1990-01-01T12:00:00Z'),
        latitude: 40.7128,
        longitude: -74.0060,
      };

      const request = new Request('http://localhost:5173/api/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          natalChart: mockNatalChart,
          transitDate: '2024-01-15T12:00:00Z',
          house_system: 'whole_sign',
          transitLocation: {
            latitude: 40.7128,
            longitude: -74.0060,
            name: 'New York, USA'
          }
        }),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockTransitData);
      expect(SwissEphemerisService.calculateTransits).toHaveBeenCalledWith(
        {
          ...mockNatalChart,
          date: new Date('1990-01-01T12:00:00Z')
        },
        new Date('2024-01-15T12:00:00Z'),
        'whole_sign',
        {
          latitude: 40.7128,
          longitude: -74.0060,
          name: 'New York, USA'
        }
      );
    });

    it('should return 400 error when natalChart is missing', async () => {
      const request = new Request('http://localhost:5173/api/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transitDate: '2024-01-15T12:00:00Z',
        }),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields: natalChart, transitDate');
      expect(SwissEphemerisService.calculateTransits).not.toHaveBeenCalled();
    });

    it('should return 400 error when transitDate is missing', async () => {
      const mockNatalChart = {
        planets: [],
        date: new Date('1990-01-01T12:00:00Z'),
        latitude: 40.7128,
        longitude: -74.0060,
      };

      const request = new Request('http://localhost:5173/api/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          natalChart: mockNatalChart,
        }),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields: natalChart, transitDate');
      expect(SwissEphemerisService.calculateTransits).not.toHaveBeenCalled();
    });

    it('should handle missing transitLocation (optional parameter)', async () => {
      const mockTransitData = {
        planets: [],
        aspects: [],
      };

      vi.mocked(SwissEphemerisService.calculateTransits).mockResolvedValue(mockTransitData);

      const mockNatalChart = {
        planets: [],
        date: new Date('1990-01-01T12:00:00Z'),
        latitude: 40.7128,
        longitude: -74.0060,
      };

      const request = new Request('http://localhost:5173/api/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          natalChart: mockNatalChart,
          transitDate: '2024-01-15T12:00:00Z',
          house_system: 'whole_sign',
        }),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(SwissEphemerisService.calculateTransits).toHaveBeenCalledWith(
        {
          ...mockNatalChart,
          date: new Date('1990-01-01T12:00:00Z')
        },
        new Date('2024-01-15T12:00:00Z'),
        'whole_sign',
        undefined
      );
    });

    it('should return 500 error when Swiss Ephemeris API fails', async () => {
      vi.mocked(SwissEphemerisService.calculateTransits).mockRejectedValue(new Error('API Error'));

      const mockNatalChart = {
        planets: [],
        date: new Date('1990-01-01T12:00:00Z'),
        latitude: 40.7128,
        longitude: -74.0060,
      };

      const request = new Request('http://localhost:5173/api/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          natalChart: mockNatalChart,
          transitDate: '2024-01-15T12:00:00Z',
        }),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to calculate transits');
      expect(SwissEphemerisService.calculateTransits).toHaveBeenCalled();
    });

    it('should return 500 error when request.json() throws an error', async () => {
      const request = new Request('http://localhost:5173/api/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to calculate transits');
      expect(SwissEphemerisService.calculateTransits).not.toHaveBeenCalled();
    });

    it('should handle empty request body', async () => {
      const request = new Request('http://localhost:5173/api/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to calculate transits');
      expect(SwissEphemerisService.calculateTransits).not.toHaveBeenCalled();
    });
  });
}); 