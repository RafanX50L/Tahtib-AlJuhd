import { Types } from 'mongoose';
import { HealthMetricType, IHealthMetric } from '@/core/interface/model/IHealthMetric.model';

export interface IHealthMetricRepository {
  record(userId: Types.ObjectId, metricType: HealthMetricType, value: number, recordedAt: Date): Promise<IHealthMetric>;
  latest(userId: Types.ObjectId, metricType: HealthMetricType): Promise<IHealthMetric | null>;
  list(userId: Types.ObjectId, metricType?: HealthMetricType, limit?: number): Promise<IHealthMetric[]>;
}


