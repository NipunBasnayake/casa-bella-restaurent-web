import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { verifyPassword } from '@/lib/hashPassword';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { username, password } = await req.json();

    const admin = await Admin.findOne({ username });

    if (admin && verifyPassword(password, admin.passwordHash)) {
      // Create token
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });

      // Create response and set HttpOnly cookie
      const response = NextResponse.json({ success: true }, { status: 200 });
      response.cookies.set({
        name: 'admin_token',
        value: token,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: 'strict',
      });

      return response;
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
