import { FastifyRequest, FastifyReply } from "fastify";
import { todoService } from "../services/TodoService";
import { TodoBody, TodoParams, TodoStatusBody } from "../../src/types";

export class TodoController {
  static async getTodos(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.id;
    if (!userId) {
      return reply.code(401).send({ message: "ログインが必要です。" });
    }
    const todos = await todoService.getTodosByUserId(userId);
    reply.send(todos);
  }

  static async createTodo(
    request: FastifyRequest<{ Body: TodoBody }>,
    reply: FastifyReply,
  ) {
    const { title, content } = request.body;
    const userId = request.user?.id;
    if (!userId) {
      return reply.code(401).send({ message: "ログインが必要です。" });
    }
    const todo = await todoService.createTodo(title, content, userId);
    reply.send(todo);
  }

  static async updateTodo(
    request: FastifyRequest<{ Params: TodoParams; Body: TodoBody }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    const { title, content } = request.body;
    const userId = request.user?.id;
    if (!userId) {
      return reply.code(401).send({ message: "ログインが必要です。" });
    }
    const todo = await todoService.updateTodo(id, title, content, userId);
    reply.send(todo);
  }

  static async updateTodoStatus(
    request: FastifyRequest<{ Params: TodoParams; Body: TodoStatusBody }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    const { status } = request.body;
    const userId = request.user?.id;
    if (!userId) {
      return reply.code(401).send({ message: "ログインが必要です。" });
    }
    const todo = await todoService.updateTodoStatus(id, status, userId);
    reply.send(todo);
  }

  static async deleteTodo(
    request: FastifyRequest<{ Params: TodoParams }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    const userId = request.user?.id;
    if (!userId) {
      return reply.code(401).send({ message: "ログインが必要です。" });
    }
    await todoService.deleteTodo(id, userId);
    reply.send({ message: "Todo deleted" });
  }
}
