import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import nodemailer from 'nodemailer';
import { cookies } from 'next/headers';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } | any
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;

  try {
    await connectToDatabase();
    
    // 1. Update the Reservation to rejected status
    const reservation = await Reservation.findByIdAndUpdate(
      resolvedParams.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    // 2. Set up Nodemailer to send to the customer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Casa Bella Reservations" <${process.env.EMAIL_USER}>`,
      to: reservation.email,
      subject: 'Casa Bella Ristorante - Reservation Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #D4AF37;">Casa Bella Ristorante</h2>
          <h3>Reservation Update</h3>
          <p>Dear ${reservation.name},</p>
          <p>We regret to inform you that we are unable to accommodate your reservation request for ${reservation.guests} people on ${reservation.date} at ${reservation.time}.</p>
          <p>We apologize for any inconvenience this may cause and hope to welcome you on another occasion.</p>
          <br/>
          <p>Warm regards,<br/>The Casa Bella Team</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Error rejecting reservation:', error);
    return NextResponse.json({ error: 'Failed to reject reservation' }, { status: 500 });
  }
}
