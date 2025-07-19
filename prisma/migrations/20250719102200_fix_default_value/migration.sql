/*
  Warnings:

  - Made the column `pages_read` on table `reading_sessions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "reading_sessions" ALTER COLUMN "pages_read" SET NOT NULL,
ALTER COLUMN "pages_read" SET DEFAULT 0;
