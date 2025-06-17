import mongoose, { Schema, model } from "mongoose";
import {
  IAdminPersonalization,
  IClientPersonalization,
  IPersonalization,
} from "../interface/IPersonalization";
import { TrainerSchema } from "./trainer/sample";

// Sub-schemas for role-specific personalization data
const clientPersonalizationSchema = new Schema<IClientPersonalization>({
  planStatus: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Inactive",
  },
  user_data: {
    nick_name: { type: String, required: true },
    age: { type: String, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: true,
    },
    height: { type: String, required: true },
    current_weight: { type: String, required: true },
    target_weight: { type: String, required: true },
    fitness_goal: {
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
    current_fitness_level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "athlete"],
      required: true,
    },
    activity_level: {
      type: String,
      enum: ["sedentary", "lightly active", "moderately active", "very active"],
      required: true,
    },
    equipments: {
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
    workout_duration: { type: String, required: true },
    workout_days_perWeek: { type: Number, required: true },
    health_issues: { type: Schema.Types.Mixed }, // Flexible for array or string
    medical_condition: { type: String },
    diet_allergies: { type: Schema.Types.Mixed }, // Flexible for array or string
    diet_meals_perDay: {
      type: [String],
      enum: ["3 meals", "3 meals + 1 snack", "3 meals + 2 snacks", "6 meals"],
      required: true,
    },
    diet_preferences: { type: String },
    workout_completed_of_28days: { type: Number, default: 0 },
  },
  workouts: { type: Schema.Types.ObjectId, ref: "WorkoutPlan", default: null },
  dietPlan: { type: Schema.Types.ObjectId, ref: "DietPlan", default: null },
  posts: { type: Schema.Types.ObjectId, ref: "Post", default: null },
  progress: { type: Schema.Types.ObjectId, ref: "ProgressLog", default: null },
  one_to_one: {
    type: Schema.Types.ObjectId,
    ref: "OneToOneSession",
    default: null,
  },
});



const trainerPersonalizationSchema = TrainerSchema;
const adminPersonalizationSchema = new Schema<IAdminPersonalization>({
  adminNotes: { type: String },
});

// Main personalization schema
const personalizationSchema = new Schema<IPersonalization>(
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
        validator: async function (value: any) {
          if (!value || typeof value !== "object") return false;
          
          console.log(this.role,'the role is and rafan and salman   have andi?? ',this,value);
          console.log('suuuuu',value.role);
          try {
            let schema: Schema;

            switch (value.role) {
              case "client":
                schema =
                  clientPersonalizationSchema as Schema<IClientPersonalization>;
                break;
              case "trainer":
                schema = trainerPersonalizationSchema as Schema<any>;
                break;
              case "admin":
                schema =
                  adminPersonalizationSchema as Schema<IAdminPersonalization>;
                break;
              default:
                return false;
            }

            // Avoid OverwriteModelError by checking for existing model
            const modelName = `Temp_${this.role}_Personalization`;
            console.log(modelName);
            const TempModel =
              mongoose.models[modelName] || mongoose.model(modelName, schema);

            const tempDoc = new TempModel(value);
            const temp = await tempDoc.validate();
            console.log("Validation successful:", temp);

            return true;
          } catch (err) {
            console.log("Validation error:", err);
            return false;
          }
        },
        message: () => `Invalid personalization data for the specified role.`,
      },
    },
  },
  { timestamps: true }
);

// Create an index on userId for faster queries
// personalizationSchema.index({ userId: 1 });

// Export the model
export const PersonalizationModel = model<IPersonalization>(
  "Personalization",
  personalizationSchema
);
