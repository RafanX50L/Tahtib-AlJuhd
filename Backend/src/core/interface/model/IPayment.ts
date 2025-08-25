import { Document } from 'mongoose';

export interface IPayment extends Document {
  clientId: string;
  trainerId: string;
  bookingId?: string;
  planId?: string;
  
  // Payment details
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod: 'stripe' | 'paypal' | 'other';
  
  // Stripe specific fields
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  stripeCustomerId?: string;
  
  // Plan details
  planDetails?: {
    planName: string;
    sessionsCount: number;
    durationWeeks: number;
    pricePerSession: number;
  };
  
  // Commission tracking
  commission?: {
    adminCommission: number;
    trainerAmount: number;
    platformFee: number;
  };
  
  // Refund information
  refund?: {
    amount: number;
    reason: string;
    processedAt: Date;
    stripeRefundId?: string;
  };
  
  // Metadata
  metadata?: Record<string, unknown>;
  
  createdAt: Date;
  updatedAt: Date;
}
