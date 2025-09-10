"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWeeklyChallengeRepository = void 0;
const base_repository_1 = require("./base.repository");
const UserWeeklyChallenge_model_1 = require("../models/UserWeeklyChallenge.model");
const mongoose_1 = require("mongoose");
class UserWeeklyChallengeRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(UserWeeklyChallenge_model_1.UserWeeklyChallengeModel);
    }
    /** Reserved for User Filespecific methods */
    _placeholder;
    async markChallengeDayComplete(userId, challengeId, DayReport) {
        return await this.model.findOneAndUpdate({
            user: new mongoose_1.Types.ObjectId(userId),
            challenge: new mongoose_1.Types.ObjectId(challengeId),
        }, { $addToSet: { progress: DayReport } });
    }
}
exports.UserWeeklyChallengeRepository = UserWeeklyChallengeRepository;
//# sourceMappingURL=UserWeeklyChallenge.repository.js.map