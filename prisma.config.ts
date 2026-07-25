import 'dotenv/config';

const prismaConfig = {
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};

export default prismaConfig;
