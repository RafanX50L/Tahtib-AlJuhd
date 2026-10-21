"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeeklyChallengeModel = void 0;
const mongoose_1 = require("mongoose");
const ExerciseSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    sets: { type: Number, required: false },
    reps: { type: String, required: false },
    rest: { type: String, required: false },
    instructions: { type: String, required: true },
    animationLink: { type: String, default: 'No video available' },
});
const DaySchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    exercises: { type: [ExerciseSchema], required: true },
    completed: { type: Boolean, default: false },
    report: {
        totalExercises: Number,
        totalSets: Number,
        estimatedDuration: String,
        caloriesBurned: Number,
        intensity: String,
        feedback: String,
    },
});
const WeeklyChallengeSchema = new mongoose_1.Schema({
    type: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    tasks: [DaySchema],
    enteredUsers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    score: { type: Number, required: true },
}, { timestamps: true });
// Index
WeeklyChallengeSchema.index({ type: 1, startDate: 1 });
exports.WeeklyChallengeModel = (0, mongoose_1.model)('WeeklyChallenge', WeeklyChallengeSchema);
//# sourceMappingURL=WeeklyChallenge.model.js.map