// src/schemas/basicDetailsSchema.ts
import { z } from 'zod';

export const basicDetailsSchema = z.object({
  nick_name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  age: z.number().min(10, 'Age must be at least 10').max(100, 'Age must not exceed 100'),
  gender: z.enum(['Male', 'Female', 'Non-binary', 'Prefer not to say'], {
    required_error: 'Please select a gender',
  }),
  height: z.number().min(100, 'Height must be at least 100 cm').max(250, 'Height must not exceed 250 cm'),
  weight: z.number().min(30, 'Weight must be at least 30 kg').max(200, 'Weight must not exceed 200 kg'),
  targetWeight: z
    .number()
    .min(30, 'Target weight must be at least 30 kg')
    .max(200, 'Target weight must not exceed 200 kg')
    .optional()
    .or(z.literal('')),
});

export type BasicDetailsForm = z.infer<typeof basicDetailsSchema>;

export const fitnessGoalsSchema = z.object({
  fitnessGoal: z.enum(["muscle", "weight-loss", "strength", "endurance", "tone", "flexibility"]),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced", "athlete"]),
  activityLevel: z.enum(["sedentary", "lightly", "moderate", "very"]),
})

export type FitnessGoalsForm = z.infer<typeof fitnessGoalsSchema>