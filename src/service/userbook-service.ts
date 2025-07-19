import { UnitOfWork } from "../application/unit-of-work";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";
import {
  createUserBook,
  searchUserBook,
  toUserBookResponse,
  updateUserBook,
  UserBookResponse,
} from "../model/userbook-model";
import { StorageService } from "../utils/s3-storage/storage-service";
import { UserBookValidation } from "../validation/userbook-validation";
import { Validation } from "../validation/validation";

export class UserBookService {
  static async addUserBokk(
    request: createUserBook,
    file: Express.Multer.File | undefined
  ): Promise<UserBookResponse> {
    const createRequest = Validation.validate(
      UserBookValidation.ADDBOOK,
      request
    );
    const uow = new UnitOfWork();

    let storageInfo: { url: string; key: string } | null = null;
    if (file) {
      storageInfo = await StorageService.upload(file);
      createRequest.bookCoverUrl = storageInfo.url;
    }

    try {
      const isTitleExists = await uow.userBookRepository.findByTitleAndUserId(
        createRequest.bookTitle,
        createRequest.userId
      );

      if (isTitleExists) {
        throw new ResponseError(401, "Book title already exists");
      }
      const book = await uow.userBookRepository.createUserBook(createRequest);

      return toUserBookResponse(book);
    } catch (e) {
      if (storageInfo) {
        await StorageService.delete(storageInfo.key);
      }
      throw e;
    }
  }

  static async searchUserBook(
    request: searchUserBook,
    userId: string
  ): Promise<Pageable<UserBookResponse>> {
    const searchRequest = Validation.validate(
      UserBookValidation.SEARCH,
      request
    );

    const uow = new UnitOfWork();
    const skip = (searchRequest.page - 1) * searchRequest.size;
    console.log(skip);
    const { data, total } = await uow.userBookRepository.searchAndCount(
      searchRequest.title,
      skip,
      searchRequest.size,
      userId
    );

    return {
      data: data.map(toUserBookResponse),
      paging: {
        current_page: searchRequest.page,
        size: searchRequest.size,
        total_page: Math.ceil(total / searchRequest.size),
      },
    };
  }

  static async deleteUserBook(id: string, userId: string): Promise<void> {
    const uow = new UnitOfWork();
    const userBook = await uow.userBookRepository.findByIdAndUserId(id, userId);
    if (!userBook) {
      throw new ResponseError(404, "User Book not found");
    }

    if (userBook.bookCoverUrl) {
      const key = userBook.bookCoverUrl.replace(
        "https://yztinhcgnrkiugkbqazc.supabase.co/storage/v1/object/public/cover/",
        ""
      );
      await StorageService.delete(key);
    }

    await uow.userBookRepository.delete(id, userId);
    return;
  }

  static async updateUserBook(
    request: updateUserBook,
    file: Express.Multer.File | undefined,
    id: string
  ): Promise<UserBookResponse> {
    const updateRequest = Validation.validate(
      UserBookValidation.UPDATE,
      request
    );
    const uow = new UnitOfWork();

    let storageInfo: { url: string; key: string } | null = null;
    if (file) {
      storageInfo = await StorageService.upload(file);
      updateRequest.bookCoverUrl = storageInfo.url;
    }

    try {
      const userBook = await uow.userBookRepository.findByIdAndUserId(
        id,
        request.userId
      );
      if (!userBook) {
        throw new ResponseError(404, "User Book not found");
      }

      if (updateRequest.bookTitle) {
        const isTitleExists = await uow.userBookRepository.findByTitleAndUserId(
          updateRequest.bookTitle,
          updateRequest.userId
        );

        if (isTitleExists && isTitleExists.id !== id) {
          throw new ResponseError(401, "Book title already exists");
        }
      }

      if (updateRequest.bookTotalPages) {
        await uow.userBookRepository.updateProgress(
          id,
          userBook.lastRead,
          updateRequest.bookTotalPages
        );
      }

      const book = await uow.userBookRepository.update(
        id,
        request.userId,
        updateRequest
      );
      return toUserBookResponse(book);
    } catch (e) {
      if (storageInfo) {
        await StorageService.delete(storageInfo.key);
      }
      throw e;
    }
  }

  static async getUserBookById(
    id: string,
    userId: string
  ): Promise<UserBookResponse> {
    const uow = new UnitOfWork();
    const userBook = await uow.userBookRepository.findByIdAndUserId(id, userId);
    if (!userBook) {
      throw new ResponseError(404, "User Book not found");
    }
    return toUserBookResponse(userBook);
  }
}
