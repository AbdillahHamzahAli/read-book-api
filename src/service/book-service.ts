import {
  AddBookRequest,
  BookResponse,
  toBookResponse,
} from "../model/book-model";
import { Validation } from "../validation/validation";
import { BookValidation } from "../validation/book-validation";
import { ResponseError } from "../error/response-error";
import { UnitOfWork } from "../application/unit-of-work";

export class BookService {
  static async addBook(request: AddBookRequest): Promise<BookResponse> {
    const uow = new UnitOfWork();
    const addBookRequest = Validation.validate(BookValidation.ADDBOOK, request);

    return uow.execute(async (tx) => {
      const isUserBookExists = await tx.userBookRepository.findByUserIdAndTitle(
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
  }
}
