import { Types } from 'mongoose';
import { BaseRepository } from './base.repository';
import { HealthMetricType, IHealthMetric } from '@/core/interface/model/IHealthMetric.model';
import { HealthMetricModel } from '@/models/HealthMetric.model';
import { IHealthMetricRepository } from '@/core/interface/repositories/IHealthMetric.repository';

export class HealthMetricRepository
  extends BaseRepository<IHealthMetric>
  implements IHealthMetricRepository
{
  constructor() {
    super(HealthMetricModel);
  }

  async record(userId: Types.ObjectId, metricType: HealthMetricType, value: number, recordedAt: Date) {
    return this.create({ user: userId, metricType, value, recordedAt }) as Promise<IHealthMetric>;
  }

  async latest(userId: Types.ObjectId, metricType: HealthMetricType) {
    return this.model.findOne({ user: userId, metricType }).sort({ recordedAt: -1 });
  }

  async list(userId: Types.ObjectId, metricType?: HealthMetricType, limit = 100) {
    const query: any = { user: userId };
    if (metricType) query.metricType = metricType;
    return this.model.find(query).sort({ recordedAt: -1 }).limit(limit);
  }
}


