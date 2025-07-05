import { NextFunction, Request, Response } from "express";
import { AddBookRequest } from "../model/book-model";
import { UserRequest } from "../type/user-request";
import { BookService } from "../service/book-service";

export class BookController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: AddBookRequest = req.body as AddBookRequest;
      request.user_id = req.user!.id;

      const data = await BookService.addBook(request);

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
}
