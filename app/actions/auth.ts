'use server';

import { cookies } from 'next/headers';

interface LoginResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // Validate
  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' };
  }

  if (!password) {
    return { success: false, error: 'Password is required' };
  }

  try {
    // Call the login API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Login failed' };
    }

    const result = await response.json();

    // Set the auth cookie
    const cookieStore = await cookies();
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      // Parse the set-cookie header and set it
      const tokenMatch = setCookieHeader.match(/authToken=([^;]+)/);
      if (tokenMatch) {
        cookieStore.set('authToken', tokenMatch[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }
    }

    // Determine redirect
    const redirectTo = result.hasShop ? '/dashboard' : '/shop-setup';

    return { success: true, redirectTo };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred. Please try again.' };
  }
}
