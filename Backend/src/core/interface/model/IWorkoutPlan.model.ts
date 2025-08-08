import { Document } from "mongoose";

// Shared interfaces
export interface IExercise {
  name: string;
  sets?: number | string;
  reps?: string;
  rest?: string;
  duration?: string;
  instructions: string;
  animationLink?: string;
}

export interface IWorkoutReport {
  totalExercises: number;
  totalSets: number;
  estimatedDuration: string;
  caloriesBurned: number;
  intensity: string;
  feedback: string;
}

export interface IDay {
  title: string;
  exercises: IExercise[];
  completed?: boolean;
  report?:IWorkoutReport;
}

export interface IWeek {
  day1: IDay;
  day2: IDay;
  day3: IDay;
  day4: IDay;
  day5: IDay;
  day6: IDay;
  day7: IDay;
  completed?: boolean;
}

export interface IWorkoutPlan extends Document {
  week1: IWeek;
  week2?: IWeek | null;
  week3?: IWeek | null;
  week4?: IWeek | null;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
