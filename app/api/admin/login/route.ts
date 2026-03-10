import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import {
  getAdminCookieOptions,
  isUsingFallbackJwtSecret,
  signAdminToken,
} from '@/lib/adminAuth';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(req: Request) {
  try {
    console.log('Admin login attempt...');

    if (isUsingFallbackJwtSecret()) {
      console.error('WARNING: Using fallback JWT secret. Set JWT_SECRET in .env.local');
    }

    await connectToDatabase();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username and password are required',
        },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    const token = signAdminToken({ role: admin.role, username: admin.username });
    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set({
      name: 'admin_token',
      value: token,
      ...getAdminCookieOptions(),
    });

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Login error:', errorMessage);

    return NextResponse.json(
      {
        success: false,
        message: 'Server error',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
