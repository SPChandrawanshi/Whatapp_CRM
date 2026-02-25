const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

// Prisma 7 requires a driver adapter for direct connections.
// The PrismaMariaDb adapter handles both MySQL and MariaDB.
const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

const prisma = new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
});

module.exports = prisma;
