/*
  Warnings:

  - A unique constraint covering the columns `[book_id]` on the table `user_books` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_books_book_id_key" ON "user_books"("book_id");
