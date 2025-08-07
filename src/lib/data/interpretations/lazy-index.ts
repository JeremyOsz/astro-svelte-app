// Lazy loading wrapper for interpretation data
// This provides the same API as the main index but loads data on-demand

import { interpretationLoader } from '../../services/interpretation-loader';

// Re-export types (these are lightweight and can be imported directly)
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

// Re-export constants (these are lightweight)
export {
    MAJOR_ASPECTS,
    ELEMENTS,
    HOUSES,
    PLANET_COMBINATIONS
} from './constants';

// Lazy loading functions that return promises
export async function getPlanetInterpretations() {
    const data = await interpretationLoader.loadPlanetInterpretations();
    return data.PLANET_INTERPRETATIONS;
}

export async function getPlanetInSignInterpretations() {
    const data = await interpretationLoader.loadPlanetInterpretations();
    return data.PLANET_IN_SIGN_INTERPRETATIONS;
}

export async function getAspectInterpretations() {
    const data = await interpretationLoader.loadAspectInterpretations();
    return data.ASPECT_INTERPRETATIONS;
}

export async function getSynastryAspectInterpretations() {
    const data = await interpretationLoader.loadSynastryInterpretations();
    return data.SYNASTRY_ASPECT_INTERPRETATIONS;
}

export async function getTransitInterpretations() {
    const data = await interpretationLoader.loadTransitInterpretations();
    return data.TRANSIT_INTERPRETATIONS;
}

export async function getSignInHouseInterpretations() {
    const data = await interpretationLoader.loadHouseInterpretations();
    return data.SIGN_IN_HOUSE_INTERPRETATIONS;
}

// Lazy loading functions for utility functions
export async function getDetailedAspectInterpretation(aspect: string, planet1: string, planet2: string): Promise<string> {
    const data = await interpretationLoader.loadAspectInterpretations();
    const aspectData = data.ASPECT_INTERPRETATIONS[aspect];
    if (!aspectData) return '';
    
    const planetKey = `${planet1}_${planet2}`;
    return aspectData.planets[planetKey] || aspectData.general;
}

export async function getTransitInterpretation(planet: string, aspect: string, targetPlanet: string): Promise<string> {
    const data = await interpretationLoader.loadTransitInterpretations();
    return data.getTransitInterpretation(planet, aspect, targetPlanet);
}

export async function getDetailedTransitAspectInterpretation(aspect: string, planet1: string, planet2: string): Promise<string> {
    const data = await interpretationLoader.loadTransitInterpretations();
    return data.getDetailedAspectInterpretation(aspect, planet1, planet2);
}

// Lazy loading for synastry functions
export async function getSynastryAspectInterpretation(
    aspect: string, 
    person1Planet: string, 
    person2Planet: string, 
    relationshipType: 'romance' | 'friendship' | 'family' | 'business' = 'romance'
): Promise<any> {
    const [aspectData, synastryData] = await Promise.all([
        interpretationLoader.loadAspectInterpretations(),
        interpretationLoader.loadSynastryInterpretations()
    ]);

    // Construct the planet key
    const planetKey = `${person1Planet}_${person2Planet}`;
    const reversePlanetKey = `${person2Planet}_${person1Planet}`;
    
    // Check if this is an angular aspect (involves Asc, MC, Part of Fortune)
    const isAngular = person1Planet === 'Asc' || person1Planet === 'MC' || person1Planet === 'Part of Fortune' ||
                      person2Planet === 'Asc' || person2Planet === 'MC' || person2Planet === 'Part of Fortune';
    
    // Check if this is a minor aspect (involves Chiron, Lilith, etc.)
    const isMinor = person1Planet === 'Chiron' || person1Planet === 'Lilith' || person1Planet === 'Node' ||
                    person2Planet === 'Chiron' || person2Planet === 'Lilith' || person2Planet === 'Node';
    
    let aspectInterpretation;
    let interpretation;
    
    // First try the specific aspect type
    aspectInterpretation = (synastryData.SYNASTRY_ASPECT_INTERPRETATIONS as any)[aspect];
    if (aspectInterpretation) {
        // Try with aspect suffix for angular aspects
        const angularKey = `${planetKey}_${aspect}`;
        const reverseAngularKey = `${reversePlanetKey}_${aspect}`;
        interpretation = (aspectInterpretation.planets as any)[planetKey] || (aspectInterpretation.planets as any)[reversePlanetKey] ||
                        (aspectInterpretation.planets as any)[angularKey] || (aspectInterpretation.planets as any)[reverseAngularKey];
    }
    
    // If not found and it's an angular aspect, check Angular category
    if (!interpretation && isAngular) {
        aspectInterpretation = (synastryData.SYNASTRY_ASPECT_INTERPRETATIONS as any)["Angular"];
        if (aspectInterpretation) {
            const angularKey = `${planetKey}_${aspect}`;
            const reverseAngularKey = `${reversePlanetKey}_${aspect}`;
            interpretation = (aspectInterpretation.planets as any)[planetKey] || (aspectInterpretation.planets as any)[reversePlanetKey] ||
                            (aspectInterpretation.planets as any)[angularKey] || (aspectInterpretation.planets as any)[reverseAngularKey];
        }
    }
    
    // If not found and it's a minor aspect, check Minor category
    if (!interpretation && isMinor) {
        aspectInterpretation = (synastryData.SYNASTRY_ASPECT_INTERPRETATIONS as any)["Minor"];
        if (aspectInterpretation) {
            const minorKey = `${planetKey}_${aspect}`;
            const reverseMinorKey = `${reversePlanetKey}_${aspect}`;
            interpretation = (aspectInterpretation.planets as any)[planetKey] || (aspectInterpretation.planets as any)[reversePlanetKey] ||
                            (aspectInterpretation.planets as any)[minorKey] || (aspectInterpretation.planets as any)[reverseMinorKey];
        }
    }
    
    if (!interpretation) {
        // If no planet interpretation found, return null to fall back to natal interpretation
        return null;
    }
    
    // Return relationship-specific interpretation if available
    if (relationshipType && interpretation[relationshipType]) {
        return {
            ...interpretation,
            interpretation: interpretation[relationshipType]
        };
    }
    
    return interpretation;
}

export async function getSynastryHouseOverlay(person2Planet: string, person1House: number): Promise<any> {
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

export async function getSynastryPlanetInSign(person2Planet: string, person1Sign: string): Promise<any> {
    const data = await interpretationLoader.loadPlanetInterpretations();
    const planetData = data.PLANET_IN_SIGN_INTERPRETATIONS[person2Planet as keyof typeof data.PLANET_IN_SIGN_INTERPRETATIONS];
    
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

// Helper functions
export async function getAvailableAspects(): Promise<string[]> {
    const data = await interpretationLoader.loadAspectInterpretations();
    return Object.keys(data.ASPECT_INTERPRETATIONS);
}

export async function getAvailableSynastryAspects(): Promise<string[]> {
    const data = await interpretationLoader.loadSynastryInterpretations();
    return Object.keys(data.SYNASTRY_ASPECT_INTERPRETATIONS);
}

// Preload function for when user wants to load everything
export async function preloadAllInterpretations() {
    await interpretationLoader.preloadAllInterpretations();
}

// Cache management
export function clearInterpretationCache() {
    interpretationLoader.clearCache();
}

export function getInterpretationCacheStatus() {
    return interpretationLoader.getCacheStatus();
} 