
import { Schema, model, Document, Types } from 'mongoose';

interface IPayment extends Document {
  clientId: Types.ObjectId;
  trainerId: Types.ObjectId;
  sessionId: Types.ObjectId;
  amount: number;
  companyCommission: number;
  trainerAmount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  amount: { type: Number, required: true, min: 0 },
  companyCommission: { type: Number, required: true, min: 0 },
  trainerAmount: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
}, { timestamps: true });

// Pre-save hook to calculate commission (10% to company, 90% to trainer)
PaymentSchema.pre('save', function (next) {
  this.companyCommission = this.amount * 0.1;
  this.trainerAmount = this.amount * 0.9;
  next();
});

// Indexes
PaymentSchema.index({ clientId: 1, status: 1 });
PaymentSchema.index({ trainerId: 1, status: 1 });

export const PaymentModel = model<IPayment>('Payment', PaymentSchema);
