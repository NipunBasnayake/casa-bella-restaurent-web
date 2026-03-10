import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/adminAuth';
import connectToDatabase from '@/lib/mongodb';
import Reservation from '@/models/Reservation';

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const reservations = await Reservation.find({}).sort({ createdAt: -1 });
    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to fetch reservations',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { customerName, email, phone, date, time, guests, specialRequest } = body;
    const guestsNumber = Number(guests);

    if (
      !customerName ||
      !email ||
      !phone ||
      !date ||
      !time ||
      Number.isNaN(guestsNumber)
    ) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['customerName', 'email', 'phone', 'date', 'time', 'guests'],
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (!Number.isInteger(guestsNumber) || guestsNumber < 1 || guestsNumber > 20) {
      return NextResponse.json(
        {
          error: 'Number of guests must be between 1 and 20',
        },
        { status: 400 }
      );
    }

    const newReservation = await Reservation.create({
      customerName,
      email,
      phone,
      date,
      time,
      guests: guestsNumber,
      specialRequest: specialRequest || '',
      status: 'pending',
    });

    return NextResponse.json(newReservation, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to create reservation',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
