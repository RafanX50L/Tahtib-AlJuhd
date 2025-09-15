import { ValidationUtil } from "@/utils/validation.util";
import { IExercise } from "@/core/interface/model/IWorkoutPlan.model";

/**
 * Request DTOs for Client Weekly Challenge Controller
 * Input validation and transformation for client weekly challenge endpoints
 */

// Get Weekly Challenge By ID Request DTO
export interface GetWeeklyChallengeByIdRequestDTO {
  id: string;
}

// Join Weekly Challenge Request DTO
export interface JoinWeeklyChallengeRequestDTO {
  id: string;
}

// Mark Challenge Day Complete Request DTO
export interface MarkChallengeDayCompleteRequestDTO {
  challengeId: string;
  dayNumber: string;
  exercises: IExercise[];
}

/**
 * Client Weekly Challenge DTO class for input validation
 * Handles validation and transformation of client weekly challenge-related requests
 */
export class ClientWeeklyChallengeDTO {
  /**
   * Validates and transforms get weekly challenge by ID request
   */
  static validateGetWeeklyChallengeByIdRequest(params: Record<string, unknown>): GetWeeklyChallengeByIdRequestDTO {
    const id = ValidationUtil.validateString(params.id, 'id', 50);

    return {
      id,
    };
  }

  /**
   * Validates and transforms join weekly challenge request
   */
  static validateJoinWeeklyChallengeRequest(params: Record<string, unknown>): JoinWeeklyChallengeRequestDTO {
    const id = ValidationUtil.validateString(params.id, 'id', 50);

    return {
      id,
    };
  }

  /**
   * Validates and transforms mark challenge day complete request
   */
  static validateMarkChallengeDayCompleteRequest(params: Record<string, unknown>, body: Record<string, unknown>): MarkChallengeDayCompleteRequestDTO {
    const challengeId = ValidationUtil.validateString(params.challengeId, 'challengeId', 50);
    const dayNumber = ValidationUtil.validateString(params.dayNumber, 'dayNumber', 10);

    // Validate day number format (should be a number between 1-7)
    const dayNum = parseInt(dayNumber);
    if (isNaN(dayNum) || dayNum < 0 || dayNum > 6) {
      throw new Error('Day number must be between 0 and 6');
    }

    // Validate exercises array
    if (!body.exercises || !Array.isArray(body.exercises)) {
      throw new Error('Exercises must be an array');
    }

    // Validate each exercise in the array
    const exercises: IExercise[] = body.exercises.map((exercise: unknown, index: number) => {
      if (typeof exercise !== 'object' || exercise === null) {
        throw new Error(`Exercise at index ${index} must be an object`);
      }

      const ex = exercise as Record<string, unknown>;
      
      // Validate required fields
      const name = ValidationUtil.validateString(ex.name, `exercises[${index}].name`, 100);
      const instructions = ValidationUtil.validateString(ex.instructions, `exercises[${index}].instructions`, 500);

      // Validate optional fields
      const sets = ex.sets ? ValidationUtil.validateString(ex.sets, `exercises[${index}].sets`, 50) : undefined;
      const reps = ex.reps ? ValidationUtil.validateString(ex.reps, `exercises[${index}].reps`, 50) : undefined;
      const rest = ex.rest ? ValidationUtil.validateString(ex.rest, `exercises[${index}].rest`, 50) : undefined;
      const duration = ex.duration ? ValidationUtil.validateString(ex.duration, `exercises[${index}].duration`, 50) : undefined;
      const animationLink = ex.animationLink ? ValidationUtil.validateString(ex.animationLink, `exercises[${index}].animationLink`, 200) : undefined;

      return {
        name,
        instructions,
        sets,
        reps,
        rest,
        duration,
        animationLink,
      } as IExercise;
    });

    return {
      challengeId,
      dayNumber,
      exercises,
    };
  }
}
