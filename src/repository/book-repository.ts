import { Book } from "@prisma/client";
import { PrismaTransactionClient } from "../application/database";
import { addBookRequest, updateBookRequest } from "../model/book-model";

export class BookRepository {
  private readonly prisma: PrismaTransactionClient;

  constructor(prisma: PrismaTransactionClient) {
    this.prisma = prisma;
  }
  async create(data: addBookRequest): Promise<Book> {
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

  async update(data: updateBookRequest): Promise<Book> {
    console.log("updateBookRequest-------------");
    return await this.prisma.book.update({
      where: { id: data.id },
      data: {
        title: data.title,
        author: data.author,
        coverImageUrl: data.cover_image_url,
        totalPages: data.total_pages,
        publishedDate:
          data.published_date !== undefined
            ? data.published_date
              ? new Date(data.published_date)
              : null
            : undefined,
        genre: data.genre,
        description: data.description,
      },
    });
  }

  async findById(id: string): Promise<Book | null> {
    return await this.prisma.book.findUnique({
      where: { id },
    });
  }

  async deleteById(id: string): Promise<Book> {
    return await this.prisma.book.delete({
      where: { id },
    });
  }
}
