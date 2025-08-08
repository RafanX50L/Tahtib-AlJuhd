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

 // ✅ Mark a day as complete and save its report
  async markWorkoutDayAsComplete(
    workoutPlanId: Types.ObjectId,
    week: string, // e.g., 'week1'
    day: string,  // e.g., 'day3'
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

  // ✅ Insert a generated next week's workout plan
  async insertNextWeek(
    workoutPlanId: Types.ObjectId,
    weekKey: string, // e.g., 'week2', 'week3'
    weekData: IWeek
  ): Promise<void> {
    await this.model.updateOne(
      { _id: workoutPlanId },
      { $set: { [weekKey]: weekData } }
    );
  }

  // ✅ Optional: mark full week as completed
  async markWeekAsCompleted(
    workoutPlanId: Types.ObjectId,
    weekKey: string // e.g., 'week1'
  ): Promise<void> {
    const fieldPath = `${weekKey}.completed`;

    await this.model.updateOne(
      { _id: workoutPlanId },
      { $set: { [fieldPath]: true } }
    );
  }
}
