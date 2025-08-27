import {
  IAdminPersonalization,
  IClientPersonalization,
  IPersonalization,
  ITrainerPersonalization,
} from "@/core/interface/model/IPersonalization.model";
import mongoose, { Schema, model } from "mongoose";

// const ClientPersonalizationSchema = new Schema<IClientPersonalization>({
//   planStatus: { type: String, enum: ['Active', 'Inactive'], default: 'Inactive' },
//   userData: {
//     nickName: { type: String, required: true },
//     age: { type: Number, required: true, min: 18 },
//     gender: { type: String, enum: ['male', 'female', 'other'], required: true },
//     address: { type: String, required: false },
//     phoneNumber: { type: String, required: false },
//     profilePictureId: { type: Schema.Types.ObjectId, ref: 'UserFile', required: false },
//     height: { type: Number, required: true },
//     currentWeight: { type: Number, required: true },
//     targetWeight: { type: Number, required: true },
//     fitnessGoal: {
//       type: String,
//       enum: ['build muscle', 'lose weight', 'get stronger', 'improve endurance', 'tone body', 'increase flexibility'],
//       required: true,
//     },
//     currentFitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'athlete'], required: true },
//     activityLevel: { type: String, enum: ['sedentary', 'lightly active', 'moderately active', 'very active'], required: true },
//     equipment: { type: [String], enum: ['body weight', 'dumbbells', 'resistance bands', 'kettlebells', 'pull-up bar', 'yoga mat'], default: [] },
//     workoutDuration: { type: String, required: true },
//     workoutDaysPerWeek: { type: Number, required: true, min: 1, max: 7 },
//     healthIssues: { type: [String], required: false },
//     medicalCondition: { type: String, required: false },
//     dietAllergies: { type: [String], required: false },
//     dietMealsPerDay: { type: [String], enum: ['3 meals', '3 meals + 1 snack', '3 meals + 2 snacks', '6 meals'], required: true },
//     dietPreferences: { type: String, required: false },
//     workoutsCompletedIn28Days: { type: Number, default: 0 },
//   },
//   workoutPlanId: { type: Schema.Types.ObjectId, ref: 'WorkoutPlan', default: null },
//   dietPlanId: { type: Schema.Types.ObjectId, ref: 'DietPlan', default: null },
//   progressLogId: { type: Schema.Types.ObjectId, ref: 'ProgressLog', required: false,default:null },
//   sessionsId: [{ type: Schema.Types.ObjectId, ref: 'Session', default: [] }],
//   chatsId: [{ type: Schema.Types.ObjectId, ref: 'Chat', default: [] }],
// });

const ClientPersonalizationSchema = new Schema<IClientPersonalization>({
  planStatus: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Inactive",
  },
  userData: {
    nickName: { type: String, required: true },
    age: { type: Number, required: true, min: 18 },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    address: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    profilePictureId: {
      type: Schema.Types.ObjectId,
      ref: "UserFile",
      required: false,
    },
    height: { type: Number, required: true },
    currentWeight: { type: Number, required: true },
    targetWeight: { type: Number, required: true },
    fitnessGoal: {
      type: String,
      enum: [
        "build muscle",
        "lose weight",
        "get stronger",
        "improve endurance",
        "tone body",
        "increase flexibility",
      ],
      required: true,
    },
    currentFitnessLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "athlete"],
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "lightly active", "moderately active", "very active"],
      required: true,
    },
    equipment: {
      type: [String],
      enum: [
        "body weight",
        "dumbbells",
        "resistance bands",
        "kettlebells",
        "pull-up bar",
        "yoga mat",
      ],
      default: [],
    },
    workoutDuration: { type: String, required: true },
    workoutDaysPerWeek: { type: Number, required: true, min: 1, max: 7 },
    healthIssues: { type: [String], required: false },
    medicalCondition: { type: String, required: false },
    dietAllergies: { type: [String], required: false },
    dietMealsPerDay: {
      type: [String],
      enum: ["3 meals", "3 meals + 1 snack", "3 meals + 2 snacks", "6 meals"],
      required: true,
    },
    dietPreferences: { type: String, required: false },
    workoutsCompletedIn28Days: { type: Number, default: 0 },
  },
  workoutPlanId: {
    type: Schema.Types.ObjectId,
    ref: "WorkoutPlan",
    default: null,
  },
  dietPlanId: { type: Schema.Types.ObjectId, ref: "DietPlan", default: null },
  progressLogId: {
    type: Schema.Types.ObjectId,
    ref: "ProgressLog",
    required: false,
    default: null,
  },
  sessionsId: [{ type: Schema.Types.ObjectId, ref: "Session", default: [] }],
  chatsId: [
    // Updated to track chats per trainer
    {
      trainerId: {
        type: Schema.Types.ObjectId,
        ref: "Trainer",
        required: true,
      },
      chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
      // startDate: { type: Date, default: Date.now } // Optional: Uncomment if you want to track when chat began
    },
  ],
  currentTrainerId: {
    type: Schema.Types.ObjectId,
    ref: "Trainer",
    default: null,
  }, // Tracks active trainer
  previousTrainers: [
    // Tracks history of past trainers
    {
      trainerId: {
        type: Schema.Types.ObjectId,
        ref: "Trainer",
        required: true,
      },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      // reason: { type: String, enum: ['switched', 'canceled', 'expired'], default: 'switched' } // Optional: Uncomment to track why trainer changed
    },
  ],
  contracts: [
    { type: Schema.Types.ObjectId, ref: "TrainerClientContract", default: [] },
  ],
});

const AdminPersonalizationSchema = new Schema<IAdminPersonalization>({
  adminNotes: { type: String, required: false },
});

const TrainerPersonalizationSchema = new Schema<ITrainerPersonalization>({
  basicInfo: {
    phoneNumber: { type: String, required: true },
    location: { type: String, required: true },
    timeZone: { type: String, required: true },
    dateOfBirth: { type: Date, required: false },
    age: { type: Number, min: 18, required: false },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false,
    },
    profilePictureId: {
      type: Schema.Types.ObjectId,
      ref: "UserFile",
      required: false,
    },
    weeklySalary: { type: Number, min: 500, max: 2500, required: false },
  },
  professionalSummary: {
    yearsOfExperience: { type: Number, min: 0, required: true },
    certifications: [
      {
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        proofFileId: {
          type: Schema.Types.ObjectId,
          ref: "UserFile",
          required: false,
        },
      },
    ],
    specializations: { type: [String], required: true },
    coachingType: {
      type: [String],
      enum: ["One-on-One", "Group", "Hybrid"],
      required: true,
    },
    platformsUsed: { type: [String], required: false },
  },
  sampleMaterials: {
    demoVideoLink: { type: String, required: true, match: /^https?:\/\/.+/ },
    portfolioLinks: { type: [String], match: /^https?:\/\/.+/ },
    resumeFileId: {
      type: Schema.Types.ObjectId,
      ref: "UserFile",
      required: false,
    },
  },
  availability: {
    weeklyRules: {
      type: Map,
      of: [
        {
          startTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):[0-5]\d$/,
          },
          endTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):[0-5]\d$/,
          },
        },
      ],
      default: {},
    },
    slotLength: { type: Number, default: 30 },
    bufferMinutes: { type: Number, default: 1 },
    engagementType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "freelance"],
      required: true,
    },
  },
  evaluation: {
    communicationSkills: { type: Number, min: 1, max: 5, required: false },
    technicalKnowledge: { type: Number, min: 1, max: 5, required: false },
    coachingStyle: { type: Number, min: 1, max: 5, required: false },
    confidencePresence: { type: Number, min: 1, max: 5, required: false },
    brandAlignment: { type: Number, min: 1, max: 5, required: false },
    equipmentQuality: { type: Number, min: 1, max: 5, required: false },
    notes: { type: String, required: false },
    evaluatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
    evaluatedAt: { type: Date, required: false },
  },
  interviewDetailsId: {
    type: Schema.Types.ObjectId,
    ref: "TrainerInterview",
    default: null,
  },

  status: {
    type: String,
    enum: [
      "applied",
      "interview_scheduled",
      "interviewed",
      "approved",
      "rejected",
    ],
    default: "applied",
  },
  ratings: [
    {
      clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: false },
    },
  ],
  sessions: [{ type: Schema.Types.ObjectId, ref: "Session", default: [] }],
  chats: [{ type: Schema.Types.ObjectId, ref: "Chat", default: [] }],
  plans: [{ type: Schema.Types.ObjectId, ref: "Plan", default: [] }], // New
  contracts: [
    { type: Schema.Types.ObjectId, ref: "TrainerClientContract", default: [] },
  ],
});

const PersonalizationSchema = new Schema<IPersonalization>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["client", "trainer", "admin"],
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
      validate: {
        validator: async function (
          value:
            | IClientPersonalization
            | ITrainerPersonalization
            | IAdminPersonalization
        ) {
          if (!value || typeof value !== "object") return false;
          try {
            let schema: Schema;
            switch (this.role) {
              case "client":
                schema = ClientPersonalizationSchema;
                break;
              case "trainer":
                schema = TrainerPersonalizationSchema;
                break;
              case "admin":
                schema = AdminPersonalizationSchema;
                break;
              default:
                return false;
            }
            const modelName = `Temp_${this.role}_Personalization`;
            const TempModel =
              mongoose.models[modelName] || mongoose.model(modelName, schema);
            const tempDoc = new TempModel(value);
            await tempDoc.validate();
            return true;
          } catch (err) {
            console.error("Validation error:", err);
            return false;
          }
        },
        message: "Invalid personalization data for the specified role.",
      },
    },
  },
  { timestamps: true }
);

// Indexes
PersonalizationSchema.index({ userId: 1, role: 1 });

export const PersonalizationModel = model<IPersonalization>(
  "Personalization",
  PersonalizationSchema
);
