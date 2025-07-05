import { Book } from "@prisma/client";
import { PrismaTransactionClient } from "../application/database";
import { AddBookRequest } from "../model/book-model";

export class BookRepository {
  private readonly prisma: PrismaTransactionClient;

  constructor(prisma: PrismaTransactionClient) {
    this.prisma = prisma;
  }
  async create(data: AddBookRequest): Promise<Book> {
    return await this.prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        coverImageUrl: data.cover_image_url,
        totalPages: data.total_pages,
        publishedDate: data.published_date
          ? new Date(data.published_date)
          : null,
        genre: data.genre,
        description: data.description,
      },
    });
  }

  async findByTitle(title: string): Promise<Book | null> {
    return await this.prisma.book.findFirst({
      where: {
        title: {
          equals: title.replace(/\s+/g, "").toLowerCase(),
          mode: "insensitive",
        },
      },
    });
  }
}
