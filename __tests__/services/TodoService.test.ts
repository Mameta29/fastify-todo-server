import { todoService } from "../../app/services/TodoService";
import { dbInstance as db } from "../../database";
import { Todo } from "../../app/types.ts/types";

jest.mock("../../database");

describe("TodoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTodo", () => {
    it("正常系", async () => {
      const now = new Date().toISOString();
      const newTodo: Todo = {
        id: 1 as any,
        title: "New Todo",
        content: "New Content",
        status: 0 as any,
        createdAt: now as any,
        updatedAt: now as any,
        userId: 1,
      };

      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(now);
      (db.insertInto as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue([newTodo]),
      });

      const result = await todoService.createTodo(
        newTodo.title,
        newTodo.content,
        newTodo.userId
      );

      expect(result).toEqual(newTodo);
      expect(db.insertInto).toHaveBeenCalledWith("Todo");
      expect(db.insertInto("Todo").values).toHaveBeenCalledWith({
        title: newTodo.title,
        content: newTodo.content,
        status: 0,
        createdAt: now,
        updatedAt: now,
        userId: newTodo.userId,
      });
      expect(db.insertInto("Todo").returning).toHaveBeenCalledWith([
        "id",
        "title",
        "content",
        "status",
        "createdAt",
        "updatedAt",
      ]);
      expect(db.insertInto("Todo").execute).toHaveBeenCalled();
    });
  });

  describe("getTodosByUserId", () => {
    it("正常系", async () => {
      const todos: Todo[] = [
        {
          id: 1 as any,
          title: "Todo 1",
          content: "Content 1",
          status: 0 as any,
          createdAt: new Date() as any,
          updatedAt: new Date() as any,
          userId: 1,
        },
        {
          id: 2 as any,
          title: "Todo 2",
          content: "Content 2",
          status: 0 as any,
          createdAt: new Date() as any,
          updatedAt: new Date() as any,
          userId: 1,
        },
      ];

      (db.selectFrom as jest.Mock).mockReturnValue({
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(todos),
      });

      const result = await todoService.getTodosByUserId(1);

      expect(result).toEqual(todos);
      expect(db.selectFrom).toHaveBeenCalledWith("Todo");
      expect(db.selectFrom("Todo").selectAll).toHaveBeenCalled();
      expect(db.selectFrom("Todo").where).toHaveBeenCalledWith("userId", "=", 1);
      expect(db.selectFrom("Todo").execute).toHaveBeenCalled();
    });
  });

  describe("updateTodo", () => {
    it("should update an existing todo and return it", async () => {
      const now = new Date().toISOString();
      const updatedTodo: Todo = {
        id: 1 as any,
        title: "Updated Todo",
        content: "Updated Content",
        status: 0 as any,
        createdAt: now as any,
        updatedAt: now as any,
        userId: 1,
      };

      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(now);
      (db.updateTable as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue([updatedTodo]),
      });

      const result = await todoService.updateTodo(
        updatedTodo.id as unknown as number,
        updatedTodo.title,
        updatedTodo.content,
        updatedTodo.userId
      );

      expect(result).toEqual(updatedTodo);
      expect(db.updateTable).toHaveBeenCalledWith("Todo");
      expect(db.updateTable("Todo").set).toHaveBeenCalledWith({
        title: updatedTodo.title,
        content: updatedTodo.content,
        updatedAt: now,
      });
      expect(db.updateTable("Todo").where).toHaveBeenCalledWith("id", "=", updatedTodo.id);
      expect(db.updateTable("Todo").where).toHaveBeenCalledWith("userId", "=", updatedTodo.userId);
      expect(db.updateTable("Todo").returning).toHaveBeenCalledWith([
        "id",
        "title",
        "content",
        "status",
        "createdAt",
        "updatedAt",
      ]);
      expect(db.updateTable("Todo").execute).toHaveBeenCalled();
    });
  });

  describe("updateTodoStatus", () => {
    it("should update the status of an existing todo and return it", async () => {
      const now = new Date().toISOString();
      const updatedTodo: Todo = {
        id: 1 as any,
        title: "Test Todo",
        content: "Test Content",
        status: 1 as any,
        createdAt: now as any,
        updatedAt: now as any,
        userId: 1,
      };

      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(now);
      (db.updateTable as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue([updatedTodo]),
      });

      const result = await todoService.updateTodoStatus(
        updatedTodo.id as unknown as number,
        updatedTodo.status as unknown as boolean,
        updatedTodo.userId
      );

      expect(result).toEqual(updatedTodo);
      expect(db.updateTable).toHaveBeenCalledWith("Todo");
      expect(db.updateTable("Todo").set).toHaveBeenCalledWith({
        status: 1,
        updatedAt: now,
      });
      expect(db.updateTable("Todo").where).toHaveBeenCalledWith("id", "=", updatedTodo.id);
      expect(db.updateTable("Todo").where).toHaveBeenCalledWith("userId", "=", updatedTodo.userId);
      expect(db.updateTable("Todo").returning).toHaveBeenCalledWith([
        "id",
        "title",
        "content",
        "status",
        "createdAt",
        "updatedAt",
      ]);
      expect(db.updateTable("Todo").execute).toHaveBeenCalled();
    });
  });

  describe("deleteTodo", () => {
    it("should delete an existing todo", async () => {
      (db.deleteFrom as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
      });

      await todoService.deleteTodo(1, 1);

      expect(db.deleteFrom).toHaveBeenCalledWith("Todo");
      expect(db.deleteFrom("Todo").where).toHaveBeenCalledWith("id", "=", 1);
      expect(db.deleteFrom("Todo").where).toHaveBeenCalledWith("userId", "=", 1);
      expect(db.deleteFrom("Todo").execute).toHaveBeenCalled();
    });
  });
});
