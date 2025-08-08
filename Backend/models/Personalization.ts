
import mongoose, { Schema, model, Document, Types } from 'mongoose';

// Shared interfaces
interface IClientPersonalization {
  planStatus: 'Active' | 'Inactive';
  userData: {
    nickName: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    address?: string;
    phoneNumber?: string;
    profilePictureId?: Types.ObjectId;
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
  };
  workoutPlan?: Types.ObjectId;
  dietPlan?: Types.ObjectId;
  progressLog: Types.ObjectId;
  sessions: Types.ObjectId[];
  chats: Types.ObjectId[];
}

interface ITrainerPersonalization {
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
    weeklySlots: { day: string; startTime: string; endTime: string }[];
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
  interview?: {
    adminId: Types.ObjectId;
    startTime: Date;
    endTime: Date;
    date: Date;
    roomId: string;
    completed: boolean;
    result: {
      communicationSkills: number;
      technicalKnowledge: number;
      coachingStyle: number;
      confidencePresence: number;
      brandAlignment: number;
      equipmentQuality: number;
      notes: string;
    };
  };
  status: 'applied' | 'interview_scheduled' | 'interviewed' | 'approved' | 'rejected';
  ratings: { clientId: Types.ObjectId; rating: number; comment?: string }[];
  sessions: Types.ObjectId[];
  chats: Types.ObjectId[];
}

interface IAdminPersonalization {
  adminNotes?: string;
}

interface IPersonalization extends Document {
  userId: Types.ObjectId;
  role: 'client' | 'trainer' | 'admin';
  data: IClientPersonalization | ITrainerPersonalization | IAdminPersonalization;
  createdAt: Date;
  updatedAt: Date;
}

const ClientPersonalizationSchema = new Schema<IClientPersonalization>({
  planStatus: { type: String, enum: ['Active', 'Inactive'], default: 'Inactive' },
  userData: {
    nickName: { type: String, required: true },
    age: { type: Number, required: true, min: 18 },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    address: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    profilePictureId: { type: Schema.Types.ObjectId, ref: 'UserFile', required: false },
    height: { type: Number, required: true },
    currentWeight: { type: Number, required: true },
    targetWeight: { type: Number, required: true },
    fitnessGoal: {
      type: String,
      enum: ['build muscle', 'lose weight', 'get stronger', 'improve endurance', 'tone body', 'increase flexibility'],
      required: true,
    },
    currentFitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'athlete'], required: true },
    activityLevel: { type: String, enum: ['sedentary', 'lightly active', 'moderately active', 'very active'], required: true },
    equipment: { type: [String], enum: ['body weight', 'dumbbells', 'resistance bands', 'kettlebells', 'pull-up bar', 'yoga mat'], default: [] },
    workoutDuration: { type: String, required: true },
    workoutDaysPerWeek: { type: Number, required: true, min: 1, max: 7 },
    healthIssues: { type: [String], required: false },
    medicalCondition: { type: String, required: false },
    dietAllergies: { type: [String], required: false },
    dietMealsPerDay: { type: [String], enum: ['3 meals', '3 meals + 1 snack', '3 meals + 2 snacks', '6 meals'], required: true },
    dietPreferences: { type: String, required: false },
    workoutsCompletedIn28Days: { type: Number, default: 0 },
  },
  workoutPlan: { type: Schema.Types.ObjectId, ref: 'WorkoutPlan', default: null },
  dietPlan: { type: Schema.Types.ObjectId, ref: 'DietPlan', default: null },
  progressLog: { type: Schema.Types.ObjectId, ref: 'ProgressLog', required: true },
  sessions: [{ type: Schema.Types.ObjectId, ref: 'Session', default: [] }],
  chats: [{ type: Schema.Types.ObjectId, ref: 'Chat', default: [] }],
});

const TrainerPersonalizationSchema = new Schema<ITrainerPersonalization>({
  basicInfo: {
    phoneNumber: { type: String, required: true },
    location: { type: String, required: true },
    timeZone: { type: String, required: true },
    dateOfBirth: { type: Date, required: false },
    age: { type: Number, min: 18, required: false },
    gender: { type: String, enum: ['male', 'female', 'other'], required: false },
    profilePictureId: { type: Schema.Types.ObjectId, ref: 'UserFile', required: false },
    weeklySalary: { type: Number, min: 500, max: 2500, required: false },
  },
  professionalSummary: {
    yearsOfExperience: { type: Number, min: 0, required: true },
    certifications: [{
      name: { type: String, required: true },
      issuer: { type: String, required: true },
      proofFileId: { type: Schema.Types.ObjectId, ref: 'UserFile', required: false },
    }],
    specializations: { type: [String], required: true },
    coachingType: { type: [String], enum: ['One-on-One', 'Group', 'Hybrid'], required: true },
    platformsUsed: { type: [String], required: false },
  },
  sampleMaterials: {
    demoVideoLink: { type: String, required: true, match: /^https?:\/\/.+/ },
    portfolioLinks: { type: [String], match: /^https?:\/\/.+/ },
    resumeFileId: { type: Schema.Types.ObjectId, ref: 'UserFile', required: false },
  },
  availability: {
    weeklySlots: [{
      day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
      startTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
      endTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    }],
    engagementType: { type: String, enum: ['full-time', 'part-time', 'contract', 'freelance'], required: true },
  },
  evaluation: {
    communicationSkills: { type: Number, min: 1, max: 5, required: false },
    technicalKnowledge: { type: Number, min: 1, max: 5, required: false },
    coachingStyle: { type: Number, min: 1, max: 5, required: false },
    confidencePresence: { type: Number, min: 1, max: 5, required: false },
    brandAlignment: { type: Number, min: 1, max: 5, required: false },
    equipmentQuality: { type: Number, min: 1, max: 5, required: false },
    notes: { type: String, required: false },
    evaluatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    evaluatedAt: { type: Date, required: false },
  },
  interview: {
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    startTime: { type: Date, required: false },
    endTime: { type: Date, required: false },
    date: { type: Date, required: false },
    roomId: { type: String, required: false },
    completed: { type: Boolean, default: false },
    result: {
      communicationSkills: { type: Number, default: 0 },
      technicalKnowledge: { type: Number, default: 0 },
      coachingStyle: { type: Number, default: 0 },
      confidencePresence: { type: Number, default: 0 },
      brandAlignment: { type: Number, default: 0 },
      equipmentQuality: { type: Number, default: 0 },
      notes: { type: String, default: '' },
    },
  },
  status: {
    type: String,
    enum: ['applied', 'interview_scheduled', 'interviewed', 'approved', 'rejected'],
    default: 'applied',
  },
  ratings: [{
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false },
  }],
  sessions: [{ type: Schema.Types.ObjectId, ref: 'Session', default: [] }],
  chats: [{ type: Schema.Types.ObjectId, ref: 'Chat', default: [] }],
});

const AdminPersonalizationSchema = new Schema<IAdminPersonalization>({
  adminNotes: { type: String, required: false },
});

const PersonalizationSchema = new Schema<IPersonalization>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  role: { type: String, enum: ['client', 'trainer', 'admin'], required: true },
  data: {
    type: Schema.Types.Mixed,
    required: true,
    validate: {
      validator: async function (value: IClientPersonalization | ITrainerPersonalization | IAdminPersonalization) {
        if (!value || typeof value !== 'object') return false;
        try {
          let schema: Schema;
          switch (this.role) {
            case 'client':
              schema = ClientPersonalizationSchema;
              break;
            case 'trainer':
              schema = TrainerPersonalizationSchema;
              break;
            case 'admin':
              schema = AdminPersonalizationSchema;
              break;
            default:
              return false;
          }
          const modelName = `Temp_${this.role}_Personalization`;
          const TempModel = mongoose.models[modelName] || mongoose.model(modelName, schema);
          const tempDoc = new TempModel(value);
          await tempDoc.validate();
          return true;
        } catch (err) {
          console.error('Validation error:', err);
          return false;
        }
      },
      message: 'Invalid personalization data for the specified role.',
    },
  },
}, { timestamps: true });

// Indexes
PersonalizationSchema.index({ userId: 1, role: 1 });

export const PersonalizationModel = model<IPersonalization>('Personalization', PersonalizationSchema);
