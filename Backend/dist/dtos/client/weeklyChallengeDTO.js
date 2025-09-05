var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class ClientWeeklyChallengeDTO {
    static mapToWeeeklyChallengeData(raw) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    static mapTooOneWeeklyChallengeData(raw) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                id: raw._id.toString(),
                endDate: raw.endDate.toDateString(),
                enteredUsers: raw.enteredUsers,
                score: raw.score,
                startDate: raw.startDate.toDateString(),
                type: raw.type,
                tasks: raw.tasks.map((day) => {
                    var _a;
                    return ({
                        title: day.title,
                        completed: (_a = day.completed) !== null && _a !== void 0 ? _a : false,
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
                    });
                })
            };
        });
    }
}
//# sourceMappingURL=weeklyChallengeDTO.js.map