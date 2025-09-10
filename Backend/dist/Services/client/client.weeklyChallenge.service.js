"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientWeeklyChallengeService = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
const UserProgressDTO_1 = require("../../dtos/client/UserProgressDTO");
const weeklyChallengeDTO_1 = require("../../dtos/client/weeklyChallengeDTO");
const utils_1 = require("../../utils");
// import { generateWorkoutReport } from "../../utils/gemini1.utils";
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
        // Fetch all three types that are still active (not expired)
        const challenges = await this._weeklyChallengeRepository.findAll({
            type: { $in: ["beginner", "intermediate", "advanced"] },
            startDate: { $lte: now },
            endDate: { $gte: now },
        });
        // Initialize with nulls (temporarily)
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
        const challengeData = await weeklyChallengeDTO_1.ClientWeeklyChallengeDTO.mapTooOneWeeklyChallengeData(challenge);
        const userProgressDTO = await UserProgressDTO_1.UserProgressDTO.mapToUserProgress(userProgress);
        return { challenge: challengeData, userProgress: userProgressDTO };
    }
    ;
    async joinWeeklyChallenge(userId, challengeId) {
        // Step 1: Fetch the challenge
        const challenge = await this._weeklyChallengeRepository.findById(new mongoose_1.Types.ObjectId(challengeId));
        if (!challenge) {
            throw new Error("Challenge not found");
        }
        // Step 2: Check if user already joined
        const hasJoined = challenge.enteredUsers.includes(new mongoose_1.Types.ObjectId(userId));
        if (hasJoined) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.CONFLICT, response_message_constant_1.HttpResponse.USER_ALREADY_JOINED_CHALLENGE);
        }
        // Step 3: Add user to enteredUsers
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
            caloriesBurned: 500, // Example value
            duration: 60, // Example value in minutes
            feedback: "Great job! Keep it up!", // Example feedback
            intensity: "low",
            estimatedDuration: "60 minutes",
            totalExercises: 5,
            totalSets: 15,
        };
        // 1. Generate report
        const report = defaultReport;
        // workout.length === 0
        //   ? defaultReport
        //   : await generateWorkoutReport(workout);
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