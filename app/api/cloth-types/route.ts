import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const clothTypes = await prisma.clothType.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(clothTypes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cloth types' }, { status: 500 });
  }
}
