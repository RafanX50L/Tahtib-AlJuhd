"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutPlanRepository = void 0;
const base_repository_1 = require("./base.repository");
const WorkoutPlan_model_1 = require("../models/WorkoutPlan.model");
class WorkoutPlanRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(WorkoutPlan_model_1.WorkoutPlanModel);
    }
    async getWorkouts(workoutId) {
        return this.findById(workoutId);
    }
    // ✅ Mark a day as complete and save its report
    async markWorkoutDayAsComplete(workoutPlanId, week, // e.g., 'week1'
    day, // e.g., 'day3'
    report) {
        const completedField = `${week}.${day}.completed`;
        const reportField = `${week}.${day}.report`;
        await this.model.updateOne({ _id: workoutPlanId }, {
            $set: {
                [completedField]: true,
                [reportField]: report,
            }
        });
    }
    // ✅ Insert a generated next week's workout plan
    async insertNextWeek(workoutPlanId, weekKey, // e.g., 'week2', 'week3'
    weekData) {
        await this.model.updateOne({ _id: workoutPlanId }, { $set: { [weekKey]: weekData } });
    }
    // ✅ Optional: mark full week as completed
    async markWeekAsCompleted(workoutPlanId, weekKey // e.g., 'week1'
    ) {
        const fieldPath = `${weekKey}.completed`;
        await this.model.updateOne({ _id: workoutPlanId }, { $set: { [fieldPath]: true } });
    }
}
exports.WorkoutPlanRepository = WorkoutPlanRepository;
//# sourceMappingURL=WorkoutPlan.repository.js.map