import mongoose, { Schema, Document } from 'mongoose';

export interface IReservation extends Document {
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequest?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema: Schema = new Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  specialRequest: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema);
