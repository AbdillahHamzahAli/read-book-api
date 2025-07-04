import { z, ZodType } from "zod";

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["ADMIN", "USER"]).default("USER"),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });
}
