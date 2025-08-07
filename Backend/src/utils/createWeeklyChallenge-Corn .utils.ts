import cron from 'node-cron';
import { WeeklyChallengeModel } from '@/models/WeeklyChallenge.model';
import { generateExercisesForWeek } from './gemini1.utils';


const createWeeklyChallenge = async () => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now.setHours(0, 0, 0, 0));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    // Check for both types
    const existingBeginner = await WeeklyChallengeModel.findOne({
      type: 'beginner',
      startDate: {
        $gte: startOfWeek,
        $lt: new Date(startOfWeek.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    const existingIntermediate = await WeeklyChallengeModel.findOne({
      type: 'intermediate',
      startDate: {
        $gte: startOfWeek,
        $lt: new Date(startOfWeek.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    const existingAdvanced = await WeeklyChallengeModel.findOne({
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
    const beginnerTasks = await generateExercisesForWeek('beginner');
    const intermediateTasks = await generateExercisesForWeek('intermediate');
    const advancedTasks = await generateExercisesForWeek('advanced');

    console.log('Beginner Tasks:', beginnerTasks,'/n Intermediate Tasks:', intermediateTasks,'/n Advanced Tasks:', advancedTasks);

    if (!existingBeginner) {
      await new WeeklyChallengeModel({
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
      await new WeeklyChallengeModel({
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
      await new WeeklyChallengeModel({
        type: 'advanced',
        startDate: startOfWeek,
        endDate: endOfWeek,
        tasks: advancedTasks,
        enteredUsers: [],
        score: 300
      }).save();
      console.log('✅ Advanced challenge created');
    }
  } catch (err) {
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

cron.schedule('27 14 * * 0', () => {
  console.log('🕐 Running weekly challenge cron job...');
  createWeeklyChallenge();
});