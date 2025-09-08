import { Types } from 'mongoose';
import { IWorkoutProgress } from '@/core/interface/model/IWorkoutProgress.model';

export interface IWorkoutProgressRepository {
  upsertDayProgress(params: {
    userId: Types.ObjectId;
    workoutPlanId: Types.ObjectId;
    weekKey: string;
    dayKey: string;
    exercises: IWorkoutProgress['exercises'];
    completionPercentage: number;
    status: IWorkoutProgress['status'];
  }): Promise<IWorkoutProgress>;

  findByDay(params: {
    userId: Types.ObjectId;
    workoutPlanId: Types.ObjectId;
    weekKey: string;
    dayKey: string;
  }): Promise<IWorkoutProgress | null>;

  listByPlan(params: { userId: Types.ObjectId; workoutPlanId: Types.ObjectId }): Promise<IWorkoutProgress[]>;

  listRecentByUser(params: { userId: Types.ObjectId; limit?: number }): Promise<IWorkoutProgress[]>;
}


