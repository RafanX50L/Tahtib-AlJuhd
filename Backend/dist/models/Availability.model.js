import { model, Schema } from "mongoose";
const AvailabilitySchema = new Schema({
    trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    slots: [{
            day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true },
        }],
}, { timestamps: true });
export const AvailabilityModel = model('Availability', AvailabilitySchema);
//# sourceMappingURL=Availability.model.js.map