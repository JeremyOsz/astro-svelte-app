import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../../src/routes/api/birth-chart/+server';
import { mockBirthDataMinimal } from '../../../utils/test-helpers';

// Mock the fetch function
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('/api/birth-chart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should return birth chart data using external API', async () => {
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

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockChartData),
      });

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
        date: mockChartData.date,
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'https://immanuel-astro.onrender.com/birth-chart',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('New York, USA'),
        })
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
      expect(mockFetch).not.toHaveBeenCalled();
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
      expect(mockFetch).not.toHaveBeenCalled();
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
      expect(mockFetch).not.toHaveBeenCalled();
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

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockChartData),
      });

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
      expect(mockFetch).toHaveBeenCalled();
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

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockChartData),
      });

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
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should return 500 error when external API fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('API Error'),
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
      expect(mockFetch).toHaveBeenCalled();
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
      expect(mockFetch).not.toHaveBeenCalled();
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
      expect(mockFetch).not.toHaveBeenCalled();
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

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockChartData),
      });

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
      expect(mockFetch).toHaveBeenCalledWith(
        'https://immanuel-astro.onrender.com/birth-chart',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('invalid-date'),
        })
      );
    });
  });
}); 