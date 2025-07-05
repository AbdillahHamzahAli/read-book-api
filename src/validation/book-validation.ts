import { z, ZodType } from "zod";

export class BookValidation {
  static readonly ADDBOOK: ZodType = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    cover_image_url: z.string().url().optional(),
    total_pages: z.number().int().positive().optional(),
    published_date: z.string().optional(),
    genre: z.string().optional(),
    description: z.string().optional(),
    user_id: z.string().min(1),
  });
}
