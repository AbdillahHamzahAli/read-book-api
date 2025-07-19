import { z, ZodType } from "zod";

export class UserBookValidation {
  static readonly ADDBOOK: ZodType = z.object({
    bookTitle: z.string().min(1, "Title is required"),
    bookAuthor: z.string().min(1).optional(),
    bookTotalPages: z.number().int().positive(),
    bookPublishedDate: z.string().optional(),
    bookGenre: z.string().optional(),
    bookDescription: z.string().optional(),
    userId: z.string().min(1),
  });

  static readonly SEARCH: ZodType = z.object({
    title: z.string().optional(),
    page: z.number().int().positive(),
    size: z.number().int().positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    bookTitle: z.string().min(1, "Title is required").optional(),
    bookAuthor: z.string().min(1).optional(),
    bookTotalPages: z.number().int().positive().optional(),
    bookPublishedDate: z.string().optional(),
    bookGenre: z.string().optional(),
    bookDescription: z.string().optional(),
    userId: z.string().min(1),
    rating: z.number().min(1).max(5).optional(),
    review: z.string().optional(),
  });
}
