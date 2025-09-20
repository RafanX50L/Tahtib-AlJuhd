import mongoose, { Document } from "mongoose";

export interface IPaymentCollection extends Document {
  _id: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  trainerId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  contractId: mongoose.Types.ObjectId;
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