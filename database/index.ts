import { Kysely, PostgresDialect } from 'kysely';
import { DB } from '../app/types.ts/types';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const dialect = new PostgresDialect({ pool });

export const dbInstance = new Kysely<DB>({ dialect });
