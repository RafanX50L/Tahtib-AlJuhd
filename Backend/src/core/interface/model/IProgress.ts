import { Document } from 'mongoose';

export interface IProgress extends Document {
  clientId: string;
  trainerId?: string;
  date: Date;
  type: 'weight' | 'measurements' | 'workout' | 'nutrition' | 'goal' | 'photo';
  
  // Weight tracking
  weight?: number;
  bodyFatPercentage?: number;
  
  // Body measurements
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
    calves?: number;
    neck?: number;
    shoulders?: number;
  };
  
  // Workout progress
  workoutProgress?: {
    workoutId: string;
    workoutName: string;
    duration: number;
    caloriesBurned?: number;
    exercises: Array<{
      exerciseName: string;
      sets: number;
      reps: number;
      weight?: number;
      duration?: number;
      completed: boolean;
    }>;
  };
  
  // Nutrition tracking
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    water: number;
    meals: Array<{
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    }>;
  };
  
  // Goal tracking
  goals?: Array<{
    goalId: string;
    goalType: 'weight' | 'measurement' | 'workout' | 'nutrition';
    target: number;
    current: number;
    unit: string;
    isCompleted: boolean;
  }>;
  
  // Progress photos
  photos?: Array<{
    type: 'front' | 'back' | 'side' | 'other';
    url: string;
    caption?: string;
  }>;
  
  // General notes
  notes?: string;
  
  // Mood and energy levels
  mood?: 1 | 2 | 3 | 4 | 5;
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  
  createdAt: Date;
  updatedAt: Date;
}
