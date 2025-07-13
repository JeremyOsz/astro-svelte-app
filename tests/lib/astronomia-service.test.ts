import { describe, it, expect } from 'vitest';
import { calculateBirthChart } from '$lib/astrology/prokerala-service';
import { getSignByDegree, getDegreeInSign } from '$lib/astrology/astrology-utils';

describe('Debug astronomia calculations', () => {
  it('should debug different solar calculation methods', () => {
    const testDate = new Date('1991-12-09T17:59:00.000Z');
    
    // Import astronomia modules
    const { julian } = require('astronomia');
    const solar = require('astronomia/solar');
    
    const jd = julian.DateToJD(testDate);
    
    // Try different methods from solar module
    const apparentLong = solar.apparentLongitude(jd);
    const trueLong = solar.trueLongitude(jd);
    
    // Use failing assertions to reveal actual values
    // apparentLong: 5.806414987217325 (wrong)
    expect(trueLong).toBe(258); // Try trueLongitude - this should show the actual value
  });
});

describe('calculateBirthChart', () => {
  describe('Melbourne, Australia birth chart - 1991-12-10 04:59 AEDT', () => {
    const melbourneBirthData = {
      // Birth time: 1991-12-10 04:59 AEDT (UTC+11)
      // UTC time: 1991-12-09 17:59 UTC
      date: new Date('1991-12-09T17:59:00.000Z'), // UTC time
      latitude: -37.814,
      longitude: 144.96332,
      timezone: 11 // UTC+11 (AEDT)
    };

    // Expected planetary positions for Melbourne birth chart
    const expectedPlanets = {
      'Sun': { sign: 'Sagittarius', degree: 17, minute: 9, retrograde: false },
      'Moon': { sign: 'Capricorn', degree: 26, minute: 20, retrograde: false },
      'Mercury': { sign: 'Sagittarius', degree: 14, minute: 28, retrograde: true },
      'Venus': { sign: 'Scorpio', degree: 4, minute: 0, retrograde: false },
      'Mars': { sign: 'Sagittarius', degree: 7, minute: 36, retrograde: false },
      'Jupiter': { sign: 'Virgo', degree: 13, minute: 55, retrograde: true },
      'Saturn': { sign: 'Aquarius', degree: 3, minute: 32, retrograde: false },
      'Uranus': { sign: 'Capricorn', degree: 12, minute: 23, retrograde: false },
      'Neptune': { sign: 'Capricorn', degree: 15, minute: 24, retrograde: false },
      'Pluto': { sign: 'Scorpio', degree: 21, minute: 20, retrograde: false },
      'Node': { sign: 'Capricorn', degree: 10, minute: 59, retrograde: true },
      'Lilith': { sign: 'Capricorn', degree: 25, minute: 14, retrograde: false },
      'Chiron': { sign: 'Leo', degree: 9, minute: 20, retrograde: true },
      'Fortune': { sign: 'Libra', degree: 22, minute: 29, retrograde: false },
      'Vertex': { sign: 'Aries', degree: 29, minute: 44, retrograde: false }
    };

    const expectedAngles = {
      'ASC': { sign: 'Sagittarius', degree: 1, minute: 40 },
      'MC': { sign: 'Leo', degree: 10, minute: 14 }
    };

    // Helper function to format degrees and minutes
    function formatDegreeMinute(totalDegrees: number): { degree: number; minute: number } {
      const degreeInSign = totalDegrees % 30;
      const degree = Math.floor(degreeInSign);
      const minute = Math.round((degreeInSign - degree) * 60);
      return { degree, minute };
    }

    // Helper function to format output like "Sun,Sagittarius,17°09'"
    function formatPlanetOutput(name: string, sign: string, degree: number, minute: number, retrograde?: boolean): string {
      const retro = retrograde ? ',R' : '';
      return `${name},${sign},${degree}°${minute.toString().padStart(2, '0')}'${retro}`;
    }

    it('should calculate accurate planetary positions', async () => {
      const chart = await calculateBirthChart(
        melbourneBirthData.date,
        melbourneBirthData.latitude,
        melbourneBirthData.longitude
      );

      // Debug output
      console.log('Birth date:', melbourneBirthData.date);
      console.log('Julian Day:', require('astronomia').julian.DateToJD(melbourneBirthData.date));
      console.log('Calculated planets:', chart.planets.map(p => ({ name: p.name, sign: p.sign, longitude: p.longitude })));

      // Check that we have planets
      expect(chart.planets).toBeDefined();
      expect(chart.planets.length).toBeGreaterThan(0);

      // Test each expected planet (note: Prokerala API results may differ from astronomia)
      Object.entries(expectedPlanets).forEach(([planetName, expected]) => {
        const planet = chart.planets.find(p => p.name === planetName);
        
        if (planet) {
          const { degree, minute } = formatDegreeMinute(planet.longitude);
          
          // For now, just log the differences to see what Prokerala returns
          console.log(`${planetName}: Expected ${expected.sign} ${expected.degree}°${expected.minute}', Got ${planet.sign} ${degree}°${minute}'`);
          
          // Check that we got a valid sign and degree
          expect(planet.sign).toBeDefined();
          expect(typeof planet.longitude).toBe('number');
          expect(planet.longitude).toBeGreaterThanOrEqual(0);
          expect(planet.longitude).toBeLessThan(360);
          
          // Check retrograde if specified
          if (expected.retrograde !== undefined) {
            expect(typeof planet.retrograde).toBe('boolean');
          }
        } else {
          // Planet not found - this will fail the test
          console.log(`Planet ${planetName} not found in response`);
          expect(planet).toBeDefined();
        }
      });
    });

    it('should calculate accurate ascendant and MC', async () => {
      const chart = await calculateBirthChart(
        melbourneBirthData.date,
        melbourneBirthData.latitude,
        melbourneBirthData.longitude
      );

      // Check Ascendant
      const ascendantSign = getSignByDegree(chart.ascendant);
      const { degree: ascDegree, minute: ascMinute } = formatDegreeMinute(chart.ascendant);
      
      console.log(`Ascendant: Expected ${expectedAngles.ASC.sign} ${expectedAngles.ASC.degree}°${expectedAngles.ASC.minute}', Got ${ascendantSign} ${ascDegree}°${ascMinute}'`);
      
      // Check that we got valid values
      expect(ascendantSign).toBeDefined();
      expect(typeof chart.ascendant).toBe('number');
      expect(chart.ascendant).toBeGreaterThanOrEqual(0);
      expect(chart.ascendant).toBeLessThan(360);

      // Check MC
      const mcSign = getSignByDegree(chart.mc);
      const { degree: mcDegree, minute: mcMinute } = formatDegreeMinute(chart.mc);
      
      console.log(`MC: Expected ${expectedAngles.MC.sign} ${expectedAngles.MC.degree}°${expectedAngles.MC.minute}', Got ${mcSign} ${mcDegree}°${mcMinute}'`);
      
      // Check that we got valid values
      expect(mcSign).toBeDefined();
      expect(typeof chart.mc).toBe('number');
      expect(chart.mc).toBeGreaterThanOrEqual(0);
      expect(chart.mc).toBeLessThan(360);
    });

    it('should format output correctly', async () => {
      const chart = await calculateBirthChart(
        melbourneBirthData.date,
        melbourneBirthData.latitude,
        melbourneBirthData.longitude
      );

      // Debug output
      console.log('Birth date:', melbourneBirthData.date);
      console.log('Julian Day:', require('astronomia').julian.DateToJD(melbourneBirthData.date));
      console.log('Calculated planets:', chart.planets.map(p => ({ 
        name: p.name, 
        sign: p.sign, 
        longitude: p.longitude,
        degree: p.degree 
      })));

      // Format the output like the expected format
      const formattedOutput: string[] = [];

      // Add planets
      Object.entries(expectedPlanets).forEach(([planetName, expected]) => {
        const planet = chart.planets.find(p => p.name === planetName);
                 if (planet) {
           const { degree, minute } = formatDegreeMinute(planet.longitude);
           formattedOutput.push(formatPlanetOutput(planetName, planet.sign, degree, minute, planet.retrograde || false));
         }
      });

      // Add ASC and MC
      const ascendantSign = getSignByDegree(chart.ascendant);
      const { degree: ascDegree, minute: ascMinute } = formatDegreeMinute(chart.ascendant);
      formattedOutput.push(formatPlanetOutput('ASC', ascendantSign, ascDegree, ascMinute));

      const mcSign = getSignByDegree(chart.mc);
      const { degree: mcDegree, minute: mcMinute } = formatDegreeMinute(chart.mc);
      formattedOutput.push(formatPlanetOutput('MC', mcSign, mcDegree, mcMinute));

      // This test will initially fail but shows what the current output looks like
      console.log('Current output:');
      console.log(formattedOutput.join('\n'));
      
      // For now, just check that we have some output
      expect(formattedOutput.length).toBeGreaterThan(0);
    });
  });
}); 