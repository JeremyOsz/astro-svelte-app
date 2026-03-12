import { describe, expect, it } from 'vitest';

import {
  ASPECT_INTERPRETATIONS,
  getDetailedAspectInterpretation,
  getSynastryAspectInterpretation,
  getTransitInterpretation,
  PLANET_INTERPRETATIONS,
  PLANET_IN_SIGN_INTERPRETATIONS,
  SIGN_IN_HOUSE_INTERPRETATIONS
} from '../../../src/lib/data/interpretations';

describe('generated interpretation runtime compatibility', () => {
  it('preserves public aspect and planet exports', () => {
    expect(ASPECT_INTERPRETATIONS.Conjunction.general).toContain('blend their energies');
    expect(PLANET_INTERPRETATIONS.Sun.description).toContain('core identity');
    expect(PLANET_IN_SIGN_INTERPRETATIONS.Sun.Aries).toContain('Sun in Aries');
    expect(SIGN_IN_HOUSE_INTERPRETATIONS.Aries['1']).toContain('You present yourself');
  });

  it('preserves synastry lookup behavior with relationship variants', () => {
    const interpretation = getSynastryAspectInterpretation('Trine', 'Sun', 'Sun', 'friendship');

    expect(interpretation).toMatchObject({
      aspect: 'Trine',
      compatibility: 'harmonious',
      intensity: 'moderate'
    });
    expect(interpretation.interpretation).toBe(interpretation.friendship);
  });

  it('preserves transit and aspect lookup behavior', () => {
    expect(getTransitInterpretation('Trine', 'Sun', 'Sun')).toContain('harmonious transit');
    expect(getDetailedAspectInterpretation('Conjunction', 'Sun', 'Moon')).toContain('conscious ego');
  });
});
