import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import jwt from 'jsonwebtoken';

// Prevent static generation for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    // Get user ID from JWT token
    const token = request.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    const customers = await prisma.customer.findMany({
      where: {
        userId: decoded.id,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
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

    // Get user ID from JWT token
    const token = request.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    await prisma.$connect();
    const customer = await prisma.customer.create({
      data: {
        userId: decoded.id,
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