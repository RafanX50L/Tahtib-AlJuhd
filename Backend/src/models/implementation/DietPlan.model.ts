import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MealOptionSchema = new Schema({
  name: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  video_link: { type: String, required: false, default: "No video available" }
});

const MealTypeSchema = new Schema({
  options: [MealOptionSchema]
});

const MealPlanSchema = new Schema({
  breakfast: MealTypeSchema,
  lunch: MealTypeSchema,
  dinner: MealTypeSchema,
  snacks: MealTypeSchema
});

const DietPlanSchema = new Schema({
  mealPlan: MealPlanSchema,
  notes: { type: String, required: false }
});

export const DietPlanModel = mongoose.model('DietPlan', DietPlanSchema);