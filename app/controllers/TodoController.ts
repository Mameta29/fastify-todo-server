// server/app/http/controllers/TodoController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { todoService } from '../services/TodoService';
import { FastifyWrapper } from '../../_wrapper';

export const registerTodoRoutes = (route: FastifyWrapper) => {
  route.get('/todos', async (request: FastifyRequest, reply: FastifyReply) => {
    const todos = await todoService.getTodos();
    reply.send(todos);
  });

  route.post('/todos', async (request: FastifyRequest, reply: FastifyReply) => {
    const { title, content } = request.body as { title: string; content: string };
    const todo = await todoService.createTodo(title, content);
    reply.send(todo);
  });

  route.put('/todos/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: number };
    const { title, content } = request.body as { title: string; content: string };
    const todo = await todoService.updateTodo(id, title, content);
    reply.send(todo);
  });

  route.patch('/todos/:id/status', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: number };
    const { status } = request.body as { status: boolean };
    const todo = await todoService.updateTodoStatus(id, status);
    reply.send(todo);
  });

  route.delete('/todos/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: number };
    await todoService.deleteTodo(id);
    reply.send({ message: 'Todo deleted' });
  });
};
