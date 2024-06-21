import redis from '../../redis';
import { randomBytes } from 'crypto';

class SessionService {
  async createSession(userId: number): Promise<string> {
    const sessionId = randomBytes(16).toString('hex');
    const now = new Date().toISOString();

    // セッションデータをRedisに保存
    await redis.set(sessionId, JSON.stringify({ userId, createdAt: now, updatedAt: now }), 'EX', 60 * 60 * 24); // 24時間有効

    return sessionId;
  }

  async findSessionById(sessionId: string): Promise<{ userId: number; createdAt: string; updatedAt: string } | null> {
    const sessionData = await redis.get(sessionId);
    if (!sessionData) {
      return null;
    }
    return JSON.parse(sessionData);
  }
}

export const sessionService = new SessionService();
