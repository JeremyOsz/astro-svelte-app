// Transit interpretations and utility functions
import type { TransitInterpretation } from './types';
import { ASPECT_INTERPRETATIONS } from './aspects';

// Import the new detailed transit interpretations
import { CONJUNCTION_INTERPRETATIONS } from './transits/conjunction';
import { OPPOSITION_INTERPRETATIONS } from './transits/opposition';
import { TRINE_INTERPRETATIONS } from './transits/trine';
import { SQUARE_INTERPRETATIONS } from './transits/square';
import { SEXTILE_INTERPRETATIONS } from './transits/sextile';
import { QUINCUNX_INTERPRETATIONS } from './transits/quincunx';
import { ANGULAR_ASPECT_INTERPRETATIONS } from './transits/angular-aspects';
import { MINOR_ASPECT_INTERPRETATIONS } from './transits/minor-aspects';

// Transit interpretation data organized by aspect type
export const TRANSIT_INTERPRETATIONS: Record<string, Record<string, string>> = {
    "Conjunction": CONJUNCTION_INTERPRETATIONS,
    "Opposition": OPPOSITION_INTERPRETATIONS,
    "Trine": TRINE_INTERPRETATIONS,
    "Square": SQUARE_INTERPRETATIONS,
    "Sextile": SEXTILE_INTERPRETATIONS,
    "Quincunx": QUINCUNX_INTERPRETATIONS,
    "Angular": ANGULAR_ASPECT_INTERPRETATIONS,
    "Minor": MINOR_ASPECT_INTERPRETATIONS
} as const;

// Utility function to get ordinal suffix
function getOrdinalSuffix(num: number): string {
    if (num >= 11 && num <= 13) return 'th';
    switch (num % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

// Get transit interpretation for a specific aspect and planet combination
export function getTransitInterpretation(aspect: string, transitPlanet: string, natalPlanet: string): string {
    // First try to get detailed interpretation from the new transit data
    const aspectData = TRANSIT_INTERPRETATIONS[aspect];
    if (aspectData) {
        const planetKey = `${transitPlanet}_${natalPlanet}`;
        const interpretation = aspectData[planetKey];
        if (interpretation) {
            return interpretation;
        }
    }

    // Fall back to the original aspect interpretations
    const originalAspectData = ASPECT_INTERPRETATIONS[aspect];
    if (!originalAspectData) return '';

    // Try both possible planet key combinations
    const planetKey1 = `${transitPlanet}_${natalPlanet}`;
    const planetKey2 = `${natalPlanet}_${transitPlanet}`;
    
    const interpretation = originalAspectData.planets[planetKey1] || originalAspectData.planets[planetKey2];

    if (interpretation) {
        return interpretation;
    }

    // If no specific interpretation, provide a general one based on aspect and planets
    const planetMeanings = {
        'Sun': 'identity and life purpose',
        'Moon': 'emotions and intuition',
        'Mercury': 'communication and thinking',
        'Venus': 'love and values',
        'Mars': 'action and energy',
        'Jupiter': 'growth and expansion',
        'Saturn': 'discipline and challenges',
        'Uranus': 'freedom and innovation',
        'Neptune': 'spirituality and dreams',
        'Pluto': 'transformation and power'
    };

    const transitPlanetMeaning = planetMeanings[transitPlanet as keyof typeof planetMeanings] || 'transit planet';
    const natalPlanetMeaning = planetMeanings[natalPlanet as keyof typeof planetMeanings] || 'natal planet';

    return `The ${transitPlanet} ${aspect.toLowerCase()} your ${natalPlanet} brings ${originalAspectData.general.toLowerCase()} This affects your ${transitPlanetMeaning} in relation to your ${natalPlanetMeaning}.`;
}

// Get enhanced transit interpretation with house and sign information
export function getEnhancedTransitInterpretation(
    aspect: string, 
    transitPlanet: string, 
    natalPlanet: string, 
    transitHouse?: number, 
    transitSign?: string
): string {
    let interpretation = getTransitInterpretation(aspect, transitPlanet, natalPlanet);

    // Add angular aspect interpretation if applicable
    if (transitHouse && (transitHouse === 1 || transitHouse === 4 || transitHouse === 7 || transitHouse === 10)) {
        const angularKey = `${transitPlanet}_${transitHouse}${transitHouse === 1 ? 'st' : transitHouse === 4 ? 'th' : transitHouse === 7 ? 'th' : 'th'}_House`;
        const angularData = (ANGULAR_ASPECT_INTERPRETATIONS as Record<string, string>)[angularKey];
        if (angularData) {
            interpretation += `\n\n${angularData}`;
        }
    }

    if (transitHouse) {
        interpretation += `\n\n${getTransitPlanetInHouseMeaning(transitPlanet, transitHouse, transitSign)}`;
    }

    if (transitSign) {
        interpretation += `\n\n${getTransitPlanetInSignMeaning(transitPlanet, transitSign)}`;
    }

    return interpretation;
}

// Get transit planet in house meaning
export function getTransitPlanetInHouseMeaning(transitPlanet: string, houseNumber: number, transitSign?: string): string {
    const planetMeanings = {
        'Sun': 'your core identity and life purpose',
        'Moon': 'your emotional needs and intuitive responses',
        'Mercury': 'your communication style and mental focus',
        'Venus': 'your approach to love and what you value',
        'Mars': 'your drive and how you take action',
        'Jupiter': 'your growth and expansion areas',
        'Saturn': 'your challenges and areas requiring discipline',
        'Uranus': 'your need for freedom and innovation',
        'Neptune': 'your spiritual inspiration and idealism',
        'Pluto': 'your areas of deep transformation'
    };

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

    const planetMeaning = planetMeanings[transitPlanet as keyof typeof planetMeanings] || 'this planet';
    const houseMeaning = houseMeanings[houseNumber as keyof typeof houseMeanings] || 'this area of life';
    const ordinalHouse = `${houseNumber}${getOrdinalSuffix(houseNumber)}`;

    let interpretation = `The ${transitPlanet} transiting your ${ordinalHouse} house brings focus to ${planetMeaning} in relation to ${houseMeaning}.`;

    if (transitSign) {
        const signMeanings = {
            'Aries': 'with bold, direct energy and a pioneering spirit',
            'Taurus': 'with steady, practical energy and a focus on stability',
            'Gemini': 'with curious, adaptable energy and a focus on communication',
            'Cancer': 'with nurturing, protective energy and emotional sensitivity',
            'Leo': 'with creative, expressive energy and a desire for recognition',
            'Virgo': 'with analytical, service-oriented energy and attention to detail',
            'Libra': 'with diplomatic, harmonious energy and a focus on relationships',
            'Scorpio': 'with intense, transformative energy and emotional depth',
            'Sagittarius': 'with optimistic, adventurous energy and a quest for truth',
            'Capricorn': 'with disciplined, ambitious energy and a focus on achievement',
            'Aquarius': 'with innovative, independent energy and humanitarian ideals',
            'Pisces': 'with compassionate, spiritual energy and intuitive sensitivity'
        };

        const signMeaning = signMeanings[transitSign as keyof typeof signMeanings] || 'with unique energy';
        interpretation += ` This transit occurs ${signMeaning}.`;
    }

    return interpretation;
}

// Get transit planet in sign meaning
export function getTransitPlanetInSignMeaning(transitPlanet: string, sign: string): string {
    const planetMeanings = {
        'Sun': 'your current identity and life direction',
        'Moon': 'your emotional state and intuitive responses',
        'Mercury': 'your current thinking and communication style',
        'Venus': 'your current approach to love and values',
        'Mars': 'your current drive and action style',
        'Jupiter': 'your current areas of growth and optimism',
        'Saturn': 'your current challenges and responsibilities',
        'Uranus': 'your current need for freedom and change',
        'Neptune': 'your current spiritual inspiration and dreams',
        'Pluto': 'your current areas of deep transformation'
    };

    const signMeanings = {
        'Aries': 'with bold, direct energy and a pioneering spirit',
        'Taurus': 'with steady, practical energy and a focus on stability',
        'Gemini': 'with curious, adaptable energy and a focus on communication',
        'Cancer': 'with nurturing, protective energy and emotional sensitivity',
        'Leo': 'with creative, expressive energy and a desire for recognition',
        'Virgo': 'with analytical, service-oriented energy and attention to detail',
        'Libra': 'with diplomatic, harmonious energy and a focus on relationships',
        'Scorpio': 'with intense, transformative energy and emotional depth',
        'Sagittarius': 'with optimistic, adventurous energy and a quest for truth',
        'Capricorn': 'with disciplined, ambitious energy and a focus on achievement',
        'Aquarius': 'with innovative, independent energy and humanitarian ideals',
        'Pisces': 'with compassionate, spiritual energy and intuitive sensitivity'
    };

    const planetMeaning = planetMeanings[transitPlanet as keyof typeof planetMeanings] || 'this planet';
    const signMeaning = signMeanings[sign as keyof typeof signMeanings] || 'with unique energy';

    return `The ${transitPlanet} in ${sign} affects ${planetMeaning} ${signMeaning}.`;
}

// Get minor aspect interpretation
export function getMinorAspectInterpretation(aspect: string, transitPlanet: string, natalPlanet: string): string {
    const minorKey = `${transitPlanet}_${natalPlanet}_${aspect}`;
    const interpretation = (MINOR_ASPECT_INTERPRETATIONS as Record<string, string>)[minorKey];
    
    if (interpretation) {
        return interpretation;
    }
    
    // Fallback for minor aspects not in the detailed data
    return `A subtle transit that creates gentle harmony between your ${transitPlanet} and ${natalPlanet}. This transit brings small but meaningful developments in your awareness and growth.`;
}

// Get angular aspect interpretation
export function getAngularAspectInterpretation(transitPlanet: string, houseNumber: number): string {
    const angularKey = `${transitPlanet}_${houseNumber}${houseNumber === 1 ? 'st' : houseNumber === 2 ? 'nd' : houseNumber === 3 ? 'rd' : 'th'}_House`;
    const interpretation = (ANGULAR_ASPECT_INTERPRETATIONS as Record<string, string>)[angularKey];
    
    if (interpretation) {
        return interpretation;
    }
    
    // Fallback for angular aspects not in the detailed data
    return `A transit that brings your ${transitPlanet} into harmony with your ${houseNumber}${getOrdinalSuffix(houseNumber)} house. This transit often brings developments in this area of your life.`;
} 