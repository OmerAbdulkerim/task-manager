-- Create a temporary column to hold the numeric IDs
ALTER TABLE "tasks" ADD COLUMN "temp_id" SERIAL;

-- Create a mapping table for UUIDs to integers
CREATE TABLE "_tasks_mapping" (
  "old_id" TEXT NOT NULL,
  "new_id" INTEGER NOT NULL,
  PRIMARY KEY ("old_id")
);

-- Insert mappings
INSERT INTO "_tasks_mapping" ("old_id", "new_id")
SELECT "id", "temp_id" FROM "tasks";

-- Update any tables that reference tasks by ID
-- (Add logic for any other tables that reference tasks)

-- Drop the primary key constraint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_pkey";

-- Drop the old ID column and rename temp_id to id
ALTER TABLE "tasks" DROP COLUMN "id";
ALTER TABLE "tasks" RENAME COLUMN "temp_id" TO "id";

-- Add primary key constraint to new id column
ALTER TABLE "tasks" ADD PRIMARY KEY ("id");

-- Drop the mapping table
DROP TABLE "_tasks_mapping";
