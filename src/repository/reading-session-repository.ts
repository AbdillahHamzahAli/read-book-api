import {
  createReadingSessionRequest,
  updateReadingSessionRequest,
} from "../model/reading-session-model";
import { PrismaTransactionClient } from "../application/database";
import { ReadingSession } from "@prisma/client";

export class ReadingSessionRepository {
  private readonly prisma: PrismaTransactionClient;
  constructor(prisma: PrismaTransactionClient) {
    this.prisma = prisma;
  }

  async create(data: createReadingSessionRequest) {
    return this.prisma.readingSession.create({
      data: {
        userBookId: data.userBookId,
        startTime: new Date(data.startTime),
        endTime: data.endTime ? new Date(data.endTime) : null,
        pagesRead: data.pagesRead,
        notes: data.notes,
      },
    });
  }

  async getTotalPagesRead(userBookId: string): Promise<number> {
    const result = await this.prisma.readingSession.aggregate({
      where: { userBookId },
      _sum: {
        pagesRead: true,
      },
    });
    return result._sum.pagesRead || 0;
  }

  async findById(id: string): Promise<ReadingSession | null> {
    return this.prisma.readingSession.findUnique({
      where: { id },
    });
  }

  async findByUserBookId(userBookId: string): Promise<ReadingSession[]> {
    return this.prisma.readingSession.findMany({
      where: { userBookId },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(
    data: updateReadingSessionRequest,
    id: string
  ): Promise<ReadingSession> {
    return this.prisma.readingSession.update({
      where: { id },
      data: {
        notes: data.notes,
        pagesRead: data.pagesRead,
      },
    });
  }

  async delete(id: string): Promise<ReadingSession> {
    return this.prisma.readingSession.delete({
      where: { id },
    });
  }
}
