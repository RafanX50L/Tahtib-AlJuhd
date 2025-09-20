import { ValidationUtil } from "@/utils/validation.util";
import { IExerciseView } from "@/dtos/client/weeklyChallengeDTO";

/**
 * Request DTOs for Client Workout Plan Controller
 * Input validation and transformation for client workout plan endpoints
 */

// Get Workouts Request DTO
export interface GetWorkoutsRequestDTO {
  week: string;
}

// Complete Daily Workout Request DTO
export interface CompleteDailyWorkoutRequestDTO {
  week: string;
  day: string;
  workout: IExerciseView[];
}

// Get Workout Report Request DTO
export interface GetWorkoutReportRequestDTO {
  week: string;
  day: string;
}

/**
 * Client Workout Plan DTO class for input validation
 * Handles validation and transformation of client workout plan-related requests
 */
export class ClientWorkoutPlanDTO {
  /**
   * Validates and transforms get workouts request
   */
  static validateGetWorkoutsRequest(
    params: Record<string, unknown>
  ): GetWorkoutsRequestDTO {
    const week = ValidationUtil.validateString(params.week, "week", 10);

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
  static validateCompleteDailyWorkoutRequest(
    body: Record<string, unknown>
  ): CompleteDailyWorkoutRequestDTO {
    const week = ValidationUtil.validateString(body.week, "week", 10);
    const day = ValidationUtil.validateString(body.day, "day", 10);

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
    const workout: IExerciseView[] = body.workout.map(
      (exercise: unknown, index: number) => {
        if (typeof exercise !== "object" || exercise === null) {
          throw new Error(
            `Workout exercise at index ${index} must be an object`
          );
        }

        const ex = exercise as Record<string, unknown>;

        // Validate required fields
        const name = ValidationUtil.validateString(
          ex.name,
          `workout[${index}].name`,
          100
        );
        const instructions = ValidationUtil.validateString(
          ex.instructions,
          `workout[${index}].instructions`,
          500
        );

        // Validate optional fields
        const sets = ex.sets
          ? ValidationUtil.validateString(ex.sets, `workout[${index}].sets`, 50)
          : undefined;
        const reps = ex.reps
          ? ValidationUtil.validateString(ex.reps, `workout[${index}].reps`, 50)
          : undefined;
        const rest = ex.rest
          ? ValidationUtil.validateString(ex.rest, `workout[${index}].rest`, 50)
          : undefined;
        const duration = ex.duration
          ? ValidationUtil.validateString(
              ex.duration,
              `workout[${index}].duration`,
              50
            )
          : undefined;

        return {
          name,
          instructions,
          sets,
          reps,
          rest,
          duration,
        } as IExerciseView;
      }
    );

    return {
      week,
      day,
      workout,
    };
  }

  /**
   * Validates and transforms get workout report request
   */
  static validateGetWorkoutReportRequest(
    query: Record<string, unknown>
  ): GetWorkoutReportRequestDTO {
    const week = ValidationUtil.validateString(query.week, "week", 10);
    const day = ValidationUtil.validateString(query.day, "day", 10);

    return {
      week,
      day,
    };
  }
}
