import { Document, Types } from 'mongoose';

export type HealthMetricType = 'bmi' | 'weight' | 'body_fat' | 'heart_rate';

export interface IHealthMetric extends Document {
  user: Types.ObjectId;
  metricType: HealthMetricType;
  value: number;
  recordedAt: Date;
  createdAt: Date;
}


