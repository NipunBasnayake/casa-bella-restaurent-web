import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/adminAuth';
import { sendReservationRejectedEmail } from '@/lib/email';
import connectToDatabase from '@/lib/mongodb';
import Reservation from '@/models/Reservation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  void request;

  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { id } = await params;

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    );

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    const emailResult = await sendReservationRejectedEmail({
      customerName: reservation.customerName,
      email: reservation.email,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
    });

    if (!emailResult.sent && emailResult.reason) {
      console.warn(emailResult.reason);
    }

    return NextResponse.json(
      {
        reservation,
        emailSent: emailResult.sent,
        emailWarning: emailResult.reason ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to reject reservation',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
