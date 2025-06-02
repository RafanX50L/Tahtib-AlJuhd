import { Document } from "mongoose";

export interface IExercise extends Document {
  name: string;
  sets?: string;
  reps?: string;
  rest?: string;
  duration?: string;
  instructions: string;
  animation_link?: string;
}

export interface IDay extends Document {
  title: string;
  exercises: IExercise[];
  completed?: boolean;
  report?: IWorkoutReport;
}

export interface IWeek extends Document {
  day1: IDay;
  day2: IDay;
  day3: IDay;
  day4: IDay;
  day5: IDay;
  day6?: IDay;
  day7?: IDay;
  completed?: boolean;
}

export interface IWorkoutPlan extends Document {
  week1: IWeek;
  week2: IWeek;
  week3: IWeek;
  week4: IWeek;
  notes?: string;
}

export interface IWorkoutReport {
  totalExercises?: number;
  totalSets?: number;
  estimatedDuration?: string;
  caloriesBurned?: number;
  intensity?: string;
  feedback?: string;
}
