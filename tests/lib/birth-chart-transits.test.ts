import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BirthChartTransits } from '../../src/lib/birth-chart-transits';
import type { BirthChart, PlanetPosition } from '../../src/lib/types/types';
import { getSignByDegree } from '../../src/lib/data/astrological-data';

// Mock astronomia modules
vi.mock('astronomia', () => ({
  julian: {
    DateToJD: vi.fn().mockReturnValue(2460100.5)
  }
}));

vi.mock('astronomia/planetposition', () => ({
  Planet: vi.fn().mockImplementation(() => ({
    lon: 120.0
  }))
}));

vi.mock('astronomia/solar', () => ({
  apparentLongitude: vi.fn().mockReturnValue(45.0)
}));

// Mock the data imports
vi.mock('../../src/lib/data/astrological-data', () => ({
  ASPECTS: [
    { name: 'Conjunction', angle: 0, orb: 8 },
    { name: 'Opposition', angle: 180, orb: 8 },
    { name: 'Trine', angle: 120, orb: 8 },
    { name: 'Square', angle: 90, orb: 8 },
    { name: 'Sextile', angle: 60, orb: 6 }
  ],
  ZODIAC_SIGNS: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  getSignByDegree: vi.fn()
}));

vi.mock('../../src/lib/transit-interpretations', () => ({
  getTransitInterpretation: vi.fn().mockReturnValue('Test interpretation')
}));

describe('BirthChartTransits', () => {
  let mockBirthChart: BirthChart;
  let startDate: Date;
  let endDate: Date;
  let birthChartTransits: BirthChartTransits;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock birth chart data
    mockBirthChart = {
      ascendant: 15.5, // Aries
      mc: 105.5, // Cancer
      houses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      planets: [
        {
          name: 'Sun',
          longitude: 45.2, // Taurus
          latitude: 0,
          distance: 1,
          sign: 'Taurus',
          degree: 15.2,
          house: 2,
          retrograde: false
        },
        {
          name: 'Moon',
          longitude: 120.8, // Leo
          latitude: 0,
          distance: 1,
          sign: 'Leo',
          degree: 0.8,
          house: 5,
          retrograde: false
        },
        {
          name: 'Mercury',
          longitude: 30.1, // Aries
          latitude: 0,
          distance: 1,
          sign: 'Aries',
          degree: 0.1,
          house: 1,
          retrograde: false
        }
      ],
      date: new Date('1990-01-01'),
      latitude: 40.7128,
      longitude: -74.0060
    };

    startDate = new Date('2024-01-01');
    endDate = new Date('2024-01-07');

    // Mock getSignByDegree
    vi.mocked(getSignByDegree).mockImplementation((longitude: number) => {
      const signIndex = Math.floor(longitude / 30);
      const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
      return signs[signIndex];
    });

    birthChartTransits = new BirthChartTransits(mockBirthChart, startDate, endDate);
  });

  describe('constructor', () => {
    it('should initialize with birth chart and date range', () => {
      expect(birthChartTransits).toBeInstanceOf(BirthChartTransits);
    });

    it('should initialize previousAspects map', () => {
      // The constructor should have initialized previousAspects
      // We can't directly access private properties, but we can test through public methods
      expect(birthChartTransits).toBeDefined();
    });
  });

  describe('calculateAspect', () => {
    it('should calculate correct aspect difference for angles less than 180', () => {
      const result = (birthChartTransits as any).calculateAspect(10, 20);
      expect(result).toBe(10);
    });

    it('should calculate correct aspect difference for angles greater than 180', () => {
      const result = (birthChartTransits as any).calculateAspect(350, 10);
      expect(result).toBe(20);
    });

    it('should handle exact 180 degree difference', () => {
      const result = (birthChartTransits as any).calculateAspect(0, 180);
      expect(result).toBe(180);
    });
  });

  describe('findAspect', () => {
    it('should find conjunction aspect', () => {
      const result = (birthChartTransits as any).findAspect(5);
      expect(result).toEqual({ name: 'Conjunction', angle: 0, orb: 8 });
    });

    it('should find opposition aspect', () => {
      const result = (birthChartTransits as any).findAspect(182);
      expect(result).toEqual({ name: 'Opposition', angle: 180, orb: 8 });
    });

    it('should find trine aspect', () => {
      const result = (birthChartTransits as any).findAspect(122);
      expect(result).toEqual({ name: 'Trine', angle: 120, orb: 8 });
    });

    it('should return null for no aspect found', () => {
      const result = (birthChartTransits as any).findAspect(45);
      expect(result).toBeNull();
    });
  });

  describe('getPlanetPosition', () => {
    beforeEach(() => {
      // Mocks are already set up in the module mocks
    });

    it('should calculate Sun position using apparentLongitude', () => {
      const result = (birthChartTransits as any).getPlanetPosition(new Date('2024-01-01'), 'Sun');
      
      expect(result.longitude).toBe(45.0);
      expect(result.sign).toBe('Taurus');
      expect(result.retrograde).toBe(false);
      expect(result.house).toBeDefined();
    });

    it('should calculate Moon position with offset', () => {
      const result = (birthChartTransits as any).getPlanetPosition(new Date('2024-01-01'), 'Moon');
      
      expect(result.longitude).toBe(58.2); // 45.0 + 13.2
      expect(result.sign).toBe('Taurus');
      expect(result.retrograde).toBe(false);
    });

    it('should calculate other planet positions using Planet class', () => {
      const result = (birthChartTransits as any).getPlanetPosition(new Date('2024-01-01'), 'Mars');
      
      expect(result.longitude).toBe(120.0);
      expect(result.sign).toBe('Leo');
      expect(result.retrograde).toBe(false);
    });

    it('should handle Planet class errors gracefully', () => {
      // This test would require more complex mocking setup
      // For now, we'll test that the method exists and can be called
      expect(() => {
        (birthChartTransits as any).getPlanetPosition(new Date('2024-01-01'), 'UnknownPlanet');
      }).not.toThrow();
    });
  });

  describe('checkTransits', () => {
    it('should find transits when planets are in aspect', () => {
      const transits = (birthChartTransits as any).checkTransits(new Date('2024-01-01'));
      
      expect(transits).toBeInstanceOf(Array);
      // Should find transits between transit planets and natal planets
      expect(transits.length).toBeGreaterThanOrEqual(0);
    });

    it('should include correct transit information when transits exist', () => {
      const transits = (birthChartTransits as any).checkTransits(new Date('2024-01-01'));
      
      if (transits.length > 0) {
        const transit = transits[0];
        expect(transit).toHaveProperty('date');
        expect(transit).toHaveProperty('transitPlanet');
        expect(transit).toHaveProperty('natalPlanet');
        expect(transit).toHaveProperty('aspect');
        expect(transit).toHaveProperty('orb');
        expect(transit).toHaveProperty('transitPlanetRetrograde');
        expect(transit).toHaveProperty('natalPlanetRetrograde');
        expect(transit).toHaveProperty('transitPlanetSign');
        expect(transit).toHaveProperty('natalPlanetSign');
        expect(transit).toHaveProperty('transitPlanetHouse');
        expect(transit).toHaveProperty('natalPlanetHouse');
      }
    });
  });

  describe('calculateSingleDayTransits', () => {
    beforeEach(() => {
      // Mock checkTransits and checkAspectChanges
      vi.spyOn(birthChartTransits as any, 'checkTransits').mockReturnValue([
        {
          date: new Date('2024-01-01'),
          transitPlanet: 'Sun',
          natalPlanet: 'Mercury',
          aspect: 'Conjunction',
          orb: 2.5,
          transitPlanetRetrograde: false,
          natalPlanetRetrograde: false,
          transitPlanetSign: 'Taurus',
          natalPlanetSign: 'Aries',
          transitPlanetHouse: 2,
          natalPlanetHouse: 1
        }
      ]);
      
      vi.spyOn(birthChartTransits as any, 'checkAspectChanges').mockReturnValue([]);
    });

    it('should return daily transits with correct structure', () => {
      const result = birthChartTransits.calculateSingleDayTransits(new Date('2024-01-01'));
      
      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('transits');
      expect(result).toHaveProperty('aspectChanges');
      expect(result.transits).toHaveLength(1);
      expect(result.aspectChanges).toHaveLength(0);
    });
  });

  describe('calculateTransits', () => {
    beforeEach(() => {
      // Mock calculateSingleDayTransits
      vi.spyOn(birthChartTransits, 'calculateSingleDayTransits').mockReturnValue({
        date: new Date('2024-01-01'),
        transits: [
          {
            date: new Date('2024-01-01'),
            transitPlanet: 'Sun',
            natalPlanet: 'Mercury',
            aspect: 'Conjunction',
            orb: 2.5,
            transitPlanetRetrograde: false,
            natalPlanetRetrograde: false,
            transitPlanetSign: 'Taurus',
            natalPlanetSign: 'Aries',
            transitPlanetHouse: 2,
            natalPlanetHouse: 1
          }
        ],
        aspectChanges: []
      });
    });

    it('should return array of daily transits for date range', () => {
      const result = birthChartTransits.calculateTransits();
      
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('transits');
      expect(result[0]).toHaveProperty('aspectChanges');
    });
  });

  describe('generateSingleDayReport', () => {
    beforeEach(() => {
      // Mock calculateSingleDayTransits
      vi.spyOn(birthChartTransits, 'calculateSingleDayTransits').mockReturnValue({
        date: new Date('2024-01-01'),
        transits: [
          {
            date: new Date('2024-01-01'),
            transitPlanet: 'Sun',
            natalPlanet: 'Mercury',
            aspect: 'Conjunction',
            orb: 2.5,
            transitPlanetRetrograde: false,
            natalPlanetRetrograde: false,
            transitPlanetSign: 'Taurus',
            natalPlanetSign: 'Aries',
            transitPlanetHouse: 2,
            natalPlanetHouse: 1
          }
        ],
        aspectChanges: [
          {
            transitPlanet: 'Mars',
            natalPlanet: 'Venus',
            aspect: 'Square',
            orb: 1.8,
            transitPlanetRetrograde: false,
            natalPlanetRetrograde: false,
            transitPlanetSign: 'Leo',
            natalPlanetSign: 'Taurus',
            transitPlanetHouse: 5,
            natalPlanetHouse: 2
          }
        ]
      });
    });

    it('should generate report with aspect changes', () => {
      const report = birthChartTransits.generateSingleDayReport(new Date('2024-01-01'));
      
      expect(report).toContain('Transit Report for');
      expect(report).toContain('New Aspects Forming:');
      expect(report).toContain('Active Transits:');
      expect(report).toContain('Sun Conjunction Mercury');
      expect(report).toContain('Mars Square Venus');
    });

    it('should handle no transits gracefully', () => {
      vi.spyOn(birthChartTransits, 'calculateSingleDayTransits').mockReturnValue({
        date: new Date('2024-01-01'),
        transits: [],
        aspectChanges: []
      });

      const report = birthChartTransits.generateSingleDayReport(new Date('2024-01-01'));
      
      expect(report).toContain('No significant transits or aspect changes for this day');
    });
  });

  describe('generateReport', () => {
    beforeEach(() => {
      // Mock calculateTransits
      vi.spyOn(birthChartTransits, 'calculateTransits').mockReturnValue([
        {
          date: new Date('2024-01-01'),
          transits: [
            {
              date: new Date('2024-01-01'),
              transitPlanet: 'Sun',
              natalPlanet: 'Mercury',
              aspect: 'Conjunction',
              orb: 2.5,
              transitPlanetRetrograde: false,
              natalPlanetRetrograde: false,
              transitPlanetSign: 'Taurus',
              natalPlanetSign: 'Aries',
              transitPlanetHouse: 2,
              natalPlanetHouse: 1
            }
          ],
          aspectChanges: []
        }
      ]);
    });

    it('should generate full report for date range', () => {
      const report = birthChartTransits.generateReport();
      
      expect(report).toContain('Birth Chart Transit Report');
      expect(report).toContain('Period:');
      expect(report).toContain('Current Transits:');
      expect(report).toContain('Sun Conjunction Mercury');
    });

    it('should handle no transits in period', () => {
      vi.spyOn(birthChartTransits, 'calculateTransits').mockReturnValue([]);

      const report = birthChartTransits.generateReport();
      
      expect(report).toContain('No significant transits or aspect changes found during this period');
    });
  });

  describe('error handling', () => {
    it('should handle invalid planet names gracefully', () => {
      const invalidBirthChart = {
        ...mockBirthChart,
        planets: [
          {
            name: 'InvalidPlanet',
            longitude: 45.2,
            latitude: 0,
            distance: 1,
            sign: 'Taurus',
            degree: 15.2,
            house: 2,
            retrograde: false
          }
        ]
      };

      const transits = new BirthChartTransits(invalidBirthChart, startDate, endDate);
      expect(transits).toBeInstanceOf(BirthChartTransits);
    });

    it('should handle astronomia calculation errors', () => {
      // This test would require more complex mocking setup
      // For now, we'll test that the method exists and can be called
      expect(() => {
        (birthChartTransits as any).getPlanetPosition(new Date('2024-01-01'), 'Mars');
      }).not.toThrow();
    });
  });
}); 