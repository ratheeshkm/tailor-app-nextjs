import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

const publicRoutes = ['/', '/login', '/signup'];
const apiPublicRoutes = ['/api/auth/login', '/api/auth/signup', '/api/health', '/api/auth/check-username'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicApi = apiPublicRoutes.some(route => pathname.startsWith(route));
  if (isPublicApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get('authToken')?.value;

  // If logged in and visiting login/home, redirect to dashboard
  if ((pathname === '/' || pathname === '/login') && token) {
    try {
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch {
      // Invalid token, allow through to login
    }
  }

  // Check if it's a public route (exact match for '/', startsWith for others)
  const isPublicRoute = pathname === '/' || publicRoutes.slice(1).some(route => pathname.startsWith(route));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!token) {
    // If it's an API route, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // If it's a page, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token
  try {
    await jwtVerify(token, secret);
    const response = NextResponse.next();
    // Prevent caching of protected pages
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    // Invalid token
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon-|manifest.json|sw.js|stitching-favicon\\.svg).*)',
  ],
};
