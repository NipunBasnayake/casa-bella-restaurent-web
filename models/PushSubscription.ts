import mongoose, { Schema, Document } from 'mongoose';

export interface IPushSubscription extends Document {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

const PushSubscriptionSchema: Schema = new Schema({
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
});

export default mongoose.models.PushSubscription || mongoose.model<IPushSubscription>('PushSubscription', PushSubscriptionSchema);
