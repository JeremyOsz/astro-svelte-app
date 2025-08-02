import { ASPECT_DEFINITIONS, ZODIAC_SIGNS } from '$lib/data/astrological-data';

export interface PlanetData {
  planet: string;
  sign: string;
  degree: number;
  minute: number;
  angle: number; // absolute ecliptic longitude 0-360
  house?: number;
}

export interface SynastryAspect {
  person1Planet: string;
  person2Planet: string;
  aspect: string;
  orb: number;
  strength?: 'strong' | 'moderate' | 'weak';
}

export interface SynastryHouseOverlay {
  person2Planet: string;
  person1House: number;
}

/**
 * Calculate aspect strength based on orb
 * @param orb The orb of the aspect
 * @param maxOrb The maximum allowed orb for this aspect type
 * @returns 'strong', 'moderate', 'weak', or null if too wide
 */
export function calculateAspectStrength(orb: number, maxOrb: number): 'strong' | 'moderate' | 'weak' | null {
  // If orb is beyond maximum, aspect is invalid
  if (orb > maxOrb) {
    return null;
  }
  
  // Calculate strength based on orb percentage
  const orbPercentage = orb / maxOrb;
  
  if (orbPercentage <= 0.25) {
    return 'strong'; // 0-25% of max orb
  } else if (orbPercentage <= 0.6) {
    return 'moderate'; // 25-60% of max orb
  } else {
    return 'weak'; // 60-100% of max orb
  }
}

/**
 * Get recommended orb limits for different aspect types
 * These are more conservative than the maximum orbs
 */
export function getRecommendedOrbLimits(): Record<string, number> {
  return {
    'Conjunction': 6,   // 0-6° for meaningful conjunctions
    'Opposition': 6,    // 0-6° for meaningful oppositions  
    'Square': 6,        // 0-6° for meaningful squares
    'Trine': 6,         // 0-6° for meaningful trines
    'Sextile': 4,       // 0-4° for meaningful sextiles
    'Quincunx': 2       // 0-2° for meaningful quincunxes
  };
}

/**
 * Parse the CSV chartData returned from Swiss Ephemeris (or stored) into structured PlanetData.
 * Expected line format: "Sun, Aries, 15°23', 11" (optional house)
 */
export function parseChartCSV(chartData: string): PlanetData[] {
  if (!chartData || typeof chartData !== 'string') {
    console.warn('Invalid chart data provided to parseChartCSV');
    return [];
  }
  
  const planets: PlanetData[] = [];
  const lines = chartData.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const parts = trimmed.split(',');
    if (parts.length < 3) {
      console.warn(`Skipping malformed line: ${trimmed}`);
      continue;
    }

    let planet = parts[0].trim();
    const sign = parts[1].trim();
    const degreeStr = parts[2].trim();
    const housePart = parts.length >= 4 ? parts[3].trim() : undefined;

    // Normalize angle names
    if (planet === 'Asc') planet = 'ASC';
    if (planet === 'Mc') planet = 'MC';
    if (planet === 'Dsc') planet = 'DSC';
    if (planet === 'Ic') planet = 'IC';

    // Parse degree string - handle multiple formats
    let degree = 0;
    let minute = 0;
    
    // Try different degree formats
    const degreeMatch = degreeStr.match(/(\d+)°(\d+)'/);
    if (degreeMatch) {
      degree = parseInt(degreeMatch[1]);
      minute = parseInt(degreeMatch[2]);
    } else {
      // Try format without minutes
      const simpleMatch = degreeStr.match(/(\d+)°/);
      if (simpleMatch) {
        degree = parseInt(simpleMatch[1]);
        minute = 0;
      } else {
        console.warn(`Could not parse degree string: ${degreeStr}`);
        continue;
      }
    }
    
    // Validate degree and minute
    if (isNaN(degree) || isNaN(minute) || degree < 0 || degree > 29 || minute < 0 || minute > 59) {
      console.warn(`Invalid degree values: ${degree}°${minute}'`);
      continue;
    }

    const signIndex = ZODIAC_SIGNS.indexOf(sign as any);
    if (signIndex === -1) {
      console.warn(`Invalid sign: ${sign}`);
      continue;
    }
    
    const absolute = signIndex * 30 + degree + minute / 60;

    const data: PlanetData = {
      planet,
      sign,
      degree,
      minute,
      angle: absolute
    };
    
    if (housePart && !isNaN(parseInt(housePart))) {
      const houseNum = parseInt(housePart);
      if (houseNum >= 1 && houseNum <= 12) {
        data.house = houseNum;
      }
    }
    
    planets.push(data);
  }
  
  if (planets.length === 0) {
    console.warn('No valid planets found in chart data');
  }
  
  return planets;
}

export function calculateSynastryAspects(person1: PlanetData[], person2: PlanetData[]): SynastryAspect[] {
  const aspects: SynastryAspect[] = [];
  const recommendedOrbs = getRecommendedOrbLimits();
  
  // Filter out angles and keep only planets
  const corePlanets1 = person1.filter(p => !['ASC', 'MC', 'DSC', 'IC'].includes(p.planet));
  const corePlanets2 = person2.filter(p => !['ASC', 'MC', 'DSC', 'IC'].includes(p.planet));

  // Validate input data
  if (corePlanets1.length === 0 || corePlanets2.length === 0) {
    console.warn('No valid planets found for synastry calculation');
    return [];
  }

  for (const p1 of corePlanets1) {
    for (const p2 of corePlanets2) {
      // Skip if either planet has invalid angle
      if (typeof p1.angle !== 'number' || typeof p2.angle !== 'number' || 
          isNaN(p1.angle) || isNaN(p2.angle)) {
        continue;
      }
      
      const angleDiff = Math.abs(p1.angle - p2.angle);
      const minAngle = Math.min(angleDiff, 360 - angleDiff);
      
      // Check each aspect definition
      for (const [aspectName, def] of Object.entries(ASPECT_DEFINITIONS)) {
        const orb = Math.abs(minAngle - def.angle);
        
        // Use recommended orb limits instead of maximum orbs
        const recommendedOrb = recommendedOrbs[aspectName] || def.orb;
        
        if (orb <= recommendedOrb) {
          // Calculate strength based on orb
          const strength = calculateAspectStrength(orb, recommendedOrb);
          
          if (strength) {
            aspects.push({
              person1Planet: p1.planet,
              person2Planet: p2.planet,
              aspect: aspectName,
              orb: parseFloat(orb.toFixed(2)),
              strength
            });
            break; // Only count the closest aspect
          }
        }
      }
    }
  }
  
  // Sort aspects by strength (strong first) and then by orb (tightest first)
  aspects.sort((a, b) => {
    const strengthOrder = { 'strong': 3, 'moderate': 2, 'weak': 1 };
    const aStrength = strengthOrder[a.strength || 'weak'];
    const bStrength = strengthOrder[b.strength || 'weak'];
    
    if (aStrength !== bStrength) {
      return bStrength - aStrength;
    }
    
    return a.orb - b.orb; // Tighter orbs first
  });
  
  return aspects;
}

/**
 * Calculate which house Person 2's planets fall into in Person 1's chart
 */
export function calculateHouseOverlays(person1: PlanetData[], person2: PlanetData[]): SynastryHouseOverlay[] {
  const overlays: SynastryHouseOverlay[] = [];
  
  // Get Person 1's ASC (1st house cusp)
  const person1Asc = person1.find(p => p.planet === 'ASC');
  if (!person1Asc) {
    console.warn('Person 1 ASC not found for house overlay calculation');
    return [];
  }
  
  // Get Person 2's planets (excluding angles)
  const person2Planets = person2.filter(p => !['ASC', 'MC', 'DSC', 'IC'].includes(p.planet));
  
  for (const planet of person2Planets) {
    // Calculate the house using whole sign system
    // This is a simplified calculation - for more accuracy, we'd need to calculate all house cusps
    const angleDiff = (planet.angle - person1Asc.angle + 360) % 360;
    const house = Math.floor(angleDiff / 30) + 1;
    
    if (house >= 1 && house <= 12) {
      overlays.push({
        person2Planet: planet.planet,
        person1House: house
      });
    }
  }
  
  return overlays;
}

/**
 * Test function to verify synastry calculations
 */
export function testSynastryCalculations(): void {
  const testPerson1 = `Sun,Leo,10°30',1
Moon,Cancer,5°12',12
Mercury,Virgo,23°45',2
Venus,Libra,15°20',3
Mars,Scorpio,2°05',4
Jupiter,Sagittarius,18°40',5
Saturn,Capricorn,8°11',6
Uranus,Aquarius,12°33',7
Neptune,Pisces,25°50',8
Pluto,Scorpio,28°10',4
ASC,Virgo,15°00'
MC,Gemini,12°00'`;

  const testPerson2 = `Sun,Virgo,12°15',1
Moon,Pisces,18°30',12
Mercury,Libra,5°11',2
Venus,Leo,20°25',3
Mars,Leo,28°40',4
Jupiter,Taurus,15°41',5
Saturn,Pisces,3°05',6
Uranus,Taurus,23°09',7
Neptune,Pisces,26°50',8
Pluto,Capricorn,27°58',9
ASC,Virgo,15°00'
MC,Gemini,12°00'`;

  try {
    const p1 = parseChartCSV(testPerson1);
    const p2 = parseChartCSV(testPerson2);
    
    console.log('Person 1 planets:', p1.length);
    console.log('Person 2 planets:', p2.length);
    
    const aspects = calculateSynastryAspects(p1, p2);
    console.log('Synastry aspects found:', aspects.length);
    
    // Log aspect strength distribution
    const strongAspects = aspects.filter(a => a.strength === 'strong');
    const moderateAspects = aspects.filter(a => a.strength === 'moderate');
    const weakAspects = aspects.filter(a => a.strength === 'weak');
    
    console.log('Strong aspects:', strongAspects.length);
    console.log('Moderate aspects:', moderateAspects.length);
    console.log('Weak aspects:', weakAspects.length);
    
    const houseOverlays = calculateHouseOverlays(p1, p2);
    console.log('House overlays found:', houseOverlays.length);
    
    // Test specific aspects
    const sunMoonAspects = aspects.filter(a => 
      (a.person1Planet === 'Sun' && a.person2Planet === 'Moon') ||
      (a.person1Planet === 'Moon' && a.person2Planet === 'Sun')
    );
    console.log('Sun-Moon aspects:', sunMoonAspects);
    
    return;
  } catch (error) {
    console.error('Test failed:', error);
  }
}
