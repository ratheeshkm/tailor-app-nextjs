'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/app/lib/prisma';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface LoginResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export async function loginAction(formData: FormData): Promise<LoginResult> {
  // Server Actions may serialize form fields with prefixes (e.g. 1_username, 1_password)
  const username = (formData.get('username') ?? formData.get('1_username') ?? '') as string;
  const password = (formData.get('password') ?? formData.get('1_password') ?? '') as string;

  // Validate
  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' };
  }

  if (!password) {
    return { success: false, error: 'Password is required' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { shop: true },
    });

    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid username or password' };
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === 'production';
    cookieStore.set('authToken', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const redirectTo = user.shop ? '/dashboard' : '/shop-setup';
    return { success: true, redirectTo };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred. Please try again.' };
  }
}
