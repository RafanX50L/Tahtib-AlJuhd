
import { Document, Types } from 'mongoose';
import { IUserFile } from './IUserFile.model';

// Shared interfaces

export interface IClientUserData{
  nickName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address?: string;
  phoneNumber?: string;
  profilePictureId?: Types.ObjectId | IUserFile ;
  height: number;
  currentWeight: number;
  targetWeight: number;
  fitnessGoal: 'build muscle' | 'lose weight' | 'get stronger' | 'improve endurance' | 'tone body' | 'increase flexibility';
  currentFitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'athlete';
  activityLevel: 'sedentary' | 'lightly active' | 'moderately active' | 'very active';
  equipment: ('body weight' | 'dumbbells' | 'resistance bands' | 'kettlebells' | 'pull-up bar' | 'yoga mat')[];
  workoutDuration: string;
  workoutDaysPerWeek: number;
  healthIssues?: string[];
  medicalCondition?: string;
  dietAllergies?: string[];
  dietMealsPerDay: ('3 meals' | '3 meals + 1 snack' | '3 meals + 2 snacks' | '6 meals')[];
  dietPreferences?: string;
  workoutsCompletedIn28Days: number;
}

export interface IClientPersonalization {
  planStatus: 'Active' | 'Inactive';
  userData: IClientUserData;
  workoutPlanId?: Types.ObjectId;
  dietPlanId?: Types.ObjectId;
  progressLogId: Types.ObjectId | null;
  sessionsId: Types.ObjectId[] | null;
  chatsId?: { trainerId: Types.ObjectId; chatId: Types.ObjectId }[]; // Non-nullable, defaults to empty array
  currentTrainerId?: Types.ObjectId | null; // Optional, nullable to match schema
  previousTrainers: { trainerId: Types.ObjectId; startDate: Date; endDate: Date }[];
  contracts?: Types.ObjectId[];
}

export interface ITrainerPersonalization {
  basicInfo: {
    phoneNumber: string;
    location: string;
    timeZone: string;
    dateOfBirth?: Date;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    profilePictureId?: Types.ObjectId;
    weeklySalary?: number;
  };
  professionalSummary: {
    yearsOfExperience: number;
    certifications: { name: string; issuer: string; proofFileId?: Types.ObjectId }[];
    specializations: string[];
    coachingType: ('One-on-One' | 'Group' | 'Hybrid')[];
    platformsUsed?: string[];
  };
  sampleMaterials: {
    demoVideoLink: string;
    portfolioLinks?: string[];
    resumeFileId?: Types.ObjectId;
  };
  availability: {
    weeklyAvailability: {
      [key: string]: {
        isAvailable: boolean;
        timeSlots: Array<{
          startTime: string;
          endTime: string;
          duration: number;
          price: number;
        }>;
      };
    };
    timezone: string;
    engagementType: 'full-time' | 'part-time' | 'contract' | 'freelance';
  };
  evaluation?: {
    communicationSkills?: number;
    technicalKnowledge?: number;
    coachingStyle?: number;
    confidencePresence?: number;
    brandAlignment?: number;
    equipmentQuality?: number;
    notes?: string;
    evaluatedBy?: Types.ObjectId;
    evaluatedAt?: Date;
  };
  interviewDetailsId?: Types.ObjectId;
  status: 'applied' | 'interview_scheduled' | 'interviewed' | 'approved' | 'rejected';
  ratings: { clientId: Types.ObjectId; rating: number; comment?: string }[];
  sessions: Types.ObjectId[];
  chats: Types.ObjectId[];
  plans?: Types.ObjectId[]; // Array of Plan IDs (new)
  contracts?: Types.ObjectId[];
}

export interface IAdminPersonalization {
  adminNotes?: string;
}

export interface IPersonalization extends Document {
  userId: Types.ObjectId;
  role: 'client' | 'trainer' | 'admin';
  data: IClientPersonalization | ITrainerPersonalization | IAdminPersonalization;
  createdAt: Date;
  updatedAt: Date;
}