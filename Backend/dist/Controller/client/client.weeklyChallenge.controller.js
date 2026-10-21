"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientWeeklyChallengeController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const ClientWeeklyChallengeDTO_1 = require("../../dtos/reverse-mapping/client/ClientWeeklyChallengeDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class ClientWeeklyChallengeController {
    _weeklyChallengeService;
    constructor(_weeklyChallengeService) {
        this._weeklyChallengeService = _weeklyChallengeService;
    }
    /** Reserved for Weekly Challenge specific methods */
    _placeholder;
    async getWeeklyChallenges(req, res, next) {
        try {
            const weeklyChallenges = await this._weeklyChallengeService.getWeeklyChallenges();
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { weeklyChallenges }, response_message_constant_1.HttpResponse.WEEKLY_CHALLENGES_FETCHED);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getWeeklyChallengeById(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = ClientWeeklyChallengeDTO_1.ClientWeeklyChallengeDTO.validateGetWeeklyChallengeByIdRequest(req.params);
            const userId = req.user.id;
            const weeklyChallenge = await this._weeklyChallengeService.getWeeklyChallengeById(validatedParams.id, userId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { challenge: weeklyChallenge }, response_message_constant_1.HttpResponse.WEEKLY_CHALLENGES_FETCHED);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async joinWeeklyChallenge(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = ClientWeeklyChallengeDTO_1.ClientWeeklyChallengeDTO.validateJoinWeeklyChallengeRequest(req.params);
            const userId = req.user?.id;
            await this._weeklyChallengeService.joinWeeklyChallenge(userId, validatedParams.id);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, response_message_constant_1.HttpResponse.WEEKLY_CHALLENGE_JOINED_SUCCESSFULL, 201);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async markChallengeDayComplete(req, res, next) {
        try {
            // Validate and transform request parameters and body using DTOs
            const validatedParams = ClientWeeklyChallengeDTO_1.ClientWeeklyChallengeDTO.validateMarkChallengeDayCompleteRequest(req.params, req.body);
            const userId = req.user.id;
            const report = await this._weeklyChallengeService.markChallengeDayComplete(userId, validatedParams.exercises, validatedParams.challengeId, Number(validatedParams.dayNumber));
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { data: report }, response_message_constant_1.HttpResponse.MARK_CHALLENGE_DAY_COMPLETED_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.ClientWeeklyChallengeController = ClientWeeklyChallengeController;
//# sourceMappingURL=client.weeklyChallenge.controller.js.map