import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Todo = {
    id: Generated<number>;
    title: string;
    content: string;
    status: Generated<number>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    userId: number;
};
export type User = {
    id: Generated<number>;
    username: string;
    email: string;
    password: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type DB = {
    Todo: Todo;
    User: User;
};
