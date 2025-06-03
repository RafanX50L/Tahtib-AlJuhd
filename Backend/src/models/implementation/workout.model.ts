import mongoose from "mongoose";
import { IDay, IExercise, IWeek, IWorkoutPlan } from "../interface/IWorkout";
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  sets: { type: String, required: false },
  reps: { type: String, required: false },
  rest: { type: String, required: false },
  duration: { type: String, required: false },
  instructions: { type: String, required: true },
  animation_link: { type: String, required: false, default: "No video available" }
});

const DaySchema = new Schema<IDay>({
  title: { type: String, required: true },
  exercises: [ExerciseSchema],
  completed: { type: Boolean, default: false },
  
  report: {
    type: Object,
    required: false,
    default: undefined
  }
});


const WeekSchema = new Schema<IWeek>({
  day1: DaySchema,
  day2: DaySchema,
  day3: DaySchema,
  day4: DaySchema,
  day5: DaySchema,
  day6: DaySchema,
  day7: DaySchema,
  completed: { type: Boolean, default: false }
});

const WorkoutPlanSchema = new Schema<IWorkoutPlan>({
  week1: WeekSchema,
  week2: { type: WeekSchema, default: null },
  week3: { type: WeekSchema, default: null },
  week4: { type: WeekSchema, default: null },
  notes: { type: String, required: false }
});

export const WorkoutPlanModel = mongoose.model<IWorkoutPlan>('WorkoutPlan', WorkoutPlanSchema);