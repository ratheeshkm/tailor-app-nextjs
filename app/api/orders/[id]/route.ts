import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// Prevent static generation for this API route
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Validate required fields
    const updateData: Record<string, unknown> = {};

    if (data.clothType !== undefined) {
      updateData.clothType = data.clothType;
    }
    if (data.stitchingType !== undefined) {
      updateData.stitchingType = data.stitchingType;
    }
    if (data.measurementsGiven !== undefined) {
      updateData.measurementsGiven = data.measurementsGiven;
    }
    if (data.numberOfItems !== undefined) {
      updateData.numberOfItems = parseInt(data.numberOfItems);
    }
    if (data.charge !== undefined) {
      updateData.charge = parseFloat(data.charge);
    }
    if (data.deliveryDate !== undefined) {
      updateData.deliveryDate = data.deliveryDate;
    }
    if (data.waist !== undefined) {
      updateData.waist = data.waist;
    }
    if (data.length !== undefined) {
      updateData.length = data.length;
    }
    if (data.shoulderWidth !== undefined) {
      updateData.shoulderWidth = data.shoulderWidth;
    }
    if (data.chest !== undefined) {
      updateData.chest = data.chest;
    }
    if (data.hip !== undefined) {
      updateData.hip = data.hip;
    }
    if (data.bicep !== undefined) {
      updateData.bicep = data.bicep;
    }
    if (data.neck !== undefined) {
      updateData.neck = data.neck;
    }
    if (data.collar !== undefined) {
      updateData.collar = data.collar;
    }
    if (data.sleeve !== undefined) {
      updateData.sleeve = data.sleeve;
    }
    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }
    if (data.measurementImages !== undefined) {
      updateData.measurementImages = data.measurementImages;
    }
    if (data.clothImages !== undefined) {
      updateData.clothImages = data.clothImages;
    }

    // Update order
    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        customer: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const order = await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
