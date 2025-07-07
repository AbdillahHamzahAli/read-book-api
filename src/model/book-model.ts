import { Book } from "@prisma/client";

export type addBookRequest = {
  title: string;
  author: string;
  cover_image_url?: string;
  total_pages?: number;
  published_date?: Date;
  genre?: string;
  description?: string;
  user_id: string;
};

export type BookResponse = {
  id: string;
  title: string;
  author: string;
  cover_image_url: string | null;
  total_pages: number | null;
  published_date: Date | null;
  genre: string | null;
  description: string | null;
};

export type searchBookRequest = {
  title?: string;
  page: number;
  size: number;
};

export type updateBookRequest = {
  id: string;
  title?: string;
  author?: string;
  cover_image_url?: string;
  total_pages?: number;
  published_date?: Date;
  genre?: string;
  description?: string;
};

export function toBookResponse(book: Book): BookResponse {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    cover_image_url: book.coverImageUrl ?? null,
    total_pages: book.totalPages ?? null,
    published_date: book.publishedDate ?? null,
    genre: book.genre ?? null,
    description: book.description ?? null,
  };
}
