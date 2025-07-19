/*
  Warnings:

  - Made the column `book_total_pages` on table `user_books` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_books" ALTER COLUMN "book_author" DROP NOT NULL,
ALTER COLUMN "book_total_pages" SET NOT NULL,
ALTER COLUMN "book_total_pages" SET DEFAULT 0;
