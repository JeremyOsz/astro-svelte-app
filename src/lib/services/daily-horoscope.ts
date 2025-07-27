import type { BirthChart, PlanetPosition, TransitAspect } from '$lib/types/types';
import { SwissEphemerisService } from '$lib/astrology/swiss-ephemeris-service';
import { getTransitInterpretation, getDetailedAspectInterpretation } from '$lib/data/interpretations';
import { getSignByDegree } from '$lib/data/astrological-data';

export interface DailyHoroscope {
  date: string;
  theme: string;
  moonInfo: MoonInfo;
  keyTransits: KeyTransit[];
  guidance: string;
  lunarPhase: LunarPhase;
  actionAdvice: string;
  intensity: 'low' | 'medium' | 'high';
}

export interface MoonInfo {
  sign: string;
  house: number;
  description: string;
  aspects: TransitAspect[];
  voidOfCourse: boolean;
}

export interface KeyTransit {
  transitPlanet: string;
  natalPlanet: string;
  aspect: string;
  orb: number;
  interpretation: string;
  exactTime?: string;
  daypart?: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface LunarPhase {
  phase: string;
  description: string;
  percentage: number;
}

export class DailyHoroscopeService {
  static async generateDailyHoroscope(
    natalChart: BirthChart,
    date: Date = new Date(),
    location?: { latitude: number; longitude: number; name: string }
  ): Promise<DailyHoroscope> {
    try {
      // Calculate current transits
      const transitData = await SwissEphemerisService.calculateTransits(
        natalChart,
        date,
        'whole_sign',
        location
      );

      // Ensure transitData has the expected structure
      if (!transitData || typeof transitData !== 'object') {
        throw new Error('Invalid transit data received from ephemeris service');
      }

      // Get Moon information
      const moonInfo = this.getMoonInfo(transitData, natalChart);

      // Get key transits (prioritized by importance)
      const keyTransits = this.getKeyTransits(transitData, natalChart);

      // Generate daily theme
      const theme = this.generateDailyTheme(keyTransits, moonInfo);

      // Generate guidance
      const guidance = this.generateGuidance(keyTransits, moonInfo);

      // Get lunar phase
      const lunarPhase = this.getLunarPhase(date);

      // Generate action advice
      const actionAdvice = this.generateActionAdvice(keyTransits, moonInfo, lunarPhase);

      // Calculate intensity
      const intensity = this.calculateIntensity(keyTransits);

      return {
        date: date.toISOString().split('T')[0],
        theme,
        moonInfo,
        keyTransits,
        guidance,
        lunarPhase,
        actionAdvice,
        intensity
      };
    } catch (error) {
      console.error('Error generating daily horoscope:', error);
      throw error;
    }
  }

  private static getMoonInfo(transitData: any, natalChart: BirthChart): MoonInfo {
    // Ensure transitData.planets exists
    if (!transitData.planets || !Array.isArray(transitData.planets)) {
      throw new Error('Transit planets not found in ephemeris data');
    }

    const moon = transitData.planets.find((p: any) => p.name === 'Moon');
    if (!moon) {
      throw new Error('Moon position not found in ephemeris data');
    }

    // Calculate Moon's house position
    const moonHouse = this.calculateHousePosition(moon.longitude, natalChart);

    // Get Moon aspects to natal planets
    const moonAspects = (transitData.aspects && Array.isArray(transitData.aspects)) 
      ? transitData.aspects.filter((aspect: any) => 
          aspect.transitPlanet === 'Moon' || aspect.natalPlanet === 'Moon'
        ) 
      : [];

    // Check for void of course (simplified - would need more sophisticated calculation)
    const voidOfCourse = this.checkVoidOfCourse(moon, transitData.planets || []);

    const descriptions = {
      'Aries': 'Emotional energy is direct and assertive. You may feel more impulsive or competitive.',
      'Taurus': 'Emotional energy is stable and grounded. You seek comfort and security.',
      'Gemini': 'Emotional energy is curious and communicative. You may feel scattered or talkative.',
      'Cancer': 'Emotional energy is nurturing and protective. You may feel more sensitive or home-focused.',
      'Leo': 'Emotional energy is dramatic and expressive. You may feel more confident or attention-seeking.',
      'Virgo': 'Emotional energy is analytical and practical. You may feel more critical or service-oriented.',
      'Libra': 'Emotional energy is balanced and harmonious. You may feel more diplomatic or relationship-focused.',
      'Scorpio': 'Emotional energy is intense and transformative. You may feel more passionate or secretive.',
      'Sagittarius': 'Emotional energy is adventurous and optimistic. You may feel more expansive or philosophical.',
      'Capricorn': 'Emotional energy is disciplined and ambitious. You may feel more serious or goal-oriented.',
      'Aquarius': 'Emotional energy is innovative and independent. You may feel more detached or rebellious.',
      'Pisces': 'Emotional energy is intuitive and compassionate. You may feel more dreamy or spiritual.'
    };

    const houseDescriptions = {
      1: 'Focus on self-expression and personal identity.',
      2: 'Focus on values, resources, and self-worth.',
      3: 'Focus on communication, learning, and immediate environment.',
      4: 'Focus on home, family, and emotional foundation.',
      5: 'Focus on creativity, romance, and self-expression.',
      6: 'Focus on work, health, and daily routines.',
      7: 'Focus on partnerships, relationships, and balance.',
      8: 'Focus on transformation, shared resources, and intimacy.',
      9: 'Focus on expansion, higher learning, and philosophy.',
      10: 'Focus on career, public image, and life direction.',
      11: 'Focus on friendships, groups, and future goals.',
      12: 'Focus on spirituality, subconscious, and hidden matters.'
    };

    const description = `${descriptions[moon.sign as keyof typeof descriptions] || ''} ${houseDescriptions[moonHouse as keyof typeof houseDescriptions] || ''}`;

    return {
      sign: moon.sign,
      house: moonHouse,
      description,
      aspects: moonAspects,
      voidOfCourse
    };
  }

  private static getKeyTransits(transitData: any, natalChart: BirthChart): KeyTransit[] {
    if (!transitData.aspects || !Array.isArray(transitData.aspects)) {
      throw new Error('Transit aspects not found in ephemeris data');
    }

    // Prioritize aspects by importance
    const personalPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
    const angles = ['Ascendant', 'MC', 'IC', 'DSC'];
    const outerPlanets = ['Saturn', 'Uranus', 'Neptune', 'Pluto'];
    const socialPlanets = ['Jupiter', 'Saturn'];

    const prioritizedAspects = transitData.aspects
      .filter((aspect: any) => aspect.orb <= 1.5) // Slightly wider orb for more comprehensive coverage
      .map((aspect: any) => {
        const transitPlanet = aspect.transitPlanet;
        const natalPlanet = aspect.natalPlanet;
        
        // Calculate priority score
        let priority = 0;
        
        // Personal planets get highest priority (especially Sun and Moon)
        if (personalPlanets.includes(transitPlanet) || personalPlanets.includes(natalPlanet)) {
          priority += 15;
          if (transitPlanet === 'Sun' || natalPlanet === 'Sun') priority += 5;
          if (transitPlanet === 'Moon' || natalPlanet === 'Moon') priority += 5;
        }
        
        // Angles get very high priority
        if (angles.includes(natalPlanet)) {
          priority += 12;
        }
        
        // Outer planets add significant priority
        if (outerPlanets.includes(transitPlanet)) {
          priority += 8;
        }
        
        // Social planets add medium priority
        if (socialPlanets.includes(transitPlanet)) {
          priority += 6;
        }
        
        // Closer orbs get higher priority (exponential increase for very close aspects)
        const orbScore = Math.pow(1.5 - aspect.orb, 2) * 10;
        priority += orbScore;
        
        // Hard aspects (conjunction, square, opposition) get higher priority
        if (['Conjunction', 'Square', 'Opposition'].includes(aspect.aspect)) {
          priority += 5;
        }
        
        // Conjunctions are especially important
        if (aspect.aspect === 'Conjunction') {
          priority += 3;
        }

        return { ...aspect, priority };
      })
      .sort((a: any, b: any) => b.priority - a.priority)
      .slice(0, 6); // Top 6 most important aspects

    return prioritizedAspects.map((aspect: any) => {
      const interpretation = getTransitInterpretation(
        aspect.aspect,
        aspect.transitPlanet,
        aspect.natalPlanet
      );

      // Determine daypart based on planet and aspect
      const daypart = this.determineDaypart(aspect.transitPlanet, aspect.aspect);

      return {
        transitPlanet: aspect.transitPlanet,
        natalPlanet: aspect.natalPlanet,
        aspect: aspect.aspect,
        orb: aspect.orb,
        interpretation,
        daypart
      };
    });
  }

  private static generateDailyTheme(keyTransits: KeyTransit[], moonInfo: MoonInfo): string {
    if (keyTransits.length === 0) {
      return "A day for reflection and gentle progress.";
    }

    const themes = {
      'Conjunction': 'Integration and new beginnings',
      'Opposition': 'Balance and awareness',
      'Square': 'Challenge and growth',
      'Trine': 'Harmony and ease',
      'Sextile': 'Opportunity and cooperation'
    };

    const primaryTransit = keyTransits[0];
    const aspectTheme = themes[primaryTransit.aspect as keyof typeof themes] || 'Transformation and change';
    
    const planetThemes = {
      'Sun': 'identity and purpose',
      'Moon': 'emotions and intuition',
      'Mercury': 'communication and thinking',
      'Venus': 'love and beauty',
      'Mars': 'action and courage',
      'Jupiter': 'expansion and wisdom',
      'Saturn': 'structure and responsibility',
      'Uranus': 'innovation and freedom',
      'Neptune': 'inspiration and spirituality',
      'Pluto': 'transformation and power'
    };

    const planetTheme = planetThemes[primaryTransit.transitPlanet as keyof typeof planetThemes] || 'personal growth';

    return `${aspectTheme} in ${planetTheme}.`;
  }

  private static generateGuidance(keyTransits: KeyTransit[], moonInfo: MoonInfo): string {
    if (keyTransits.length === 0) {
      return "Today offers a gentle energy for reflection and small steps forward. Trust your intuition and take time to connect with your inner wisdom.";
    }

    const guidance = [];
    
    // Add Moon guidance
    if (moonInfo.voidOfCourse) {
      guidance.push("The Moon is void of course—avoid starting new projects or making important decisions.");
    }

    // Add transit guidance
    keyTransits.forEach(transit => {
      const transitGuidance = this.getTransitGuidance(transit);
      if (transitGuidance) {
        guidance.push(transitGuidance);
      }
    });

    // Add overall tone
    const hardAspects = keyTransits.filter(t => ['Conjunction', 'Square', 'Opposition'].includes(t.aspect));
    const easyAspects = keyTransits.filter(t => ['Trine', 'Sextile'].includes(t.aspect));

    if (hardAspects.length > easyAspects.length) {
      guidance.push("Today may bring challenges that require patience and effort. Trust that growth comes through facing difficulties.");
    } else if (easyAspects.length > 0) {
      guidance.push("The day's energy supports flow and harmony. Trust your instincts and move forward with confidence.");
    }

    return guidance.join(' ');
  }

  private static generateActionAdvice(keyTransits: KeyTransit[], moonInfo: MoonInfo, lunarPhase: LunarPhase): string {
    const advice = [];

    // Moon phase advice
    if (lunarPhase.phase === 'New Moon') {
      advice.push("Set intentions and plant seeds for new beginnings.");
    } else if (lunarPhase.phase === 'First Quarter') {
      advice.push("Take action and make decisions about what you started.");
    } else if (lunarPhase.phase === 'Full Moon') {
      advice.push("Release what no longer serves and celebrate achievements.");
    } else if (lunarPhase.phase === 'Last Quarter') {
      advice.push("Reflect, review, and prepare for closure.");
    }

    // Transit-specific advice
    keyTransits.forEach(transit => {
      const actionAdvice = this.getActionAdvice(transit);
      if (actionAdvice) {
        advice.push(actionAdvice);
      }
    });

    // Void of course advice
    if (moonInfo.voidOfCourse) {
      advice.push("Focus on routine tasks and avoid new commitments.");
    }

    return advice.join(' ');
  }

  private static getLunarPhase(date: Date): LunarPhase {
    // More accurate lunar phase calculation based on astronomical algorithms
    const phases = [
      { phase: 'New Moon', description: 'New beginnings and setting intentions. Time to plant seeds for what you want to manifest.', percentage: 0 },
      { phase: 'Waxing Crescent', description: 'Building momentum and taking first steps. Begin to take action on your intentions.', percentage: 25 },
      { phase: 'First Quarter', description: 'Making decisions and taking action. Face challenges with determination and clarity.', percentage: 50 },
      { phase: 'Waxing Gibbous', description: 'Refining and preparing for completion. Fine-tune your approach and gather resources.', percentage: 75 },
      { phase: 'Full Moon', description: 'Illumination and release. Celebrate achievements and let go of what no longer serves.', percentage: 100 },
      { phase: 'Waning Gibbous', description: 'Gratitude and sharing. Express thanks and share your wisdom with others.', percentage: 75 },
      { phase: 'Last Quarter', description: 'Reflection and letting go. Review what you\'ve learned and release old patterns.', percentage: 50 },
      { phase: 'Waning Crescent', description: 'Rest and preparation for new cycle. Rest, reflect, and prepare for the next new moon.', percentage: 25 }
    ];

    // Calculate lunar phase using a more accurate method
    // This is a simplified version - for production, you'd want to use astronomical algorithms
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Calculate days since known new moon (approximate)
    const knownNewMoon = new Date(2000, 0, 6); // January 6, 2000 was a new moon
    const daysSinceKnownNewMoon = Math.floor((date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24));
    
    // Lunar cycle is approximately 29.53 days
    const lunarCycle = 29.53;
    const daysInCurrentCycle = daysSinceKnownNewMoon % lunarCycle;
    
    // Determine phase based on days in cycle
    let phaseIndex = 0;
    let percentage = 0;
    
    if (daysInCurrentCycle < 3.69) {
      phaseIndex = 0; // New Moon
      percentage = (daysInCurrentCycle / 3.69) * 25;
    } else if (daysInCurrentCycle < 7.38) {
      phaseIndex = 1; // Waxing Crescent
      percentage = 25 + ((daysInCurrentCycle - 3.69) / 3.69) * 25;
    } else if (daysInCurrentCycle < 11.07) {
      phaseIndex = 2; // First Quarter
      percentage = 50 + ((daysInCurrentCycle - 7.38) / 3.69) * 25;
    } else if (daysInCurrentCycle < 14.76) {
      phaseIndex = 3; // Waxing Gibbous
      percentage = 75 + ((daysInCurrentCycle - 11.07) / 3.69) * 25;
    } else if (daysInCurrentCycle < 18.45) {
      phaseIndex = 4; // Full Moon
      percentage = 100 - ((daysInCurrentCycle - 14.76) / 3.69) * 25;
    } else if (daysInCurrentCycle < 22.14) {
      phaseIndex = 5; // Waning Gibbous
      percentage = 75 - ((daysInCurrentCycle - 18.45) / 3.69) * 25;
    } else if (daysInCurrentCycle < 25.83) {
      phaseIndex = 6; // Last Quarter
      percentage = 50 - ((daysInCurrentCycle - 22.14) / 3.69) * 25;
    } else {
      phaseIndex = 7; // Waning Crescent
      percentage = 25 - ((daysInCurrentCycle - 25.83) / 3.69) * 25;
    }
    
    return {
      phase: phases[phaseIndex].phase,
      description: phases[phaseIndex].description,
      percentage: Math.round(percentage)
    };
  }

  private static calculateIntensity(keyTransits: KeyTransit[]): 'low' | 'medium' | 'high' {
    if (keyTransits.length === 0) return 'low';
    
    let intensityScore = 0;
    
    keyTransits.forEach(transit => {
      // Hard aspects add more intensity
      if (['Conjunction', 'Square', 'Opposition'].includes(transit.aspect)) {
        intensityScore += 2;
      } else {
        intensityScore += 1;
      }
      
      // Closer orbs add more intensity
      intensityScore += (1.0 - transit.orb) * 2;
      
      // Outer planets add more intensity
      if (['Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(transit.transitPlanet)) {
        intensityScore += 1;
      }
    });

    if (intensityScore >= 8) return 'high';
    if (intensityScore >= 4) return 'medium';
    return 'low';
  }

  private static calculateHousePosition(longitude: number, natalChart: BirthChart): number {
    // Simplified house calculation - assumes whole sign houses
    const ascendant = natalChart.ascendant;
    const diff = (longitude - ascendant + 360) % 360;
    return Math.floor(diff / 30) + 1;
  }

  private static checkVoidOfCourse(moon: any, planets: any[]): boolean {
    // Simplified void of course check
    // In production, you'd want more sophisticated calculation
    if (!moon || !planets || !Array.isArray(planets)) {
      return false;
    }
    return false;
  }

  private static determineDaypart(planet: string, aspect: string): 'morning' | 'afternoon' | 'evening' | 'night' | undefined {
    // More sophisticated daypart determination based on planet and aspect
    const planetDayparts = {
      'Sun': 'morning',
      'Moon': 'night',
      'Mercury': 'morning',
      'Venus': 'afternoon',
      'Mars': 'afternoon',
      'Jupiter': 'evening',
      'Saturn': 'night',
      'Uranus': 'evening',
      'Neptune': 'night',
      'Pluto': 'night'
    };

    const aspectDayparts = {
      'Conjunction': 'morning',
      'Opposition': 'evening',
      'Square': 'afternoon',
      'Trine': 'afternoon',
      'Sextile': 'morning'
    };

    // Prefer planet-based daypart, fall back to aspect-based
    return (planetDayparts[planet as keyof typeof planetDayparts] || 
           aspectDayparts[aspect as keyof typeof aspectDayparts]) as 'morning' | 'afternoon' | 'evening' | 'night' | undefined;
  }

  private static getChartRuler(natalChart: BirthChart): string | null {
    // Get the chart ruler based on the Ascendant sign
    // This is a simplified version - you'd want to look up the actual ruler
    const ascendantSign = this.getSignByLongitude(natalChart.ascendant);
    
    const rulers = {
      'Aries': 'Mars',
      'Taurus': 'Venus',
      'Gemini': 'Mercury',
      'Cancer': 'Moon',
      'Leo': 'Sun',
      'Virgo': 'Mercury',
      'Libra': 'Venus',
      'Scorpio': 'Pluto',
      'Sagittarius': 'Jupiter',
      'Capricorn': 'Saturn',
      'Aquarius': 'Uranus',
      'Pisces': 'Neptune'
    };

    return rulers[ascendantSign as keyof typeof rulers] || null;
  }

  private static getSignByLongitude(longitude: number): string {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signIndex = Math.floor(longitude / 30);
    return signs[signIndex];
  }

  private static getTransitGuidance(transit: KeyTransit): string {
    const guidance = {
      'Sun': 'Focus on your core identity and life purpose.',
      'Moon': 'Pay attention to your emotional needs and intuition.',
      'Mercury': 'Communication and mental processes are highlighted.',
      'Venus': 'Relationships and values are in focus.',
      'Mars': 'Action and courage are emphasized.',
      'Jupiter': 'Expansion and optimism are available.',
      'Saturn': 'Structure and responsibility require attention.',
      'Uranus': 'Innovation and change are possible.',
      'Neptune': 'Inspiration and spirituality are accessible.',
      'Pluto': 'Transformation and deep change are occurring.'
    };

    return guidance[transit.transitPlanet as keyof typeof guidance] || '';
  }

  private static getActionAdvice(transit: KeyTransit): string {
    const advice = {
      'Conjunction': 'Integrate and align with this energy.',
      'Opposition': 'Find balance between opposing forces.',
      'Square': 'Work through challenges with patience.',
      'Trine': 'Flow with this harmonious energy.',
      'Sextile': 'Take advantage of this opportunity.'
    };

    return advice[transit.aspect as keyof typeof advice] || '';
  }


} 