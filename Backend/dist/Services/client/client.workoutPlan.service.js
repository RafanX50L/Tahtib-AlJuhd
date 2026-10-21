"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientWorkoutPlanService = void 0;
const WorkoutsDTO_1 = require("../../dtos/client/WorkoutsDTO");
const utils_1 = require("../../utils");
const gemini1_utils_1 = require("../../utils/gemini1.utils");
const mongoose_1 = require("mongoose");
class ClientWorkoutPlanService {
    _workoutPlanRepository;
    _personalizationRepository;
    constructor(_workoutPlanRepository, _personalizationRepository) {
        this._workoutPlanRepository = _workoutPlanRepository;
        this._personalizationRepository = _personalizationRepository;
    }
    /** Reserved for Workout plan specific methods */
    _placeholder;
    async getWorkouts(userId, week) {
        const personalization = (await this._personalizationRepository.getPersonalization(userId));
        const workoutId = new mongoose_1.Types.ObjectId(personalization.data.workoutPlanId);
        const workouts = await this._workoutPlanRepository.getWorkouts(workoutId);
        if (workouts[`week${week}`]) {
            const workotsDto = await WorkoutsDTO_1.WorkotsDto.mapToWorkoutData(workouts[`week${week}`]);
            return workotsDto;
        }
        else {
            return null;
        }
    }
    async completeDailyWorkoutAndFetchReport(userId, week, day, workout) {
        const defaultReport = {
            caloriesBurned: 0,
            duration: 0,
            feedback: "Great job! Keep it up!",
            intensity: "low",
            estimatedDuration: "0 minutes",
            totalExercises: 0,
            totalSets: 0,
        };
        const report = workout.length === 0
            ? defaultReport
            : await (0, gemini1_utils_1.generateWorkoutReport)(workout);
        const clientData = (await this._personalizationRepository.updateClientWorkoutCompletionCounter(userId)).data;
        const workoutId = clientData.workoutPlanId;
        if (!workoutId)
            throw (0, utils_1.createHttpError)(400, "No workout plan assigned to user");
        if (day === "day7") {
            const workoutPlan = (await this._workoutPlanRepository.findById(workoutId));
            const previousWeekWorkouts = workoutPlan[`${week}`];
            const currentWeek = parseInt(week.replace("week", ""), 10);
            const nextWeekPlan = await (0, gemini1_utils_1.generateFitnessPlan)(clientData.userData, currentWeek + 1, "workout", previousWeekWorkouts);
            await this._workoutPlanRepository.insertNextWeek(workoutId, `week${currentWeek + 1}`, nextWeekPlan[`week${currentWeek + 1}`]);
            await this._workoutPlanRepository.markWeekAsCompleted(workoutId, `week${currentWeek}`);
        }
        await this._workoutPlanRepository.markWorkoutDayAsComplete(workoutId, week, day, report);
        return report;
    }
    async getWorkoutReport(userId, week, day) {
        const personalization = (await this._personalizationRepository.getPersonalization(userId));
        const workoutId = new mongoose_1.Types.ObjectId(personalization.data.workoutPlanId);
        if (!workoutId) {
            throw (0, utils_1.createHttpError)(400, "No workout plan assigned to user");
        }
        const workoutPlan = await this._workoutPlanRepository.findById(workoutId);
        if (!workoutPlan) {
            throw (0, utils_1.createHttpError)(404, "Workout plan not found");
        }
        const weekData = workoutPlan[`${week}`];
        if (!weekData) {
            throw (0, utils_1.createHttpError)(404, `${week} not found in workout plan`);
        }
        const dayData = weekData[day];
        if (!dayData) {
            throw (0, utils_1.createHttpError)(404, `${day} not found in week ${week}`);
        }
        // Return the report if it exists, otherwise return null
        return dayData.report || null;
    }
}
exports.ClientWorkoutPlanService = ClientWorkoutPlanService;
//# sourceMappingURL=client.workoutPlan.service.js.map