import { FastifyWrapper } from './_wrapper';
import { TodoController } from './app/controllers/TodoController';
import { UserController } from './app/controllers/UserController';
import { AuthController } from './app/controllers/AuthController';
import { loginCheckMiddleware } from './app/middlewares/loginCheckMiddleware';

export const registerRoutes = (route: FastifyWrapper) => {
  route.middleware('/todos', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], loginCheckMiddleware, {});
  // Todo routes
  route.get('/todos', TodoController.getTodos);
  route.post('/todos', TodoController.createTodo);
  route.put('/todos/:id', TodoController.updateTodo);
  route.patch('/todos/:id/status', TodoController.updateTodoStatus);
  route.delete('/todos/:id', TodoController.deleteTodo);

  // User routes
  route.post('/register', UserController.registerUser);
  route.get('/users', UserController.getUsers);

  // Auth routes
  route.post('/login', AuthController.login);
  route.post('/logout', AuthController.logout);
};