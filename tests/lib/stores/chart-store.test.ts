import { beforeEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';

describe('saved people loading', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.mocked(fetch).mockReset();
  });

  it('stays loading until the people request settles', async () => {
    let finish = (_response: Response) => {};
    vi.mocked(fetch).mockReturnValueOnce(new Promise<Response>((resolve) => { finish = resolve; }));
    const { chartStore } = await import('../../../src/lib/stores/chart-store');

    const loading = chartStore.setAuthUser(null);
    expect(get(chartStore).peopleLoadState.status).toBe('loading');
    expect(get(chartStore).isLoading).toBe(false);

    finish(Response.json({ people: [] }));
    await loading;
    expect(get(chartStore).peopleLoadState.status).toBe('ready');
    expect(get(chartStore).savedCharts).toEqual([]);
  });

  it('keeps people failures separate from the chart and allows retry', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 503 }));
    const { chartStore } = await import('../../../src/lib/stores/chart-store');
    chartStore.setChartData("Sun,Aries,1°00'");

    await chartStore.setAuthUser(null);
    expect(get(chartStore).peopleLoadState.status).toBe('error');
    expect(get(chartStore).error).toBeNull();
    expect(get(chartStore).chartData).toBe("Sun,Aries,1°00'");

    vi.mocked(fetch).mockResolvedValueOnce(Response.json({ people: [] }));
    await chartStore.refreshPeople();
    expect(get(chartStore).peopleLoadState.status).toBe('ready');
  });

  it('preserves the people loading state when the chart is cleared', async () => {
    const { chartStore } = await import('../../../src/lib/stores/chart-store');
    chartStore.setChartData("Sun,Aries,1°00'");
    chartStore.clear();
    expect(get(chartStore).peopleLoadState.status).toBe('loading');
    expect(get(chartStore).chartData).toBeNull();
  });
});
