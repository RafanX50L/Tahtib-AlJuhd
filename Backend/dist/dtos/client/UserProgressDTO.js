var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class UserProgressDTO {
    static mapToUserProgress(raw) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                user: raw.user.toString(),
                challenge: raw.challenge.toString(),
                type: raw.type,
                startDate: raw.startDate.toDateString(),
                score: raw.score,
                progress: raw.progress.map((day) => {
                    var _a;
                    return ({
                        dayIndex: day.dayIndex,
                        completed: day.completed,
                        completedAt: (_a = day.completedAt) !== null && _a !== void 0 ? _a : null,
                        report: {
                            caloriesBurned: day.report.caloriesBurned.toString(),
                            feedback: day.report.feedback,
                            intensity: day.report.intensity,
                            estimatedDuration: day.report.estimatedDuration,
                            totalExercises: day.report.totalExercises.toString(),
                            totalSets: day.report.totalSets.toString(),
                        },
                    });
                }),
            };
        });
    }
}
//# sourceMappingURL=UserProgressDTO.js.map