# Todo App Server

下記の技術を使用したシンプルな Todo API

- **Web フレームワーク:** Fastify
- **クエリビルダ:** Kysely
- **データベース:** PostgreSQL
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

#### Redis サーバーの起動

```bash
redis-server
```

#### アプリケーションの起動

```bash
npm run dev
```

`http://localhost:8080`で実行されます。

## Docker での立ち上げ

1. Docker コンテナのビルド

   ```bash
   docker-compose build
   ```

2. Docker コンテナの起動

   ```bash
   docker-compose up
   ```

3. Prisma マイグレーションの実行

   ```bash
   docker-compose run app npx prisma migrate dev --name init
   ```

4. プロジェクト立ち上げ
   ```bash
   npm install
   npm run dev
   ```


### API エンドポイント

`:id`には該当の id を入力

- **Todo の作成**

  ```bash
  curl -X POST http://localhost:8080/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Todo",
    "content": "This is a sample todo item."
  }'
  ```

- **すべての Todo の取得**

  ```bash
  curl -X GET http://localhost:8080/todos
  ```

- **Todo 更新**

  ```bash
  curl -X PUT http://localhost:8080/todos/:id \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Todo",
    "content": "This is an updated todo item."
  }'
  ```

- **Todo 削除**

  ```bash
  curl -X DELETE http://localhost:8080/todos/:id
  ```

- **会員登録**

  ```bash
  curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "sample@example.com",
    "password": "password"
  }'
  ```

- **ログイン**

  ```bash
  curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sample@example.com",
    "password": "password"
  }'
  ```
