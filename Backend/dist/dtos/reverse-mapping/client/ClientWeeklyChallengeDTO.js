"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientWeeklyChallengeDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Client Weekly Challenge DTO class for input validation
 * Handles validation and transformation of client weekly challenge-related requests
 */
class ClientWeeklyChallengeDTO {
    /**
     * Validates and transforms get weekly challenge by ID request
     */
    static validateGetWeeklyChallengeByIdRequest(params) {
        const id = validation_util_1.ValidationUtil.validateString(params.id, 'id', 50);
        return {
            id,
        };
    }
    /**
     * Validates and transforms join weekly challenge request
     */
    static validateJoinWeeklyChallengeRequest(params) {
        const id = validation_util_1.ValidationUtil.validateString(params.id, 'id', 50);
        return {
            id,
        };
    }
    /**
     * Validates and transforms mark challenge day complete request
     */
    static validateMarkChallengeDayCompleteRequest(params, body) {
        const challengeId = validation_util_1.ValidationUtil.validateString(params.challengeId, 'challengeId', 50);
        const dayNumber = validation_util_1.ValidationUtil.validateString(params.dayNumber, 'dayNumber', 10);
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
        const exercises = body.exercises.map((exercise, index) => {
            if (typeof exercise !== 'object' || exercise === null) {
                throw new Error(`Exercise at index ${index} must be an object`);
            }
            const ex = exercise;
            // Validate required fields
            const name = validation_util_1.ValidationUtil.validateString(ex.name, `exercises[${index}].name`, 100);
            const instructions = validation_util_1.ValidationUtil.validateString(ex.instructions, `exercises[${index}].instructions`, 500);
            // Validate optional fields
            const sets = ex.sets ? validation_util_1.ValidationUtil.validateString(ex.sets, `exercises[${index}].sets`, 50) : undefined;
            const reps = ex.reps ? validation_util_1.ValidationUtil.validateString(ex.reps, `exercises[${index}].reps`, 50) : undefined;
            const rest = ex.rest ? validation_util_1.ValidationUtil.validateString(ex.rest, `exercises[${index}].rest`, 50) : undefined;
            const duration = ex.duration ? validation_util_1.ValidationUtil.validateString(ex.duration, `exercises[${index}].duration`, 50) : undefined;
            const animationLink = ex.animationLink ? validation_util_1.ValidationUtil.validateString(ex.animationLink, `exercises[${index}].animationLink`, 200) : undefined;
            return {
                name,
                instructions,
                sets,
                reps,
                rest,
                duration,
                animationLink,
            };
        });
        return {
            challengeId,
            dayNumber,
            exercises,
        };
    }
}
exports.ClientWeeklyChallengeDTO = ClientWeeklyChallengeDTO;
//# sourceMappingURL=ClientWeeklyChallengeDTO.js.map