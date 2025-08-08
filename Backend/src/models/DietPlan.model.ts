
import { IDietPlan, IMealOption, IMealType } from '@/core/interface/model/IDietPlan.model';
import { Schema, model } from 'mongoose';

const MealOptionSchema = new Schema<IMealOption>({
  name: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  videoLink: { type: String, default: 'No video available' },
});

const MealTypeSchema = new Schema<IMealType>({
  options: [MealOptionSchema],
});

const DietPlanSchema = new Schema<IDietPlan>({
  mealPlan: {
    breakfast: MealTypeSchema,
    lunch: MealTypeSchema,
    dinner: MealTypeSchema,
    snacks: MealTypeSchema,
  },
  notes: { type: String, required: false },
}, { timestamps: true });



export const DietPlanModel = model<IDietPlan>('DietPlan', DietPlanSchema);
