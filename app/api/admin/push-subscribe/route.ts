import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/adminAuth';
import connectToDatabase from '@/lib/mongodb';
import PushSubscription from '@/models/PushSubscription';

export async function POST(req: Request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
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
