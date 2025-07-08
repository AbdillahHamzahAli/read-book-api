/*
  Warnings:

  - Made the column `last_read` on table `user_books` required. This step will fail if there are existing NULL values in that column.
  - Made the column `progress` on table `user_books` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_books" ALTER COLUMN "last_read" SET NOT NULL,
ALTER COLUMN "last_read" SET DEFAULT 0,
ALTER COLUMN "progress" SET NOT NULL,
ALTER COLUMN "progress" SET DEFAULT 0;
