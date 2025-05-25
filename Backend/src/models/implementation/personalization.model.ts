import mongoose, { Schema, model } from "mongoose";
import { IAdminPersonalization, IClientPersonalization, ITrainerPersonalization, IPersonalization } from "../interface/IPersonalization";

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
      enum: ["build muscle", "lose weight", "get stronger", "improve endurance", "tone body", "increase flexibility"],
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
      enum: ["body weight", "dumbbells", "resistance bands", "kettlebells", "pull-up bar", "yoga mat"],
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
  },
  workouts: { type: Schema.Types.ObjectId, ref: "WorkoutPlan", default: null },
  dietPlan:{ type: Schema.Types.ObjectId, ref: "DietPlan", default: null },
  posts: { type: Schema.Types.ObjectId, ref: "Post", default: null },
  progress: { type: Schema.Types.ObjectId, ref: "ProgressLog", default: null },
  one_to_one: { type: Schema.Types.ObjectId, ref: "OneToOneSession", default: null },
});

const trainerPersonalizationSchema = new Schema<ITrainerPersonalization>({
  specialty: { type: String, required: true, default: "General" },
  experience: { type: String, required: true, default: "0 years" },
  monthlyFee: { type: String, required: true, default: "$0" },
  expertiseLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
    default: "beginner",
  },
  isActive: { type: Boolean, default: false },
});

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

          try {
            // Select the appropriate schema based on role
            let schema: Schema;
            if (this.role === "client") {
              console.log('nice enterd');
              schema = clientPersonalizationSchema;
            } else if (this.role === "trainer") {
              schema = trainerPersonalizationSchema;
            } else if (this.role === "admin") {
              schema = adminPersonalizationSchema;
            } else {
              return false;
            }

            // Create a temporary model to validate the data
            const TempModel = mongoose.model("TempModel", schema);
            const tempDoc = new TempModel(value);
            await tempDoc.validate();
            return true;
          } catch (error) {
            console.log(error);
            return false;
          }
        },
        message: "Invalid personalization data for the specified role",
      },
    },
  },
  { timestamps: true }
);

// Create an index on userId for faster queries
// personalizationSchema.index({ userId: 1 });

// Export the model
export const PersonalizationModel = model<IPersonalization>("Personalization", personalizationSchema);