import { Types } from 'mongoose';
import { BaseRepository } from './base.repository';
import { IWorkoutProgress } from '@/core/interface/model/IWorkoutProgress.model';
import { WorkoutProgressModel } from '@/models/WorkoutProgress.model';
import { IWorkoutProgressRepository } from '@/core/interface/repositories/IWorkoutProgress.repository';

export class WorkoutProgressRepository
  extends BaseRepository<IWorkoutProgress>
  implements IWorkoutProgressRepository
{
  constructor() {
    super(WorkoutProgressModel);
  }

  async upsertDayProgress(params: {
    userId: Types.ObjectId;
    workoutPlanId: Types.ObjectId;
    weekKey: string;
    dayKey: string;
    exercises: IWorkoutProgress['exercises'];
    completionPercentage: number;
    status: IWorkoutProgress['status'];
  }): Promise<IWorkoutProgress> {
    const { userId, workoutPlanId, weekKey, dayKey, exercises, completionPercentage, status } = params;
    const doc = await this.model.findOneAndUpdate(
      { user: userId, workoutPlanId, weekKey, dayKey },
      {
        $set: {
          exercises,
          completionPercentage,
          status,
        },
        $inc: { version: 1 },
      },
      { new: true, upsert: true }
    );
    return doc as IWorkoutProgress;
  }

  async findByDay(params: {
    userId: Types.ObjectId;
    workoutPlanId: Types.ObjectId;
    weekKey: string;
    dayKey: string;
  }): Promise<IWorkoutProgress | null> {
    const { userId, workoutPlanId, weekKey, dayKey } = params;
    return this.model.findOne({ user: userId, workoutPlanId, weekKey, dayKey });
  }

  async listByPlan(params: { userId: Types.ObjectId; workoutPlanId: Types.ObjectId }): Promise<IWorkoutProgress[]> {
    const { userId, workoutPlanId } = params;
    return this.model.find({ user: userId, workoutPlanId }).sort({ weekKey: 1, dayKey: 1 });
  }

  async listRecentByUser(params: { userId: Types.ObjectId; limit?: number }): Promise<IWorkoutProgress[]> {
    const { userId, limit = 10 } = params;
    return this.model.find({ user: userId }).sort({ updatedAt: -1 }).limit(limit);
  }
}


