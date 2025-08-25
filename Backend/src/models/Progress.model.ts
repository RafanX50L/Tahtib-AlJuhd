import { Schema, model } from 'mongoose';

export interface IProgress {
  _id: Schema.Types.ObjectId;
  clientId: Schema.Types.ObjectId;
  trainerId?: Schema.Types.ObjectId;
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
    duration: number; // in minutes
    caloriesBurned?: number;
    exercises: Array<{
      exerciseName: string;
      sets: number;
      reps: number;
      weight?: number;
      duration?: number; // for timed exercises
      completed: boolean;
    }>;
  };
  
  // Nutrition tracking
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    water: number; // in liters
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
  mood?: 1 | 2 | 3 | 4 | 5; // 1-5 scale
  energyLevel?: 1 | 2 | 3 | 4 | 5; // 1-5 scale
  
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>({
  clientId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  trainerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  type: { 
    type: String, 
    enum: ['weight', 'measurements', 'workout', 'nutrition', 'goal', 'photo'],
    required: true 
  },
  
  // Weight tracking
  weight: { 
    type: Number,
    min: 0,
    max: 1000
  },
  bodyFatPercentage: { 
    type: Number,
    min: 0,
    max: 100
  },
  
  // Body measurements
  measurements: {
    chest: { type: Number, min: 0 },
    waist: { type: Number, min: 0 },
    hips: { type: Number, min: 0 },
    biceps: { type: Number, min: 0 },
    thighs: { type: Number, min: 0 },
    calves: { type: Number, min: 0 },
    neck: { type: Number, min: 0 },
    shoulders: { type: Number, min: 0 }
  },
  
  // Workout progress
  workoutProgress: {
    workoutId: { type: String, required: true },
    workoutName: { type: String, required: true },
    duration: { type: Number, required: true, min: 0 },
    caloriesBurned: { type: Number, min: 0 },
    exercises: [{
      exerciseName: { type: String, required: true },
      sets: { type: Number, required: true, min: 0 },
      reps: { type: Number, required: true, min: 0 },
      weight: { type: Number, min: 0 },
      duration: { type: Number, min: 0 },
      completed: { type: Boolean, default: false }
    }]
  },
  
  // Nutrition tracking
  nutrition: {
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, required: true, min: 0 },
    carbs: { type: Number, required: true, min: 0 },
    fats: { type: Number, required: true, min: 0 },
    water: { type: Number, required: true, min: 0 },
    meals: [{
      mealType: { 
        type: String, 
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true 
      },
      name: { type: String, required: true },
      calories: { type: Number, required: true, min: 0 },
      protein: { type: Number, required: true, min: 0 },
      carbs: { type: Number, required: true, min: 0 },
      fats: { type: Number, required: true, min: 0 }
    }]
  },
  
  // Goal tracking
  goals: [{
    goalId: { type: String, required: true },
    goalType: { 
      type: String, 
      enum: ['weight', 'measurement', 'workout', 'nutrition'],
      required: true 
    },
    target: { type: Number, required: true },
    current: { type: Number, required: true },
    unit: { type: String, required: true },
    isCompleted: { type: Boolean, default: false }
  }],
  
  // Progress photos
  photos: [{
    type: { 
      type: String, 
      enum: ['front', 'back', 'side', 'other'],
      required: true 
    },
    url: { type: String, required: true },
    caption: { type: String }
  }],
  
  // General notes
  notes: { type: String, maxlength: 1000 },
  
  // Mood and energy levels
  mood: { 
    type: Number, 
    enum: [1, 2, 3, 4, 5],
    min: 1,
    max: 5
  },
  energyLevel: { 
    type: Number, 
    enum: [1, 2, 3, 4, 5],
    min: 1,
    max: 5
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
ProgressSchema.index({ clientId: 1, date: -1 });
ProgressSchema.index({ clientId: 1, type: 1, date: -1 });
ProgressSchema.index({ trainerId: 1, date: -1 });

export const ProgressModel = model<IProgress>('Progress', ProgressSchema);
