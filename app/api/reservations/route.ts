import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import PushSubscription from '@/models/PushSubscription';
import webpush from 'web-push';
import nodemailer from 'nodemailer';
import { cookies } from 'next/headers';

// Configuration for Web Push Notification payload
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const reservations = await Reservation.find({}).sort({ createdAt: -1 });
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();

    // Basic Validation
    if (!data.name || !data.phone || !data.email || !data.date || !data.time || !data.guests) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Explicitly set status to pending
    const reservationData = {
      ...data,
      status: 'pending',
    };

    // 1. Create a reservation in MongoDB
    const newReservation = await Reservation.create(reservationData);

    // 2. Send Push Notification to All Subscribed Admins
    try {
      const subscriptions = await PushSubscription.find({});
      if (subscriptions.length > 0) {
        const payload = JSON.stringify({
          title: '🔔 New Reservation Request!',
          body: `${newReservation.name} requested a table for ${newReservation.guests} on ${newReservation.date} at ${newReservation.time}.`,
          url: '/admin',
        });

        const notifications = subscriptions.map((sub: any) =>
          webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys.p256dh,
                auth: sub.keys.auth,
              },
            },
            payload
          ).catch(e => {
            if (e.statusCode === 410 || e.statusCode === 404) {
              return PushSubscription.findByIdAndDelete(sub._id);
            }
          })
        );
        await Promise.all(notifications);
      }
    } catch (pushError) {
      console.error('Push Notification Error:', pushError);
    }

    // 3. Fallback: Send Email Notification to Admin
    try {
      const adminEmail = process.env.EMAIL_USER;
      if (adminEmail && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: adminEmail,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Casa Bella System" <${adminEmail}>`,
          to: adminEmail,
          subject: `New Reservation Request from ${newReservation.name}`,
          text: `A new reservation has been made by ${newReservation.name} for ${newReservation.guests} guests on ${newReservation.date} at ${newReservation.time}.\nPlease review it in the admin dashboard.`,
        };
        await transporter.sendMail(mailOptions);
      }
    } catch (emailError) {
      console.error('Email Notification Error:', emailError);
    }

    return NextResponse.json(newReservation, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}
