import { FastifyRequest, FastifyReply } from 'fastify';
import { todoService } from '../services/TodoService';

export class TodoController {
  static async getTodos(request: FastifyRequest, reply: FastifyReply) {
    const todos = await todoService.getTodos();
    reply.send(todos);
  }

  static async createTodo(request: FastifyRequest, reply: FastifyReply) {
    const { title, content } = request.body as { title: string; content: string };
    const todo = await todoService.createTodo(title, content);
    reply.send(todo);
  }

  static async updateTodo(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };
    const { title, content } = request.body as { title: string; content: string };
    const todo = await todoService.updateTodo(id, title, content);
    reply.send(todo);
  }

  static async updateTodoStatus(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };
    const { status } = request.body as { status: boolean };
    const todo = await todoService.updateTodoStatus(id, status);
    reply.send(todo);
  }

  static async deleteTodo(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };
    await todoService.deleteTodo(id);
    reply.send({ message: 'Todo deleted' });
  }
}
