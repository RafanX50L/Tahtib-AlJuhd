"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientWorkoutPlanDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Client Workout Plan DTO class for input validation
 * Handles validation and transformation of client workout plan-related requests
 */
class ClientWorkoutPlanDTO {
    /**
     * Validates and transforms get workouts request
     */
    static validateGetWorkoutsRequest(params) {
        const week = validation_util_1.ValidationUtil.validateString(params.week, "week", 10);
        // Validate week format (should be a number between 1-52)
        const weekNumber = parseInt(week);
        if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 52) {
            throw new Error("Week must be a number between 1 and 52");
        }
        return {
            week,
        };
    }
    /**
     * Validates and transforms complete daily workout request
     */
    static validateCompleteDailyWorkoutRequest(body) {
        const week = validation_util_1.ValidationUtil.validateString(body.week, "week", 10);
        const day = validation_util_1.ValidationUtil.validateString(body.day, "day", 10);
        // Validate week format (should be a number between 1-52)
        const weekNumber = parseInt(week.replace("week", ""), 10);
        if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 52) {
            throw new Error("Week must be a number between 1 and 52");
        }
        const dayNumber = parseInt(day.replace("day", ""), 10);
        if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 7) {
            throw new Error("Day must be a number between 1 and 7");
        }
        // Validate workout array
        if (!body.workout || !Array.isArray(body.workout)) {
            throw new Error("Workout must be an array");
        }
        // Validate each exercise in the workout array
        const workout = body.workout.map((exercise, index) => {
            if (typeof exercise !== "object" || exercise === null) {
                throw new Error(`Workout exercise at index ${index} must be an object`);
            }
            const ex = exercise;
            // Validate required fields
            const name = validation_util_1.ValidationUtil.validateString(ex.name, `workout[${index}].name`, 100);
            const instructions = validation_util_1.ValidationUtil.validateString(ex.instructions, `workout[${index}].instructions`, 500);
            // Validate optional fields
            const sets = ex.sets
                ? validation_util_1.ValidationUtil.validateString(ex.sets, `workout[${index}].sets`, 50)
                : undefined;
            const reps = ex.reps
                ? validation_util_1.ValidationUtil.validateString(ex.reps, `workout[${index}].reps`, 50)
                : undefined;
            const rest = ex.rest
                ? validation_util_1.ValidationUtil.validateString(ex.rest, `workout[${index}].rest`, 50)
                : undefined;
            const duration = ex.duration
                ? validation_util_1.ValidationUtil.validateString(ex.duration, `workout[${index}].duration`, 50)
                : undefined;
            return {
                name,
                instructions,
                sets,
                reps,
                rest,
                duration,
            };
        });
        return {
            week,
            day,
            workout,
        };
    }
    /**
     * Validates and transforms get workout report request
     */
    static validateGetWorkoutReportRequest(query) {
        const week = validation_util_1.ValidationUtil.validateString(query.week, "week", 10);
        const day = validation_util_1.ValidationUtil.validateString(query.day, "day", 10);
        return {
            week,
            day,
        };
    }
}
exports.ClientWorkoutPlanDTO = ClientWorkoutPlanDTO;
//# sourceMappingURL=ClientWorkoutPlanDTO.js.map