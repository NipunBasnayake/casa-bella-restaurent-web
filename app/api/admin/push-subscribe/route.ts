import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PushSubscription from '@/models/PushSubscription';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const subscription = await req.json();
    
    // Save to database, upsert based on endpoint.
    await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      { $set: subscription },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
