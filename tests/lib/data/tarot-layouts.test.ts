import { describe, expect, it } from 'vitest';

import {
  TAROT_LAYOUTS,
  getAllCategories,
  getAllDifficulties,
  getLayoutById,
  getLayoutsByCategory,
  getLayoutsByDifficulty
} from '../../../src/lib/data/tarot-layouts';

describe('tarot layouts data', () => {
  it('keeps layout ids unique and card counts aligned with positions', () => {
    const ids = TAROT_LAYOUTS.map((layout) => layout.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const layout of TAROT_LAYOUTS) {
      expect(layout.cardCount).toBe(layout.positions.length);
      const numbers = layout.positions.map((p) => p.number);
      expect(new Set(numbers).size).toBe(layout.cardCount);
      expect(layout.svg.trim().length).toBeGreaterThan(0);
    }
  });

  it('exposes categories and difficulties present in data', () => {
    const categorySet = new Set(TAROT_LAYOUTS.map((layout) => layout.category));
    const difficultySet = new Set(TAROT_LAYOUTS.map((layout) => layout.difficulty));

    expect(new Set(getAllCategories())).toEqual(categorySet);
    expect(new Set(getAllDifficulties())).toEqual(difficultySet);
  });

  it('provides expected helpers for filtering and lookup', () => {
    expect(getLayoutById('crossroads-choice')?.name).toBe('Crossroads Choice');
    expect(getLayoutById('month-ahead')?.cardCount).toBe(4);
    expect(getLayoutById('five-element-balance')?.category).toBe('Spiritual');

    expect(getLayoutsByCategory('Problem-Solving').some((layout) => layout.id === 'crossroads-choice')).toBe(true);
    expect(getLayoutsByDifficulty('Beginner').some((layout) => layout.id === 'month-ahead')).toBe(true);
    expect(getLayoutsByDifficulty('Intermediate').some((layout) => layout.id === 'five-element-balance')).toBe(true);
  });
});
