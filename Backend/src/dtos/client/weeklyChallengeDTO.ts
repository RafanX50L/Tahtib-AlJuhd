import { IWeeklyChallenge } from "@/core/interface/model/IWeeklyChallenge.models";
import {  Types } from "mongoose";

export interface IChallengesView {
  id: string;
  created: string;
  endDate: string;
  enteredUsers: Types.ObjectId[];
  score: number;
  startDate: string;
  completedTask: number;
  TaskLength: number;
  type: string;
  updated: string;
}

export interface IWeeklyChallengesView {
  beginner: IChallengesView;
  intermediate: IChallengesView;
  advanced: IChallengesView;
}


export interface IExerciseView {
  name: string;
  sets?: string;
  reps?: string;
  rest?: string;
  duration?: string;
  instructions: string;
}

export interface IWorkoutReportView {
  totalExercises?: number;
  totalSets?: number;
  estimatedDuration?: string;
  caloriesBurned?: number;
  intensity?: string;
  feedback?: string;
}

export interface IDayView {
  title: string;
  exercises: IExerciseView[];
  completed?: boolean;
  report?: IWorkoutReportView;
}

export interface IChallengesViews {
  id: string;
  endDate: string;
  enteredUsers: Types.ObjectId[];
  score: number;
  startDate: string;
  tasks: IDayView[];
  type: string;
}


export class ClientWeeklyChallengeDTO {
  static async mapToWeeeklyChallengeData(raw: IWeeklyChallenge): Promise<IChallengesView> {
    return {
      id: raw.id,
      created: raw.createdAt.toISOString(),
      endDate: raw.endDate.toISOString(),
      enteredUsers: raw.enteredUsers,
      score: raw.score,
      startDate: raw.startDate.toISOString(),
      completedTask: raw.tasks.filter(t => t.completed).length,
      TaskLength: raw.tasks.length,
      type: raw.type,
      updated: raw.updatedAt.toISOString(),
    };
  }
  static async mapTooOneWeeklyChallengeData(
    raw: IWeeklyChallenge
  ): Promise<IChallengesViews> {
    return {
      id: raw._id.toString(),
      endDate: raw.endDate.toDateString(),
      enteredUsers: raw.enteredUsers,
      score: raw.score,
      startDate: raw.startDate.toDateString(),
      type: raw.type,
      tasks: raw.tasks.map((day): IDayView => ({
        title: day.title,
        completed: day.completed ?? false,
        exercises: day.exercises.map((ex): IExerciseView => ({
          name: ex.name,
          sets: ex.sets as string,
          reps: ex.reps,
          rest: ex.rest,
          duration: ex.duration,
          instructions: ex.instructions
        })),
        report: day.report
          ? {
              totalExercises: day.report.totalExercises,
              totalSets: day.report.totalSets,
              estimatedDuration: day.report.estimatedDuration,
              caloriesBurned: day.report.caloriesBurned,
              intensity: day.report.intensity,
              feedback: day.report.feedback
            }
          : undefined
      }))
    };
  }

}
