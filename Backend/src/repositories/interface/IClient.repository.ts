import { IUserModel } from "@/models/implementation/user.model";
import { IBaseRepository } from "../IBase.respository";
import { IClientUserData } from "@/models/interface/IPersonalization";
import mongoose from "mongoose";
import { IWorkoutPlan, IWorkoutReport } from "@/models/interface/IWorkout";

export interface IClientRepository extends IBaseRepository<IUserModel> {
  SaveWorkoutsDietsPersonalization(
    userData: IClientUserData,
    workout: any,
    diet: any
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
  updateDayCompletion(
    userId: string,
    workoutReport: IWorkoutReport,
    week: string,
    day: string
  ): Promise<IWorkoutPlan | null>;
  getWorkoutReport(
    userId: string,
    week: string,
    day: string
  ): Promise<IWorkoutReport | null>;
  getWeeklyChallenges(): Promise<any>;
  getChallengeById(id: string): Promise<any>;
  joinWeeklyChallenge(userId: string, challengeId: string): Promise<any>;
  getUserWeeklyChallenge(userId: string, challengeId: string): Promise<any>;
  updateDayCompletionOfWeeklyChallengeStatus(
    userId: string,
    dayIndex: number,
    challengeId: string,
    workoutReport: IWorkoutReport
  ): Promise<any>;
}
