import type { OwnerScope } from '$lib/server/auth/owner-scope';
import { featureUsageEvents } from '$lib/server/db/schema';
import { getDb } from '$lib/server/db';
import type { UsageEventInput } from '$lib/server/usage-validation';

export async function logFeatureUsage(owner: OwnerScope, input: UsageEventInput) {
  const db = getDb();
  await db.insert(featureUsageEvents).values({
    feature: input.feature,
    action: input.action,
    route: input.route ?? '/',
    userId: owner.type === 'user' ? owner.userId : null,
    anonymousId: owner.type === 'anonymous' ? owner.anonymousId : null,
    metadata: input.metadata ?? {}
  });
}
