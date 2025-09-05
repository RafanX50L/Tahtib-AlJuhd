var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpResponse } from "../../constants/response-message.constant";
import { HttpStatus } from "../../constants/status.constant";
export class ClientWeeklyChallengeController {
    constructor(_weeklyChallengeService) {
        this._weeklyChallengeService = _weeklyChallengeService;
    }
    getWeeklyChallenges(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const weeklyChallenges = yield this._weeklyChallengeService.getWeeklyChallenges();
                res.status(HttpStatus.OK).json({ message: HttpResponse.WEEKLY_CHALLENGES_FETCHED, weeklyChallenges: weeklyChallenges });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getWeeklyChallengeById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const userId = req.user.id;
                const weeklyChallenge = yield this._weeklyChallengeService.getWeeklyChallengeById(id, userId);
                res.status(HttpStatus.OK).json({ message: HttpResponse.WEEKLY_CHALLENGES_FETCHED, challenge: weeklyChallenge });
            }
            catch (error) {
                next(error);
            }
        });
    }
    joinWeeklyChallenge(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const challengeId = req.params.id;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                yield this._weeklyChallengeService.joinWeeklyChallenge(userId, challengeId);
                res.status(HttpStatus.CREATED).json({ message: HttpResponse.WEEKLY_CHALLENGE_JOINED_SUCCESSFULL });
            }
            catch (error) {
                next(error);
            }
        });
    }
    markChallengeDayComplete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { challengeId, dayNumber } = req.params;
                const exercises = req.body.exercises;
                const report = yield this._weeklyChallengeService.markChallengeDayComplete(userId, exercises, challengeId, Number(dayNumber));
                res.status(HttpStatus.OK).json({ message: HttpResponse.MARK_CHALLENGE_DAY_COMPLETED_SUCCESSFULL, data: report });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
//# sourceMappingURL=client.weeklyChallenge.controller.js.map