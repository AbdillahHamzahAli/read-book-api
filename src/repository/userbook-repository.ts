import { UserBook } from "@prisma/client";
import { PrismaTransactionClient } from "../application/database";
import { createUserBook } from "../model/userbook-model";

export class UserBookRepository {
  private readonly prisma: PrismaTransactionClient;
  constructor(prisma: PrismaTransactionClient) {
    this.prisma = prisma;
  }

  async findByTitleAndUserId(
    title: string,
    userId: string
  ): Promise<UserBook | null> {
    return this.prisma.userBook.findFirst({
      where: { userId, bookTitle: title },
    });
  }

  async createUserBook(data: createUserBook): Promise<UserBook> {
    return this.prisma.userBook.create({
      data: data,
    });
  }

  async searchAndCount(
    title: string = "",
    skip: number,
    size: number,
    userId: string
  ): Promise<{
    data: UserBook[];
    total: number;
  }> {
    if (title === "") {
      title = "%%";
    }
    const total = await this.prisma.userBook.count({
      where: {
        userId,
        bookTitle: {
          contains: title,
        },
      },
    });
    const data = await this.prisma.userBook.findMany({
      where: {
        userId,
        bookTitle: {
          contains: title,
          mode: "insensitive",
        },
      },
      skip,
      take: size,
    });
    return { data, total };
  }

  async findByIdAndUserId(
    id: string,
    userId: string
  ): Promise<UserBook | null> {
    return this.prisma.userBook.findFirst({
      where: { id, userId },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.userBook.delete({
      where: { id, userId },
    });
  }

  async update(
    id: string,
    userId: string,
    data: Partial<UserBook>
  ): Promise<UserBook> {
    return this.prisma.userBook.update({
      where: { id, userId },
      data,
    });
  }

  async updateProgress(
    id: string,
    pagesRead: number,
    totalPages: number
  ): Promise<UserBook> {
    return this.prisma.userBook.update({
      where: { id },
      data: {
        lastRead: pagesRead,
        progress: Math.floor((pagesRead / totalPages) * 100),
      },
    });
  }
}
