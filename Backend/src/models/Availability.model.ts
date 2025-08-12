import { IAvailability } from "@/core/interface/model/IAvailability";
import { model, Schema } from "mongoose";

const AvailabilitySchema = new Schema<IAvailability>({
  trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  slots: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  }],
}, { timestamps: true });

export const AvailabilityModel = model<IAvailability>('Availability', AvailabilitySchema);