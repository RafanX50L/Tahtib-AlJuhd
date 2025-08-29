import { Types } from "mongoose";

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