import { Types } from "mongoose";

export interface IClientPersonalization extends Document {
  
  planStatus: "Active" | "Inactive";
  user_data: IClientUserData;
  workouts: Types.ObjectId | null;
  dietPlan: Types.ObjectId | null;
  posts: Types.ObjectId | null;
  progress: Types.ObjectId | null;
  one_to_one: Types.ObjectId | null;
}

export interface ITrainerPersonalization {
  specialty: string;
  experience: string;
  monthlyFee: string;
  expertiseLevel: "beginner" | "intermediate" | "advanced";
  isActive: boolean;
}

export interface IAdminPersonalization {
  adminNotes?: string;
}

export interface IPersonalization extends Document {
  userId: Types.ObjectId;
  role: "client" | "trainer" | "admin";
  data: IClientPersonalization | ITrainerPersonalization | IAdminPersonalization | null;
}


// IClientUserData.ts
export interface IClientUserData {
  userId:string;
  nick_name: string;
  age: string;
  gender: 'male' | 'female' | 'others';
  height: string;
  current_weight: string;
  target_weight: string;
  fitness_goal:
    | 'build muscle'
    | 'lose weight'
    | 'get stronger'
    | 'imporve endurance'
    | 'tone body'
    | 'increase flexibility';
  current_fitness_level: 'beginner' | 'intermediate' | 'advanced' | 'athlete';
  activity_level: 'sedentary' | 'lightly active' | 'moderately active' | 'very active';
  equipments: Array<
    'body weight' | 'dumbbells' | 'resistance Bands' | 'kettlebells' | 'pull-up bar' | 'yoga mat'
  >;
  workout_duration: string;
  workout_days_perWeek: number;
  health_issues: Array<'back pain' | 'knee pain' | 'shoulder pain' | 'wrist/hand issues'> | string;
  medical_condition: string;
  diet_allergies: Array<'nuts' | 'dairy' | 'shellfish' | 'glusten'> | string;
  diet_meals_perDay: Array<'3 meals' | '3 meals + 1 snack' | '3 meals + 2 snacks' | '6 meals'>;
  diet_preferences: string;
}
