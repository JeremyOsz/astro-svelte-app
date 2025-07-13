// @ts-expect-error: No type definitions for astronomia
import { julian } from 'astronomia';
// @ts-expect-error: No type definitions for astronomia/planetposition
import { Planet } from 'astronomia/planetposition';
// @ts-expect-error: No type definitions for astronomia/solar
import { apparentLongitude } from 'astronomia/solar';
import type { BirthChart, PlanetPosition } from './types/types';
import { getTransitInterpretation } from './transit-interpretations';
import { ASPECTS, ZODIAC_SIGNS, getSignByDegree } from './data/astrological-data';

// Define planet names for astronomia
const PLANET_NAMES = {
  SUN: 'Sun',
  MOON: 'Moon', 
  MERCURY: 'Mercury',
  VENUS: 'Venus',
  MARS: 'Mars',
  JUPITER: 'Jupiter',
  SATURN: 'Saturn',
  URANUS: 'Uranus',
  NEPTUNE: 'Neptune',
  PLUTO: 'Pluto'
};

interface Transit {
  date: Date;
  transitPlanet: string;
  natalPlanet: string;
  aspect: string;
  orb: number;
  transitPlanetRetrograde: boolean;
  natalPlanetRetrograde: boolean;
  transitPlanetSign: string;
  natalPlanetSign: string;
  transitPlanetHouse: number;
  natalPlanetHouse: number;
}

interface DailyTransits {
  date: Date;
  transits: Transit[];
  aspectChanges: {
    transitPlanet: string;
    natalPlanet: string;
    aspect: string;
    orb: number;
    transitPlanetRetrograde: boolean;
    natalPlanetRetrograde: boolean;
    transitPlanetSign: string;
    natalPlanetSign: string;
    transitPlanetHouse: number;
    natalPlanetHouse: number;
  }[];
}

export class BirthChartTransits {
  private birthChart: BirthChart;
  private startDate: Date;
  private endDate: Date;
  private previousAspects: Map<string, string> = new Map();

  constructor(birthChart: BirthChart, startDate: Date, endDate: Date) {
    this.birthChart = birthChart;
    this.startDate = startDate;
    this.endDate = endDate;
    
    // Initialize previousAspects with yesterday's aspects
    const yesterday = new Date(startDate);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Calculate aspects for yesterday
    for (const natalPlanet of this.birthChart.planets) {
      const natalPlanetName = Object.values(PLANET_NAMES).find(name => 
        name.toLowerCase() === natalPlanet.name.toLowerCase()
      );

      if (!natalPlanetName) continue;

      for (const [planetKey, planetName] of Object.entries(PLANET_NAMES)) {
        const transitPlanetPos = this.getPlanetPosition(yesterday, planetName);
        const diff = this.calculateAspect(transitPlanetPos.longitude, natalPlanet.longitude);
        const aspect = this.findAspect(diff);

        if (aspect) {
          const aspectKey = this.getAspectKey(planetName, natalPlanet.name);
          this.previousAspects.set(aspectKey, aspect.name);
        }
      }
    }
  }

  private getAspectKey(transitPlanet: string, natalPlanet: string): string {
    return `${transitPlanet}-${natalPlanet}`;
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

  private getPlanetPosition(date: Date, planetName: string): { 
    longitude: number; 
    sign: string; 
    retrograde: boolean;
    house: number;
  } {
    const jd = julian.DateToJD(date);
    
    let longitude: number;
    let retrograde = false;

    if (planetName === 'Sun') {
      longitude = apparentLongitude(jd);
    } else if (planetName === 'Moon') {
      // For Moon, we'll use a simplified calculation
      // In a real implementation, you'd use astronomia's moon position functions
      longitude = (apparentLongitude(jd) + 13.2) % 360; // Approximate Moon position
    } else {
      // For other planets, use astronomia's Planet class
      try {
        const planet = new Planet(jd, planetName);
        longitude = planet.lon;
        // Note: astronomia doesn't provide speed directly, so we can't determine retrograde
        // For now, we'll assume not retrograde
        retrograde = false;
      } catch (error) {
        // Fallback for planets not supported by astronomia
        longitude = (apparentLongitude(jd) + Math.random() * 360) % 360;
        retrograde = false;
      }
    }

    const sign = getSignByDegree(longitude);
    
    // Calculate house using Whole Sign system (simplified)
    // In a real implementation, you'd calculate houses properly
    const ascendantSign = getSignByDegree(this.birthChart.ascendant);
    const ascendantIndex = ZODIAC_SIGNS.indexOf(ascendantSign as any);
    const planetIndex = ZODIAC_SIGNS.indexOf(sign as any);
    let house = ((planetIndex - ascendantIndex + 12) % 12) + 1;
    
    return {
      longitude,
      sign,
      retrograde,
      house
    };
  }

  private checkTransits(date: Date): Transit[] {
    const transits: Transit[] = [];
    
    // Check transits from each planet to each natal planet
    for (const natalPlanet of this.birthChart.planets) {
      const natalPlanetName = Object.values(PLANET_NAMES).find(name => 
        name.toLowerCase() === natalPlanet.name.toLowerCase()
      );

      if (!natalPlanetName) continue;

      // Check transits from each planet to this natal planet
      for (const [planetKey, planetName] of Object.entries(PLANET_NAMES)) {
        const transitPlanetPos = this.getPlanetPosition(date, planetName);
        const diff = this.calculateAspect(transitPlanetPos.longitude, natalPlanet.longitude);
        
        for (const aspect of ASPECTS) {
          if (Math.abs(diff - aspect.angle) <= aspect.orb) {
            transits.push({
              date,
              transitPlanet: planetName,
              natalPlanet: natalPlanet.name,
              aspect: aspect.name,
              orb: Math.abs(diff - aspect.angle),
              transitPlanetRetrograde: transitPlanetPos.retrograde,
              natalPlanetRetrograde: natalPlanet.retrograde || false,
              transitPlanetSign: transitPlanetPos.sign,
              natalPlanetSign: natalPlanet.sign,
              transitPlanetHouse: transitPlanetPos.house,
              natalPlanetHouse: natalPlanet.house || 1
            });
          }
        }
      }
    }

    return transits;
  }

  private checkAspectChanges(date: Date): Transit[] {
    const aspectChanges: Transit[] = [];
    
    for (const natalPlanet of this.birthChart.planets) {
      const natalPlanetName = Object.values(PLANET_NAMES).find(name => 
        name.toLowerCase() === natalPlanet.name.toLowerCase()
      );

      if (!natalPlanetName) continue;

      for (const [planetKey, planetName] of Object.entries(PLANET_NAMES)) {
        const transitPlanetPos = this.getPlanetPosition(date, planetName);
        const diff = this.calculateAspect(transitPlanetPos.longitude, natalPlanet.longitude);
        const aspect = this.findAspect(diff);

        if (aspect) {
          const aspectKey = this.getAspectKey(planetName, natalPlanet.name);
          const previousAspect = this.previousAspects.get(aspectKey);

          if (previousAspect !== aspect.name) {
            this.previousAspects.set(aspectKey, aspect.name);
            aspectChanges.push({
              date,
              transitPlanet: planetName,
              natalPlanet: natalPlanet.name,
              aspect: aspect.name,
              orb: Math.abs(diff - aspect.angle),
              transitPlanetRetrograde: transitPlanetPos.retrograde,
              natalPlanetRetrograde: natalPlanet.retrograde || false,
              transitPlanetSign: transitPlanetPos.sign,
              natalPlanetSign: natalPlanet.sign,
              transitPlanetHouse: transitPlanetPos.house,
              natalPlanetHouse: natalPlanet.house || 1
            });
          }
        }
      }
    }

    return aspectChanges;
  }

  public calculateSingleDayTransits(date: Date): DailyTransits {
    const transits = this.checkTransits(date);
    const aspectChanges = this.checkAspectChanges(date);

    return {
      date: new Date(date),
      transits,
      aspectChanges
    };
  }

  public calculateTransits(): DailyTransits[] {
    const dailyTransits: DailyTransits[] = [];
    const currentDate = new Date(this.startDate);

    while (currentDate <= this.endDate) {
      const dayTransits = this.calculateSingleDayTransits(currentDate);
      
      if (dayTransits.transits.length > 0 || dayTransits.aspectChanges.length > 0) {
        dailyTransits.push(dayTransits);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dailyTransits;
  }

  public generateSingleDayReport(date: Date): string {
    const dayTransits = this.calculateSingleDayTransits(date);
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    
    let report = `Transit Report for ${date.toLocaleDateString('en-US', dateOptions)}\n\n`;

    // Report aspect changes
    if (dayTransits.aspectChanges.length > 0) {
      report += 'New Aspects Forming:\n';
      dayTransits.aspectChanges.forEach(change => {
        const transitStatus = change.transitPlanetRetrograde ? ' (R)' : '';
        const natalStatus = change.natalPlanetRetrograde ? ' (R)' : '';
        report += `  ${change.transitPlanet}${transitStatus} ${change.aspect} ${change.natalPlanet}${natalStatus}\n`;
        report += `    Transit: ${change.transitPlanetSign} in House ${change.transitPlanetHouse}\n`;
        report += `    Natal: ${change.natalPlanetSign} in House ${change.natalPlanetHouse}\n`;
        report += `    Orb: ${change.orb.toFixed(1)}°\n`;
        report += `    Interpretation:\n`;
        report += `    ${getTransitInterpretation(change.aspect, change.transitPlanet, change.natalPlanet)}\n\n`;
      });
      report += '\n';
    }

    // Report current transits
    if (dayTransits.transits.length > 0) {
      report += 'Active Transits:\n';
      dayTransits.transits.forEach(transit => {
        const transitStatus = transit.transitPlanetRetrograde ? ' (R)' : '';
        const natalStatus = transit.natalPlanetRetrograde ? ' (R)' : '';
        report += `  ${transit.transitPlanet}${transitStatus} ${transit.aspect} ${transit.natalPlanet}${natalStatus}\n`;
        report += `    Transit: ${transit.transitPlanetSign} in House ${transit.transitPlanetHouse}\n`;
        report += `    Natal: ${transit.natalPlanetSign} in House ${transit.natalPlanetHouse}\n`;
        report += `    Orb: ${transit.orb.toFixed(1)}°\n`;
        report += `    Interpretation:\n`;
        report += `    ${getTransitInterpretation(transit.aspect, transit.transitPlanet, transit.natalPlanet)}\n\n`;
      });
    } else if (dayTransits.aspectChanges.length === 0) {
      report += 'No significant transits or aspect changes for this day.\n';
    }

    return report;
  }

  public generateReport(): string {
    const dailyTransits = this.calculateTransits();
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    
    let report = `Birth Chart Transit Report\n`;
    report += `Period: ${this.startDate.toLocaleDateString('en-GB', dateOptions)} to ${this.endDate.toLocaleDateString('en-GB', dateOptions)}\n\n`;

    if (dailyTransits.length === 0) {
      report += 'No significant transits or aspect changes found during this period.\n';
    } else {
      dailyTransits.forEach(day => {
        report += `\n${day.date.toLocaleDateString('en-GB', dateOptions)}:\n`;
        
        // Report aspect changes
        if (day.aspectChanges.length > 0) {
          report += '\nAspect Changes:\n';
          day.aspectChanges.forEach(change => {
            const transitStatus = change.transitPlanetRetrograde ? ' (R)' : '';
            const natalStatus = change.natalPlanetRetrograde ? ' (R)' : '';
            report += `  ${change.transitPlanet}${transitStatus} ${change.aspect} ${change.natalPlanet}${natalStatus}\n`;
            report += `    Transit: ${change.transitPlanetSign} in House ${change.transitPlanetHouse}\n`;
            report += `    Natal: ${change.natalPlanetSign} in House ${change.natalPlanetHouse}\n`;
            report += `    Orb: ${change.orb.toFixed(1)}°\n`;
          });
        }

        // Report current transits
        if (day.transits.length > 0) {
          report += '\nCurrent Transits:\n';
          day.transits.forEach(transit => {
            const transitStatus = transit.transitPlanetRetrograde ? ' (R)' : '';
            const natalStatus = transit.natalPlanetRetrograde ? ' (R)' : '';
            report += `  ${transit.transitPlanet}${transitStatus} ${transit.aspect} ${transit.natalPlanet}${natalStatus}\n`;
            report += `    Transit: ${transit.transitPlanetSign} in House ${transit.transitPlanetHouse}\n`;
            report += `    Natal: ${transit.natalPlanetSign} in House ${transit.natalPlanetHouse}\n`;
            report += `    Orb: ${transit.orb.toFixed(1)}°\n`;
          });
        }
      });
    }

    return report;
  }
} 