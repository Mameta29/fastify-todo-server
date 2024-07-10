import { sessionService } from "../../app/services/SessionService";
import redis from "../../redis";

jest.mock("crypto", () => ({
  randomBytes: jest.fn().mockReturnValue("testsessionid")
}));

jest.mock("../../redis", () => ({
  hset: jest.fn(),
  hgetall: jest.fn(),
  del: jest.fn(),
  expire: jest.fn(),
}));

describe("SessionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createSession", () => {
    it("正常系", async () => {
      const userId = 1;
      const sessionId = "testsessionid";
      const now = "2024-06-29T13:18:10.745Z";  // 固定された日時を使用

      // Date.prototype.toISOStringをモック
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(now);

      const result = await sessionService.createSession(userId);

      expect(result).toBe(sessionId);
      expect(redis.hset).toHaveBeenCalledWith(sessionId, "userId", userId.toString());
      expect(redis.hset).toHaveBeenCalledWith(sessionId, "createdAt", now);
      expect(redis.hset).toHaveBeenCalledWith(sessionId, "updatedAt", now);
      expect(redis.expire).toHaveBeenCalledWith(sessionId, 60 * 60 * 24);
    });
  });

  describe("findSessionById", () => {
    it("セッションが存在する場合、セッション情報を返す。", async () => {
      const sessionId = "testsessionid";
      const sessionData = {
        userId: "1",
        createdAt: "2024-06-29T13:18:10.745Z",
        updatedAt: "2024-06-29T13:18:10.745Z",
      };

      (redis.hgetall as jest.Mock).mockResolvedValue(sessionData);

      const result = await sessionService.findSessionById(sessionId);

      expect(result).toEqual({
        userId: parseInt(sessionData.userId, 10),
        createdAt: sessionData.createdAt,
        updatedAt: sessionData.updatedAt,
      });
    });

    it("セッションが存在しない場合、nullを返す。", async () => {
      const sessionId = "nonexistentsession";

      (redis.hgetall as jest.Mock).mockResolvedValue({});

      const result = await sessionService.findSessionById(sessionId);

      expect(result).toBeNull();
    });
  });

  describe("deleteSession", () => {
    it("正常系", async () => {
      const sessionId = "testsessionid";

      await sessionService.deleteSession(sessionId);

      expect(redis.del).toHaveBeenCalledWith(sessionId);
    });
  });
});
