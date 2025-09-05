import { Schema, model } from 'mongoose';
const ExerciseSchema = new Schema({
    name: { type: String, required: true },
    sets: { type: Number, required: false },
    reps: { type: String, required: false },
    rest: { type: String, required: false },
    instructions: { type: String, required: true },
    animationLink: { type: String, default: 'No video available' },
});
const DaySchema = new Schema({
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
const WeeklyChallengeSchema = new Schema({
    type: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    tasks: [DaySchema],
    enteredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    score: { type: Number, required: true },
}, { timestamps: true });
// Index
WeeklyChallengeSchema.index({ type: 1, startDate: 1 });
export const WeeklyChallengeModel = model('WeeklyChallenge', WeeklyChallengeSchema);
//# sourceMappingURL=WeeklyChallenge.model.js.map