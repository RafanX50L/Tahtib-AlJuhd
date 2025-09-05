var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseRepository } from "./base.repository";
import { WorkoutPlanModel } from "../models/WorkoutPlan.model";
export class WorkoutPlanRepository extends BaseRepository {
    constructor() {
        super(WorkoutPlanModel);
    }
    getWorkouts(workoutId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findById(workoutId);
        });
    }
    // ✅ Mark a day as complete and save its report
    markWorkoutDayAsComplete(workoutPlanId, week, // e.g., 'week1'
    day, // e.g., 'day3'
    report) {
        return __awaiter(this, void 0, void 0, function* () {
            const completedField = `${week}.${day}.completed`;
            const reportField = `${week}.${day}.report`;
            yield this.model.updateOne({ _id: workoutPlanId }, {
                $set: {
                    [completedField]: true,
                    [reportField]: report,
                }
            });
        });
    }
    // ✅ Insert a generated next week's workout plan
    insertNextWeek(workoutPlanId, weekKey, // e.g., 'week2', 'week3'
    weekData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ _id: workoutPlanId }, { $set: { [weekKey]: weekData } });
        });
    }
    // ✅ Optional: mark full week as completed
    markWeekAsCompleted(workoutPlanId, weekKey // e.g., 'week1'
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            const fieldPath = `${weekKey}.completed`;
            yield this.model.updateOne({ _id: workoutPlanId }, { $set: { [fieldPath]: true } });
        });
    }
}
//# sourceMappingURL=WorkoutPlan.repository.js.map