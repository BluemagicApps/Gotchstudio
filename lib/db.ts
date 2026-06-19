import { PrismaClient } from "@prisma/client";

/**
 * Lazily-instantiated, globally-cached Prisma client.
 *
 * Lazy so importing this module never connects at build time (route handlers are
 * dynamic; the client is created on first query at runtime). Cached on
 * globalThis so Next.js dev hot-reload doesn't open a new pool on every reload.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
}
