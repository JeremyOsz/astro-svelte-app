import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgSchema, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export type BirthData = {
  date: string;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
};

const auth = pgSchema('auth');
const authUsers = auth.table('users', {
  id: uuid('id').primaryKey()
});

export const people = pgTable('people', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  anonymousId: text('anonymous_id'),
  name: text('name').notNull(),
  birthData: jsonb('birth_data').$type<BirthData>().notNull(),
  chartData: text('chart_data').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  index('people_user_id_idx').on(table.userId),
  index('people_anonymous_id_idx').on(table.anonymousId),
  check(
    'people_owner_check',
    sql`(case when ${table.userId} is null then 0 else 1 end + case when ${table.anonymousId} is null then 0 else 1 end) = 1`
  ),
  index('people_updated_at_idx').on(table.updatedAt)
]);

export const featureUsageEvents = pgTable('feature_usage_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  feature: text('feature').notNull(),
  action: text('action').notNull(),
  route: text('route').notNull(),
  userId: uuid('user_id').references(() => authUsers.id, { onDelete: 'set null' }),
  anonymousId: text('anonymous_id'),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  index('feature_usage_events_feature_idx').on(table.feature),
  index('feature_usage_events_action_idx').on(table.action),
  index('feature_usage_events_created_at_idx').on(table.createdAt),
  index('feature_usage_events_user_id_idx').on(table.userId),
  index('feature_usage_events_anonymous_id_idx').on(table.anonymousId),
  check(
    'feature_usage_events_owner_check',
    sql`(case when ${table.userId} is null then 0 else 1 end + case when ${table.anonymousId} is null then 0 else 1 end) = 1`
  )
]);

export type PersonRow = typeof people.$inferSelect;
export type InsertPersonRow = typeof people.$inferInsert;
export type FeatureUsageEventRow = typeof featureUsageEvents.$inferSelect;
