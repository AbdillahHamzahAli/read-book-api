/*
  Warnings:

  - You are about to drop the column `isbn` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `user_books` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "books_isbn_key";

-- AlterTable
ALTER TABLE "books" DROP COLUMN "isbn",
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user_books" DROP COLUMN "status";
