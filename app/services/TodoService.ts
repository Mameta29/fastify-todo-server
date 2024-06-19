// server/app/services/TodoService.ts
import { dbInstance as db } from '../../database';
import { Todo } from '../../app/types.ts/types';

class TodoService {
  async createTodo(title: string, content: string): Promise<Todo> {
    const now = new Date().toISOString();
    console.log("Creating Todo with:", { title, content, status: 0, createdAt: now, updatedAt: now });
    const [todo] = await db
      .insertInto('Todo')
      .values({ title, content, status: 0, createdAt: now, updatedAt: now })
      .returning(['id', 'title', 'content', 'status', 'createdAt', 'updatedAt'])
      .execute() as unknown as Todo[];
    return todo;
  }

  async getTodos(): Promise<Todo[]> {
    const todos = await db.selectFrom('Todo').selectAll().execute();
    return todos as unknown as Todo[];
  }

  async getTodoById(id: number): Promise<Todo | null> {
    const todo = await db
      .selectFrom('Todo')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    return todo as unknown as Todo | null;
  }

  async updateTodo(id: number, title: string, content: string): Promise<Todo> {
    const now = new Date().toISOString();
    const [todo] = await db
      .updateTable('Todo')
      .set({ title, content, updatedAt: now })
      .where('id', '=', id)
      .returning(['id', 'title', 'content', 'status', 'createdAt', 'updatedAt'])
      .execute() as unknown as Todo[];
    return todo;
  }

  async updateTodoStatus(id: number, status: boolean): Promise<Todo> {
    const now = new Date().toISOString();
    const [todo] = await db
      .updateTable('Todo')
      .set({ status: status ? 1 : 0, updatedAt: now })
      .where('id', '=', id)
      .returning(['id', 'title', 'content', 'status', 'createdAt', 'updatedAt'])
      .execute() as unknown as Todo[];
    return todo;
  }

  async deleteTodo(id: number): Promise<void> {
    await db.deleteFrom('Todo').where('id', '=', id).execute();
  }
}

export const todoService = new TodoService();
