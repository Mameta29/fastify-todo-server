import { FastifyRequest, FastifyReply } from "fastify";
import { UserController } from "../../app/controllers/UserController";
import { userService } from "../../app/services/UserService";

jest.mock("../../app/services/UserService");

interface MockRequestBody {
  Body: {
    username: string;
    email: string;
    password: string;
  };
}

type MockFastifyRequest = FastifyRequest<MockRequestBody>;

describe("UserController", () => {
  let request: MockFastifyRequest;
  let reply: FastifyReply;

  beforeEach(() => {
    request = {
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "testpassword"
      }
    } as MockFastifyRequest;

    reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as FastifyReply;
  });

  describe("registerUser", () => {
    it("should return 400 if the email is already registered", async () => {
      userService.findUserByEmail = jest.fn().mockResolvedValue({ id: 1 });
      userService.createUser = jest.fn();

      await UserController.registerUser(request, reply);

      expect(reply.code).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({ message: "メールアドレスは既に登録されています。" });
      expect(userService.createUser).not.toHaveBeenCalled();
    });

    it("should create a new user if the email is not registered", async () => {
      const newUser = { id: 1, username: "testuser", email: "test@example.com" };
      userService.findUserByEmail = jest.fn().mockResolvedValue(null);
      userService.createUser = jest.fn().mockResolvedValue(newUser);

      await UserController.registerUser(request, reply);

      expect(reply.send).toHaveBeenCalledWith(newUser);
    });
  });

  describe("getUsers", () => {
    it("should return a list of users", async () => {
      const users = [
        { id: 1, username: "user1", email: "user1@example.com" },
        { id: 2, username: "user2", email: "user2@example.com" }
      ];
      userService.getUsers = jest.fn().mockResolvedValue(users);

      await UserController.getUsers(request, reply);

      expect(reply.send).toHaveBeenCalledWith(users);
    });
  });
});
