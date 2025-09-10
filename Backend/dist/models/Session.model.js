"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionModel = void 0;
const mongoose_1 = require("mongoose");
const SessionSchema = new mongoose_1.Schema({
    trainerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    // planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["free", 'booked', 'completed', 'canceled'], default: 'booked' },
    meetingLink: { type: String, required: true },
}, { timestamps: true });
exports.SessionModel = (0, mongoose_1.model)('Session', SessionSchema);
//# sourceMappingURL=Session.model.js.map