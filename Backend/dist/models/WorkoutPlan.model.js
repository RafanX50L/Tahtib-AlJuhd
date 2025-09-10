"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutPlanModel = void 0;
const mongoose_1 = require("mongoose");
const ExerciseSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    sets: { type: Number || String, required: false },
    reps: { type: String, required: false },
    rest: { type: String, required: false },
    duration: { type: String, required: false },
    instructions: { type: String, required: true },
    animationLink: { type: String, default: 'No video available' },
});
const DaySchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    exercises: [ExerciseSchema],
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
const WeekSchema = new mongoose_1.Schema({
    day1: DaySchema,
    day2: DaySchema,
    day3: DaySchema,
    day4: DaySchema,
    day5: DaySchema,
    day6: DaySchema,
    day7: DaySchema,
    completed: { type: Boolean, default: false },
});
const WorkoutPlanSchema = new mongoose_1.Schema({
    week1: WeekSchema,
    week2: WeekSchema,
    week3: WeekSchema,
    week4: WeekSchema,
    notes: { type: String, required: false },
}, { timestamps: true });
exports.WorkoutPlanModel = (0, mongoose_1.model)('WorkoutPlan', WorkoutPlanSchema);
//# sourceMappingURL=WorkoutPlan.model.js.map