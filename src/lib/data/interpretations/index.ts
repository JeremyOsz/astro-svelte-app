// Main entry point for astrological interpretations
// This file provides a clean API for accessing all interpretation data

// Re-export types
export type {
    AspectInterpretation,
    TransitInterpretation,
    PlanetInterpretation,
    SignInterpretation,
    SynastryAspectInterpretation,
    SynastryHouseOverlay,
    SynastryPlanetInSign,
    PlanetName,
    ZodiacSign,
    HouseNumber,
    PlanetInSignInterpretations,
    SignInHouseInterpretations
} from './types';

// Re-export constants
export {
    MAJOR_ASPECTS,
    ELEMENTS,
    HOUSES,
    PLANET_COMBINATIONS
} from './constants';

// Re-export aspect interpretations
export { ASPECT_INTERPRETATIONS } from './aspects';

// Re-export synastry interpretations
export { SYNASTRY_ASPECT_INTERPRETATIONS } from './synastry';

// Re-export planet interpretations
export { PLANET_INTERPRETATIONS, PLANET_IN_SIGN_INTERPRETATIONS } from './planets';

// Re-export house interpretations
export { SIGN_IN_HOUSE_INTERPRETATIONS } from './houses';

// Re-export transit interpretations and functions
export { 
    TRANSIT_INTERPRETATIONS,
    getTransitInterpretation,
    getTransitPlanetInHouseMeaning,
    getTransitPlanetInSignMeaning,
    getEnhancedTransitInterpretation
} from './transits';

// Import the data we need for utility functions
import { ASPECT_INTERPRETATIONS } from './aspects';
import { SYNASTRY_ASPECT_INTERPRETATIONS } from './synastry';
import { PLANET_IN_SIGN_INTERPRETATIONS } from './planets';

// Utility functions for accessing interpretations
export function getDetailedAspectInterpretation(aspect: string, planet1: string, planet2: string): string {
    const aspectData = ASPECT_INTERPRETATIONS[aspect];
    if (!aspectData) return '';
    
    const planetKey = `${planet1}_${planet2}`;
    return aspectData.planets[planetKey] || aspectData.general;
}

// Synastry utility functions
export function getSynastryAspectInterpretation(
    aspect: string, 
    person1Planet: string, 
    person2Planet: string, 
    relationshipType: 'romance' | 'friendship' | 'family' | 'business' = 'romance'
): any {
    const key = `${person1Planet}_${person2Planet}_${aspect}`;
    const reverseKey = `${person2Planet}_${person1Planet}_${aspect}`;
    
    const interpretation = SYNASTRY_ASPECT_INTERPRETATIONS[key] || SYNASTRY_ASPECT_INTERPRETATIONS[reverseKey];
    
    if (!interpretation) return null;
    
    // Return relationship-specific interpretation if available
    if (relationshipType && interpretation[relationshipType]) {
        return {
            ...interpretation,
            interpretation: interpretation[relationshipType]
        };
    }
    
    return interpretation;
}

export function getSynastryHouseOverlay(person2Planet: string, person1House: number): any {
    // This would need to be implemented with house overlay data
    // For now, return a basic interpretation
    const houseMeanings = {
        1: 'how you present yourself and your personal identity',
        2: 'your material security and self-worth',
        3: 'your communication and immediate environment',
        4: 'your home life and emotional foundation',
        5: 'your creativity and self-expression',
        6: 'your daily work and health routines',
        7: 'your partnerships and close relationships',
        8: 'your shared resources and transformation',
        9: 'your higher learning and spiritual beliefs',
        10: 'your career and public reputation',
        11: 'your friendships and group connections',
        12: 'your subconscious and spiritual development'
    };

    const planetMeanings = {
        'Sun': 'core identity and life purpose',
        'Moon': 'emotional needs and intuitive responses',
        'Mercury': 'communication style and mental focus',
        'Venus': 'approach to love and values',
        'Mars': 'drive and action style',
        'Jupiter': 'growth and expansion areas',
        'Saturn': 'challenges and discipline areas',
        'Uranus': 'freedom and innovation needs',
        'Neptune': 'spiritual inspiration and idealism',
        'Pluto': 'deep transformation areas'
    };

    const planetMeaning = planetMeanings[person2Planet as keyof typeof planetMeanings] || 'this planet';
    const houseMeaning = houseMeanings[person1House as keyof typeof houseMeanings] || 'this area of life';

    return {
        person2Planet,
        person1House,
        interpretation: `The ${person2Planet} in your ${person1House}${person1House === 1 ? 'st' : person1House === 2 ? 'nd' : person1House === 3 ? 'rd' : 'th'} house brings focus to ${planetMeaning} in relation to ${houseMeaning}.`,
        themes: [planetMeaning, houseMeaning]
    };
}

export function getSynastryPlanetInSign(person2Planet: string, person1Sign: string): any {
    const planetData = PLANET_IN_SIGN_INTERPRETATIONS[person2Planet as keyof typeof PLANET_IN_SIGN_INTERPRETATIONS];
    
    if (!planetData || !planetData[person1Sign as keyof typeof planetData]) {
        return null;
    }

    const compatibility = person2Planet === 'Sun' || person2Planet === 'Moon' ? 'harmonious' : 'neutral';
    
    return {
        person2Planet,
        person1Sign,
        interpretation: planetData[person1Sign as keyof typeof planetData],
        compatibility
    };
}

export function getComprehensiveSynastryInterpretation(
    person1Planet: string, 
    person2Planet: string, 
    aspect: string, 
    person1House?: number, 
    person1Sign?: string
): string {
    let interpretation = '';
    
    // Get aspect interpretation
    const aspectInterpretation = getSynastryAspectInterpretation(aspect, person1Planet, person2Planet);
    if (aspectInterpretation) {
        interpretation += aspectInterpretation.interpretation;
    }
    
    // Add house overlay if available
    if (person1House) {
        const houseOverlay = getSynastryHouseOverlay(person2Planet, person1House);
        if (houseOverlay) {
            interpretation += `\n\n${houseOverlay.interpretation}`;
        }
    }
    
    // Add planet in sign if available
    if (person1Sign) {
        const planetInSign = getSynastryPlanetInSign(person2Planet, person1Sign);
        if (planetInSign) {
            interpretation += `\n\n${planetInSign.interpretation}`;
        }
    }
    
    return interpretation;
}

export function getSynastryCompatibilitySummary(aspects: any[]): string {
    if (!aspects || aspects.length === 0) {
        return "No significant aspects found between these charts.";
    }
    
    const harmonious = aspects.filter(a => a.compatibility === 'harmonious').length;
    const challenging = aspects.filter(a => a.compatibility === 'challenging').length;
    const neutral = aspects.filter(a => a.compatibility === 'neutral').length;
    
    let summary = `Found ${aspects.length} significant aspects between these charts. `;
    
    if (harmonious > challenging && harmonious > neutral) {
        summary += "This relationship shows strong harmonious connections with natural compatibility.";
    } else if (challenging > harmonious && challenging > neutral) {
        summary += "This relationship shows significant challenges that can lead to growth and learning.";
    } else if (neutral > harmonious && neutral > challenging) {
        summary += "This relationship shows balanced connections with moderate compatibility.";
    } else {
        summary += "This relationship shows a mix of harmonious and challenging aspects.";
    }
    
    return summary;
}

// Helper function to get all available aspects
export function getAvailableAspects(): string[] {
    return Object.keys(ASPECT_INTERPRETATIONS);
}

// Helper function to get all available synastry aspects
export function getAvailableSynastryAspects(): string[] {
    return Object.keys(SYNASTRY_ASPECT_INTERPRETATIONS);
} 