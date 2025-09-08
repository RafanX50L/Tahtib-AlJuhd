import { Types } from 'mongoose';
import { IWorkoutProgressRepository } from '@/core/interface/repositories/IWorkoutProgress.repository';

export class TrainerProgressService {
  constructor(private readonly workoutRepo: IWorkoutProgressRepository) {}

  async resetWorkoutDay(params: { userId: string; workoutPlanId: string; weekKey: string; dayKey: string; }) {
    const { userId, workoutPlanId, weekKey, dayKey } = params;
    const doc = await this.workoutRepo.findByDay({
      userId: new Types.ObjectId(userId),
      workoutPlanId: new Types.ObjectId(workoutPlanId),
      weekKey,
      dayKey,
    });
    if (!doc) return null;
    doc.exercises = doc.exercises.map(e => ({ ...e, status: 'pending', completedAt: undefined }));
    doc.completionPercentage = 0;
    doc.status = 'in_progress';
    doc.version += 1;
    await (doc as any).save();
    return doc;
  }

  async approveWorkoutDay(params: { userId: string; workoutPlanId: string; weekKey: string; dayKey: string; }) {
    const { userId, workoutPlanId, weekKey, dayKey } = params;
    const doc = await this.workoutRepo.findByDay({
      userId: new Types.ObjectId(userId),
      workoutPlanId: new Types.ObjectId(workoutPlanId),
      weekKey,
      dayKey,
    });
    if (!doc) return null;
    doc.exercises = doc.exercises.map(e => ({ ...e, status: 'completed', completedAt: e.completedAt ?? new Date() }));
    doc.completionPercentage = 100;
    doc.status = 'completed';
    doc.version += 1;
    await (doc as any).save();
    return doc;
  }
}


