import { Document } from 'mongoose';

export interface IBooking extends Document {
  trainerId: string;
  clientId: string;
  sessionDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  amount: number;
  currency: string;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  meetingLink?: string;
  notes?: string;
  cancellationReason?: string;
  cancelledBy?: 'trainer' | 'client' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
