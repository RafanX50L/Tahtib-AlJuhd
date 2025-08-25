import { Schema, model } from 'mongoose';

export interface IPayment {
  _id: Schema.Types.ObjectId;
  clientId: Schema.Types.ObjectId;
  trainerId: Schema.Types.ObjectId;
  bookingId?: Schema.Types.ObjectId;
  planId?: Schema.Types.ObjectId;
  
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

const PaymentSchema = new Schema<IPayment>({
  clientId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  trainerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  bookingId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Booking' 
  },
  planId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Plan' 
  },
  
  // Payment details
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  currency: { 
    type: String, 
    required: true,
    default: 'USD'
  },
  status: { 
    type: String, 
    enum: ['pending', 'succeeded', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: { 
    type: String, 
    enum: ['stripe', 'paypal', 'other'],
    required: true
  },
  
  // Stripe specific fields
  stripePaymentIntentId: { 
    type: String 
  },
  stripeSessionId: { 
    type: String 
  },
  stripeCustomerId: { 
    type: String 
  },
  
  // Plan details
  planDetails: {
    planName: { type: String },
    sessionsCount: { type: Number, min: 0 },
    durationWeeks: { type: Number, min: 0 },
    pricePerSession: { type: Number, min: 0 }
  },
  
  // Commission tracking
  commission: {
    adminCommission: { type: Number, min: 0 },
    trainerAmount: { type: Number, min: 0 },
    platformFee: { type: Number, min: 0 }
  },
  
  // Refund information
  refund: {
    amount: { type: Number, min: 0 },
    reason: { type: String },
    processedAt: { type: Date },
    stripeRefundId: { type: String }
  },
  
  // Metadata
  metadata: { 
    type: Schema.Types.Mixed 
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
PaymentSchema.index({ clientId: 1, createdAt: -1 });
PaymentSchema.index({ trainerId: 1, createdAt: -1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ stripePaymentIntentId: 1 });
PaymentSchema.index({ stripeSessionId: 1 });

export const PaymentModel = model<IPayment>('Payment', PaymentSchema);
