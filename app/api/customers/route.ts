import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Check if database is configured
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
}

export async function GET() {
  try {
    await prisma.$connect();
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Database connection failed. Please check your database configuration.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, mobile } = await request.json();

    if (!name || !mobile) {
      return NextResponse.json({ error: 'Name and mobile are required' }, { status: 400 });
    }

    // Validate mobile number (basic validation)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json({ error: 'Invalid mobile number. Must be 10 digits.' }, { status: 400 });
    }

    await prisma.$connect();
    const customer = await prisma.customer.create({
      data: {
        name,
        mobile,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    if (error instanceof Error && error.message.includes('connect')) {
      return NextResponse.json({ error: 'Database connection failed. Please check your database configuration.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}