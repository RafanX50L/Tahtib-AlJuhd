"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientWeeklyChallengeService = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
const UserProgressDTO_1 = require("../../dtos/client/UserProgressDTO");
const weeklyChallengeDTO_1 = require("../../dtos/client/weeklyChallengeDTO");
const utils_1 = require("../../utils");
const gemini1_utils_1 = require("../../utils/gemini1.utils");
const mongoose_1 = require("mongoose");
class ClientWeeklyChallengeService {
    _weeklyChallengeRepository;
    _userWeeklyChallengeRepository;
    constructor(_weeklyChallengeRepository, _userWeeklyChallengeRepository) {
        this._weeklyChallengeRepository = _weeklyChallengeRepository;
        this._userWeeklyChallengeRepository = _userWeeklyChallengeRepository;
    }
    /** Reserved for Weekly Challenge specific methods */
    _placeholder;
    async getWeeklyChallenges() {
        const now = new Date();
        const challenges = await this._weeklyChallengeRepository.findAll({
            type: { $in: ["beginner", "intermediate", "advanced"] },
            startDate: { $lte: now },
            endDate: { $gte: now },
        });
        const result = {
            beginner: null,
            intermediate: null,
            advanced: null,
        };
        for (const challenge of challenges) {
            result[challenge.type] = await weeklyChallengeDTO_1.ClientWeeklyChallengeDTO.mapToWeeeklyChallengeData(challenge);
        }
        return result;
    }
    async getWeeklyChallengeById(id, userId) {
        const challenge = (await this._weeklyChallengeRepository.findById(new mongoose_1.Types.ObjectId(id)));
        const userProgress = (await this._userWeeklyChallengeRepository.findOne({
            user: new mongoose_1.Types.ObjectId(userId),
            challenge: new mongoose_1.Types.ObjectId(id),
        }));
        if (!userProgress) {
            const challengeData = await weeklyChallengeDTO_1.ClientWeeklyChallengeDTO.mapTooOneWeeklyChallengeData(challenge);
            return { challenge: challengeData };
        }
        const challengeData = await weeklyChallengeDTO_1.ClientWeeklyChallengeDTO.mapTooOneWeeklyChallengeData(challenge);
        const userProgressDTO = await UserProgressDTO_1.UserProgressDTO.mapToUserProgress(userProgress);
        return { challenge: challengeData, userProgress: userProgressDTO };
    }
    ;
    async joinWeeklyChallenge(userId, challengeId) {
        const challenge = await this._weeklyChallengeRepository.findById(new mongoose_1.Types.ObjectId(challengeId));
        if (!challenge) {
            throw new Error("Challenge not found");
        }
        const hasJoined = challenge.enteredUsers.includes(new mongoose_1.Types.ObjectId(userId));
        if (hasJoined) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.CONFLICT, response_message_constant_1.HttpResponse.USER_ALREADY_JOINED_CHALLENGE);
        }
        await this._weeklyChallengeRepository.update(challengeId, {
            $addToSet: { enteredUsers: userId },
        });
        await this._userWeeklyChallengeRepository.create({
            user: new mongoose_1.Types.ObjectId(userId),
            challenge: new mongoose_1.Types.ObjectId(challengeId),
            type: challenge.type,
            startDate: new Date(),
            progress: [],
            score: 0,
        });
        return true;
    }
    async markChallengeDayComplete(userId, workout, challengeId, dayIndex) {
        const defaultReport = {
            caloriesBurned: 0, // Example value
            duration: 0, // Example value in minutes
            feedback: "Great job! Keep it up!", // Example feedback
            intensity: "low",
            estimatedDuration: "0 minutes",
            totalExercises: 0,
            totalSets: 0,
        };
        // 1. Generate report
        const report = workout.length === 0
            ? defaultReport
            : await (0, gemini1_utils_1.generateWorkoutReport)(workout);
        const newDayReport = {
            dayIndex,
            completed: true,
            completedAt: new Date(),
            report: report,
        };
        await this._userWeeklyChallengeRepository.markChallengeDayComplete(userId, challengeId, newDayReport);
        return report;
    }
}
exports.ClientWeeklyChallengeService = ClientWeeklyChallengeService;
//# sourceMappingURL=client.weeklyChallenge.service.js.map