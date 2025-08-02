import { 
    getSynastryAspectInterpretation, 
    getSynastryHouseOverlay, 
    getSynastryPlanetInSign,
    getComprehensiveSynastryInterpretation,
    type SynastryAspectInterpretation 
} from '../../data/interpretations';

export interface SynastryTooltipData {
    element: 'planet' | 'aspect' | 'house';
    person1Planet?: string;
    person2Planet?: string;
    aspect?: string;
    person1House?: number;
    person1Sign?: string;
    person2PlanetName?: string;
    orb?: number;
}

export function createSynastryTooltip(data: SynastryTooltipData): string {
    let tooltipContent = '';

    switch (data.element) {
        case 'planet':
            if (data.person2PlanetName && data.person1House) {
                const houseOverlay = getSynastryHouseOverlay(data.person2PlanetName, data.person1House);
                if (houseOverlay) {
                    tooltipContent = `<strong>${data.person2PlanetName} in your ${getOrdinalSuffix(data.person1House)} House</strong><br>`;
                    tooltipContent += houseOverlay.interpretation;
                } else {
                    tooltipContent = `<strong>${data.person2PlanetName}</strong><br>`;
                    tooltipContent += `This planet influences your ${getOrdinalSuffix(data.person1House)} house area of life.`;
                }
            }
            break;

        case 'aspect':
            if (data.person1Planet && data.person2Planet && data.aspect) {
                const aspectInterpretation = getSynastryAspectInterpretation(
                    data.aspect, 
                    data.person1Planet, 
                    data.person2Planet
                );
                
                if (aspectInterpretation) {
                    tooltipContent = `<strong>${data.person1Planet}-${data.person2Planet} ${data.aspect}</strong>`;
                    if (data.orb) {
                        tooltipContent += ` (${data.orb.toFixed(1)}° orb)<br>`;
                    } else {
                        tooltipContent += '<br>';
                    }
                    tooltipContent += aspectInterpretation.interpretation;
                    
                    // Add compatibility indicator
                    const compatibilityColor = aspectInterpretation.compatibility === 'harmonious' ? '#10b981' : 
                                           aspectInterpretation.compatibility === 'challenging' ? '#ef4444' : '#f59e0b';
                    tooltipContent += `<br><span style="color: ${compatibilityColor}; font-size: 0.9em;">${aspectInterpretation.compatibility} aspect</span>`;
                } else {
                    tooltipContent = `<strong>${data.person1Planet}-${data.person2Planet} ${data.aspect}</strong><br>`;
                    tooltipContent += `This aspect creates a dynamic interaction between your charts.`;
                }
            }
            break;

        case 'house':
            if (data.person1House) {
                tooltipContent = `<strong>Your ${getOrdinalSuffix(data.person1House)} House</strong><br>`;
                tooltipContent += `This area of your life is influenced by your partner's planets that fall here.`;
            }
            break;
    }

    return tooltipContent;
}

export function getSynastryAspectSummary(aspects: SynastryAspectInterpretation[]): string {
    const harmonious = aspects.filter(a => a.compatibility === 'harmonious').length;
    const challenging = aspects.filter(a => a.compatibility === 'challenging').length;
    const neutral = aspects.filter(a => a.compatibility === 'neutral').length;
    
    const total = aspects.length;
    if (total === 0) return 'No major aspects found between your charts.';
    
    const harmonyPercentage = Math.round((harmonious / total) * 100);
    
    let summary = `<strong>Synastry Summary</strong><br>`;
    summary += `Total aspects: ${total}<br>`;
    summary += `Harmonious: ${harmonious}<br>`;
    summary += `Challenging: ${challenging}<br>`;
    summary += `Neutral: ${neutral}<br><br>`;
    
    if (harmonyPercentage >= 70) {
        summary += `<span style="color: #10b981;">Excellent compatibility (${harmonyPercentage}% harmonious)</span>`;
    } else if (harmonyPercentage >= 50) {
        summary += `<span style="color: #f59e0b;">Good compatibility (${harmonyPercentage}% harmonious)</span>`;
    } else {
        summary += `<span style="color: #ef4444;">Challenging compatibility (${harmonyPercentage}% harmonious)</span>`;
    }
    
    return summary;
}

export function getSynastryKeyAspects(aspects: SynastryAspectInterpretation[]): SynastryAspectInterpretation[] {
    // Return the most important aspects for synastry
    const keyAspects = aspects.filter(aspect => {
        const isKeyAspect = [
            'Sun_Moon', 'Moon_Sun', 'Venus_Mars', 'Mars_Venus',
            'Sun_Venus', 'Venus_Sun', 'Moon_Venus', 'Venus_Moon',
            'Saturn_Venus', 'Venus_Saturn', 'Jupiter_Venus', 'Venus_Jupiter'
        ].includes(`${aspect.person1Planet}_${aspect.person2Planet}`);
        
        return isKeyAspect && aspect.intensity === 'strong';
    });
    
    return keyAspects.slice(0, 5); // Return top 5 key aspects
}

function getOrdinalSuffix(num: number): string {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) {
        return num + "st";
    }
    if (j === 2 && k !== 12) {
        return num + "nd";
    }
    if (j === 3 && k !== 13) {
        return num + "rd";
    }
    return num + "th";
} 