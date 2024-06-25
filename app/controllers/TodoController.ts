import { FastifyRequest, FastifyReply } from 'fastify';
import { todoService } from '../services/TodoService';

// 共通の型定義
type TodoBody = { title: string; content: string };
type TodoParams = { id: number };
type TodoStatusBody = { status: boolean };

export class TodoController {
  static async getTodos(request: FastifyRequest, reply: FastifyReply) {
    const todos = await todoService.getTodos();
    reply.send(todos);
  }

  static async createTodo(request: FastifyRequest<{ Body: TodoBody }>, reply: FastifyReply) {
    const { title, content } = request.body;
    const todo = await todoService.createTodo(title, content);
    reply.send(todo);
  }

  static async updateTodo(request: FastifyRequest<{ Params: TodoParams; Body: TodoBody }>, reply: FastifyReply) {
    const { id } = request.params;
    const { title, content } = request.body;
    const todo = await todoService.updateTodo(id, title, content);
    reply.send(todo);
  }

  static async updateTodoStatus(request: FastifyRequest<{ Params: TodoParams; Body: TodoStatusBody }>, reply: FastifyReply) {
    const { id } = request.params;
    const { status } = request.body;
    const todo = await todoService.updateTodoStatus(id, status);
    reply.send(todo);
  }

  static async deleteTodo(request: FastifyRequest<{ Params: TodoParams }>, reply: FastifyReply) {
    const { id } = request.params;
    await todoService.deleteTodo(id);
    reply.send({ message: 'Todo deleted' });
  }
}
