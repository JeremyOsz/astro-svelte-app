import { describe, expect, it } from 'vitest';

import {
  compileAllInterpretations,
  parseAspectFamilyMarkdown,
  parseHousesMarkdown,
  parsePlanetsMarkdown,
  parseSynastryFamilyMarkdown,
  parseTransitFamilyMarkdown
} from '../../../scripts/interpretations/lib/compiler.mjs';
import { auditInterpretationContent, normalizeForSimilarity } from '../../../scripts/interpretations/lib/audit.mjs';

const sampleSynastryMarkdown = `# Synastry Trine

## Sun_Sun
compatibility: harmonious
intensity: moderate

### Interpretation
Natural harmony between your core identities. You understand each other's essence effortlessly and support each other's growth.

### Romance
Comfortable romantic connection with mutual respect and steady encouragement.

### Friendship
Easy friendship with natural support and reliable encouragement.

### Family
Comfortable family bonds built on mutual respect and shared values.

### Business
Steady collaboration with shared priorities and supportive leadership.`;

const sampleTransitMarkdown = `# Transit Trine

## Sun_Moon
### Interpretation
This transit creates a harmonious flow between your core identity and emotional rhythms, helping confidence and emotional responsiveness support each other.`;

const samplePlanetsMarkdown = `# Planet Interpretations

## Sun
### Description
Core identity, will, vitality, and creative direction expressed through conscious purpose.

### Keywords
Identity, Vitality, Purpose

### Aries
With the Sun in Aries, your identity moves directly toward challenge and leadership.

### Taurus
With the Sun in Taurus, your identity seeks stability, embodiment, and staying power.`;

const sampleHousesMarkdown = `# Sign In House Interpretations

## Aries
### House 1
You present yourself with directness, courage, and fast-moving initiative.

### House 2
You pursue security assertively and value self-reliance in material matters.`;

const sampleAspectMarkdown = `# Aspect Interpretations

## Conjunction
orb: 0-8°
nature: Harmonious when planets are compatible, challenging when they are not

### General
Planets in conjunction blend their energies into a focused, intensified expression.

### Sun_Moon
The conscious self and emotional life operate as one force, creating immediacy and emotional visibility.`;

describe('interpretation markdown parser', () => {
  it('parses synastry family markdown into the expected schema', () => {
    // compiler.mjs is @ts-nocheck; assert against runtime shape
    const parsed = parseSynastryFamilyMarkdown(sampleSynastryMarkdown, 'Trine') as {
      general: string;
      planets: Record<string, { aspect: string; person1Planet: string; person2Planet: string; compatibility: string; intensity: string; romance?: string }>;
    };

    expect(parsed.general).toBe('');
    expect(parsed.planets.Sun_Sun).toMatchObject({
      aspect: 'Trine',
      person1Planet: 'Sun',
      person2Planet: 'Sun',
      compatibility: 'harmonious',
      intensity: 'moderate'
    });
    expect(parsed.planets.Sun_Sun.romance).toContain('Comfortable romantic connection');
  });

  it('rejects unsupported synastry metadata', () => {
    const invalid = sampleSynastryMarkdown.replace('compatibility: harmonious', 'compatibility: maybe');

    expect(() => parseSynastryFamilyMarkdown(invalid, 'Trine')).toThrow(/Unsupported compatibility/);
  });

  it('rejects duplicate headings in transit markdown', () => {
    const invalid = `${sampleTransitMarkdown}\n\n## Sun_Moon\n### Interpretation\nDuplicate`;

    expect(() => parseTransitFamilyMarkdown(invalid)).toThrow(/Duplicate entry heading/);
  });

  it('parses planets, houses, and aspects markdown', () => {
    const planetsDoc = parsePlanetsMarkdown(samplePlanetsMarkdown) as unknown as {
      PLANET_INTERPRETATIONS: { Sun: { description: string } };
    };
    const housesDoc = parseHousesMarkdown(sampleHousesMarkdown) as unknown as { Aries: Record<string, string> };
    const aspectsDoc = parseAspectFamilyMarkdown(sampleAspectMarkdown) as unknown as {
      Conjunction: { planets: Record<string, string> };
    };
    expect(planetsDoc.PLANET_INTERPRETATIONS.Sun.description).toContain('Core identity');
    expect(housesDoc.Aries['1']).toContain('directness');
    expect(aspectsDoc.Conjunction.planets.Sun_Moon).toContain('conscious self');
  });
});

describe('interpretation compiler', () => {
  it('compiles all real content files into runtime datasets', async () => {
    const compiled = (await compileAllInterpretations()) as unknown as {
      houses: Record<string, Record<string, string>>;
      planets: { PLANET_INTERPRETATIONS: { Sun: { description: string } } };
      synastry: Record<string, { planets: Record<string, { aspect: string }> }>;
      transits: Record<string, Record<string, string>>;
      aspects: Record<string, { general: string }>;
    };

    expect(compiled.houses.Aries['1']).toContain('You present yourself');
    expect(compiled.planets.PLANET_INTERPRETATIONS.Sun.description).toContain('core identity');
    expect(compiled.synastry.Trine.planets.Sun_Sun.aspect).toBe('Trine');
    expect(compiled.transits.Trine.Sun_Sun).toContain('harmonious transit');
    expect(compiled.aspects.Conjunction.general).toContain('blend their energies');
  });
});

describe('interpretation audit', () => {
  it('flags sparse and repetitive entries', async () => {
    const findings = auditInterpretationContent({
      houses: { Aries: { '1': 'Too short.' } },
      planets: {
        PLANET_INTERPRETATIONS: { Sun: { description: 'Valid enough description for audit threshold.', keywords: ['Identity'] } },
        PLANET_IN_SIGN_INTERPRETATIONS: { Sun: { Aries: 'short' } }
      },
      synastry: {
        Trine: {
          general: '',
          orb: '120° ±8°',
          nature: 'Harmonious',
          planets: {
            Sun_Sun: {
              aspect: 'Trine',
              person1Planet: 'Sun',
              person2Planet: 'Sun',
              interpretation: 'Natural identity harmony. Your identities work together beautifully.',
              compatibility: 'harmonious',
              intensity: 'moderate',
              romance: 'Natural romance harmony. Your identities work together beautifully.',
              friendship: 'Natural friendship harmony. Your identities work together beautifully.',
              family: 'Natural family harmony. Your identities work together beautifully.',
              business: 'Natural business harmony. Your identities work together beautifully.'
            }
          }
        }
      },
      transits: {
        Trine: {
          Sun_Sun: 'short transit'
        }
      },
      aspects: {
        Conjunction: {
          general: 'General aspect description that is long enough to avoid threshold issues.',
          orb: '0-8°',
          nature: 'Harmonious',
          planets: {}
        }
      }
    });

    expect(findings.some((finding) => finding.family === 'houses' && finding.kind === 'too_short')).toBe(true);
    expect(findings.some((finding) => finding.family === 'planets' && finding.kind === 'too_short')).toBe(true);
    expect(findings.some((finding) => finding.family === 'synastry' && finding.kind === 'formulaic_pattern')).toBe(true);
    expect(findings.some((finding) => finding.family === 'transits' && finding.kind === 'too_short')).toBe(true);
  });

  it('normalizes text before similarity comparisons', () => {
    expect(normalizeForSimilarity('Sun_Sun creates natural harmony.')).not.toContain('sun_sun');
  });
});
