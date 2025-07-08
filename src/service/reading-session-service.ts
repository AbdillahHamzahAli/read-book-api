import e from "cors";
import { UnitOfWork } from "../application/unit-of-work";
import { ResponseError } from "../error/response-error";
import {
  createReadingSessionRequest,
  readingSessionResponse,
  toReadingSessionResponse,
  updateReadingSessionRequest,
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
    if (!existsUserBook) throw new ResponseError(404, "User book not found");

    return uow.execute(async (tx) => {
      const readingSession = await uow.readingSessionRepository.create(
        createRequest
      );

      await tx.userBookRepository.updateProgress(
        existsUserBook.id,
        createRequest.pagesRead + (existsUserBook.lastRead ?? 0),
        existsUserBook.book.totalPages ?? 0
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

  static async update(
    data: updateReadingSessionRequest,
    idUserBook: string,
    idSession: string,
    userId: string
  ): Promise<readingSessionResponse> {
    const updateRequest = Validation.validate(
      ReadingSessionValidation.UPDATEREADSESSION,
      data
    );

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

    if (readingSession.userBookId !== idUserBook) {
      throw new ResponseError(
        403,
        "You do not have permission to update this session"
      );
    }

    const updatedSession = await uow.readingSessionRepository.updateNotes(
      updateRequest,
      idSession
    );

    return toReadingSessionResponse(updatedSession);
  }

  static async delete(
    idUserBook: string,
    idSession: string,
    userId: string
  ): Promise<void> {
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

    if (readingSession.userBookId !== idUserBook) {
      throw new ResponseError(
        403,
        "You do not have permission to delete this session"
      );
    }

    await uow.readingSessionRepository.delete(idSession);
    await uow.userBookRepository.updateProgress(
      idUserBook,
      (existsUserBook.lastRead ?? 0) - (readingSession.pagesRead ?? 0),
      existsUserBook.book.totalPages ?? 0
    );

    return;
  }
}
