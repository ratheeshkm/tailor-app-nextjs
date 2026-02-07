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
      updateData.clothType = typeof data.clothType === 'string' ? data.clothType : String(data.clothType);
    }
    if (data.stitchingType !== undefined) {
      updateData.stitchingType = data.stitchingType;
    }
    if (data.measurementsGiven !== undefined) {
      updateData.measurementsGiven = data.measurementsGiven;
    }
    if (data.numberOfItems !== undefined) {
      const num = parseInt(String(data.numberOfItems), 10);
      if (!isNaN(num) && num >= 1) updateData.numberOfItems = num;
    }
    if (data.charge !== undefined) {
      const charge = parseFloat(String(data.charge));
      if (!isNaN(charge) && charge >= 0) updateData.charge = charge;
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
    const statusValue =
      data.status !== undefined
        ? (['pending', 'completed', 'delivered'].includes(String(data.status).toLowerCase())
            ? String(data.status).toLowerCase()
            : undefined)
        : undefined;
    if (statusValue !== undefined) {
      updateData.status = statusValue;
    }

    let order;
    try {
      order = await prisma.order.update({
        where: { id: orderId },
        data: updateData,
        include: {
          customer: true,
        },
      });
    } catch (updateError) {
      const errMsg = updateError instanceof Error ? updateError.message : String(updateError);
      const isStatusColumnError =
        updateData.status !== undefined &&
        (errMsg.includes('status') || errMsg.includes('column') || errMsg.includes('does not exist') || errMsg.includes('Unknown arg'));
      if (isStatusColumnError) {
        delete updateData.status;
        order = await prisma.order.update({
          where: { id: orderId },
          data: updateData,
          include: {
            customer: true,
          },
        });
      } else {
        throw updateError;
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    const isSchemaError =
      errMsg.includes('status') ||
      errMsg.includes('column') ||
      errMsg.includes('does not exist') ||
      errMsg.includes('Unknown arg');
    return NextResponse.json(
      {
        error: 'Failed to update order',
        details: errMsg,
        hint: isSchemaError
          ? 'Run "npx prisma migrate deploy" to add the status column, then "npx prisma generate".'
          : undefined,
      },
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
