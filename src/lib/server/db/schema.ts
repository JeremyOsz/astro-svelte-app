import { index, jsonb, pgSchema, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

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
    .notNull()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  birthData: jsonb('birth_data').$type<BirthData>().notNull(),
  chartData: text('chart_data').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  index('people_user_id_idx').on(table.userId),
  index('people_updated_at_idx').on(table.updatedAt)
]);

export type PersonRow = typeof people.$inferSelect;
export type InsertPersonRow = typeof people.$inferInsert;
