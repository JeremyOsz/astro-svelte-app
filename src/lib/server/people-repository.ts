import { and, desc, eq, sql } from 'drizzle-orm';
import type { InferInsertModel } from 'drizzle-orm';
import { people } from '$lib/server/db/schema';
import { getDb } from '$lib/server/db';

type NewPerson = Omit<InferInsertModel<typeof people>, 'userId'>;

function normalizeRow(row: typeof people.$inferSelect) {
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    birthData: row.birthData,
    chartData: row.chartData,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  };
}

export async function listPeople(userId: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(people)
    .where(eq(people.userId, userId))
    .orderBy(desc(people.updatedAt));

  return rows.map(normalizeRow);
}

export async function createPerson(userId: string, input: NewPerson) {
  const db = getDb();
  const [row] = await db
    .insert(people)
    .values({ ...input, userId })
    .returning();

  return normalizeRow(row);
}

export async function updatePerson(userId: string, id: string, updates: Partial<NewPerson>) {
  const db = getDb();
  const [row] = await db
    .update(people)
    .set({
      ...updates,
      updatedAt: new Date()
    })
    .where(and(eq(people.id, id), eq(people.userId, userId)))
    .returning();

  return row ? normalizeRow(row) : null;
}

export async function deletePerson(userId: string, id: string) {
  const db = getDb();
  const result = await db
    .delete(people)
    .where(and(eq(people.id, id), eq(people.userId, userId)))
    .returning({ id: people.id });

  return result.length > 0;
}

export async function getPerson(userId: string, id: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(people)
    .where(and(eq(people.id, id), eq(people.userId, userId)))
    .limit(1);

  return row ? normalizeRow(row) : null;
}

export async function importPeople(userId: string, input: NewPerson[]) {
  const db = getDb();
  let importedCount = 0;
  let skippedCount = 0;

  for (const person of input) {
    const existing = await db
      .select({ id: people.id })
      .from(people)
      .where(and(
        eq(people.userId, userId),
        eq(people.name, person.name),
        sql`${people.birthData} ->> 'date' = ${person.birthData.date}`,
        sql`${people.birthData} ->> 'time' = ${person.birthData.time}`,
        sql`${people.birthData} ->> 'place' = ${person.birthData.place}`
      ))
      .limit(1);

    if (existing.length > 0) {
      skippedCount += 1;
      continue;
    }

    await db.insert(people).values({
      userId,
      name: person.name,
      birthData: person.birthData,
      chartData: person.chartData
    });

    importedCount += 1;
  }

  return { importedCount, skippedCount };
}
