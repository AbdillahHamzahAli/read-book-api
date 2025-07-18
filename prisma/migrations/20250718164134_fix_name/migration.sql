/*
  Warnings:

  - You are about to drop the `user_library_entries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reading_sessions" DROP CONSTRAINT "reading_sessions_user_book_id_fkey";

-- DropForeignKey
ALTER TABLE "user_library_entries" DROP CONSTRAINT "user_library_entries_user_id_fkey";

-- DropTable
DROP TABLE "user_library_entries";

-- CreateTable
CREATE TABLE "user_books" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "book_title" TEXT NOT NULL,
    "book_author" TEXT NOT NULL,
    "book_cover_url" TEXT,
    "book_total_pages" INTEGER,
    "book_published_date" TIMESTAMP(3),
    "book_genre" TEXT,
    "book_description" TEXT,
    "start_date" TIMESTAMP(3),
    "finish_date" TIMESTAMP(3),
    "last_read" INTEGER NOT NULL DEFAULT 0,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER,
    "review" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_books_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_books_user_id_book_title_book_author_key" ON "user_books"("user_id", "book_title", "book_author");

-- AddForeignKey
ALTER TABLE "user_books" ADD CONSTRAINT "user_books_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_sessions" ADD CONSTRAINT "reading_sessions_user_book_id_fkey" FOREIGN KEY ("user_book_id") REFERENCES "user_books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
