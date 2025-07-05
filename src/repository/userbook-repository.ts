import { UserBook } from "@prisma/client";
import { PrismaTransactionClient } from "../application/database";
import { CreateUserBook } from "../model/userbook-model";

export class UserBookRepository {
  private readonly prisma: PrismaTransactionClient;

  constructor(prisma: PrismaTransactionClient) {
    this.prisma = prisma;
  }

  async create(data: CreateUserBook): Promise<UserBook> {
    return await this.prisma.userBook.create({
      data: {
        userId: data.userId,
        bookId: data.bookId,
        startDate: new Date(),
        progress: 0,
      },
    });
  }

  async findByUserIdAndTitle(
    userId: string,
    title: string
  ): Promise<UserBook | null> {
    return await this.prisma.userBook.findFirst({
      where: {
        userId,
        book: {
          title: {
            equals: title.replace(/\s+/g, "").toLowerCase(),
            mode: "insensitive",
          },
        },
      },
      include: {
        book: true,
      },
    });
  }
}
