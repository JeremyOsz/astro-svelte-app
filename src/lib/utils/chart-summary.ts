import type { BirthData } from '$lib/stores/chart-store';

/**
 * Builds a human-readable summary of the current chart for AI context.
 * Used by the chart chat feature to give the model birth data and planetary positions.
 */
export function buildChartSummary(chartData: string | null, birthData: BirthData | null): string {
  const parts: string[] = [];

  if (birthData) {
    parts.push(
      `Birth data: ${birthData.date} at ${birthData.time}, ${birthData.place} (lat ${birthData.latitude}, lng ${birthData.longitude}).`
    );
  }

  if (chartData?.trim()) {
    parts.push('Planetary positions (planet, sign, degree, retrograde if R):');
    parts.push(chartData.trim());
  }

  return parts.length ? parts.join('\n\n') : '';
}
