"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const WeeklyChallenge_model_1 = require("../models/WeeklyChallenge.model");
const gemini1_utils_1 = require("./gemini1.utils");
const createWeeklyChallenge = async () => {
    try {
        const now = new Date();
        const startOfWeek = new Date(now.setHours(0, 0, 0, 0));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        // Check for both types
        const existingBeginner = await WeeklyChallenge_model_1.WeeklyChallengeModel.findOne({
            type: 'beginner',
            startDate: {
                $gte: startOfWeek,
                $lt: new Date(startOfWeek.getTime() + 24 * 60 * 60 * 1000)
            }
        });
        const existingIntermediate = await WeeklyChallenge_model_1.WeeklyChallengeModel.findOne({
            type: 'intermediate',
            startDate: {
                $gte: startOfWeek,
                $lt: new Date(startOfWeek.getTime() + 24 * 60 * 60 * 1000)
            }
        });
        const existingAdvanced = await WeeklyChallenge_model_1.WeeklyChallengeModel.findOne({
            type: 'advanced',
            startDate: {
                $gte: startOfWeek,
                $lt: new Date(startOfWeek.getTime() + 24 * 60 * 60 * 1000)
            }
        });
        if (existingBeginner && existingAdvanced && existingIntermediate) {
            console.log('⚠️ Both weekly challenges already exist.');
            return;
        }
        // Generate different workouts
        const beginnerTasks = await (0, gemini1_utils_1.generateExercisesForWeek)('beginner');
        const intermediateTasks = await (0, gemini1_utils_1.generateExercisesForWeek)('intermediate');
        const advancedTasks = await (0, gemini1_utils_1.generateExercisesForWeek)('advanced');
        console.log('Beginner Tasks:', beginnerTasks, '/n Intermediate Tasks:', intermediateTasks, '/n Advanced Tasks:', advancedTasks);
        if (!existingBeginner) {
            await new WeeklyChallenge_model_1.WeeklyChallengeModel({
                type: 'beginner',
                startDate: startOfWeek,
                endDate: endOfWeek,
                tasks: beginnerTasks,
                enteredUsers: [],
                score: 100
            }).save();
            console.log('✅ Beginner challenge created');
        }
        if (!existingIntermediate) {
            await new WeeklyChallenge_model_1.WeeklyChallengeModel({
                type: 'intermediate',
                startDate: startOfWeek,
                endDate: endOfWeek,
                tasks: intermediateTasks,
                enteredUsers: [],
                score: 200
            }).save();
            console.log('✅ Intermediate challenge created');
        }
        if (!existingAdvanced) {
            await new WeeklyChallenge_model_1.WeeklyChallengeModel({
                type: 'advanced',
                startDate: startOfWeek,
                endDate: endOfWeek,
                tasks: advancedTasks,
                enteredUsers: [],
                score: 300
            }).save();
            console.log('✅ Advanced challenge created');
        }
    }
    catch (err) {
        console.error('❌ Error creating weekly challenges:', err);
    }
};
// Run every Sunday at 12:05 AM (5 12 * * *)
// ┌───────────── minute (0 - 59)
// │ ┌───────────── hour (0 - 23) → 24-hour format
// │ │ ┌───────────── day of month (1 - 31)
// │ │ │ ┌───────────── month (1 - 12)
// │ │ │ │ ┌───────────── day of week (0 - 6) (Sunday = 0)
// │ │ │ │ │
// │ │ │ │ │
// * * * * *
node_cron_1.default.schedule('21 10 * * *', () => {
    console.log('🕐 Running weekly challenge cron job...');
    createWeeklyChallenge();
});
//# sourceMappingURL=createWeeklyChallenge.cron.js.map