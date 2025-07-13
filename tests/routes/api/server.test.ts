import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../src/routes/api/transits/+server';
import { mockTransitData } from '../../utils/test-helpers';

// Mock the calculateTransits function
vi.mock('$lib/astrology/prokerala-service', () => ({
  calculateTransits: vi.fn(),
}));

import { calculateTransits } from '$lib/astrology/prokerala-service';

describe('/api/transits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should return transit data for valid request', async () => {
      const mockTransitResult = [
        {
          planet: 'Sun',
          currentLongitude: 280,
          currentSign: 'Capricorn',
          currentDegree: 10,
          natalLongitude: 270,
          natalSign: 'Capricorn',
          natalDegree: 0,
          aspect: {
            type: 'conjunction',
            orb: 2.5,
            exact: false,
          },
        },
      ];

      vi.mocked(calculateTransits).mockReturnValue(mockTransitResult);

      const request = new Request('http://localhost:5173/api/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockTransitData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockTransitResult);
      expect(calculateTransits).toHaveBeenCalledWith(
        expect.objectContaining({
          ascendant: mockTransitData.natalChart.ascendant,
          mc: mockTransitData.natalChart.mc,
          houses: mockTransitData.natalChart.houses,
          planets: mockTransitData.natalChart.planets,
          latitude: mockTransitData.natalChart.latitude,
          longitude: mockTransitData.natalChart.longitude,
        }),
        new Date(mockTransitData.transitDate)
      );
    });

    it('should return 400 error when natalChart is missing', async () => {
      const invalidData = { ...mockTransitData };
      invalidData.natalChart = undefined as any;

      const request = new Request('http://localhost:5173/api/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields: natalChart, transitDate');
      expect(calculateTransits).not.toHaveBeenCalled();
    });

    it('should return 400 error when transitDate is missing', async () => {
      const invalidData = { ...mockTransitData };
      invalidData.transitDate = undefined as any;

      const request = new Request('http://localhost:5173/api/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields: natalChart, transitDate');
      expect(calculateTransits).not.toHaveBeenCalled();
    });

    it('should return 400 error when natalChart is null', async () => {
      const invalidData = { ...mockTransitData, natalChart: null };

      const request = new Request('http://localhost:5173/api/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields: natalChart, transitDate');
      expect(calculateTransits).not.toHaveBeenCalled();
    });

    it('should return 400 error when transitDate is null', async () => {
      const invalidData = { ...mockTransitData, transitDate: null };

      const request = new Request('http://localhost:5173/api/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields: natalChart, transitDate');
      expect(calculateTransits).not.toHaveBeenCalled();
    });

    it('should return 500 error when calculateTransits throws an error', async () => {
      vi.mocked(calculateTransits).mockImplementation(() => {
        throw new Error('Calculation failed');
      });

      const request = new Request('http://localhost:5173/api/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockTransitData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to calculate transits');
      expect(calculateTransits).toHaveBeenCalledWith(
        expect.objectContaining({
          ascendant: mockTransitData.natalChart.ascendant,
          mc: mockTransitData.natalChart.mc,
          houses: mockTransitData.natalChart.houses,
          planets: mockTransitData.natalChart.planets,
          latitude: mockTransitData.natalChart.latitude,
          longitude: mockTransitData.natalChart.longitude,
        }),
        new Date(mockTransitData.transitDate)
      );
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
      expect(calculateTransits).not.toHaveBeenCalled();
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
      expect(calculateTransits).not.toHaveBeenCalled();
    });

    it('should handle invalid transit date format', async () => {
      const invalidData = { ...mockTransitData, transitDate: 'invalid-date' };

      const request = new Request('http://localhost:5173/api/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to calculate transits');
      expect(calculateTransits).toHaveBeenCalledWith(
        expect.objectContaining({
          ascendant: mockTransitData.natalChart.ascendant,
          mc: mockTransitData.natalChart.mc,
          houses: mockTransitData.natalChart.houses,
          planets: mockTransitData.natalChart.planets,
          latitude: mockTransitData.natalChart.latitude,
          longitude: mockTransitData.natalChart.longitude,
        }),
        new Date('invalid-date')
      );
    });

    it('should handle empty natalChart object', async () => {
      const invalidData = { ...mockTransitData, natalChart: {} };

      const request = new Request('http://localhost:5173/api/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const event = { request } as any;
      const response = await POST(event);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to calculate transits');
      expect(calculateTransits).toHaveBeenCalledWith(
        {},
        new Date(mockTransitData.transitDate)
      );
    });
  });
}); 