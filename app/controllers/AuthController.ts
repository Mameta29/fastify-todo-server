import { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from '../services/UserService';
import { sessionService } from '../services/SessionService';

type AuthBody = { email: string; password: string };

export class AuthController {
  static async login(request: FastifyRequest<{Body: AuthBody}>, reply: FastifyReply) {
  // static async login(request: FastifyRequest, reply: FastifyReply) {
    // const { email, password } = request.body as { email: string; password: string };

    const { email, password } = request.body;

    const user = await userService.validateUser(email, password);
    if (!user) {
      return reply.code(401).send({ message: '認証に失敗しました。' });
    }

    const sessionId = await sessionService.createSession(user.id as unknown as number);
    // クッキーがJavaScriptからアクセスされないようにする設定
    reply.setCookie('sessionId', sessionId, { httpOnly: true, path: '/' });
    reply.send({ message: 'ログインに成功しました。' });
  }
}
