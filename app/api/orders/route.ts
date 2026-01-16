import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Prevent static generation for this API route
export const dynamic = 'force-dynamic';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    let data: Record<string, unknown> = {};

    if (contentType?.includes('application/json')) {
      data = await request.json();
    } else if (contentType?.includes('multipart/form-data') || contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      
      // Convert FormData to object
      data = {
        customerId: formData.get('customerId'),
        clothType: formData.get('clothType'),
        stitchingType: formData.get('stitchingType'),
        measurementsGiven: formData.get('measurementsGiven'),
        numberOfItems: formData.get('numberOfItems'),
        charge: formData.get('charge'),
        deliveryDate: formData.get('deliveryDate'),
        waist: formData.get('waist'),
        length: formData.get('length'),
      };

      // Collect all image files
      const clothImages: File[] = [];
      const measurementImages: File[] = [];

      formData.forEach((value, key) => {
        if (key.startsWith('clothImage_')) {
          clothImages.push(value as File);
        } else if (key.startsWith('measurementImage_')) {
          measurementImages.push(value as File);
        }
      });

      data.clothImages = clothImages;
      data.measurementImages = measurementImages;
    } else {
      data = await request.json();
    }

    console.log('Received data:', {
      customerId: data.customerId,
      clothType: data.clothType,
      stitchingType: data.stitchingType,
      measurementsGiven: data.measurementsGiven,
      numberOfItems: data.numberOfItems,
      charge: data.charge,
      deliveryDate: data.deliveryDate,
    });

    // Validate required fields
    const customerId = data.customerId ? parseInt(String(data.customerId)) : null;
    const clothType = data.clothType?.toString().trim();
    const stitchingType = data.stitchingType?.toString().trim();
    const measurementsGiven = data.measurementsGiven?.toString().trim();
    const numberOfItems = data.numberOfItems ? parseInt(String(data.numberOfItems)) : null;
    const charge = data.charge !== null && data.charge !== undefined ? parseFloat(String(data.charge)) : null;
    const deliveryDate = data.deliveryDate?.toString().trim();
    
    // Optional fields
    const waist = data.waist?.toString().trim() || null;
    const length = data.length?.toString().trim() || null;

    if (!customerId || !clothType || !stitchingType || !measurementsGiven || !numberOfItems || charge === null || !deliveryDate) {
      console.error('Validation failed:', {
        customerId,
        clothType,
        stitchingType,
        measurementsGiven,
        numberOfItems,
        charge,
        deliveryDate,
      });

      return NextResponse.json(
        { error: 'Missing required fields', details: { customerId, clothType, stitchingType, measurementsGiven, numberOfItems, charge, deliveryDate } },
        { status: 400 }
      );
    }

    try {
      // Create order
      const order = await prisma.order.create({
        data: {
          customerId,
          clothType,
          stitchingType,
          measurementsGiven,
          numberOfItems,
          charge,
          deliveryDate,
          waist,
          length,
        },
        include: {
          customer: true,
        },
      });

      return NextResponse.json(order, { status: 201 });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error', details: dbError instanceof Error ? dbError.message : 'Unknown database error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const orders = await prisma.order.findMany({
      include: {
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
