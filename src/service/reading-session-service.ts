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
      const readingSession = await tx.readingSessionRepository.create(
        createRequest
      );

      const totalPageRead = await tx.readingSessionRepository.getTotalPagesRead(
        createRequest.userBookId
      );

      await tx.userBookRepository.updateProgress(
        existsUserBook.id,
        totalPageRead,
        existsUserBook.bookTotalPages
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

    return uow.execute(async (tx) => {
      const updatedSession = await uow.readingSessionRepository.update(
        updateRequest,
        idSession
      );

      const totalPageRead =
        await uow.readingSessionRepository.getTotalPagesRead(idUserBook);

      await tx.userBookRepository.updateProgress(
        existsUserBook.id,
        totalPageRead,
        existsUserBook.bookTotalPages
      );

      return toReadingSessionResponse(updatedSession);
    });
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

    uow.execute(async (tx) => {
      await tx.readingSessionRepository.delete(idSession);
      const totalPageRead = await tx.readingSessionRepository.getTotalPagesRead(
        idUserBook
      );

      console.log(totalPageRead);

      await tx.userBookRepository.updateProgress(
        existsUserBook.id,
        totalPageRead,
        existsUserBook.bookTotalPages
      );
    });
    return;
  }
}
