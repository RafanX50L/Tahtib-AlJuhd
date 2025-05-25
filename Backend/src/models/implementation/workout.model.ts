import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: { type: String, required: true },
  sets: { type: String, required: false },
  reps: { type: String, required: false },
  rest: { type: String, required: false },
  duration: { type: String, required: false },
  instructions: { type: String, required: true },
  animation_link: { type: String, required: false, default: "No video available" }
});

const DaySchema = new Schema({
  title: { type: String, required: true },
  exercises: [ExerciseSchema]
});

const WeekSchema = new Schema({
  day1: DaySchema,
  day2: DaySchema,
  day3: DaySchema,
  day4: DaySchema,
  day5: DaySchema,
  day6: DaySchema
});

const WorkoutPlanSchema = new Schema({
  week1: WeekSchema,
  week2: WeekSchema,
  week3: WeekSchema,
  week4: WeekSchema
});

export const WorkoutPlanModel = mongoose.model('WorkoutPlan', WorkoutPlanSchema);