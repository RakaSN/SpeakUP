import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prismaClient: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

const client = globalForPrisma.prismaClient || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaClient = client;

type TransactionClient = Parameters<Parameters<typeof client.$transaction>[0]>[0];

/**
 * Database Abstraction dengan dukungan Transaction Wrapper
 * Membantu memastikan operasi Assignment + Activity + Notification selalu ter-commit bersama
 */
export const db = Object.assign(client, {
  transaction: async <T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> => {
    return await client.$transaction(async (tx) => {
      return await fn(tx);
    });
  },
});
