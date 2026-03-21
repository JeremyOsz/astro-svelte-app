import { describe, expect, it } from 'vitest';
import { usageEventSchema } from '$lib/server/usage-validation';

describe('usage event schema', () => {
  it('accepts valid payload', () => {
    const result = usageEventSchema.safeParse({
      feature: 'chart',
      action: 'save',
      route: '/chart',
      metadata: { chartId: 'abc' }
    });

    expect(result.success).toBe(true);
  });

  it('rejects unknown feature', () => {
    const result = usageEventSchema.safeParse({
      feature: 'unknown',
      action: 'save'
    });

    expect(result.success).toBe(false);
  });

  it('rejects oversized metadata payload', () => {
    const result = usageEventSchema.safeParse({
      feature: 'chart',
      action: 'save',
      metadata: { large: 'x'.repeat(2100) }
    });

    expect(result.success).toBe(false);
  });
});
