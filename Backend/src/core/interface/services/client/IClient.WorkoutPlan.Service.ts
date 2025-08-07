import { IExercise, IWeek, IWorkoutReport } from "../../model/IWorkoutPlan.model";

export interface IClientWorkoutPlanService {
  /** Reserved for Workout plan specific methods */
  _placeholder?: never;

  getWorkouts(userId:string,week:string):Promise<IWeek>;
  completeDailyWorkoutAndFetchReport(userId:string, week:string, day:string, workout:IExercise[]):Promise<IWorkoutReport>;

}
