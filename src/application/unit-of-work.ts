import { BookRepository } from "../repository/book-repository";
import { UserBookRepository } from "../repository/userbook-repository";
import { prismaClient, PrismaTransactionClient } from "./database";

export class UnitOfWork {
  public readonly bookRepository: BookRepository;
  public readonly userBookRepository: UserBookRepository;

  constructor() {
    this.bookRepository = new BookRepository(prismaClient);
    this.userBookRepository = new UserBookRepository(prismaClient);
  }

  async execute<T>(
    logic: (uow: {
      bookRepository: BookRepository;
      userBookRepository: UserBookRepository;
    }) => Promise<T>
  ): Promise<T> {
    return prismaClient.$transaction(async (tx) => {
      const transactionalUow = {
        bookRepository: new BookRepository(tx),
        userBookRepository: new UserBookRepository(tx),
      };

      return await logic(transactionalUow);
    });
  }
}
