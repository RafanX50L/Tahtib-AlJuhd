import { IExercise, IWorkoutReport } from "@/models/interface/IWorkout";

export interface IClientService{

    generateFitnessPlan(userData:any):Promise<string>;
    getBasicFitnessPlan(userId:string):Promise<any>;
    getWorkouts(userId:string,week:string):Promise<any>;
    getWeekCompletionStatus(userId:string):Promise<any>;
    updateDayCompletionStatus(userId:string, week:string, day:string, workout:IExercise[]):Promise<IWorkoutReport>;
    getWorkoutReport(userId:string, week:string, day:string):Promise<IWorkoutReport  | null>;
}