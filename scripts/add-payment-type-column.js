/**
 * Adds the paymentType column to the Order table if it doesn't exist.
 * Run with: node scripts/add-payment-type-column.js
 * Or apply the migration: npx prisma migrate deploy
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentType" TEXT NOT NULL DEFAULT \'Cash\''
    );
    console.log('PaymentType column added successfully (or already exists).');
  } catch (error) {
    if (error.message?.includes('already exists')) {
      console.log('PaymentType column already exists.');
    } else {
      console.error('Error:', error.message);
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
