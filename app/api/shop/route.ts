import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    // Get user from token
    const token = request.cookies.get('authToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    
    const body = await request.json();
    const { shopName, phoneNumber, address } = body;

    // Validation
    if (!shopName || !phoneNumber) {
      return NextResponse.json(
        { error: 'Shop name and phone number are required' },
        { status: 400 }
      );
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Phone number must be exactly 10 digits' },
        { status: 400 }
      );
    }

    // Check if shop already exists for this user
    const existingShop = await prisma.shop.findUnique({
      where: { userId: decoded.id },
    });

    if (existingShop) {
      return NextResponse.json(
        { error: 'Shop details already exist' },
        { status: 400 }
      );
    }

    // Create shop
    const shop = await prisma.shop.create({
      data: {
        userId: decoded.id,
        shopName,
        phoneNumber,
        address: address || null,
      },
    });

    return NextResponse.json(
      { 
        message: 'Shop details saved successfully',
        shop: {
          id: shop.id,
          shopName: shop.shopName,
          phoneNumber: shop.phoneNumber,
          address: shop.address,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Shop creation error:', error);
    return NextResponse.json(
      { error: 'Failed to save shop details' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user from token
    const token = request.cookies.get('authToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    
    // Get shop details
    const shop = await prisma.shop.findUnique({
      where: { userId: decoded.id },
    });

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop details not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        shop: {
          id: shop.id,
          shopName: shop.shopName,
          phoneNumber: shop.phoneNumber,
          address: shop.address,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Shop fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shop details' },
      { status: 500 }
    );
  }
}
