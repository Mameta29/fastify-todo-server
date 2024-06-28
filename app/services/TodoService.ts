// TodoService.ts
import { dbInstance as db } from "../../database";
import { Todo } from "../../app/types.ts/types";

class TodoService {
  async createTodo(
    title: string,
    content: string,
    userId: number,
  ): Promise<Todo> {
    const now = new Date().toISOString();
    const [todo] = (await db
      .insertInto("Todo")
      .values({
        title,
        content,
        status: 0,
        createdAt: now,
        updatedAt: now,
        userId,
      })
      .returning(["id", "title", "content", "status", "createdAt", "updatedAt"])
      .execute()) as unknown as Todo[];
    return todo;
  }

  async getTodosByUserId(userId: number): Promise<Todo[]> {
    const todos = await db
      .selectFrom("Todo")
      .selectAll()
      .where("userId", "=", userId)
      .execute();
    return todos as unknown as Todo[];
  }

  async updateTodo(
    id: number,
    title: string,
    content: string,
    userId: number,
  ): Promise<Todo> {
    const now = new Date().toISOString();
    const [todo] = (await db
      .updateTable("Todo")
      .set({ title, content, updatedAt: now })
      .where("id", "=", id)
      .where("userId", "=", userId)
      .returning(["id", "title", "content", "status", "createdAt", "updatedAt"])
      .execute()) as unknown as Todo[];
    return todo;
  }

  async updateTodoStatus(
    id: number,
    status: boolean,
    userId: number,
  ): Promise<Todo> {
    const now = new Date().toISOString();
    const [todo] = (await db
      .updateTable("Todo")
      .set({ status: status ? 1 : 0, updatedAt: now })
      .where("id", "=", id)
      .where("userId", "=", userId)
      .returning(["id", "title", "content", "status", "createdAt", "updatedAt"])
      .execute()) as unknown as Todo[];
    return todo;
  }

  async deleteTodo(id: number, userId: number): Promise<void> {
    await db
      .deleteFrom("Todo")
      .where("id", "=", id)
      .where("userId", "=", userId)
      .execute();
  }
}

export const todoService = new TodoService();
