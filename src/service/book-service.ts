import {
  addBookRequest,
  BookResponse,
  searchBookRequest,
  toBookResponse,
  updateBookRequest,
} from "../model/book-model";
import { Validation } from "../validation/validation";
import { BookValidation } from "../validation/book-validation";
import { ResponseError } from "../error/response-error";
import { UnitOfWork } from "../application/unit-of-work";
import { StorageService } from "../utils/s3-storage/storage-service";
import { Pageable } from "../model/page";
import { Prisma, UserBook } from "@prisma/client";

export class BookService {
  static async addBook(
    request: addBookRequest,
    file: Express.Multer.File | undefined
  ): Promise<BookResponse> {
    const uow = new UnitOfWork();
    const addBookRequest = Validation.validate(BookValidation.ADDBOOK, request);

    let storageInfo: { url: string; key: string } | null = null;

    if (file) {
      storageInfo = await StorageService.upload(file);
      addBookRequest.cover_image_url = storageInfo.url;
    }

    try {
      return uow.execute(async (tx) => {
        const isUserBookExists =
          await tx.userBookRepository.findByUserIdAndTitle(
            addBookRequest.user_id,
            addBookRequest.title
          );

        if (isUserBookExists) {
          throw new ResponseError(409, "A book with this title already exists");
        }
        const book = await tx.bookRepository.create(addBookRequest);

        await tx.userBookRepository.create({
          userId: addBookRequest.user_id,
          bookId: book.id,
        });

        return toBookResponse(book);
      });
    } catch (e) {
      if (storageInfo) {
        await StorageService.delete(storageInfo.key);
      }
      throw e;
    }
  }

  static async getAllBooks(userId: string): Promise<BookResponse[]> {
    const uow = new UnitOfWork();
    return uow.execute(async (tx) => {
      const books = await tx.userBookRepository.findByUserId(userId);
      return books.map((item) => toBookResponse(item.book));
    });
  }

  static async searchBooks(
    request: searchBookRequest,
    userId: string
  ): Promise<Pageable<BookResponse>> {
    const searchRequest = Validation.validate(
      BookValidation.SEARCHBOOK,
      request
    );
    const uow = new UnitOfWork();
    const skip = (searchRequest.page - 1) * searchRequest.size;

    const [userBooks, total] = await uow.userBookRepository.searchAndCount(
      userId,
      searchRequest.title,
      searchRequest.size,
      skip
    );

    return {
      data: userBooks.map((userBook) => toBookResponse(userBook.book!)),
      paging: {
        current_page: searchRequest.page,
        size: searchRequest.size,
        total_page: Math.ceil(total / searchRequest.size),
      },
    };
  }

  static async getBookById(
    bookId: string,
    userId: string
  ): Promise<{
    book: BookResponse;
    user_book: UserBook | null;
  }> {
    const uow = new UnitOfWork();
    return uow.execute(async (tx) => {
      const book = await tx.bookRepository.findById(bookId);
      if (!book) {
        throw new ResponseError(404, "Book not found");
      }

      const userBook = await tx.userBookRepository.findByUserIdAndBookId(
        userId,
        bookId
      );

      if (!userBook) {
        throw new ResponseError(
          403,
          "You do not have permission to access this book"
        );
      }

      return {
        book: toBookResponse(book),
        user_book: { ...userBook },
      };
    });
  }

  static async updateBook(
    request: updateBookRequest,
    file: Express.Multer.File | undefined,
    userId: string
  ): Promise<BookResponse> {
    const uow = new UnitOfWork();
    const updateBookRequest = Validation.validate(
      BookValidation.UPDATEBOOK,
      request
    );

    let storageInfo: { url: string; key: string } | null = null;

    if (file) {
      storageInfo = await StorageService.upload(file);
      updateBookRequest.cover_image_url = storageInfo.url;
    }

    return uow.execute(async (tx) => {
      const book = await tx.bookRepository.findById(updateBookRequest.id);
      if (!book) {
        throw new ResponseError(404, "Book not found");
      }

      const isUserBookExists =
        await tx.userBookRepository.findByUserIdAndBookId(
          userId,
          updateBookRequest.id
        );

      if (!isUserBookExists) {
        throw new ResponseError(
          403,
          "You do not have permission to update this book"
        );
      }

      if (updateBookRequest.title) {
        const isDuplicate = await tx.userBookRepository.findByUserIdAndTitle(
          userId,
          updateBookRequest.title
        );

        if (isDuplicate && isDuplicate.bookId !== book.id) {
          throw new ResponseError(409, "A book with this title already exists");
        }
      }

      const updatedBook = await tx.bookRepository.update(updateBookRequest);

      if (storageInfo && book.coverImageUrl) {
        const key = book.coverImageUrl.replace(
          "https://yztinhcgnrkiugkbqazc.supabase.co/storage/v1/object/public/cover/",
          ""
        );
        await StorageService.delete(key);
      }

      return toBookResponse(updatedBook);
    });
  }

  static async deleteBook(bookId: string, userId: string): Promise<void> {
    const uow = new UnitOfWork();
    return uow.execute(async (tx) => {
      const book = await tx.bookRepository.findById(bookId);
      if (!book) {
        throw new ResponseError(404, "Book not found");
      }

      const userBook = await tx.userBookRepository.findByUserIdAndBookId(
        userId,
        bookId
      );

      if (!userBook) {
        throw new ResponseError(
          403,
          "You do not have permission to delete this book"
        );
      }

      await tx.userBookRepository.deleteById(userBook.id);
      await tx.bookRepository.deleteById(book.id);

      if (book.coverImageUrl) {
        const key = book.coverImageUrl.replace(
          "https://yztinhcgnrkiugkbqazc.supabase.co/storage/v1/object/public/cover/",
          ""
        );
        await StorageService.delete(key);
      }
    });
  }
}
