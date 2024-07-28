import { FastifyRequest, FastifyReply, RouteGenericInterface } from "fastify";
import { AuthController } from "../../app/controllers/AuthController";
import { userService } from "../../app/services/UserService";
import { sessionService } from "../../app/services/SessionService";
import redis from "../../redis";

jest.mock("../../app/services/UserService");
jest.mock("../../app/services/SessionService");

interface MockRequestBody {
  Body: {
    email: string;
    password: string;
  };
}

type MockFastifyRequest = FastifyRequest<MockRequestBody> & { cookies?: { [key: string]: string } };

describe("AuthController", () => {
  let request: MockFastifyRequest;
  let reply: FastifyReply;

  beforeEach(() => {
    request = {
      body: { email: "", password: "" },
      cookies: {}
    } as MockFastifyRequest;

    reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn(),
      setCookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    } as unknown as FastifyReply;
  });

  afterAll(() => {
    redis.quit(); // テスト後にRedis接続を閉じる
  });

  describe("login", () => {
    it("認証に失敗した場合 401 エラーコードで返る", async () => {
      userService.validateUser = jest.fn().mockResolvedValue(null);

      request.body = { email: "test@example.com", password: "wrongpassword" };

      await AuthController.login(request, reply);

      expect(reply.code).toHaveBeenCalledWith(401);
      expect(reply.send).toHaveBeenCalledWith({ message: "認証に失敗しました。" });
    });

    it("正常系", async () => {
      userService.validateUser = jest.fn().mockResolvedValue({ id: 1 });
      sessionService.createSession = jest.fn().mockResolvedValue("session-id");

      request.body = { email: "test@example.com", password: "correctpassword" };

      await AuthController.login(request, reply);

      expect(reply.setCookie).toHaveBeenCalledWith("sessionId", "session-id", { httpOnly: true, path: "/" });
      expect(reply.send).toHaveBeenCalledWith({ message: "ログインに成功しました。" });
    });
  });

  describe("logout", () => {
    it("クッキーにセッションIDがなければ 400 エラーコードで返る", async () => {
      request.cookies = {};

      await AuthController.logout(request, reply);

      expect(reply.code).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({ message: "ログインしていません。" });
    });

    it("正常系", async () => {
      request.cookies = { sessionId: "session-id" };

      sessionService.deleteSession = jest.fn().mockResolvedValue(undefined);

      await AuthController.logout(request, reply);

      expect(reply.clearCookie).toHaveBeenCalledWith("sessionId", { path: "/" });
      expect(reply.send).toHaveBeenCalledWith({ message: "ログアウトに成功しました。" });
    });
  });
});
