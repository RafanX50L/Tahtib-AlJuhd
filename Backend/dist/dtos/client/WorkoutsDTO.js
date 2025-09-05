var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class WorkotsDto {
    static mapToWorkoutData(raw) {
        return __awaiter(this, void 0, void 0, function* () {
            const days = [
                raw.day1,
                raw.day2,
                raw.day3,
                raw.day4,
                raw.day5,
                raw.day6,
                raw.day7,
            ];
            return days.map((day) => {
                var _a;
                return ({
                    title: day.title,
                    completed: (_a = day.completed) !== null && _a !== void 0 ? _a : false,
                    exercises: day.exercises.map((ex) => {
                        var _a;
                        return ({
                            name: ex.name,
                            sets: (_a = ex.sets) === null || _a === void 0 ? void 0 : _a.toString(),
                            reps: ex.reps,
                            rest: ex.rest,
                            duration: ex.duration,
                            instructions: ex.instructions,
                        });
                    }),
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
                });
            });
        });
    }
}
//# sourceMappingURL=WorkoutsDTO.js.map