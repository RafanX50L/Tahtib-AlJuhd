"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkotsDto = void 0;
class WorkotsDto {
    static async mapToWorkoutData(raw) {
        const days = [
            raw.day1,
            raw.day2,
            raw.day3,
            raw.day4,
            raw.day5,
            raw.day6,
            raw.day7,
        ];
        return days.map((day) => ({
            title: day.title,
            completed: day.completed ?? false,
            exercises: day.exercises.map((ex) => ({
                name: ex.name,
                sets: ex.sets?.toString(),
                reps: ex.reps,
                rest: ex.rest,
                duration: ex.duration,
                instructions: ex.instructions,
            })),
            report: day.report
                ? {
                    totalExercises: day.report.totalExercises,
                    totalSets: day.report.totalSets,
                    estimatedDuration: day.report.estimatedDuration,
                    caloriesBurned: day.report.caloriesBurned,
                    intensity: day.report.intensity,
                    feedback: day.report.feedback,
                }
                : undefined,
        }));
    }
}
exports.WorkotsDto = WorkotsDto;
//# sourceMappingURL=WorkoutsDTO.js.map