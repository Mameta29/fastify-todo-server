// server/app/http/routes.ts
import { FastifyWrapper } from './_wrapper';
import { registerTodoRoutes } from './app/controllers/TodoController';

export const registerRoutes = (route: FastifyWrapper) => {
  registerTodoRoutes(route);
};
