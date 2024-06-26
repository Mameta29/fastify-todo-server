-- This is your existing migration file, with manual changes
ALTER TABLE "Todo" ADD COLUMN "userId" INTEGER;

-- Set default value for existing rows (adjust the value as necessary)
UPDATE "Todo" SET "userId" = 1 WHERE "userId" IS NULL;

-- Enforce NOT NULL constraint after setting default values
ALTER TABLE "Todo" ALTER COLUMN "userId" SET NOT NULL;
