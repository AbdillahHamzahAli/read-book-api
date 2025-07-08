import { NextFunction, Request, Response } from "express";
import {
  addBookRequest,
  searchBookRequest,
  updateBookRequest,
} from "../model/book-model";
import { UserRequest } from "../type/user-request";
import { BookService } from "../service/book-service";

export class BookController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: addBookRequest = req.body as addBookRequest;
      request.user_id = req.user!.id;
      request.cover_image_url = undefined;
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

  static async search(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: searchBookRequest = {
        title: req.query.title as string,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
      };

      const books = await BookService.searchBooks(request, req.user!.id);

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

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: updateBookRequest = req.body as updateBookRequest;
      request.cover_image_url = undefined;
      request.id = req.params.id;
      if (request.total_pages) {
        request.total_pages = parseInt(request.total_pages as any, 10);
      }

      const respose = await BookService.updateBook(
        request,
        req.file,
        req.user!.id
      );
      res.status(200).json({
        status: "success",
        data: {
          book: respose,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const bookId = req.params.id;
      const userId = req.user!.id;

      await BookService.deleteBook(bookId, userId);

      res.status(200).json({
        status: "success",
        message: "Book deleted successfully",
      });
    } catch (e) {
      next(e);
    }
  }

  static async getById(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const bookId = req.params.id;
      const userId = req.user!.id;

      const response = await BookService.getBookById(bookId, userId);

      res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
