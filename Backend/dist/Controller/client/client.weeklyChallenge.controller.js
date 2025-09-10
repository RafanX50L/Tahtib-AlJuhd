"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientWeeklyChallengeController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
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
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.WEEKLY_CHALLENGES_FETCHED, weeklyChallenges: weeklyChallenges });
        }
        catch (error) {
            next(error);
        }
    }
    async getWeeklyChallengeById(req, res, next) {
        try {
            const id = req.params.id;
            const userId = req.user.id;
            const weeklyChallenge = await this._weeklyChallengeService.getWeeklyChallengeById(id, userId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.WEEKLY_CHALLENGES_FETCHED, challenge: weeklyChallenge });
        }
        catch (error) {
            next(error);
        }
    }
    async joinWeeklyChallenge(req, res, next) {
        try {
            const challengeId = req.params.id;
            const userId = req.user?.id;
            await this._weeklyChallengeService.joinWeeklyChallenge(userId, challengeId);
            res.status(status_constant_1.HttpStatus.CREATED).json({ message: response_message_constant_1.HttpResponse.WEEKLY_CHALLENGE_JOINED_SUCCESSFULL });
        }
        catch (error) {
            next(error);
        }
    }
    async markChallengeDayComplete(req, res, next) {
        try {
            const userId = req.user.id;
            const { challengeId, dayNumber } = req.params;
            const exercises = req.body.exercises;
            const report = await this._weeklyChallengeService.markChallengeDayComplete(userId, exercises, challengeId, Number(dayNumber));
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.MARK_CHALLENGE_DAY_COMPLETED_SUCCESSFULL, data: report });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ClientWeeklyChallengeController = ClientWeeklyChallengeController;
//# sourceMappingURL=client.weeklyChallenge.controller.js.map