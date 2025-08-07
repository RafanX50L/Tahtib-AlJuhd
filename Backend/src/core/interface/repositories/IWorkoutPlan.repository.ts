import { Types } from "mongoose";
import { IWeek, IWorkoutPlan, IWorkoutReport } from "../model/IWorkoutPlan.model";
import { IBaseRepository } from "./IBase.repository";

export interface IWorkoutPlanRepository extends IBaseRepository<IWorkoutPlan> {
  /** Reserved for workout plan specific methods */
  _placeholder?: never;

  getWorkouts(workoutId: Types.ObjectId): Promise<IWorkoutPlan>;
  markWorkoutDayAsComplete(
    workoutPlanId: Types.ObjectId,
    week: string,
    day: string,
    report: IWorkoutReport
  ):Promise<void>;
  insertNextWeek(
    workoutPlanId: Types.ObjectId,
    nextWeekKey: string, // like "week3"
    nextWeekData: IWeek
  ):Promise<void>;
  markWeekAsCompleted(
    workoutPlanId: Types.ObjectId,
    weekKey: string // e.g., 'week1'
  ): Promise<void>;
}
