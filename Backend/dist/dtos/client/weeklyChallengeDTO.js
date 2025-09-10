"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientWeeklyChallengeDTO = void 0;
class ClientWeeklyChallengeDTO {
    static async mapToWeeeklyChallengeData(raw) {
        return {
            id: raw.id,
            created: raw.createdAt.toISOString(),
            endDate: raw.endDate.toISOString(),
            enteredUsers: raw.enteredUsers,
            score: raw.score,
            startDate: raw.startDate.toISOString(),
            completedTask: raw.tasks.filter(t => t.completed).length,
            TaskLength: raw.tasks.length,
            type: raw.type,
            updated: raw.updatedAt.toISOString(),
        };
    }
    static async mapTooOneWeeklyChallengeData(raw) {
        return {
            id: raw._id.toString(),
            endDate: raw.endDate.toDateString(),
            enteredUsers: raw.enteredUsers,
            score: raw.score,
            startDate: raw.startDate.toDateString(),
            type: raw.type,
            tasks: raw.tasks.map((day) => ({
                title: day.title,
                completed: day.completed ?? false,
                exercises: day.exercises.map((ex) => ({
                    name: ex.name,
                    sets: ex.sets,
                    reps: ex.reps,
                    rest: ex.rest,
                    duration: ex.duration,
                    instructions: ex.instructions
                })),
                report: day.report
                    ? {
                        totalExercises: day.report.totalExercises,
                        totalSets: day.report.totalSets,
                        estimatedDuration: day.report.estimatedDuration,
                        caloriesBurned: day.report.caloriesBurned,
                        intensity: day.report.intensity,
                        feedback: day.report.feedback
                    }
                    : undefined
            }))
        };
    }
}
exports.ClientWeeklyChallengeDTO = ClientWeeklyChallengeDTO;
//# sourceMappingURL=weeklyChallengeDTO.js.map