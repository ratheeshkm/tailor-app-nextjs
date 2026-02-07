import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/me
 * Used only to check if the user has a valid auth cookie (e.g. on login page).
 * Does not touch shop, orders, or any other data.
 * Returns 200 if authenticated (middleware already verified the token).
 * Unauthenticated requests never reach this handler; middleware returns 401.
 */
export async function GET() {
  return NextResponse.json({ ok: true });
}
