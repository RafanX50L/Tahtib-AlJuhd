import { Schema, model, Document, Types } from "mongoose";

export interface IClientPersonalization {
  trainer: string;
  planStatus: "Active" | "Inactive";
  sessionStatus: "Purchased" | "Not Purchased";
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
  data: IClientPersonalization | ITrainerPersonalization | IAdminPersonalization;
}

// Sub-schemas define the structure for role-specific personalization data.
// Used for TypeScript interfaces and documentation; not directly enforced in the validator.
const clientPersonalizationSchema = new Schema<IClientPersonalization>({
  trainer: { type: String, required: true, default: "Unassigned" },
  planStatus: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Inactive",
  },
  sessionStatus: {
    type: String,
    enum: ["Purchased", "Not Purchased"],
    default: "Not Purchased",
  },
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
        validator: function (value: any) {
          if (!value || typeof value !== "object") return false;

          if (this.role === "client") {
            return (
              typeof value.trainer === "string" &&
              ["Active", "Inactive"].includes(value.planStatus) &&
              ["Purchased", "Not Purchased"].includes(value.sessionStatus)
            );
          } else if (this.role === "trainer") {
            return (
              typeof value.specialty === "string" &&
              typeof value.experience === "string" &&
              typeof value.monthlyFee === "string" &&
              ["beginner", "intermediate", "advanced"].includes(value.expertiseLevel) &&
              typeof value.isActive === "boolean"
            );
          } else if (this.role === "admin") {
            return (
              value.adminNotes === undefined || typeof value.adminNotes === "string"
            );
          }
          return false;
        },
        message: "Invalid personalization data for the specified role",
      },
    },
  },
  { timestamps: true }
);

personalizationSchema.index({ userId: 1 });

export const PersonalizationModel = model<IPersonalization>("Personalization", personalizationSchema);