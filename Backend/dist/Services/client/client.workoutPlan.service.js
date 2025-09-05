var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WorkotsDto } from "../../dtos/client/WorkoutsDTO";
import { createHttpError } from "../../utils";
import { generateFitnessPlan, generateWorkoutReport, } from "../../utils/gemini1.utils";
import { Types } from "mongoose";
export class ClientWorkoutPlanService {
    constructor(_workoutPlanRepository, _personalizationRepository) {
        this._workoutPlanRepository = _workoutPlanRepository;
        this._personalizationRepository = _personalizationRepository;
    }
    getWorkouts(userId, week) {
        return __awaiter(this, void 0, void 0, function* () {
            const personalization = (yield this._personalizationRepository.getPersonalization(userId));
            const workoutId = new Types.ObjectId(personalization.data.workoutPlanId);
            const workouts = yield this._workoutPlanRepository.getWorkouts(workoutId);
            if (workouts[`week${week}`]) {
                const workotsDto = yield WorkotsDto.mapToWorkoutData(workouts[`week${week}`]);
                return workotsDto;
            }
            else {
                return null;
            }
        });
    }
    completeDailyWorkoutAndFetchReport(userId, week, day, workout) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultReport = {
                caloriesBurned: 500, // Example value
                duration: 60, // Example value in minutes
                feedback: "Great job! Keep it up!", // Example feedback
                intensity: "low",
                estimatedDuration: "60 minutes",
                totalExercises: 5,
                totalSets: 15,
            };
            // 1. Generate report
            const report = workout.length === 0
                ? defaultReport
                : yield generateWorkoutReport(workout);
            // 2. Increment completion counter
            const clientData = (yield this._personalizationRepository.updateClientWorkoutCompletionCounter(userId)).data;
            const workoutId = clientData.workoutPlanId;
            if (!workoutId)
                throw createHttpError(400, "No workout plan assigned to user");
            // 3. Generate next week if it’s day7
            if (day === "day7") {
                const workoutPlan = (yield this._workoutPlanRepository.findById(workoutId));
                const previousWeekWorkouts = workoutPlan[`${week}`]; // assuming the keys are like week1, week2, etc.
                const currentWeek = parseInt(week.replace("week", ""), 10);
                const nextWeekPlan = yield generateFitnessPlan(clientData.userData, currentWeek + 1, "workout", previousWeekWorkouts);
                yield this._workoutPlanRepository.insertNextWeek(workoutId, `week${currentWeek + 1}`, nextWeekPlan);
                yield this._workoutPlanRepository.markWeekAsCompleted(workoutId, `week${currentWeek}`);
            }
            // 4. Mark current day complete and save report
            yield this._workoutPlanRepository.markWorkoutDayAsComplete(workoutId, week, day, report);
            return report;
        });
    }
}
//# sourceMappingURL=client.workoutPlan.service.js.map