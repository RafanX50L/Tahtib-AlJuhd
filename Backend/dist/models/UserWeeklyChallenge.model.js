"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWeeklyChallengeModel = void 0;
const mongoose_1 = require("mongoose");
const DayReportSchema = new mongoose_1.Schema({
    dayIndex: { type: Number, required: true, min: 0, max: 6 },
    completed: { type: Boolean, default: false },
    report: {
        totalExercises: { type: Number, required: false },
        totalSets: { type: Number, required: false },
        estimatedDuration: { type: String, required: false },
        caloriesBurned: { type: Number, required: false },
        intensity: { type: String, required: false },
        feedback: { type: String, required: false },
    },
    completedAt: { type: Date, required: false },
});
const UserWeeklyChallengeSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    challenge: { type: mongoose_1.Schema.Types.ObjectId, ref: 'WeeklyChallenge', required: true },
    type: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    startDate: { type: Date, required: true },
    progress: { type: [DayReportSchema], default: [], validate: [v => v.length <= 7, 'Progress cannot exceed 7 days'] },
    score: { type: Number, default: 0 },
}, { timestamps: true });
// Index
UserWeeklyChallengeSchema.index({ user: 1, challenge: 1 });
exports.UserWeeklyChallengeModel = (0, mongoose_1.model)('UserWeeklyChallenge', UserWeeklyChallengeSchema);
//# sourceMappingURL=UserWeeklyChallenge.model.js.map