import {
    IWeek,
  IWorkoutPlan,
  IWorkoutReport,
} from "@/core/interface/model/IWorkoutPlan.model";
import { BaseRepository } from "./base.repository";
import { WorkoutPlanModel } from "@/models/WorkoutPlan.model";
import { IWorkoutPlanRepository } from "@/core/interface/repositories/IWorkoutPlan.repository";
import { Types } from "mongoose";

export class WorkoutPlanRepository
  extends BaseRepository<IWorkoutPlan>
  implements IWorkoutPlanRepository
{
  constructor() {
    super(WorkoutPlanModel);
  }

  async getWorkouts(workoutId: Types.ObjectId) {
    return this.findById(workoutId);
  }

  async markWorkoutDayAsComplete(
    workoutPlanId: Types.ObjectId,
    week: string,
    day: string, 
    report: IWorkoutReport
  ): Promise<void> {
    const completedField = `${week}.${day}.completed`;
    const reportField = `${week}.${day}.report`;

    await this.model.updateOne(
      { _id: workoutPlanId },
      {
        $set: {
          [completedField]: true,
          [reportField]: report,
        }
      }
    );
  }

  async insertNextWeek(
    workoutPlanId: Types.ObjectId,
    weekKey: string,
    weekData: IWeek
  ): Promise<void> {
    await this.model.updateOne(
      { _id: workoutPlanId },
      { $set: { [weekKey]: weekData } }
    );
  }

  async markWeekAsCompleted(
    workoutPlanId: Types.ObjectId,
    weekKey: string 
  ): Promise<void> {
    const fieldPath = `${weekKey}.completed`;

    await this.model.updateOne(
      { _id: workoutPlanId },
      { $set: { [fieldPath]: true } }
    );
  }
}
