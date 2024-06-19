// server/app/types.ts
import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;
// export type Timestamp = ColumnType<string, string | undefined, string>;

export type Todo = {
  id: Generated<number>;
  title: string;
  content: string;
  status: Generated<number>;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

export type DB = {
  todo: Todo;
};
