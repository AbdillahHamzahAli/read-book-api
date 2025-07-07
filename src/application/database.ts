import { PrismaClient, Prisma } from "@prisma/client";
import { logger } from "./logging";

export const prismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

// prismaClient.$on("error", (e) => {
//   logger.error(e);
// });

// prismaClient.$on("warn", (e) => {
//   logger.warn(e);
// });

// prismaClient.$on("info", (e) => {
//   logger.info(e);
// });

// prismaClient.$on("query", (e) => {
//   logger.debug(e);
// });

export type PrismaTransactionClient = Omit<
  Prisma.TransactionClient,
  | "$on"
  | "$connect"
  | "$disconnect"
  | "$use"
  | "$executeRaw"
  | "$queryRaw"
  | "$transaction"
  | "$extends"
>;
