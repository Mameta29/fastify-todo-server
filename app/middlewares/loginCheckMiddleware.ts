import { FastifyRequest, FastifyReply } from 'fastify';
import { sessionService } from '../services/SessionService';

export async function loginCheckMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const { sessionId } = request.cookies;

  if (!sessionId) {
    reply.code(401).send({ message: 'ログインしてください。' });
    return;
  }

  const session = await sessionService.findSessionById(sessionId);

  if (!session) {
    reply.code(401).send({ message: 'セッションが無効です。' });
    return;
  }

  request.user = { id: session.userId };
}
