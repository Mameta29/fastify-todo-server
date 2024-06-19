# Todo App Server

This is a simple Todo application built with Fastify, Kysely, and SQLite. The application provides basic CRUD operations for managing todo items.

## 使用技術

- **Web フレームワーク:** Fastify
- **クエリビルダ:** Kysely
- **データベース:** SQLite (Better-SQLite3 を使用)
- **ORM/スキーマ管理:** Prisma

## ローカル立ち上げ

### インストール

1. 依存関係のインストール

   ```bash
   npm install
   ```

2. Prisma クライアントと Kysely タイプを生成

   ```bash
   npx prisma generate
   ```

3. データベースのセットアップ

   ```bash
   npx prisma migrate dev --name init
   ```

### サーバーのローカル起動

```bash
npm run dev
```

`http://localhost:3000`で実行される。

### API エンドポイント

`:id`には該当の id を入力

- **Todo の作成**

  ```bash
  curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Todo",
    "content": "This is a sample todo item."
  }'
  ```

- **すべての Todo の取得**

  ```bash
  curl -X GET http://localhost:3000/todos
  ```

- **Todo 更新**

  ```bash
  curl -X PUT http://localhost:3000/todos/:id \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Todo",
    "content": "This is an updated todo item."
  }'
  ```

- **Todo 削除**
  ```bash
  curl -X DELETE http://localhost:3000/todos/:id
  ```
