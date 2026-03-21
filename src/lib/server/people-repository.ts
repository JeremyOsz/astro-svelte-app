import { and, desc, eq, sql } from 'drizzle-orm';
import type { InferInsertModel } from 'drizzle-orm';
import { people } from '$lib/server/db/schema';
import { getDb } from '$lib/server/db';
import type { OwnerScope } from '$lib/server/auth/owner-scope';

type NewPerson = Omit<InferInsertModel<typeof people>, 'userId' | 'anonymousId'>;

function ownerWhere(owner: OwnerScope) {
  return owner.type === 'user'
    ? eq(people.userId, owner.userId)
    : eq(people.anonymousId, owner.anonymousId);
}

function normalizeRow(row: typeof people.$inferSelect) {
  return {
    id: row.id,
    userId: row.userId ?? undefined,
    anonymousId: row.anonymousId ?? undefined,
    name: row.name,
    birthData: row.birthData,
    chartData: row.chartData,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  };
}

export async function listPeople(owner: OwnerScope) {
  const db = getDb();
  const rows = await db
    .select()
    .from(people)
    .where(ownerWhere(owner))
    .orderBy(desc(people.updatedAt));

  return rows.map(normalizeRow);
}

export async function createPerson(owner: OwnerScope, input: NewPerson) {
  const db = getDb();
  const ownerValues = owner.type === 'user'
    ? { userId: owner.userId, anonymousId: null }
    : { userId: null, anonymousId: owner.anonymousId };

  const [row] = await db
    .insert(people)
    .values({ ...input, ...ownerValues })
    .returning();

  return normalizeRow(row);
}

export async function updatePerson(owner: OwnerScope, id: string, updates: Partial<NewPerson>) {
  const db = getDb();
  const [row] = await db
    .update(people)
    .set({
      ...updates,
      updatedAt: new Date()
    })
    .where(and(eq(people.id, id), ownerWhere(owner)))
    .returning();

  return row ? normalizeRow(row) : null;
}

export async function deletePerson(owner: OwnerScope, id: string) {
  const db = getDb();
  const result = await db
    .delete(people)
    .where(and(eq(people.id, id), ownerWhere(owner)))
    .returning({ id: people.id });

  return result.length > 0;
}

export async function getPerson(owner: OwnerScope, id: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(people)
    .where(and(eq(people.id, id), ownerWhere(owner)))
    .limit(1);

  return row ? normalizeRow(row) : null;
}

export async function importPeople(owner: OwnerScope, input: NewPerson[]) {
  const db = getDb();
  let importedCount = 0;
  let skippedCount = 0;

  for (const person of input) {
    const existing = await db
      .select({ id: people.id })
      .from(people)
      .where(and(
        ownerWhere(owner),
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

    await db
      .insert(people)
      .values({
        userId: owner.type === 'user' ? owner.userId : null,
        anonymousId: owner.type === 'anonymous' ? owner.anonymousId : null,
        name: person.name,
        birthData: person.birthData,
        chartData: person.chartData
      });

    importedCount += 1;
  }

  return { importedCount, skippedCount };
}
