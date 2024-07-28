import { FastifyRequest, FastifyReply } from "fastify";
import { loginCheckMiddleware } from "../../app/middlewares/loginCheckMiddleware";
import { sessionService } from "../../app/services/SessionService";

jest.mock("../../app/services/SessionService");

describe("loginCheckMiddleware", () => {
  let request: FastifyRequest;
  let reply: FastifyReply;

  beforeEach(() => {
    request = {
      cookies: {},
    } as FastifyRequest;

    reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as FastifyReply;

    jest.clearAllMocks();
  });

  it("セッションIDがない場合、 401エラーを返す。", async () => {
    await loginCheckMiddleware(request, reply);

    expect(reply.code).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({ message: "ログインしてください。" });
  });

  it("セッションが切れている場合、401エラーを返す。", async () => {
    request.cookies = { sessionId: "invalid-session-id" };
    (sessionService.findSessionById as jest.Mock).mockResolvedValue(null);

    await loginCheckMiddleware(request, reply);

    expect(reply.code).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({ message: "セッションが無効です。" });
  });

  it("正常系", async () => {
    request.cookies = { sessionId: "valid-session-id" };
    const session = { userId: 1 };
    (sessionService.findSessionById as jest.Mock).mockResolvedValue(session);

    await loginCheckMiddleware(request, reply);

    expect(reply.code).not.toHaveBeenCalled();
    expect(reply.send).not.toHaveBeenCalled();
    expect(request.user).toEqual({ id: session.userId });
  });
});
