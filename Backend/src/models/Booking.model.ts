import { Schema, model } from 'mongoose';

export interface IBooking {
  _id: Schema.Types.ObjectId;
  trainerId: Schema.Types.ObjectId;
  clientId: Schema.Types.ObjectId;
  sessionDate: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
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

const BookingSchema = new Schema<IBooking>({
  trainerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  clientId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sessionDate: { 
    type: Date, 
    required: true 
  },
  startTime: { 
    type: String, 
    required: true 
  },
  endTime: { 
    type: String, 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true,
    min: 15,
    max: 480
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  currency: { 
    type: String, 
    default: 'USD'
  },
  stripePaymentIntentId: { 
    type: String 
  },
  stripeSessionId: { 
    type: String 
  },
  meetingLink: { 
    type: String 
  },
  notes: { 
    type: String 
  },
  cancellationReason: { 
    type: String 
  },
  cancelledBy: { 
    type: String, 
    enum: ['trainer', 'client', 'admin']
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
BookingSchema.index({ trainerId: 1, sessionDate: 1 });
BookingSchema.index({ clientId: 1, sessionDate: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ paymentStatus: 1 });

export const BookingModel = model<IBooking>('Booking', BookingSchema);
