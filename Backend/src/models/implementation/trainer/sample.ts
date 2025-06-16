import { Schema, model } from "mongoose";

import { Document } from 'mongoose';

// Interface for BasicInfo
interface BasicInfo {
  phoneNumber: string;
  location: string;
  timeZone: string; // e.g., "America/New_York"
  dateOfBirth?: Date;
  age?: number; // min: 18
  gender?: 'male' | 'female' | 'other';
  profilePhotoId?: string; // References TrainerFile
}

// Interface for Certification
interface Certification {
  name: string;
  issuer: string;
  proofFileId?: string; // References TrainerFile
}

// Interface for ProfessionalSummary
interface ProfessionalSummary {
  yearsOfExperience: number; // min: 0
  certifications: Certification[];
  specializations: string[];
  coachingType: ('One-on-One' | 'Group' | 'Hybrid')[];
  platformsUsed?: string[]; // e.g., ["Zoom", "Google Meet"]
}

// Interface for SampleMaterials
interface SampleMaterials {
  demoVideoLink: string; // Must match /^https?:\/\/.+/
  portfolioLinks?: string[]; // Must match /^https?:\/\/.+/
  resumeFileId?: string; // References TrainerFile
}

// Interface for WeeklySlot
interface WeeklySlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // Matches 00:00 to 23:59, e.g., "09:30"
  endTime: string; // Matches 00:00 to 23:59, e.g., "10:30"
}

// Interface for Availability
interface Availability {
  weeklySlots: WeeklySlot[];
  engagementType: 'full-time' | 'part-time' | 'contract' | 'freelance';
}

// Interface for Evaluation
interface Evaluation {
  communicationSkills?: number; // 1 to 5
  technicalKnowledge?: number; // 1 to 5
  coachingStyle?: number; // 1 to 5
  confidencePresence?: number; // 1 to 5
  brandAlignment?: number; // 1 to 5
  equipmentQuality?: number; // 1 to 5
  notes?: string;
  evaluatedBy?: string; // References User (Admin)
  evaluatedAt?: Date;
}

// Interface for Trainer
interface ITrainer extends Document {
  basicInfo: BasicInfo;
  professionalSummary: ProfessionalSummary;
  sampleMaterials: SampleMaterials;
  availability: Availability;
  evaluation?: Evaluation;
  status: 'applied' | 'interview_scheduled' | 'interviewed' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Interface for TrainerFile
interface TrainerFiles extends Document {
  trainerId: string; // References Trainer (assuming Personalization is Trainer)
  fileName: string;
  filePath: string; // Path to file in storage (e.g., S3)
  fileType: string; // e.g., "pdf", "jpg"
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for AuditLog
interface AuditLogs extends Document {
  userId?: string; // References User (Admin), optional
  action: string; // e.g., "update_status", "add_evaluation"
  entityType: string; // e.g., "trainer"
  entityId: string; // References Trainer (assuming Personalization is Trainer)
  details: unknown; // Flexible context (Schema.Types.Mixed)
  createdAt: Date;
  updatedAt: Date;
}

export {
  BasicInfo,
  Certification,
  ProfessionalSummary,
  SampleMaterials,
  WeeklySlot,
  Availability,
  Evaluation,
  ITrainer,
  TrainerFiles,
  AuditLogs,
};


// Sub-schema: BasicInfo
const BasicInfoSchema = new Schema({
  phoneNumber: { type: String, required: true },
  location: { type: String, required: true },
  timeZone: { type: String, required: true }, // e.g., "America/New_York"
  dateOfBirth: { type: Date, required: false },
  age: { type: Number, required: false, min: 18 },
  gender: { type: String, enum: ["male", "female", "other"], required: false },
  profilePhotoId: {
    type: Schema.Types.ObjectId,
    ref: "TrainerFile",
    required: false,
  },
});

// Sub-schema: Certification
const CertificationSchema = new Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  proofFileId: {
    type: Schema.Types.ObjectId,
    ref: "TrainerFile",
    required: false,
  },
});

// Sub-schema: ProfessionalSummary
const ProfessionalSummarySchema = new Schema({
  yearsOfExperience: { type: Number, required: true, min: 0 },
  certifications: { type: [CertificationSchema], required: true },
  specializations: { type: [String], required: true }, // e.g., ["yoga", "strength"]
  coachingType: {
    type: [String],
    enum: ["One-on-One", "Group", "Hybrid"],
    required: true,
  },
  platformsUsed: { type: [String], required: false }, // e.g., ["Zoom", "Google Meet"]
});

// Sub-schema: SampleMaterials
const SampleMaterialsSchema = new Schema({
  demoVideoLink: { type: String, required: true, match: /^https?:\/\/.+/ },
  portfolioLinks: { type: [String], required: false, match: /^https?:\/\/.+/ },
  resumeFileId: {
    type: Schema.Types.ObjectId,
    ref: "TrainerFile",
    required: false,
  },
});

// Sub-schema: WeeklySlot
const WeeklySlotSchema = new Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
  startTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):[0-5]\d$/, // Matches 00:00 to 23:59
  },
  endTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):[0-5]\d$/,
  },
});

// Sub-schema: Availability
const AvailabilitySchema = new Schema({
  weeklySlots: { type: [WeeklySlotSchema], required: true },
  engagementType: {
    type: String,
    enum: ["full-time", "part-time", "contract", "freelance"],
    required: true,
  },
});

// Sub-schema: Evaluation
const EvaluationSchema = new Schema({
  communicationSkills: { type: Number, min: 1, max: 5, required: false },
  technicalKnowledge: { type: Number, min: 1, max: 5, required: false },
  coachingStyle: { type: Number, min: 1, max: 5, required: false },
  confidencePresence: { type: Number, min: 1, max: 5, required: false },
  brandAlignment: { type: Number, min: 1, max: 5, required: false },
  equipmentQuality: { type: Number, min: 1, max: 5, required: false },
  notes: { type: String, required: false },
  evaluatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false }, // Admin user
  evaluatedAt: { type: Date, required: false },
});

// Schema: Trainer
export const TrainerSchema = new Schema(
  {
    basicInfo: { type: BasicInfoSchema, required: true },
    professionalSummary: { type: ProfessionalSummarySchema, required: true },
    sampleMaterials: { type: SampleMaterialsSchema, required: true },
    availability: { type: AvailabilitySchema, required: true },
    evaluation: { type: EvaluationSchema, required: false },
    status: {
      type: String,
      enum: [
        "applied",
        "interview_scheduled",
        "interviewed",
        "approved",
        "rejected",
      ],
      required: true,
      default: "applied",
    },
  },
  { timestamps: true }
);

// Indexes for Trainer
TrainerSchema.index({ status: 1 });
TrainerSchema.index({ "availability.weeklySlots.day": 1 });

// Schema: TrainerFile
const TrainerFileSchema = new Schema(
  {
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: "Personalization",
      required: true,
    }, // Reference Personalization
    fileName: { type: String, required: true },
    filePath: { type: String, required: true }, // Path to file in storage (e.g., S3)
    fileType: { type: String, required: true }, // e.g., "pdf", "jpg"
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for TrainerFile
TrainerFileSchema.index({ trainerId: 1 });

// Schema: AuditLog
const AuditLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false }, // Admin or null
    action: { type: String, required: true }, // e.g., "update_status", "add_evaluation"
    entityType: { type: String, required: true }, // e.g., "trainer"
    entityId: {
      type: Schema.Types.ObjectId,
      ref: "Personalization",
      required: true,
    }, // Reference Personalization
    details: { type: Schema.Types.Mixed, required: true }, // Flexible context
  },
  { timestamps: true }
);

// Index for AuditLog
AuditLogSchema.index({ entityType: 1, entityId: 1 });

// Models
export const TrainerFile = model("TrainerFile", TrainerFileSchema);
export const AuditLog = model("AuditLog", AuditLogSchema);
