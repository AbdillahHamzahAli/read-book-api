import { UnitOfWork } from "../application/unit-of-work";
import { ResponseError } from "../error/response-error";
import {
  createReadingSessionRequest,
  readingSessionResponse,
  toReadingSessionResponse,
} from "../model/reading-session-model";
import { ReadingSessionValidation } from "../validation/reading-session-validation";
import { Validation } from "../validation/validation";

export class ReadingSessionService {
  static async createReadingSession(
    request: createReadingSessionRequest,
    userId: string
  ): Promise<readingSessionResponse> {
    const createRequest = Validation.validate(
      ReadingSessionValidation.CREATEREADSESSION,
      request
    );

    const uow = new UnitOfWork();

    const existsUserBook = await uow.userBookRepository.findByIdAndUserId(
      createRequest.userBookId,
      userId
    );

    if (!existsUserBook) {
      throw new ResponseError(404, "User book not found");
    }

    return await uow.execute(async (tx) => {
      const readingSession = await uow.readingSessionRepository.create(
        createRequest
      );

      await tx.userBookRepository.updateProgress(
        existsUserBook.id,
        createRequest.pagesRead
      );

      return toReadingSessionResponse(readingSession);
    });
  }

  static async getReadingSessionsByUserBook(
    idUserBook: string,
    userId: string
  ): Promise<readingSessionResponse[]> {
    const uow = new UnitOfWork();

    const existsUserBook = await uow.userBookRepository.findByIdAndUserId(
      idUserBook,
      userId
    );

    if (!existsUserBook) {
      throw new ResponseError(404, "User book not found");
    }

    const readingSessions = await uow.readingSessionRepository.findByUserBookId(
      idUserBook
    );

    return readingSessions.map(toReadingSessionResponse);
  }

  static async getReadingSessionDetails(
    idUserBook: string,
    idSession: string,
    userId: string
  ): Promise<readingSessionResponse> {
    const uow = new UnitOfWork();

    const existsUserBook = await uow.userBookRepository.findByIdAndUserId(
      idUserBook,
      userId
    );

    if (!existsUserBook) {
      throw new ResponseError(404, "User book not found");
    }

    const readingSession = await uow.readingSessionRepository.findById(
      idSession
    );

    if (!readingSession) {
      throw new ResponseError(404, "Reading session not found");
    }

    return toReadingSessionResponse(readingSession);
  }
}
