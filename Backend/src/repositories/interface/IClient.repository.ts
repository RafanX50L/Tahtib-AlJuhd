import { IUserModel } from "@/models/implementation/user.model";
import { IBaseRepository } from "../IBase.respository";
import { IClientUserData } from "@/models/interface/IPersonalization";
import mongoose from "mongoose";

export interface IClientRepository extends IBaseRepository<IUserModel> {
  SaveWorkoutsDietsPersonalization(
    userData: IClientUserData,
    plan: any
  ): Promise<any>;
  createPersonalization(
    userData: IClientUserData,
    workoutId: mongoose.Types.ObjectId,
    dietId: mongoose.Types.ObjectId,
    session?: mongoose.ClientSession
  ): Promise<any>;
  createWorkoutPlan(
    workoutPlan: any,
    session?: mongoose.ClientSession
  ): Promise<any>;
  createDietPlan(dietPlan: any, session?: mongoose.ClientSession): Promise<any>;
  getBasicFitnessPlan(userId: string): Promise<{
    Workout_Duration: string;
    Workout_Days_Per_Week: number;
    Workout_Completed: number;
  }>;
  getWorkouts(userId: string, week: string): Promise<any>;
  getWeekCompletionStatus(userId: string): Promise<any>;
}
