import { IDay, IWeek } from "@/core/interface/model/IWorkoutPlan.model";
import { IDayView, IExerciseView } from "./weeklyChallengeDTO";

export class WorkotsDto {
  static async mapToWorkoutData(raw: IWeek): Promise<IDayView[]> {
    const days: IDay[] = [
      raw.day1,
      raw.day2,
      raw.day3,
      raw.day4,
      raw.day5,
      raw.day6,
      raw.day7,
    ];

    return days.map(
      (day): IDayView => ({
        title: day.title,
        completed: day.completed ?? false,
        exercises: day.exercises.map(
          (ex): IExerciseView => ({
            name: ex.name,
            sets: ex.sets?.toString(),
            reps: ex.reps,
            rest: ex.rest,
            duration: ex.duration,
            instructions: ex.instructions,
          })
        ),
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
      })
    );
  }
}
