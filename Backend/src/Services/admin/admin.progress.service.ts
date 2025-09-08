import { Types } from 'mongoose';
import { IWorkoutProgressRepository } from '@/core/interface/repositories/IWorkoutProgress.repository';
import { IHealthMetricRepository } from '@/core/interface/repositories/IHealthMetric.repository';

export class AdminProgressService {
  constructor(
    private readonly workoutRepo: IWorkoutProgressRepository,
    private readonly healthRepo: IHealthMetricRepository,
  ) {}

  async cohortCompletionByDayRange(params: { start: Date; end: Date }) {
    const { start, end } = params;
    // naive aggregate: count completed docs per day
    const results = await (this.workoutRepo as any).model.aggregate([
      { $match: { updatedAt: { $gte: start, $lte: end }, status: 'completed' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }, completions: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    return results.map((r: any) => ({ date: r._id, completions: r.completions }));
  }

  async exportHealthCsv(params: { metricType: string; start?: Date; end?: Date }) {
    const { metricType, start, end } = params as any;
    const match: any = { metricType };
    if (start || end) match.recordedAt = { ...(start ? { $gte: start } : {}), ...(end ? { $lte: end } : {}) };
    const rows = await (this.healthRepo as any).model.find(match).sort({ recordedAt: 1 }).lean();
    const header = 'user,metricType,value,recordedAt\n';
    const body = rows.map((r: any) => `${r.user},${r.metricType},${r.value},${new Date(r.recordedAt).toISOString()}`).join('\n');
    return header + body + '\n';
  }
}


