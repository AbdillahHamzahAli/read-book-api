import { Book, Prisma, UserBook } from "@prisma/client";
import { PrismaTransactionClient } from "../application/database";
import { CreateUserBook } from "../model/userbook-model";

type UserBookWithBook = Prisma.UserBookGetPayload<{
  include: {
    book: true;
  };
}>;

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

  async findByUserId(userId: string): Promise<UserBookWithBook[]> {
    return await this.prisma.userBook.findMany({
      where: { userId },
      include: {
        book: true,
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
            contains: title,
            mode: "insensitive",
          },
        },
      },
      include: {
        book: true,
      },
    });
  }

  async searchAndCount(
    userId: string,
    title: string | undefined,
    take: number,
    skip: number
  ): Promise<[UserBookWithBook[], number]> {
    const whereClause: Prisma.UserBookWhereInput = {
      userId: userId,
    };

    if (title) {
      whereClause.book = {
        title: {
          contains: title,
          mode: "insensitive",
        },
      };
    }

    const [userBooks, total] = await Promise.all([
      this.prisma.userBook.findMany({
        where: whereClause,
        include: { book: true },
        take,
        skip,
      }),
      this.prisma.userBook.count({ where: whereClause }),
    ]);

    return [userBooks, total];
  }

  async findByUserIdAndBookId(
    userId: string,
    bookId: string
  ): Promise<UserBook | null> {
    return await this.prisma.userBook.findFirst({
      where: {
        userId,
        bookId,
      },
    });
  }

  async deleteById(id: string): Promise<UserBook> {
    return await this.prisma.userBook.delete({
      where: { id },
    });
  }

  async findByIdAndUserId(
    id: string,
    userId: string
  ): Promise<UserBook | null> {
    return await this.prisma.userBook.findUnique({
      where: { id, userId },
    });
  }

  async updateProgress(
    userBookId: string,
    progress: number
  ): Promise<UserBook> {
    return await this.prisma.userBook.update({
      where: { id: userBookId },
      data: { progress: { increment: progress } },
    });
  }
}
