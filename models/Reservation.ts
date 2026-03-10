import mongoose, { Schema, Document } from 'mongoose';

export interface IReservation extends Document {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  requests?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  requests: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema);
