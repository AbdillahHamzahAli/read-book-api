import {
  createUserBook,
  searchUserBook,
  updateUserBook,
} from "../model/userbook-model";
import { UserBookService } from "../service/userbook-service";
import { UserRequest } from "../type/user-request";
import { Response, NextFunction } from "express";
export class UserBookController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: createUserBook = req.body as createUserBook;
      request.userId = req.user!.id;
      request.bookCoverUrl = undefined;
      request.bookTotalPages = parseInt(request.bookTotalPages as any, 10);

      const response = await UserBookService.addUserBokk(request, req.file);
      res.status(201).json({
        status: "success",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
  static async search(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: searchUserBook = {
        title: req.query.title as string,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
      };

      const response = await UserBookService.searchUserBook(
        request,
        req.user!.id
      );

      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserBookService.deleteUserBook(
        req.params.id,
        req.user!.id
      );
      res.status(200).json({
        status: "success",
        data: "OK",
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: updateUserBook = req.body as updateUserBook;
      request.userId = req.user!.id;
      if (request.bookTotalPages) {
        request.bookTotalPages = parseInt(request.bookTotalPages as any, 10);
      }
      if (request.rating) {
        request.rating = parseInt(request.rating as any, 10);
      }
      request.bookCoverUrl = undefined;
      const response = await UserBookService.updateUserBook(
        request,
        req.file,
        req.params.id
      );

      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getById(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserBookService.getUserBookById(
        req.params.id,
        req.user!.id
      );
      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
