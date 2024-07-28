import { userService } from "../../app/services/UserService";
import { dbInstance as db } from "../../database";
import bcrypt from "bcryptjs";
import { User } from "../../app/types.ts/types";

jest.mock("../../database");
jest.mock("bcryptjs");

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a new user and return it", async () => {
      const now = new Date().toISOString();
      const hashedPassword = "hashedPassword";
      const newUser: User = {
        id: 1 as any,
        username: "testuser",
        email: "test@example.com",
        password: hashedPassword,
        createdAt: now as any,
        updatedAt: now as any,
      };

      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(now);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (db.insertInto as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue([newUser]),
      });

      const result = await userService.createUser(
        newUser.username,
        newUser.email,
        "password"
      );

      expect(result).toEqual(newUser);
      expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
      expect(db.insertInto).toHaveBeenCalledWith("User");
      expect(db.insertInto("User").values).toHaveBeenCalledWith({
        username: newUser.username,
        email: newUser.email,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      });
      expect(db.insertInto("User").returning).toHaveBeenCalledWith([
        "id",
        "username",
        "email",
        "createdAt",
        "updatedAt",
      ]);
      expect(db.insertInto("User").execute).toHaveBeenCalled();
    });
  });

  describe("findUserByEmail", () => {
    it("should return a user if found", async () => {
      const user: User = {
        id: 1 as any,
        username: "testuser",
        email: "test@example.com",
        password: "hashedPassword",
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };

      (db.selectFrom as jest.Mock).mockReturnValue({
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        executeTakeFirst: jest.fn().mockResolvedValue(user),
      });

      const result = await userService.findUserByEmail("test@example.com");

      expect(result).toEqual(user);
      expect(db.selectFrom).toHaveBeenCalledWith("User");
      expect(db.selectFrom("User").selectAll).toHaveBeenCalled();
      expect(db.selectFrom("User").where).toHaveBeenCalledWith("email", "=", "test@example.com");
      expect(db.selectFrom("User").executeTakeFirst).toHaveBeenCalled();
    });

    it("should return null if no user is found", async () => {
      (db.selectFrom as jest.Mock).mockReturnValue({
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        executeTakeFirst: jest.fn().mockResolvedValue(null),
      });

      const result = await userService.findUserByEmail("nonexistent@example.com");

      expect(result).toBeNull();
      expect(db.selectFrom).toHaveBeenCalledWith("User");
      expect(db.selectFrom("User").selectAll).toHaveBeenCalled();
      expect(db.selectFrom("User").where).toHaveBeenCalledWith("email", "=", "nonexistent@example.com");
      expect(db.selectFrom("User").executeTakeFirst).toHaveBeenCalled();
    });
  });

  describe("getUsers", () => {
    it("should return a list of users", async () => {
      const users: User[] = [
        {
          id: 1 as any,
          username: "testuser1",
          email: "test1@example.com",
          password: "hashedPassword",
          createdAt: new Date() as any,
          updatedAt: new Date() as any,
        },
        {
          id: 2 as any,
          username: "testuser2",
          email: "test2@example.com",
          password: "hashedPassword",
          createdAt: new Date() as any,
          updatedAt: new Date() as any,
        },
      ];

      (db.selectFrom as jest.Mock).mockReturnValue({
        selectAll: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(users),
      });

      const result = await userService.getUsers();

      expect(result).toEqual(users);
      expect(db.selectFrom).toHaveBeenCalledWith("User");
      expect(db.selectFrom("User").selectAll).toHaveBeenCalled();
      expect(db.selectFrom("User").execute).toHaveBeenCalled();
    });
  });

  describe("validateUser", () => {
    it("should return a user if the credentials are valid", async () => {
      const user: User = {
        id: 1 as any,
        username: "testuser",
        email: "test@example.com",
        password: "hashedPassword",
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await userService.validateUser("test@example.com", "password");

      expect(result).toEqual(user);
      expect(userService.findUserByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedPassword");
    });

    it("should return null if the user is not found", async () => {
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(null);

      const result = await userService.validateUser("nonexistent@example.com", "password");

      expect(result).toBeNull();
      expect(userService.findUserByEmail).toHaveBeenCalledWith("nonexistent@example.com");
    });

    it("should return null if the password is invalid", async () => {
      const user: User = {
        id: 1 as any,
        username: "testuser",
        email: "test@example.com",
        password: "hashedPassword",
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await userService.validateUser("test@example.com", "wrongpassword");

      expect(result).toBeNull();
      expect(userService.findUserByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", "hashedPassword");
    });
  });
});
