import { Kysely, SqliteDialect } from 'kysely';
import { DB } from '../app/types.ts/types';
import Database from 'better-sqlite3';

const db = new Database("./prisma/data/dev.db");

const dialect = new SqliteDialect({ database: db });

export const dbInstance = new Kysely<DB>({ dialect });

// better-sqlite3-helper使用 (migrate機能付き)
// import { Kysely, SqliteDialect } from 'kysely';
// import { DB } from '../database/types';
// import Database from 'better-sqlite3-helper';

// // Initialize better-sqlite3-helper
// const db = Database({
//   path: './prisma/data/dev.db',
//   readonly: false,
//   fileMustExist: false,
//   WAL: true,
//   migrate: {
//     force: false,
//     table: 'migration',
//     migrationsPath: './migrations'
//   }
// });

// const dialect = new SqliteDialect({ database: db });

// export const dbInstance = new Kysely<DB>({ dialect });
