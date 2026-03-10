import { NextResponse } from 'next/server';
import { getAdminCookieOptions } from '@/lib/adminAuth';

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set({
    name: 'admin_token',
    value: '',
    ...getAdminCookieOptions(),
    maxAge: 0,
  });
  return response;
}
