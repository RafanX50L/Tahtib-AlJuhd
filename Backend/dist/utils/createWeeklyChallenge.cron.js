var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cron from 'node-cron';
import { WeeklyChallengeModel } from '../models/WeeklyChallenge.model';
import { generateExercisesForWeek } from './gemini1.utils';
const createWeeklyChallenge = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const startOfWeek = new Date(now.setHours(0, 0, 0, 0));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        // Check for both types
        const existingBeginner = yield WeeklyChallengeModel.findOne({
            type: 'beginner',
            startDate: {
                $gte: startOfWeek,
                $lt: new Date(startOfWeek.getTime() + 24 * 60 * 60 * 1000)
            }
        });
        const existingIntermediate = yield WeeklyChallengeModel.findOne({
            type: 'intermediate',
            startDate: {
                $gte: startOfWeek,
                $lt: new Date(startOfWeek.getTime() + 24 * 60 * 60 * 1000)
            }
        });
        const existingAdvanced = yield WeeklyChallengeModel.findOne({
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
        const beginnerTasks = yield generateExercisesForWeek('beginner');
        const intermediateTasks = yield generateExercisesForWeek('intermediate');
        const advancedTasks = yield generateExercisesForWeek('advanced');
        console.log('Beginner Tasks:', beginnerTasks, '/n Intermediate Tasks:', intermediateTasks, '/n Advanced Tasks:', advancedTasks);
        if (!existingBeginner) {
            yield new WeeklyChallengeModel({
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
            yield new WeeklyChallengeModel({
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
            yield new WeeklyChallengeModel({
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
});
// Run every Sunday at 12:05 AM (5 12 * * *)
// ┌───────────── minute (0 - 59)
// │ ┌───────────── hour (0 - 23) → 24-hour format
// │ │ ┌───────────── day of month (1 - 31)
// │ │ │ ┌───────────── month (1 - 12)
// │ │ │ │ ┌───────────── day of week (0 - 6) (Sunday = 0)
// │ │ │ │ │
// │ │ │ │ │
// * * * * *
cron.schedule('00 10 * * 0', () => {
    console.log('🕐 Running weekly challenge cron job...');
    createWeeklyChallenge();
});
//# sourceMappingURL=createWeeklyChallenge.cron.js.map