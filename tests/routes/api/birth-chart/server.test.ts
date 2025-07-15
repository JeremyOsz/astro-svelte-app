import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../../src/routes/api/birth-chart/+server';
import { mockBirthDataMinimal } from '../../../utils/test-helpers';

// Mock the Swiss Ephemeris service
vi.mock('$lib/astrology/swiss-ephemeris-service', () => ({
  SwissEphemerisService: {
    calculateBirthChart: vi.fn(),
  },
}));

import { SwissEphemerisService } from '$lib/astrology/swiss-ephemeris-service';

describe('/api/birth-chart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should return birth chart data using Swiss Ephemeris API', async () => {
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

      vi.mocked(SwissEphemerisService.calculateBirthChart).mockResolvedValue(mockChartData);

      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...mockBirthDataMinimal,
          place: 'New York, USA',
          house_system: 'whole_sign',
        }),
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
        date: mockChartData.date.toISOString(), // JSON serialization converts Date to string
      });
      expect(SwissEphemerisService.calculateBirthChart).toHaveBeenCalledWith(
        new Date(mockBirthDataMinimal.date),
        mockBirthDataMinimal.latitude,
        mockBirthDataMinimal.longitude,
        'New York, USA',
        'whole_sign'
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
      expect(SwissEphemerisService.calculateBirthChart).not.toHaveBeenCalled();
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
      expect(SwissEphemerisService.calculateBirthChart).not.toHaveBeenCalled();
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
      expect(SwissEphemerisService.calculateBirthChart).not.toHaveBeenCalled();
    });

    it('should handle null latitude (validation passes)', async () => {
      const mockChartData = {
        ascendant: 180,
        mc: 270,
        houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
        planets: [],
        date: new Date('1990-01-01T12:00:00Z'),
        latitude: 40.7128,
        longitude: -74.0060,
      };

      vi.mocked(SwissEphemerisService.calculateBirthChart).mockResolvedValue(mockChartData);

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
      expect(SwissEphemerisService.calculateBirthChart).toHaveBeenCalled();
    });

    it('should handle null longitude (validation passes)', async () => {
      const mockChartData = {
        ascendant: 180,
        mc: 270,
        houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
        planets: [],
        date: new Date('1990-01-01T12:00:00Z'),
        latitude: 40.7128,
        longitude: -74.0060,
      };

      vi.mocked(SwissEphemerisService.calculateBirthChart).mockResolvedValue(mockChartData);

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
      expect(SwissEphemerisService.calculateBirthChart).toHaveBeenCalled();
    });

    it('should return 500 error when Swiss Ephemeris API fails', async () => {
      vi.mocked(SwissEphemerisService.calculateBirthChart).mockRejectedValue(new Error('API Error'));

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
      expect(SwissEphemerisService.calculateBirthChart).toHaveBeenCalled();
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
      expect(SwissEphemerisService.calculateBirthChart).not.toHaveBeenCalled();
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
      expect(SwissEphemerisService.calculateBirthChart).not.toHaveBeenCalled();
    });

    it('should handle invalid date format', async () => {
      const mockChartData = {
        ascendant: 180,
        mc: 270,
        houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
        planets: [],
        date: new Date('invalid-date'),
        latitude: 40.7128,
        longitude: -74.0060,
      };

      vi.mocked(SwissEphemerisService.calculateBirthChart).mockResolvedValue(mockChartData);

      const invalidData = { ...mockBirthDataMinimal, date: 'invalid-date' };

      const request = new Request('http://localhost:5173/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(SwissEphemerisService.calculateBirthChart).toHaveBeenCalledWith(
        new Date('invalid-date'),
        mockBirthDataMinimal.latitude,
        mockBirthDataMinimal.longitude,
        'Unknown Location',
        'whole_sign'
      );
    });
  });
}); 