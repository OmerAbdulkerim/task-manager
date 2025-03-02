/*
  Warnings:

  - The primary key for the `roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `task_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `task_priorities` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_priorityId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- Create temporary columns with integer IDs
ALTER TABLE "roles" ADD COLUMN "temp_id" SERIAL;
ALTER TABLE "task_categories" ADD COLUMN "temp_id" SERIAL;
ALTER TABLE "task_priorities" ADD COLUMN "temp_id" SERIAL;

-- Create mapping tables to store the UUID to ID mappings
CREATE TABLE "_roles_mapping" (
  "old_id" TEXT NOT NULL,
  "new_id" INTEGER NOT NULL,
  PRIMARY KEY ("old_id")
);

CREATE TABLE "_task_categories_mapping" (
  "old_id" TEXT NOT NULL,
  "new_id" INTEGER NOT NULL,
  PRIMARY KEY ("old_id")
);

CREATE TABLE "_task_priorities_mapping" (
  "old_id" TEXT NOT NULL,
  "new_id" INTEGER NOT NULL,
  PRIMARY KEY ("old_id")
);

-- Insert into mapping tables
INSERT INTO "_roles_mapping" ("old_id", "new_id")
SELECT "id", "temp_id" FROM "roles";

INSERT INTO "_task_categories_mapping" ("old_id", "new_id")
SELECT "id", "temp_id" FROM "task_categories";

INSERT INTO "_task_priorities_mapping" ("old_id", "new_id")
SELECT "id", "temp_id" FROM "task_priorities";

-- Create temporary ID columns in foreign key tables
ALTER TABLE "users" ADD COLUMN "temp_roleId" INTEGER;
ALTER TABLE "tasks" ADD COLUMN "temp_priorityId" INTEGER;
ALTER TABLE "tasks" ADD COLUMN "temp_categoryId" INTEGER;

-- Update temporary ID columns with mapped values
UPDATE "users" u
SET "temp_roleId" = m."new_id"
FROM "_roles_mapping" m
WHERE u."roleId" = m."old_id";

UPDATE "tasks" t
SET "temp_priorityId" = m."new_id"
FROM "_task_priorities_mapping" m
WHERE t."priorityId" = m."old_id";

UPDATE "tasks" t
SET "temp_categoryId" = m."new_id"
FROM "_task_categories_mapping" m
WHERE t."categoryId" = m."old_id";

-- Now replace the primary key columns
ALTER TABLE "roles" DROP CONSTRAINT "roles_pkey";
ALTER TABLE "task_categories" DROP CONSTRAINT "task_categories_pkey";
ALTER TABLE "task_priorities" DROP CONSTRAINT "task_priorities_pkey";

-- Drop the old columns and rename the temp columns
ALTER TABLE "roles" DROP COLUMN "id";
ALTER TABLE "roles" RENAME COLUMN "temp_id" TO "id";
ALTER TABLE "roles" ADD PRIMARY KEY ("id");

ALTER TABLE "task_categories" DROP COLUMN "id";
ALTER TABLE "task_categories" RENAME COLUMN "temp_id" TO "id";
ALTER TABLE "task_categories" ADD PRIMARY KEY ("id");

ALTER TABLE "task_priorities" DROP COLUMN "id";
ALTER TABLE "task_priorities" RENAME COLUMN "temp_id" TO "id";
ALTER TABLE "task_priorities" ADD PRIMARY KEY ("id");

-- Update the foreign key columns
ALTER TABLE "users" DROP COLUMN "roleId";
ALTER TABLE "users" RENAME COLUMN "temp_roleId" TO "roleId";
ALTER TABLE "users" ALTER COLUMN "roleId" SET NOT NULL;

ALTER TABLE "tasks" DROP COLUMN "priorityId";
ALTER TABLE "tasks" RENAME COLUMN "temp_priorityId" TO "priorityId";
ALTER TABLE "tasks" ALTER COLUMN "priorityId" SET NOT NULL;

ALTER TABLE "tasks" DROP COLUMN "categoryId";
ALTER TABLE "tasks" RENAME COLUMN "temp_categoryId" TO "categoryId";
ALTER TABLE "tasks" ALTER COLUMN "categoryId" SET NOT NULL;

-- Add foreign key constraints back
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey"
FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tasks" ADD CONSTRAINT "tasks_priorityId_fkey"
FOREIGN KEY ("priorityId") REFERENCES "task_priorities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tasks" ADD CONSTRAINT "tasks_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "task_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop temporary mapping tables
DROP TABLE "_roles_mapping";
DROP TABLE "_task_categories_mapping";
DROP TABLE "_task_priorities_mapping";
