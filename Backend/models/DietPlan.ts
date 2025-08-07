
import { Schema, model, Document } from 'mongoose';

interface IMealOption {
  name: string;
  ingredients: string[];
  instructions: string;
  videoLink?: string;
}

interface IMealType {
  options: IMealOption[];
}

interface IDietPlan extends Document {
  mealPlan: {
    breakfast: IMealType;
    lunch: IMealType;
    dinner: IMealType;
    snacks?: IMealType;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

// Index
DietPlanSchema.index({ _id: 1 });

export const DietPlanModel = model<IDietPlan>('DietPlan', DietPlanSchema);
