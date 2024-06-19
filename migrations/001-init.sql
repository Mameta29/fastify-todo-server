-- migrations/001-init.sql
-- Up
CREATE TABLE todo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status BOOLEAN NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Down
DROP TABLE IF EXISTS todo;
