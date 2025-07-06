import { NextFunction, Request, Response } from "express";
import { AddBookRequest } from "../model/book-model";
import { UserRequest } from "../type/user-request";
import { BookService } from "../service/book-service";

export class BookController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: AddBookRequest = req.body as AddBookRequest;
      request.user_id = req.user!.id;
      request.total_pages = parseInt(request.total_pages as any, 10);

      const data = await BookService.addBook(request, req.file);

      res.status(201).json({
        status: "success",
        data: {
          book: data,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async getAll(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const books = await BookService.getAllBooks(userId);

      res.status(200).json({
        status: "success",
        data: {
          books,
        },
      });
    } catch (e) {
      next(e);
    }
  }
}
