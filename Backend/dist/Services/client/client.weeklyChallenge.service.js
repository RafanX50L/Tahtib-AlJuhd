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
import { UserProgressDTO } from "../../dtos/client/UserProgressDTO";
import { ClientWeeklyChallengeDTO } from "../../dtos/client/weeklyChallengeDTO";
import { createHttpError } from "../../utils";
// import { generateWorkoutReport } from "../../utils/gemini1.utils";
import { Types } from "mongoose";
export class ClientWeeklyChallengeService {
    constructor(_weeklyChallengeRepository, _userWeeklyChallengeRepository) {
        this._weeklyChallengeRepository = _weeklyChallengeRepository;
        this._userWeeklyChallengeRepository = _userWeeklyChallengeRepository;
    }
    getWeeklyChallenges() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            // Fetch all three types that are still active (not expired)
            const challenges = yield this._weeklyChallengeRepository.findAll({
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
                result[challenge.type] = yield ClientWeeklyChallengeDTO.mapToWeeeklyChallengeData(challenge);
            }
            return result;
        });
    }
    getWeeklyChallengeById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const challenge = (yield this._weeklyChallengeRepository.findById(new Types.ObjectId(id)));
            const userProgress = (yield this._userWeeklyChallengeRepository.findOne({
                user: new Types.ObjectId(userId),
                challenge: new Types.ObjectId(id),
            }));
            const challengeData = yield ClientWeeklyChallengeDTO.mapTooOneWeeklyChallengeData(challenge);
            const userProgressDTO = yield UserProgressDTO.mapToUserProgress(userProgress);
            return { challenge: challengeData, userProgress: userProgressDTO };
        });
    }
    ;
    joinWeeklyChallenge(userId, challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Step 1: Fetch the challenge
            const challenge = yield this._weeklyChallengeRepository.findById(new Types.ObjectId(challengeId));
            if (!challenge) {
                throw new Error("Challenge not found");
            }
            // Step 2: Check if user already joined
            const hasJoined = challenge.enteredUsers.includes(new Types.ObjectId(userId));
            if (hasJoined) {
                throw createHttpError(HttpStatus.CONFLICT, HttpResponse.USER_ALREADY_JOINED_CHALLENGE);
            }
            // Step 3: Add user to enteredUsers
            yield this._weeklyChallengeRepository.update(challengeId, {
                $addToSet: { enteredUsers: userId },
            });
            yield this._userWeeklyChallengeRepository.create({
                user: new Types.ObjectId(userId),
                challenge: new Types.ObjectId(challengeId),
                type: challenge.type,
                startDate: new Date(),
                progress: [],
                score: 0,
            });
            return true;
        });
    }
    markChallengeDayComplete(userId, workout, challengeId, dayIndex) {
        return __awaiter(this, void 0, void 0, function* () {
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
            yield this._userWeeklyChallengeRepository.markChallengeDayComplete(userId, challengeId, newDayReport);
            return report;
        });
    }
}
//# sourceMappingURL=client.weeklyChallenge.service.js.map