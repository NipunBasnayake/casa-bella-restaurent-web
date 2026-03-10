import jwt, { type JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const FALLBACK_JWT_SECRET = 'fallback_secret';

export interface AdminTokenPayload extends JwtPayload {
  role?: string;
  username?: string;
}

export function getJwtSecret(): string {
  return process.env.JWT_SECRET || FALLBACK_JWT_SECRET;
}

export function isUsingFallbackJwtSecret(): boolean {
  return !process.env.JWT_SECRET;
}

export function signAdminToken(payload: { role: string; username: string }): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '1d' });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as AdminTokenPayload;
  } catch {
    return null;
  }
}

export async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    return null;
  }

  const payload = verifyAdminToken(token);
  if (!payload || payload.role !== 'admin') {
    return null;
  }

  return {
    role: payload.role,
    username: typeof payload.username === 'string' ? payload.username : undefined,
  };
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
  };
}
