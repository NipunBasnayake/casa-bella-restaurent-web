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

  // Await the params to be compliant with Next.js 15+ patterns
  const resolvedParams = await params;

  try {
    await connectToDatabase();
    
    // 1. Update the Reservation to confirmed status
    const reservation = await Reservation.findByIdAndUpdate(
      resolvedParams.id,
      { status: 'confirmed' },
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
      subject: 'Casa Bella Ristorante - Reservation Confirmed!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #D4AF37;">Casa Bella Ristorante</h2>
          <h3>Reservation Confirmed</h3>
          <p>Dear ${reservation.name},</p>
          <p>We are delighted to confirm your reservation at Casa Bella.</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td> <td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.date}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Time:</strong></td> <td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.time}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Guests:</strong></td> <td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.guests} People</td></tr>
          </table>
          <p>If you need to make any changes or cancel, please contact us directly.</p>
          <p>We look forward to hosting you!</p>
          <br/>
          <p>Warm regards,<br/>The Casa Bella Team</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Error confirming reservation:', error);
    return NextResponse.json({ error: 'Failed to confirm reservation' }, { status: 500 });
  }
}
