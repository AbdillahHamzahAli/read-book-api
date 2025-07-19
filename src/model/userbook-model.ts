import { UserBook } from "@prisma/client";

export type createUserBook = {
  bookTitle: string;
  bookAuthor: string;
  bookTotalPages: number;
  bookCoverUrl?: string;
  bookPublishedDate?: Date;
  bookGenre?: string;
  bookDescription?: string;
  userId: string;
};

export type searchUserBook = {
  title?: string;
  page: number;
  size: number;
};

export type updateUserBook = {
  bookTitle?: string;
  bookAuthor?: string;
  bookTotalPages?: number;
  bookCoverUrl?: string;
  bookPublishedDate?: Date;
  bookGenre?: string;
  bookDescription?: string;

  rating?: number;
  review?: string;

  userId: string;
};

export type UserBookResponse = {
  id: string;
  bookTitle: string;
  bookAuthor: string | null;
  bookCoverUrl: string | null;
  bookTotalPages: number;
  bookPublishedDate: Date | null;
  bookGenre: string | null;
  bookDescription: string | null;
  startDate: Date | null;
  finishDate: Date | null;
  lastRead: number | null;
  progress: number | null;
  rating: number | null;
  review: string | null;
};

export function toUserBookResponse(userBook: UserBook): UserBookResponse {
  return {
    id: userBook.id,
    bookTitle: userBook.bookTitle,
    bookAuthor: userBook.bookAuthor,
    bookCoverUrl: userBook.bookCoverUrl,
    bookTotalPages: userBook.bookTotalPages,
    bookPublishedDate: userBook.bookPublishedDate,
    bookGenre: userBook.bookGenre,
    bookDescription: userBook.bookDescription,
    startDate: userBook.startDate,
    finishDate: userBook.finishDate,
    lastRead: userBook.lastRead,
    progress: userBook.progress,
    rating: userBook.rating,
    review: userBook.review,
  };
}
