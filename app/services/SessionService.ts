import redis from '../../redis';
import { randomBytes } from 'crypto';

class SessionService {
  async createSession(userId: number): Promise<string> {
    const sessionId = randomBytes(16).toString('hex');
    const now = new Date().toISOString();

    // セッションデータをRedisにハッシュ型で保存
    await redis.hset(sessionId, 'userId', userId.toString());
    await redis.hset(sessionId, 'createdAt', now);
    await redis.hset(sessionId, 'updatedAt', now);
    await redis.expire(sessionId, 60 * 60 * 24); // 24時間有効

    return sessionId;
  }

  async findSessionById(sessionId: string): Promise<{ userId: number; createdAt: string; updatedAt: string } | null> {
    const sessionData = await redis.hgetall(sessionId);
    if (!sessionData || Object.keys(sessionData).length === 0) {
      return null;
    }
    return {
      userId: parseInt(sessionData.userId, 10),
      createdAt: sessionData.createdAt,
      updatedAt: sessionData.updatedAt,
    };
  }
}

export const sessionService = new SessionService();
