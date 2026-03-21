export type UsageFeature =
  | 'chart'
  | 'transits'
  | 'synastry'
  | 'daily_horoscope'
  | 'tarot'
  | 'market_cosmos';

type UsagePayload = {
  feature: UsageFeature;
  action: string;
  route?: string;
  metadata?: Record<string, unknown>;
};

export async function logFeatureUsage(payload: UsagePayload): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    await fetch('/api/usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    });
  } catch {
    // Intentionally swallow errors so telemetry never blocks UX.
  }
}
