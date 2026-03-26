import { describe, expect, it } from 'vitest';

import { isSameChartSelection } from '../../../src/routes/daily-horoscope/chart-selection';

describe('isSameChartSelection', () => {
  it('returns true for matching chart ids', () => {
    expect(isSameChartSelection({ id: 'chart-1' }, { id: 'chart-1' })).toBe(true);
  });

  it('returns false for different chart ids', () => {
    expect(isSameChartSelection({ id: 'chart-1' }, { id: 'chart-2' })).toBe(false);
  });

  it('returns false when both charts miss comparable fields', () => {
    expect(isSameChartSelection({} as never, {} as never)).toBe(false);
  });

  it('returns false when either chart is null', () => {
    expect(isSameChartSelection(null, { id: 'chart-1' })).toBe(false);
    expect(isSameChartSelection({ id: 'chart-1' }, null)).toBe(false);
  });

  it('falls back to birth data signature when id is missing', () => {
    const chartA = {
      birthData: {
        date: '1990-01-01',
        time: '12:34',
        latitude: 40.7128,
        longitude: -74.006
      }
    };

    const chartB = {
      birthData: {
        date: '1990-01-01',
        time: '12:34',
        latitude: 40.7128,
        longitude: -74.006
      }
    };

    expect(isSameChartSelection(chartA, chartB)).toBe(true);
  });

  it('returns false when only one chart has a stable id', () => {
    const byId = { id: 'chart-1' };
    const byBirthData = {
      birthData: {
        date: '1990-01-01',
        time: '12:34',
        latitude: 40.7128,
        longitude: -74.006
      }
    };

    expect(isSameChartSelection(byId, byBirthData)).toBe(false);
  });
});
