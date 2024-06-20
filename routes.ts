// server/app/http/routes.ts
import { FastifyWrapper } from './_wrapper';
import { TodoController } from './app/controllers/TodoController';

export const registerRoutes = (route: FastifyWrapper) => {
  route.get('/todos', TodoController.getTodos);
  route.post('/todos', TodoController.createTodo);
  route.put('/todos/:id', TodoController.updateTodo);
  route.patch('/todos/:id/status', TodoController.updateTodoStatus);
  route.delete('/todos/:id', TodoController.deleteTodo);
};
