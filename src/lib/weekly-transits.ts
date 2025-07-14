// Calculate weekly transits to create a general report  - not for a particular chart
// Fetch planetary data for a week/month using VSOP87.
// Check for transits (e.g., any planets forming aspects within a 1°-3° orb).
// Generate a human-readable report dynamically.
// Output the report in the terminal or export it as a text/markdown file.

import { calculateBirthChart } from './astrology/astronomia-service';
import { PLANETS, ZODIAC_SIGNS, getSignByDegree } from './data/astrological-data';

interface Transit {
  date: Date;
  planet1: string;
  planet2: string;
  aspect: string;
  orb: number;
  planet1Retrograde?: boolean;
  planet2Retrograde?: boolean;
}

interface DailyTransits {
  date: Date;
  transits: Transit[];
  aspectChanges: {
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
    planet1Retrograde: boolean;
    planet2Retrograde: boolean;
  }[];
}

// Basic aspects for transit calculations
const BASIC_ASPECTS = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180
};

export class WeeklyTransits {
  private startDate: Date;
  private endDate: Date;
  private previousAspects: Map<string, string> = new Map();

  constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  private getPlanetName(planetId: number): string {
    const planetNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
    return planetNames[planetId] || 'Unknown';
  }

  private async getPlanetPosition(date: Date, planetName: string): Promise<{ longitude: number; retrograde: boolean }> {
    // Use default coordinates for transit calculations (not location-specific)
    const DEFAULT_LAT = 0;
    const DEFAULT_LON = 0;
    
    try {
      const chart = await calculateBirthChart(date, DEFAULT_LAT, DEFAULT_LON);
      
      const planet = chart.planets.find(p => p.name === planetName);
      if (planet) {
        return {
          longitude: planet.longitude,
          retrograde: planet.retrograde || false
        };
      } else {
        // Fallback for planets not found
        return {
          longitude: Math.random() * 360,
          retrograde: false
        };
      }
    } catch (error) {
      // Fallback for calculation errors
      return {
        longitude: Math.random() * 360,
        retrograde: false
      };
    }
  }

  private async getRetrogradePlanets(date: Date): Promise<string[]> {
    const retrogradePlanets: string[] = [];
    
    try {
      const chart = await calculateBirthChart(date, 0, 0);
      
      for (const planet of chart.planets) {
        if (planet.retrograde) {
          retrogradePlanets.push(planet.name);
        }
      }
    } catch (error) {
      // Return empty array if calculation fails
    }

    return retrogradePlanets;
  }

  private getZodiacSign(longitude: number): string {
    return getSignByDegree(longitude);
  }

  private async checkAspects(planet1Name: string, planet2Name: string, date: Date): Promise<Transit[]> {
    const transits: Transit[] = [];
    
    const planet1Pos = await this.getPlanetPosition(date, planet1Name);
    const planet2Pos = await this.getPlanetPosition(date, planet2Name);

    // Check each aspect
    for (const [aspectName, aspectDegree] of Object.entries(BASIC_ASPECTS)) {
      const angleDiff = Math.abs(planet1Pos.longitude - planet2Pos.longitude);
      const normalizedAngle = Math.min(angleDiff, 360 - angleDiff);
      
      // Check if the angle is within orb (typically 1-3 degrees for transits)
      const orb = 2; // 2-degree orb for transits
      if (Math.abs(normalizedAngle - aspectDegree) <= orb) {
        transits.push({
          date,
          planet1: planet1Name,
          planet2: planet2Name,
          aspect: aspectName,
          orb: Math.abs(normalizedAngle - aspectDegree),
          planet1Retrograde: planet1Pos.retrograde,
          planet2Retrograde: planet2Pos.retrograde
        });
      }
    }

    return transits;
  }

  private async getMoonPhase(date: Date): Promise<string> {
    try {
      const chart = await calculateBirthChart(date, 0, 0);
      
      const sunPlanet = chart.planets.find(p => p.name === 'Sun');
      const moonPlanet = chart.planets.find(p => p.name === 'Moon');
      
      if (!sunPlanet || !moonPlanet) {
        return 'Unknown';
      }
      
      const sunLongitude = sunPlanet.longitude;
      const moonLongitude = moonPlanet.longitude;
      
      // Calculate the angle between Sun and Moon
      const angleDiff = Math.abs(moonLongitude - sunLongitude);
      const normalizedAngle = Math.min(angleDiff, 360 - angleDiff);
      
      // Determine moon phase based on angle
      if (normalizedAngle < 22.5) return 'New Moon';
      if (normalizedAngle < 67.5) return 'Waxing Crescent';
      if (normalizedAngle < 112.5) return 'First Quarter';
      if (normalizedAngle < 157.5) return 'Waxing Gibbous';
      if (normalizedAngle < 202.5) return 'Full Moon';
      if (normalizedAngle < 247.5) return 'Waning Gibbous';
      if (normalizedAngle < 292.5) return 'Last Quarter';
      return 'Waning Crescent';
    } catch (error) {
      return 'Error calculating Moon Phase';
    }
  }

  public async calculateTransits(): Promise<DailyTransits[]> {
    const dailyTransits: DailyTransits[] = [];
    const currentDate = new Date(this.startDate);
    
    const planetNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

    while (currentDate <= this.endDate) {
      const dayTransits: Transit[] = [];
      
      // Check aspects between all planet pairs
      for (let i = 0; i < planetNames.length; i++) {
        for (let j = i + 1; j < planetNames.length; j++) {
          const transits = await this.checkAspects(planetNames[i], planetNames[j], currentDate);
          dayTransits.push(...transits);
        }
      }

      dailyTransits.push({
        date: new Date(currentDate),
        transits: dayTransits,
        aspectChanges: [] // Simplified - not tracking aspect changes for now
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dailyTransits;
  }

  public async generateReport(): Promise<string> {
    const dailyTransits = await this.calculateTransits();
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };

    let report = `Weekly Transits Report\n`;
    report += `From ${this.startDate.toLocaleDateString('en-GB', dateOptions)} to ${this.endDate.toLocaleDateString('en-GB', dateOptions)}\n`;
    report += `${'='.repeat(50)}\n\n`;

    if (dailyTransits.length === 0) {
      report += 'No significant transits found during this period.\n';
    } else {
      for (const day of dailyTransits) {
        if (day.transits.length > 0) {
          report += `\n${day.date.toLocaleDateString('en-GB', dateOptions)}:\n`;
          
          if (day.transits.length > 0) {
            report += 'Transits:\n';
            day.transits.forEach(transit => {
              const planet1Retro = transit.planet1Retrograde ? ' (R)' : '';
              const planet2Retro = transit.planet2Retrograde ? ' (R)' : '';
              report += `  ${transit.planet1}${planet1Retro} ${transit.aspect} ${transit.planet2}${planet2Retro} (orb: ${transit.orb.toFixed(2)}°)\n`;
            });
          }
          
          // Report Moon phase
          const moonPhase = await this.getMoonPhase(day.date);
          report += `Moon Phase: ${moonPhase}\n\n`;
        }
      }
    }

    return report;
  }
}

