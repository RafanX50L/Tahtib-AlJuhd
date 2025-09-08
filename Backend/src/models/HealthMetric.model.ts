import { Schema, model } from 'mongoose';
import { HealthMetricType, IHealthMetric } from '@/core/interface/model/IHealthMetric.model';

const HealthMetricSchema = new Schema<IHealthMetric>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  metricType: { type: String, enum: ['bmi','weight','body_fat','heart_rate'] as HealthMetricType[], required: true, index: true },
  value: { type: Number, required: true },
  recordedAt: { type: Date, required: true, index: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

HealthMetricSchema.index({ user: 1, metricType: 1, recordedAt: -1 });

export const HealthMetricModel = model<IHealthMetric>('HealthMetric', HealthMetricSchema);


