import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prismaClientSingleton = () => {
  let dbUrl = process.env.DATABASE_URL;

  // Workaround for SQLite on Vercel: copy database to writeable /tmp folder
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const tmpDbPath = '/tmp/dev.db';

    try {
      if (!fs.existsSync(tmpDbPath)) {
        console.log(`Copying database from ${dbPath} to ${tmpDbPath}...`);
        fs.copyFileSync(dbPath, tmpDbPath);
        console.log('Database copied successfully to /tmp.');
      } else {
        console.log('Database already exists in /tmp.');
      }
    } catch (err) {
      console.error('Failed to copy database to /tmp:', err);
    }

    dbUrl = 'file:/tmp/dev.db';
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });
};

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
