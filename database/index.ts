import { Kysely, SqliteDialect } from 'kysely';
import { DB } from '../app/types.ts/types';
import Database from 'better-sqlite3';

const db = new Database("./prisma/data/dev.db");

const dialect = new SqliteDialect({ database: db });

export const dbInstance = new Kysely<DB>({ dialect });