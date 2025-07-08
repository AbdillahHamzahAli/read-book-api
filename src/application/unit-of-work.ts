import { BookRepository } from "../repository/book-repository";
import { ReadingSessionRepository } from "../repository/reading-session-repository";
import { UserBookRepository } from "../repository/userbook-repository";
import { prismaClient, PrismaTransactionClient } from "./database";

export class UnitOfWork {
  public readonly bookRepository: BookRepository;
  public readonly userBookRepository: UserBookRepository;
  public readonly readingSessionRepository: ReadingSessionRepository;

  constructor() {
    this.bookRepository = new BookRepository(prismaClient);
    this.userBookRepository = new UserBookRepository(prismaClient);
    this.readingSessionRepository = new ReadingSessionRepository(prismaClient);
  }

  async execute<T>(
    logic: (uow: {
      bookRepository: BookRepository;
      userBookRepository: UserBookRepository;
      readingSessionRepository: ReadingSessionRepository;
    }) => Promise<T>
  ): Promise<T> {
    return prismaClient.$transaction(async (tx) => {
      const transactionalUow = {
        bookRepository: new BookRepository(tx),
        userBookRepository: new UserBookRepository(tx),
        readingSessionRepository: new ReadingSessionRepository(tx),
      };

      return await logic(transactionalUow);
    });
  }
}
