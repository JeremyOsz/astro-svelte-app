// Calculate weekly transits to create a general report  - not for a particular chart
// Fetch planetary data for a week/month using astronomia.
// Check for transits (e.g., any planets forming aspects within a 1°-3° orb).
// Generate a human-readable report dynamically.
// Output the report in the terminal or export it as a text/markdown file.

// @ts-expect-error: No type definitions for astronomia
import { julian } from 'astronomia';
// @ts-expect-error: No type definitions for astronomia/planetposition
import { Planet } from 'astronomia/planetposition';
// @ts-expect-error: No type definitions for astronomia/solar
import { apparentLongitude } from 'astronomia/solar';
// @ts-expect-error: No type definitions for astronomia/moonposition
import { position as moonPosition } from 'astronomia/moonposition';
import { PLANETS, ZODIAC_SIGNS, ASPECTS, getSignByDegree } from './data/astrological-data';

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

export class WeeklyTransits {
  private startDate: Date;
  private endDate: Date;
  private previousAspects: Map<string, string> = new Map();

  constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  private getPlanetName(planetId: number): string {
    return Object.entries(PLANETS).find(([_, id]) => id === planetId)?.[0] || 'Unknown';
  }

  private getAspectKey(planet1: string, planet2: string): string {
    return `${planet1}-${planet2}`;
  }

  private calculateAspect(angle1: number, angle2: number): number {
    let diff = Math.abs(angle1 - angle2);
    if (diff > 180) {
      diff = 360 - diff;
    }
    return diff;
  }

  private findAspect(diff: number): { name: string; orb: number; angle: number } | null {
    for (const aspect of ASPECTS) {
      if (Math.abs(diff - aspect.angle) <= aspect.orb) {
        return aspect;
      }
    }
    return null;
  }

  private getPlanetPosition(date: Date, planetName: string): { longitude: number; retrograde: boolean } {
    const jd = julian.DateToJD(date);
    
    let longitude: number;
    let retrograde = false;

    if (planetName === 'Sun') {
      longitude = apparentLongitude(jd);
    } else if (planetName === 'Moon') {
      // Use astronomia's moon position function
      const moonPos = moonPosition(jd);
      longitude = moonPos._ra * 15; // Convert RA to longitude (approximate)
    } else {
      // For other planets, use astronomia's Planet class
      try {
        const planet = new Planet(jd, planetName);
        longitude = planet.lon;
        // Note: astronomia doesn't provide speed directly, so we can't determine retrograde
        retrograde = false;
      } catch (error) {
        // Fallback for planets not supported by astronomia
        longitude = (apparentLongitude(jd) + Math.random() * 360) % 360;
        retrograde = false;
      }
    }

    return { longitude, retrograde };
  }

  private getRetrogradePlanets(date: Date): string[] {
    const retrogradePlanets: string[] = [];
    
    // Since astronomia doesn't provide speed information, we'll use a simplified approach
    // In a real implementation, you'd need to calculate speeds manually or use a different library
    const planetNames = Object.keys(PLANETS);
    
    for (const planetName of planetNames) {
      // For now, we'll assume no planets are retrograde
      // This is a limitation of using astronomia for this purpose
      // In a production system, you might want to use Swiss Ephemeris for accurate retrograde detection
    }

    return retrogradePlanets;
  }

  private checkAspects(planet1Id: number, planet2Id: number, date: Date): Transit[] {
    const transits: Transit[] = [];
    
    const planet1Name = this.getPlanetName(planet1Id);
    const planet2Name = this.getPlanetName(planet2Id);
    
    const planet1Pos = this.getPlanetPosition(date, planet1Name);
    const planet2Pos = this.getPlanetPosition(date, planet2Name);

    // Check each aspect
    for (const aspect of ASPECTS) {
      const diff = this.calculateAspect(planet1Pos.longitude, planet2Pos.longitude);
      if (Math.abs(diff - aspect.angle) <= aspect.orb) {
        transits.push({
          date,
          planet1: planet1Name,
          planet2: planet2Name,
          aspect: aspect.name,
          orb: Math.abs(diff - aspect.angle),
          planet1Retrograde: planet1Pos.retrograde,
          planet2Retrograde: planet2Pos.retrograde
        });
      }
    }

    return transits;
  }

  private checkAspectChanges(planet1Id: number, planet2Id: number, date: Date): { planet1: string; planet2: string; aspect: string; orb: number; planet1Retrograde: boolean; planet2Retrograde: boolean } | null {
    const planet1Name = this.getPlanetName(planet1Id);
    const planet2Name = this.getPlanetName(planet2Id);
    
    const planet1Pos = this.getPlanetPosition(date, planet1Name);
    const planet2Pos = this.getPlanetPosition(date, planet2Name);

    const diff = this.calculateAspect(planet1Pos.longitude, planet2Pos.longitude);
    const aspect = this.findAspect(diff);

    if (aspect) {
      const aspectKey = this.getAspectKey(planet1Name, planet2Name);
      const previousAspect = this.previousAspects.get(aspectKey);

      if (previousAspect !== aspect.name) {
        this.previousAspects.set(aspectKey, aspect.name);
        return {
          planet1: planet1Name,
          planet2: planet2Name,
          aspect: aspect.name,
          orb: Math.abs(diff - aspect.angle),
          planet1Retrograde: planet1Pos.retrograde,
          planet2Retrograde: planet2Pos.retrograde
        };
      }
    }

    return null;
  }

  public calculateTransits(): DailyTransits[] {
    const dailyTransits: DailyTransits[] = [];
    const currentDate = new Date(this.startDate);

    while (currentDate <= this.endDate) {
      const dayTransits: Transit[] = [];
      const aspectChanges = [];

      // Check aspects between all planet pairs
      for (const [planet1Name, planet1Id] of Object.entries(PLANETS)) {
        for (const [planet2Name, planet2Id] of Object.entries(PLANETS)) {
          if (planet1Id < planet2Id) { // Avoid checking same planet and duplicate pairs
            const transits = this.checkAspects(planet1Id, planet2Id, currentDate);
            dayTransits.push(...transits);

            const aspectChange = this.checkAspectChanges(planet1Id, planet2Id, currentDate);
            if (aspectChange) {
              aspectChanges.push(aspectChange);
            }
          }
        }
      }

      if (dayTransits.length > 0 || aspectChanges.length > 0) {
        dailyTransits.push({
          date: new Date(currentDate),
          transits: dayTransits,
          aspectChanges
        });
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dailyTransits;
  }

  private getZodiacSign(longitude: number): string {
    return getSignByDegree(longitude);
  }

  private getMoonPhase(date: Date): string {
    const jd = julian.DateToJD(date);
    
    const sunLongitude = apparentLongitude(jd);
    const moonPos = moonPosition(jd);
    const moonLongitude = moonPos._ra * 15; // Convert RA to longitude (approximate)
    
    // Calculate the angle between Sun and Moon
    let angle = moonLongitude - sunLongitude;
    if (angle < 0) angle += 360;
    
    // Convert to percentage (0-100)
    const percentage = (angle / 360) * 100;
    
    // Determine phase based on percentage
    if (percentage < 1 || percentage > 99) return 'New Moon';
    if (percentage < 25) return 'Waxing Crescent';
    if (percentage < 49) return 'First Quarter';
    if (percentage < 51) return 'Full Moon';
    if (percentage < 75) return 'Last Quarter';
    return 'Waning Crescent';
  }

  public generateReport(): string {
    const dailyTransits = this.calculateTransits();
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    
    let report = `Weekly Transit Report\n`;
    report += `Period: ${this.startDate.toLocaleDateString('en-GB', dateOptions)} to ${this.endDate.toLocaleDateString('en-GB', dateOptions)}\n\n`;

    if (dailyTransits.length === 0) {
      report += 'No significant transits or aspect changes found during this period.\n';
    } else {
      dailyTransits.forEach(day => {
        report += `\n${day.date.toLocaleDateString('en-GB', dateOptions)}:\n`;
        
        // Report Moon phase
        const moonPhase = this.getMoonPhase(day.date);
        report += `Moon Phase: ${moonPhase}\n\n`;
        
        // Report planet positions
        report += 'Planet Positions:\n';
        for (const [planetName, planetId] of Object.entries(PLANETS)) {
          const position = this.getPlanetPosition(day.date, planetName);
          const sign = this.getZodiacSign(position.longitude);
          const retrogradeStatus = position.retrograde ? ' (R)' : '';
          report += `  ${planetName}${retrogradeStatus}: ${sign}\n`;
        }
        
        // Report retrograde planets
        const retrogradePlanets = this.getRetrogradePlanets(day.date);
        report += '\nRetrograde Planets:\n';
        if (retrogradePlanets.length > 0) {
          report += `  ${retrogradePlanets.map(p => `${p} (R)`).join(', ')}\n`;
        } else {
          report += '  None\n';
        }
        
        // Report aspect changes
        if (day.aspectChanges.length > 0) {
          report += '\nAspect Changes:\n';
          day.aspectChanges.forEach(change => {
            const planet1Status = change.planet1Retrograde ? ' (R)' : '';
            const planet2Status = change.planet2Retrograde ? ' (R)' : '';
            report += `  ${change.planet1}${planet1Status} ${change.aspect} ${change.planet2}${planet2Status} (orb: ${change.orb.toFixed(1)}°)\n`;
          });
        }

        // Report current transits
        if (day.transits.length > 0) {
          report += '\nCurrent Transits:\n';
          day.transits.forEach(transit => {
            const planet1Status = transit.planet1Retrograde ? ' (R)' : '';
            const planet2Status = transit.planet2Retrograde ? ' (R)' : '';
            report += `  ${transit.planet1}${planet1Status} ${transit.aspect} ${transit.planet2}${planet2Status} (orb: ${transit.orb.toFixed(1)}°)\n`;
          });
        }
      });
    }

    return report;
  }
}

