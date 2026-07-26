import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prismaClient: PrismaClient };

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

function getPrismaClient(): PrismaClient {
  if (
    globalForPrisma.prismaClient &&
    'aiTelemetryLog' in globalForPrisma.prismaClient &&
    'aiRecommendation' in globalForPrisma.prismaClient
  ) {
    return globalForPrisma.prismaClient;
  }
  const freshClient = createPrismaClient();
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prismaClient = freshClient;
  }
  return freshClient;
}

export const prismaClient = getPrismaClient();

type TransactionClient = Parameters<Parameters<typeof prismaClient.$transaction>[0]>[0];

export type ExtendedPrismaClient = PrismaClient & {
  transaction: <T>(fn: (tx: TransactionClient) => Promise<T>) => Promise<T>;
};

/**
 * Database Abstraction dengan dukungan Transaction Wrapper
 * Membantu memastikan operasi Assignment + Activity + Notification selalu ter-commit bersama
 */
export const db: ExtendedPrismaClient = Object.assign(prismaClient, {
  transaction: async <T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> => {
    return await prismaClient.$transaction(async (tx) => {
      return await fn(tx);
    });
  },
});
