import { IDayView, IExerciseView, IWorkoutReportView } from "@/dtos/client/weeklyChallengeDTO";

export interface IClientWorkoutPlanService {
  /** Reserved for Workout plan specific methods */
  _placeholder?: never;

  getWorkouts(userId:string,week:string):Promise<IDayView[]>;
  completeDailyWorkoutAndFetchReport(userId:string, week:string, day:string, workout:IExerciseView[]):Promise<IWorkoutReportView>;
  getWorkoutReport(userId:string, week:string, day:string):Promise<IWorkoutReportView>;

}
