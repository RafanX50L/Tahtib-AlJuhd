"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProgressDTO = void 0;
class UserProgressDTO {
    static async mapToUserProgress(raw) {
        return {
            user: raw.user.toString(),
            challenge: raw.challenge.toString(),
            type: raw.type,
            startDate: raw.startDate.toDateString(),
            score: raw.score,
            progress: raw.progress.map((day) => ({
                dayIndex: day.dayIndex,
                completed: day.completed,
                completedAt: day.completedAt ?? null,
                report: {
                    caloriesBurned: day.report.caloriesBurned.toString(),
                    feedback: day.report.feedback,
                    intensity: day.report.intensity,
                    estimatedDuration: day.report.estimatedDuration,
                    totalExercises: day.report.totalExercises.toString(),
                    totalSets: day.report.totalSets.toString(),
                },
            })),
        };
    }
}
exports.UserProgressDTO = UserProgressDTO;
//# sourceMappingURL=UserProgressDTO.js.map