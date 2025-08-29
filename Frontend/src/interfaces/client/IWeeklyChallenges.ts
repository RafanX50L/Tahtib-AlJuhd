import { Types } from "mongoose";

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


interface IUserDayReportView {
  dayIndex: number;
  completed: boolean;
  completedAt: Date;
  report: {
    caloriesBurned: string;
    feedback: string;
    intensity: string;
    estimatedDuration: string;
    totalExercises: string;
    totalSets: string;
  };
}

export interface IUserWeeklyChallengeView {
  user: string;
  challenge: string;
  type: string;
  startDate: string;
  progress: IUserDayReportView[];
  score: number;
}