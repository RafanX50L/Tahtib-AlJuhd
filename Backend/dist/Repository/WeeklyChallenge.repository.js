"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeeklyChallengeRepository = void 0;
const base_repository_1 = require("./base.repository");
const WeeklyChallenge_model_1 = require("../models/WeeklyChallenge.model");
class WeeklyChallengeRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(WeeklyChallenge_model_1.WeeklyChallengeModel);
    }
}
exports.WeeklyChallengeRepository = WeeklyChallengeRepository;
//# sourceMappingURL=WeeklyChallenge.repository.js.map