"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const mongoose_1 = require("mongoose");
class DashboardService {
    _personalizationRepo;
    _progressRepo;
    _sessionRepo;
    _userWeeklyChallengeRepo;
    constructor(_personalizationRepo, _progressRepo, _sessionRepo, _userWeeklyChallengeRepo) {
        this._personalizationRepo = _personalizationRepo;
        this._progressRepo = _progressRepo;
        this._sessionRepo = _sessionRepo;
        this._userWeeklyChallengeRepo = _userWeeklyChallengeRepo;
    }
    async getClientDashboardStats(clientId) {
        const clientPers = await this._personalizationRepo.findByUserId(clientId);
        if (!clientPers) {
            throw new Error("Client not found");
        }
        const clientData = clientPers.data;
        const userChallenges = await this._userWeeklyChallengeRepo.findAll({ user: new mongoose_1.Types.ObjectId(clientId) });
        const workoutsCompleted = this.calculateWorkoutsCompleted(userChallenges);
        const activeMinutes = this.calculateActiveMinutes(clientData, workoutsCompleted);
        const caloriesBurned = this.calculateCaloriesBurned(clientData, activeMinutes);
        const currentStreak = this.calculateCurrentStreak(userChallenges);
        const progress = await this._progressRepo.getLatestEntry(clientId);
        const weightProgress = this.calculateWeightProgress(clientData, progress);
        const weeklyProgress = this.calculateWeeklyProgress(clientData, userChallenges);
        const upcomingSessions = await this.getUpcomingSessions(clientId);
        return {
            workoutsCompleted,
            activeMinutes,
            caloriesBurned,
            currentStreak,
            weightProgress,
            weeklyProgress,
            upcomingSessions,
            planStatus: clientData.planStatus || 'Inactive'
        };
    }
    calculateWorkoutsCompleted(userChallenges) {
        let totalCompleted = 0;
        userChallenges.forEach(challenge => {
            if (challenge.progress && Array.isArray(challenge.progress)) {
                challenge.progress.forEach((day) => {
                    if (day.completed) {
                        totalCompleted++;
                    }
                });
            }
        });
        return totalCompleted;
    }
    calculateActiveMinutes(clientData, workoutsCompleted) {
        const workoutDuration = this.parseWorkoutDuration(clientData.userData?.workoutDuration || "30 minutes");
        const daysPerWeek = clientData.userData?.workoutDaysPerWeek || 3;
        const weeks = 4;
        const estimatedMinutesPerWorkout = workoutDuration;
        const totalWorkouts = Math.min(workoutsCompleted, daysPerWeek * weeks);
        return totalWorkouts * estimatedMinutesPerWorkout;
    }
    parseWorkoutDuration(duration) {
        const match = duration.match(/(\d+)/);
        if (match) {
            const value = parseInt(match[1]);
            if (duration.includes('hour')) {
                return value * 60;
            }
            return value;
        }
        return 30;
    }
    calculateCaloriesBurned(clientData, activeMinutes) {
        const weight = clientData.userData?.currentWeight || 70;
        const baseCaloriesPerMinute = (weight / 10) * 0.8;
        return Math.round(activeMinutes * baseCaloriesPerMinute);
    }
    calculateCurrentStreak(userChallenges) {
        if (!userChallenges || userChallenges.length === 0)
            return 0;
        const sortedChallenges = userChallenges.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const latestChallenge = sortedChallenges[0];
        if (latestChallenge && latestChallenge.progress) {
            for (let i = latestChallenge.progress.length - 1; i >= 0; i--) {
                const day = latestChallenge.progress[i];
                if (day.completed) {
                    currentStreak++;
                }
                else {
                    break;
                }
            }
        }
        return currentStreak;
    }
    calculateWeightProgress(clientData, progress) {
        const currentWeight = clientData.userData?.currentWeight || 0;
        const targetWeight = clientData.userData?.targetWeight || 0;
        let lost = 0;
        if (progress && progress.weight) {
            lost = Math.max(0, progress.weight - currentWeight);
        }
        return {
            current: currentWeight,
            target: targetWeight,
            lost: lost
        };
    }
    calculateWeeklyProgress(clientData, userChallenges) {
        const daysPerWeek = clientData.userData?.workoutDaysPerWeek || 3;
        if (!userChallenges || userChallenges.length === 0) {
            return { completed: 0, total: daysPerWeek };
        }
        const currentWeek = userChallenges[0];
        if (!currentWeek || !currentWeek.progress) {
            return { completed: 0, total: daysPerWeek };
        }
        const completed = currentWeek.progress.filter((day) => day.completed).length;
        return { completed, total: daysPerWeek };
    }
    async getUpcomingSessions(clientId) {
        const now = new Date();
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + 7);
        const upcomingSessions = await this._sessionRepo.findUnFreeSlotsByClient(clientId, now, endOfWeek);
        return upcomingSessions ? upcomingSessions.length : 0;
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=client.dashboard.service.js.map