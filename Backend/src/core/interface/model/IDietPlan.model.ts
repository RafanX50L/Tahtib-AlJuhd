
import { Document } from 'mongoose';

export interface IMealOption {
  name: string;
  ingredients: string[];
  instructions: string;
  videoLink?: string;
}

export interface IMealType {
  options: IMealOption[];
}

export interface IDietPlan extends Document {
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