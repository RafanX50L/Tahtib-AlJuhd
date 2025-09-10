import { Document, Types } from 'mongoose';

export interface IPaymentCollection extends Document {
  _id: Types.ObjectId;
  clientId: Types.ObjectId;
  trainerId: Types.ObjectId;
  planId: Types.ObjectId;
  contractId: Types.ObjectId;
  amount: number;
  currency: string;
  stripePaymentIntentId: string;
  stripeSessionId: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  companyAccount: string;
  createdAt: Date;
  updatedAt: Date;
}