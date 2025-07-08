import { ReadingSession } from "@prisma/client";

export type createReadingSessionRequest = {
  userBookId: string;
  startTime: string;
  endTime?: string;
  pagesRead: number;
  notes?: string;
};

export type readingSessionResponse = {
  id: string;
  userBookId: string;
  startTime: Date;
  endTime: Date | null;
  pagesRead: number | null;
  notes: string | null;
};

export type updateReadingSessionRequest = {
  notes?: string;
};

export function toReadingSessionResponse(
  data: ReadingSession
): readingSessionResponse {
  return {
    id: data.id,
    userBookId: data.userBookId,
    startTime: data.startTime,
    endTime: data.endTime ? new Date(data.endTime) : null,
    pagesRead: data.pagesRead,
    notes: data.notes,
  };
}
