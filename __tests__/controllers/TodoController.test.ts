import { FastifyRequest, FastifyReply } from "fastify";
import { TodoController } from "../../app/controllers/TodoController";
import { todoService } from "../../app/services/TodoService";
import { TodoBody, TodoParams, TodoStatusBody } from "../../src/types";

jest.mock("../../app/services/TodoService");

interface MockRequestBody {
  Body: {
    title: string;  // 必須プロパティに変更
    content: string; // 必須プロパティに変更
    status?: boolean;
  };
  Params: {
    id: number;
  };
}

interface MockStatusRequestBody {
  Body: {
    status: boolean;
  };
  Params: {
    id: number;
  };
}

type MockFastifyRequest = FastifyRequest<MockRequestBody> & { user?: { id: number } };
type MockFastifyStatusRequest = FastifyRequest<MockStatusRequestBody> & { user?: { id: number } };

describe("TodoController", () => {
  let request: MockFastifyRequest;
  let statusRequest: MockFastifyStatusRequest;
  let reply: FastifyReply;

  beforeEach(() => {
    request = {
      body: {
        title: "Test Todo",
        content: "Test Content"
      },
      params: { id: 1 },
      user: { id: 1 }
    } as MockFastifyRequest;

    statusRequest = {
      body: {
        status: true
      },
      params: { id: 1 },
      user: { id: 1 }
    } as MockFastifyStatusRequest;

    reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as FastifyReply;
  });

  describe("getTodos", () => {
    it("should return 401 if user is not logged in", async () => {
      request.user = undefined;

      await TodoController.getTodos(request, reply);

      expect(reply.code).toHaveBeenCalledWith(401);
      expect(reply.send).toHaveBeenCalledWith({ message: "ログインが必要です。" });
    });

    it("should return todos for the logged-in user", async () => {
      const todos = [{ id: 1, title: "Test Todo", content: "Test Content" }];
      todoService.getTodosByUserId = jest.fn().mockResolvedValue(todos);

      await TodoController.getTodos(request, reply);

      expect(reply.send).toHaveBeenCalledWith(todos);
    });
  });

  describe("createTodo", () => {
    it("should return 401 if user is not logged in", async () => {
      request.user = undefined;

      await TodoController.createTodo(request, reply);

      expect(reply.code).toHaveBeenCalledWith(401);
      expect(reply.send).toHaveBeenCalledWith({ message: "ログインが必要です。" });
    });

    it("should create a new todo for the logged-in user", async () => {
      const newTodo = { id: 1, title: "New Todo", content: "New Content" };
      todoService.createTodo = jest.fn().mockResolvedValue(newTodo);
      request.body = { title: "New Todo", content: "New Content" };

      await TodoController.createTodo(request, reply);

      expect(reply.send).toHaveBeenCalledWith(newTodo);
    });
  });

  describe("updateTodo", () => {
    it("should return 401 if user is not logged in", async () => {
      request.user = undefined;

      await TodoController.updateTodo(request, reply);

      expect(reply.code).toHaveBeenCalledWith(401);
      expect(reply.send).toHaveBeenCalledWith({ message: "ログインが必要です。" });
    });

    it("should update an existing todo for the logged-in user", async () => {
      const updatedTodo = { id: 1, title: "Updated Todo", content: "Updated Content" };
      todoService.updateTodo = jest.fn().mockResolvedValue(updatedTodo);
      request.body = { title: "Updated Todo", content: "Updated Content" };

      await TodoController.updateTodo(request, reply);

      expect(reply.send).toHaveBeenCalledWith(updatedTodo);
    });
  });

  describe("updateTodoStatus", () => {
    it("should return 401 if user is not logged in", async () => {
      statusRequest.user = undefined;

      await TodoController.updateTodoStatus(statusRequest, reply);

      expect(reply.code).toHaveBeenCalledWith(401);
      expect(reply.send).toHaveBeenCalledWith({ message: "ログインが必要です。" });
    });

    it("should update the status of an existing todo for the logged-in user", async () => {
      const updatedTodo = { id: 1, title: "Test Todo", content: "Test Content", status: true };
      todoService.updateTodoStatus = jest.fn().mockResolvedValue(updatedTodo);
      statusRequest.body = { status: true };

      await TodoController.updateTodoStatus(statusRequest, reply);

      expect(reply.send).toHaveBeenCalledWith(updatedTodo);
    });
  });

  describe("deleteTodo", () => {
    it("should return 401 if user is not logged in", async () => {
      request.user = undefined;

      await TodoController.deleteTodo(request, reply);

      expect(reply.code).toHaveBeenCalledWith(401);
      expect(reply.send).toHaveBeenCalledWith({ message: "ログインが必要です。" });
    });

    it("should delete an existing todo for the logged-in user", async () => {
      todoService.deleteTodo = jest.fn().mockResolvedValue(undefined);

      await TodoController.deleteTodo(request, reply);

      expect(reply.send).toHaveBeenCalledWith({ message: "Todo deleted" });
    });
  });
});
