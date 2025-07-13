import { describe, it, expect, beforeAll } from 'vitest';
import { calculateBirthChart } from '$lib/astrology/prokerala-service';
import { getSignByDegree, getDegreeInSign } from '$lib/astrology/astrology-utils';

describe('Prokerala Service Integration Tests', () => {
  beforeAll(() => {
    // Check if API credentials are available
    if (!process.env.PROKERALA_CLIENT_ID || !process.env.PROKERALA_CLIENT_SECRET) {
      console.warn('⚠️  Prokerala API credentials not found. These tests will fail unless you set:');
      console.warn('   PROKERALA_CLIENT_ID=your_client_id');
      console.warn('   PROKERALA_CLIENT_SECRET=your_client_secret');
    }
  });

  describe('Basic functionality', () => {
    it('should calculate sign by degree correctly', () => {
      expect(getSignByDegree(0)).toBe('Aries');
      expect(getSignByDegree(30)).toBe('Taurus');
      expect(getSignByDegree(60)).toBe('Gemini');
      expect(getSignByDegree(90)).toBe('Cancer');
      expect(getSignByDegree(180)).toBe('Libra');
      expect(getSignByDegree(270)).toBe('Capricorn');
      expect(getSignByDegree(360)).toBe('Aries'); // 360 = 0
    });

    it('should calculate degree in sign correctly', () => {
      expect(getDegreeInSign(0)).toBe(0);
      expect(getDegreeInSign(15)).toBe(15);
      expect(getDegreeInSign(30)).toBe(0);
      expect(getDegreeInSign(45)).toBe(15);
      expect(getDegreeInSign(360)).toBe(0);
    });
  });

  describe('Melbourne birth chart - 1991-12-10 04:59 AEDT', () => {
    const melbourneBirthData = {
      // Birth time: 1991-12-10 04:59 AEDT (UTC+11)
      // UTC time: 1991-12-09 17:59 UTC
      date: new Date('1991-12-09T17:59:00.000Z'),
      latitude: -37.814,
      longitude: 144.96332,
      timezone: 11 // UTC+11 (AEDT)
    };

    it('should successfully connect to Prokerala API', async () => {
      try {
        const chart = await calculateBirthChart(
          melbourneBirthData.date,
          melbourneBirthData.latitude,
          melbourneBirthData.longitude
        );

        // Basic structure checks
        expect(chart).toBeDefined();
        expect(chart.planets).toBeDefined();
        expect(Array.isArray(chart.planets)).toBe(true);
        expect(chart.planets.length).toBeGreaterThan(0);
        
        // Check required properties
        expect(typeof chart.ascendant).toBe('number');
        expect(typeof chart.mc).toBe('number');
        expect(chart.date).toBeInstanceOf(Date);
        expect(typeof chart.latitude).toBe('number');
        expect(typeof chart.longitude).toBe('number');
        expect(Array.isArray(chart.houses)).toBe(true);

        console.log('✅ Prokerala API connection successful!');
        console.log(`Found ${chart.planets.length} planets`);
        console.log(`Ascendant: ${chart.ascendant}° (${getSignByDegree(chart.ascendant)})`);
        console.log(`MC: ${chart.mc}° (${getSignByDegree(chart.mc)})`);
      } catch (error) {
        console.error('❌ Prokerala API connection failed:', error);
        throw error;
      }
    }, 30000); // 30 second timeout for API calls

    it('should return valid planetary data', async () => {
      try {
        const chart = await calculateBirthChart(
          melbourneBirthData.date,
          melbourneBirthData.latitude,
          melbourneBirthData.longitude
        );

        // Test each planet
        chart.planets.forEach(planet => {
          expect(planet.name).toBeDefined();
          expect(typeof planet.name).toBe('string');
          expect(planet.name.length).toBeGreaterThan(0);
          
          expect(typeof planet.longitude).toBe('number');
          expect(planet.longitude).toBeGreaterThanOrEqual(0);
          expect(planet.longitude).toBeLessThan(360);
          
          expect(typeof planet.latitude).toBe('number');
          expect(typeof planet.distance).toBe('number');
          expect(planet.distance).toBeGreaterThan(0);
          
          expect(planet.sign).toBeDefined();
          expect(typeof planet.sign).toBe('string');
          
          expect(typeof planet.degree).toBe('number');
          expect(planet.degree).toBeGreaterThanOrEqual(0);
          expect(planet.degree).toBeLessThan(30);
          
          if (planet.house !== undefined) {
            expect(typeof planet.house).toBe('number');
            expect(planet.house).toBeGreaterThanOrEqual(1);
            expect(planet.house).toBeLessThanOrEqual(12);
          }
          
          if (planet.retrograde !== undefined) {
            expect(typeof planet.retrograde).toBe('boolean');
          }
        });

        console.log('✅ All planetary data is valid');
        console.log('Planets found:', chart.planets.map(p => `${p.name} (${p.sign})`).join(', '));
      } catch (error) {
        console.error('❌ Planet data validation failed:', error);
        throw error;
      }
    }, 30000);

    it('should show planetary positions for comparison', async () => {
      try {
        const chart = await calculateBirthChart(
          melbourneBirthData.date,
          melbourneBirthData.latitude,
          melbourneBirthData.longitude
        );

        console.log('\n🌟 PROKERALA API RESULTS FOR MELBOURNE BIRTH CHART:');
        console.log(`Birth Date: ${melbourneBirthData.date.toISOString()}`);
        console.log(`Location: ${melbourneBirthData.latitude}, ${melbourneBirthData.longitude}`);
        console.log('');
        
        // Format planetary positions
        chart.planets.forEach(planet => {
          const degreeInSign = planet.degree;
          const minutes = Math.round((degreeInSign - Math.floor(degreeInSign)) * 60);
          const retrograde = planet.retrograde ? ' (R)' : '';
          
          console.log(`${planet.name}: ${planet.sign} ${Math.floor(degreeInSign)}°${minutes.toString().padStart(2, '0')}'${retrograde}`);
        });
        
        console.log('');
        console.log('ANGLES:');
        const ascDegree = chart.ascendant % 30;
        const ascMinutes = Math.round((ascDegree - Math.floor(ascDegree)) * 60);
        console.log(`ASC: ${getSignByDegree(chart.ascendant)} ${Math.floor(ascDegree)}°${ascMinutes.toString().padStart(2, '0')}'`);
        
        const mcDegree = chart.mc % 30;
        const mcMinutes = Math.round((mcDegree - Math.floor(mcDegree)) * 60);
        console.log(`MC: ${getSignByDegree(chart.mc)} ${Math.floor(mcDegree)}°${mcMinutes.toString().padStart(2, '0')}'`);
        
        // This test always passes - it's just for output
        expect(true).toBe(true);
      } catch (error) {
        console.error('❌ Failed to get planetary positions:', error);
        throw error;
      }
    }, 30000);
  });

  describe('Error handling', () => {
    it('should handle API errors gracefully', async () => {
      // Test with invalid credentials by temporarily clearing env vars
      const originalId = process.env.PROKERALA_CLIENT_ID;
      const originalSecret = process.env.PROKERALA_CLIENT_SECRET;
      
      process.env.PROKERALA_CLIENT_ID = '';
      process.env.PROKERALA_CLIENT_SECRET = '';
      
      try {
        await calculateBirthChart(
          new Date('2000-01-01T12:00:00Z'),
          40.7128,
          -74.0060
        );
        
        // Should not reach here
        expect(true).toBe(false);
             } catch (error) {
         expect(error).toBeInstanceOf(Error);
         expect((error as Error).message).toContain('credentials not configured');
      } finally {
        // Restore original values
        process.env.PROKERALA_CLIENT_ID = originalId;
        process.env.PROKERALA_CLIENT_SECRET = originalSecret;
      }
    });
  });
}); 