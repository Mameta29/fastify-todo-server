import { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from '../services/UserService';

export class UserController {
  static async registerUser(request: FastifyRequest, reply: FastifyReply) {
    const { username, email, password } = request.body as { username: string; email: string; password: string };

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return reply.code(400).send({ message: 'メールアドレスは既に登録されています。' });
    }

    const user = await userService.createUser(username, email, password);
    reply.send(user);
  }

  static async getUsers(request: FastifyRequest, reply: FastifyReply) {
    const users = await userService.getUsers();
    reply.send(users);
  }
}
