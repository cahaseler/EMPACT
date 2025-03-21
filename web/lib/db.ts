// NOTE: Change this path to that of a different datbasae provider such as postgres if needed.

import { PrismaClient } from "@/prisma/mssql/generated/client"

export type * as PrismaClient from "@/prisma/mssql/generated/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
