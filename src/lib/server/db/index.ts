import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

let db: PostgresJsDatabase<typeof schema> | null = null;
let queryClient: postgres.Sql | null = null;

export function getDb(): PostgresJsDatabase<typeof schema> {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }

  if (!db) {
    queryClient = postgres(env.DATABASE_URL, {
      prepare: false,
      max: 1
    });
    db = drizzle(queryClient, { schema });
  }

  return db;
}
