import { IPlan } from '@/core/interface/model/IPlan';
import { Schema, model } from 'mongoose';

const PlanSchema = new Schema<IPlan>({
  trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  price: Number,
  sessionsPerWeek: Number,
  durationWeeks: Number,
  isActive: { type: Boolean, default: true },
  isBooked: { type: Boolean, default: false },
}, { timestamps: true });

export const PlanModel = model<IPlan>('Plan', PlanSchema);