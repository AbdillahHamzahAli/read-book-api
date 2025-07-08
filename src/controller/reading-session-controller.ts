import { updateBookRequest } from "../model/book-model";
import {
  createReadingSessionRequest,
  updateReadingSessionRequest,
} from "../model/reading-session-model";
import { ReadingSessionService } from "../service/reading-session-service";
import { UserRequest } from "../type/user-request";
import { Response, NextFunction } from "express";

export class ReadingSessionController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: createReadingSessionRequest =
        req.body as createReadingSessionRequest;
      request.userBookId = req.params.idUserBook;

      const data = await ReadingSessionService.createReadingSession(
        request,
        req.user!.id
      );

      res.status(201).json({
        status: "success",
        data: {
          reading_session: data,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async getAllByUserBook(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { idUserBook } = req.params;

      const data = await ReadingSessionService.getReadingSessionsByUserBook(
        idUserBook,
        req.user!.id
      );

      res.status(200).json({
        status: "success",
        data: {
          reading_sessions: data,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async getDetails(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const { idUserBook, idSession } = req.params;

      const data = await ReadingSessionService.getReadingSessionDetails(
        idUserBook,
        idSession,
        req.user!.id
      );

      res.status(200).json({
        status: "success",
        data: {
          reading_session: data,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const { idUserBook, idSession } = req.params;
      const request: updateReadingSessionRequest =
        req.body as updateReadingSessionRequest;

      const updatedSession = await ReadingSessionService.update(
        request,
        idUserBook,
        idSession,
        req.user!.id
      );

      res.status(200).json({
        status: "success",
        data: {
          reading_session: updatedSession,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const { idUserBook, idSession } = req.params;

      await ReadingSessionService.delete(idUserBook, idSession, req.user!.id);

      res.status(200).json({
        status: "success",
        data: "deleted",
      });
    } catch (e) {
      next(e);
    }
  }
}
