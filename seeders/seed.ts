import { dbInstance as db } from "../database/index";
import bcrypt from "bcryptjs";

async function seed() {
  const now = new Date().toISOString();
  // ユーザーの作成
  const hashedPassword = await bcrypt.hash("password", 10);
  const users = await db
    .insertInto("User")
    .values([
      {
        username: "user1",
        email: "user1@example.com",
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      },
      {
        username: "user2",
        email: "user2@example.com",
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      },
    ])
    .returning(["id", "username", "email"])
    .execute();

  // Todosの作成
  
  await db
    .insertInto("Todo")
    .values([
      {
        title: "Todo 1",
        content: "This is the first todo",
        status: 0,
        createdAt: now,
        updatedAt: now,
        userId: users[0].id,
      },
      {
        title: "Todo 2",
        content: "This is the second todo",
        status: 0,
        createdAt: now,
        updatedAt: now,
        userId: users[1].id,
      },
    ])
    .execute();

  console.log("Seeding completed.");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
