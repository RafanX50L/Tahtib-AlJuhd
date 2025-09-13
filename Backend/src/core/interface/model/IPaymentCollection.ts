import { Document, Types } from 'mongoose';
import IUser from './IUser.model';
import { IPlan } from './IPlan';

export interface IPaymentCollection extends Document {
  _id: Types.ObjectId;
  clientId: Types.ObjectId | IUser;
  trainerId: Types.ObjectId | IUser;
  planId: Types.ObjectId | IPlan;
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