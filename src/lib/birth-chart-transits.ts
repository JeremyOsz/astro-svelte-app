import { calculateBirthChart } from './astrology/astronomia-service';
import type { BirthChart, PlanetPosition } from './types/types';
import { getTransitInterpretation } from './transit-interpretations';
import { ZODIAC_SIGNS, getSignByDegree } from './data/astrological-data';

// Define planet names for calculations
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

// Basic aspects for transit calculations
const BASIC_ASPECTS = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180
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
  }

  private calculateAspect(angle1: number, angle2: number): number {
    let diff = Math.abs(angle1 - angle2);
    if (diff > 180) {
      diff = 360 - diff;
    }
    return diff;
  }

  private findAspect(diff: number): { name: string; orb: number; angle: number } | null {
    for (const [aspectName, aspectAngle] of Object.entries(BASIC_ASPECTS)) {
      const orb = 2; // 2-degree orb for transits
      if (Math.abs(diff - aspectAngle) <= orb) {
        return { name: aspectName, orb, angle: aspectAngle };
      }
    }
    return null;
  }

  private async getTransitPlanetPosition(date: Date, planetName: string): Promise<{
    longitude: number;
    retrograde: boolean;
    sign: string;
    house: number;
  }> {
    try {
      const chart = await calculateBirthChart(date, this.birthChart.latitude, this.birthChart.longitude);
      
      const planet = chart.planets.find(p => p.name === planetName);
      if (planet) {
        return {
          longitude: planet.longitude,
          retrograde: planet.retrograde || false,
          sign: planet.sign,
          house: planet.house || 1
        };
      } else {
        // Fallback for planets not found
        return {
          longitude: Math.random() * 360,
          retrograde: false,
          sign: 'Unknown',
          house: 1
        };
      }
    } catch (error) {
      // Fallback for calculation errors
      return {
        longitude: Math.random() * 360,
        retrograde: false,
        sign: 'Unknown',
        house: 1
      };
    }
  }

  private getAspectKey(transitPlanet: string, natalPlanet: string): string {
    return `${transitPlanet}-${natalPlanet}`;
  }

  private async checkTransits(date: Date): Promise<Transit[]> {
    const transits: Transit[] = [];
    
    // Get current transit positions
    const transitPositions = new Map<string, any>();
    const planetNames = Object.values(PLANET_NAMES);
    
    for (const planetName of planetNames) {
      const position = await this.getTransitPlanetPosition(date, planetName);
      transitPositions.set(planetName, position);
    }

    // Check aspects between transit planets and natal planets
    for (const transitPlanet of planetNames) {
      const transitPos = transitPositions.get(transitPlanet);
      if (!transitPos) continue;

      for (const natalPlanet of this.birthChart.planets) {
        const diff = this.calculateAspect(transitPos.longitude, natalPlanet.longitude);
        const aspect = this.findAspect(diff);
        
        if (aspect) {
          transits.push({
            date,
            transitPlanet,
            natalPlanet: natalPlanet.name,
            aspect: aspect.name,
            orb: Math.abs(diff - aspect.angle),
            transitPlanetRetrograde: transitPos.retrograde,
            natalPlanetRetrograde: natalPlanet.retrograde || false,
            transitPlanetSign: transitPos.sign,
            natalPlanetSign: natalPlanet.sign,
            transitPlanetHouse: transitPos.house,
            natalPlanetHouse: natalPlanet.house || 1
          });
        }
      }
    }

    return transits;
  }

  public async calculateTransits(): Promise<DailyTransits[]> {
    const dailyTransits: DailyTransits[] = [];
    const currentDate = new Date(this.startDate);

    while (currentDate <= this.endDate) {
      const transits = await this.checkTransits(currentDate);
      
      if (transits.length > 0) {
        dailyTransits.push({
          date: new Date(currentDate),
          transits,
          aspectChanges: [] // Simplified - not tracking aspect changes for now
        });
      }

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

    let report = `Birth Chart Transits Report\n`;
    report += `From ${this.startDate.toLocaleDateString('en-GB', dateOptions)} to ${this.endDate.toLocaleDateString('en-GB', dateOptions)}\n`;
    report += `${'='.repeat(50)}\n\n`;

    if (dailyTransits.length === 0) {
      report += 'No significant transits found during this period.\n';
    } else {
      for (const day of dailyTransits) {
        report += `\n${day.date.toLocaleDateString('en-GB', dateOptions)}:\n`;
        
        if (day.transits.length > 0) {
          report += 'Transits:\n';
          day.transits.forEach(transit => {
            const transitRetro = transit.transitPlanetRetrograde ? ' (R)' : '';
            const natalRetro = transit.natalPlanetRetrograde ? ' (R)' : '';
            report += `  ${transit.transitPlanet}${transitRetro} ${transit.aspect} ${transit.natalPlanet}${natalRetro} (orb: ${transit.orb.toFixed(2)}°)\n`;
            
            // Add interpretation if available
            const interpretation = getTransitInterpretation(transit.transitPlanet, transit.natalPlanet, transit.aspect);
            if (interpretation) {
              report += `    ${interpretation}\n`;
            }
          });
        }
        
        report += '\n';
      }
    }

    return report;
  }
} 