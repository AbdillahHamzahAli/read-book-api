import { ReadingSessionRepository } from "../repository/reading-session-repository";
import { UserBookRepository } from "../repository/userbook-repository";
import { prismaClient } from "./database";

export class UnitOfWork {
  public readonly userBookRepository: UserBookRepository;
  public readonly readingSessionRepository: ReadingSessionRepository;

  constructor() {
    this.userBookRepository = new UserBookRepository(prismaClient);
    this.readingSessionRepository = new ReadingSessionRepository(prismaClient);
  }

  async execute<T>(
    logic: (uow: {
      userBookRepository: UserBookRepository;
      readingSessionRepository: ReadingSessionRepository;
    }) => Promise<T>
  ): Promise<T> {
    return prismaClient.$transaction(async (tx) => {
      const transactionalUow = {
        userBookRepository: new UserBookRepository(tx),
        readingSessionRepository: new ReadingSessionRepository(tx),
      };

      return await logic(transactionalUow);
    });
  }
}
