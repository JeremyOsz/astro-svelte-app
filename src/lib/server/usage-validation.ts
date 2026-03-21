import { z } from 'zod';

export const usageFeatureSchema = z.enum([
  'chart',
  'transits',
  'synastry',
  'daily_horoscope',
  'tarot',
  'market_cosmos'
]);

export const usageEventSchema = z.object({
  feature: usageFeatureSchema,
  action: z.string().trim().min(1).max(80),
  route: z.string().trim().min(1).max(160).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
}).superRefine((value, ctx) => {
  if (!value.metadata) return;
  const raw = JSON.stringify(value.metadata);
  if (raw.length > 2000) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['metadata'],
      message: 'Metadata payload is too large'
    });
  }
});

export type UsageEventInput = z.infer<typeof usageEventSchema>;
