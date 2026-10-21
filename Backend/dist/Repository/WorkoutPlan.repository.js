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
    async markWorkoutDayAsComplete(workoutPlanId, week, day, report) {
        const completedField = `${week}.${day}.completed`;
        const reportField = `${week}.${day}.report`;
        await this.model.updateOne({ _id: workoutPlanId }, {
            $set: {
                [completedField]: true,
                [reportField]: report,
            }
        });
    }
    async insertNextWeek(workoutPlanId, weekKey, weekData) {
        await this.model.updateOne({ _id: workoutPlanId }, { $set: { [weekKey]: weekData } });
    }
    async markWeekAsCompleted(workoutPlanId, weekKey) {
        const fieldPath = `${weekKey}.completed`;
        await this.model.updateOne({ _id: workoutPlanId }, { $set: { [fieldPath]: true } });
    }
}
exports.WorkoutPlanRepository = WorkoutPlanRepository;
//# sourceMappingURL=WorkoutPlan.repository.js.map