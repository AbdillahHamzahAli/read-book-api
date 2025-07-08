import {
  createReadingSessionRequest,
  updateReadingSessionRequest,
} from "../model/reading-session-model";
import { PrismaTransactionClient } from "../application/database";
import { ReadingSession } from "@prisma/client";
import { updateBookRequest } from "../model/book-model";

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

  async updateNotes(
    data: updateReadingSessionRequest,
    id: string
  ): Promise<ReadingSession> {
    return this.prisma.readingSession.update({
      where: { id },
      data: {
        notes: data.notes,
      },
    });
  }

  async delete(id: string): Promise<ReadingSession> {
    return this.prisma.readingSession.delete({
      where: { id },
    });
  }
}
