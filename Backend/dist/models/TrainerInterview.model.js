"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerInterviewModel = void 0;
const mongoose_1 = require("mongoose");
const resultSchema = new mongoose_1.Schema({
    communicationSkills: { type: Number, min: 1, max: 5, default: 0 },
    technicalKnowledge: { type: Number, min: 1, max: 5, default: 0 },
    coachingStyle: { type: Number, min: 1, max: 5, default: 0 },
    confidencePresence: { type: Number, min: 1, max: 5, default: 0 },
    brandAlignment: { type: Number, min: 1, max: 5, default: 0 },
    equipmentQuality: { type: Number, min: 1, max: 5, default: 0 },
    notes: { type: String, default: "" },
}, { _id: false });
const trainerInterviewSchema = new mongoose_1.Schema({
    adminId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    trainerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Personalization", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    date: { type: Date, required: true },
    roomId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    result: { type: resultSchema, default: () => ({}) },
}, { timestamps: true });
// Indexes
trainerInterviewSchema.index({ trainerId: 1 });
// trainerInterviewSchema.index({ adminId: 1 });
exports.TrainerInterviewModel = (0, mongoose_1.model)("TrainerInterview", trainerInterviewSchema);
//# sourceMappingURL=TrainerInterview.model.js.map