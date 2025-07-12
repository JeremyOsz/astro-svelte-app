import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './+server';
import { mockBirthDataMinimal } from '../../../test/utils/test-helpers';

// Mock the calculateBirthChart function
vi.mock('$lib/astrology/astronomia-service', () => ({
  calculateBirthChart: vi.fn(),
}));

import { calculateBirthChart } from '$lib/astrology/astronomia-service';

describe('/api/birth-chart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
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
        new Date(mockBirthDataMinimal.date),
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
        new Date(mockBirthDataMinimal.date),
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
  });
}); 