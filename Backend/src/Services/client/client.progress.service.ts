import { Types } from 'mongoose';
import { IWorkoutProgress, IExerciseProgress } from '@/core/interface/model/IWorkoutProgress.model';
import { HealthMetricType, IHealthMetric } from '@/core/interface/model/IHealthMetric.model';
import { IVideoProgress } from '@/core/interface/model/IVideoProgress.model';
import { IWorkoutProgressRepository } from '@/core/interface/repositories/IWorkoutProgress.repository';
import { IStreakLogRepository } from '@/core/interface/repositories/IStreakLog.repository';
import { IHealthMetricRepository } from '@/core/interface/repositories/IHealthMetric.repository';
import { IVideoProgressRepository } from '@/core/interface/repositories/IVideoProgress.repository';

export class ClientProgressService {
  constructor(
    private readonly workoutProgressRepo: IWorkoutProgressRepository,
    private readonly streakRepo: IStreakLogRepository,
    private readonly healthRepo: IHealthMetricRepository,
    private readonly videoRepo: IVideoProgressRepository,
  ) {}

  async upsertWorkoutProgress(params: {
    userId: string;
    workoutPlanId: string;
    weekKey: 'week1'|'week2'|'week3'|'week4';
    dayKey: 'day1'|'day2'|'day3'|'day4'|'day5'|'day6'|'day7';
    exercises: IExerciseProgress[];
  }): Promise<IWorkoutProgress> {
    const { userId, workoutPlanId, weekKey, dayKey, exercises } = params;
    const completedCount = exercises.filter(e => e.status === 'completed').length;
    const completionPercentage = exercises.length > 0 ? Math.round((completedCount / exercises.length) * 100) : 0;
    const status = completionPercentage === 100 ? 'completed' : 'in_progress' as IWorkoutProgress['status'];

    const doc = await this.workoutProgressRepo.upsertDayProgress({
      userId: new Types.ObjectId(userId),
      workoutPlanId: new Types.ObjectId(workoutPlanId),
      weekKey,
      dayKey,
      exercises,
      completionPercentage,
      status,
    });

    if (status === 'completed') {
      await this.streakRepo.bump(new Types.ObjectId(userId), 'daily', new Date());
      await this.streakRepo.bump(new Types.ObjectId(userId), 'weekly', new Date());
    }
    return doc;
  }

  async recordHealthMetric(params: { userId: string; metricType: HealthMetricType; value: number; recordedAt?: Date; }): Promise<IHealthMetric> {
    const { userId, metricType, value, recordedAt } = params;
    return this.healthRepo.record(new Types.ObjectId(userId), metricType, value, recordedAt ?? new Date());
  }

  async upsertVideoProgress(params: { userId: string; videoId: string; watchPercent: number; avgPlaybackRate?: number; }): Promise<IVideoProgress> {
    const { userId, videoId, watchPercent, avgPlaybackRate } = params;
    return this.videoRepo.upsert(new Types.ObjectId(userId), videoId, watchPercent, avgPlaybackRate);
  }

  async getSummary(userId: string) {
    const [dailyStreak, weeklyStreak, latestWeight, latestBmi] = await Promise.all([
      this.streakRepo.get(new Types.ObjectId(userId), 'daily'),
      this.streakRepo.get(new Types.ObjectId(userId), 'weekly'),
      this.healthRepo.latest(new Types.ObjectId(userId), 'weight'),
      this.healthRepo.latest(new Types.ObjectId(userId), 'bmi'),
    ]);

    return {
      streaks: {
        daily: dailyStreak?.streakCount ?? 0,
        weekly: weeklyStreak?.streakCount ?? 0,
      },
      health: {
        latestWeight: latestWeight?.value ?? null,
        latestBmi: latestBmi?.value ?? null,
      },
    };
  }

  async getWorkoutDayProgress(params: { userId: string; workoutPlanId: string; weekKey: string; dayKey: string; }) {
    const { userId, workoutPlanId, weekKey, dayKey } = params;
    return this.workoutProgressRepo.findByDay({
      userId: new Types.ObjectId(userId),
      workoutPlanId: new Types.ObjectId(workoutPlanId),
      weekKey,
      dayKey,
    });
  }

  async listHealthMetrics(params: { userId: string; metricType?: HealthMetricType; limit?: number; }) {
    const { userId, metricType, limit } = params;
    return this.healthRepo.list(new Types.ObjectId(userId), metricType, limit);
  }

  async getStreaks(userId: string) {
    const [daily, weekly] = await Promise.all([
      this.streakRepo.get(new Types.ObjectId(userId), 'daily'),
      this.streakRepo.get(new Types.ObjectId(userId), 'weekly'),
    ]);
    return { daily: daily?.streakCount ?? 0, weekly: weekly?.streakCount ?? 0 };
  }

  async listRecentWorkoutDays(userId: string, limit = 10) {
    return this.workoutProgressRepo.listRecentByUser({ userId: new Types.ObjectId(userId), limit });
  }
}


