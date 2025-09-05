import { model, Schema } from "mongoose";
const SessionSchema = new Schema({
    trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    // planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["free", 'booked', 'completed', 'canceled'], default: 'booked' },
    meetingLink: { type: String, required: true },
}, { timestamps: true });
export const SessionModel = model('Session', SessionSchema);
//# sourceMappingURL=Session.model.js.map