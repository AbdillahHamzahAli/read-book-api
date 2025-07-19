import { z } from "zod";

export class ReadingSessionValidation {
  static readonly CREATEREADSESSION = z.object({
    userBookId: z.string().min(1, "User Book ID is required"),
    startTime: z.string().datetime({
      offset: true,
      message: "Start time must be a valid date-time string",
    }),
    endTime: z.string().datetime({ offset: true }).optional(),
    pagesRead: z.number().int().min(1).positive(),
    notes: z.string().optional(),
  });

  static readonly UPDATEREADSESSION = z.object({
    notes: z.string().optional(),
    pagesRead: z.number().int().min(1).positive().optional(),
  });
}
