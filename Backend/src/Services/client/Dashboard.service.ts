import { Types } from "mongoose";
import { IDashboardService, IClientDashboardStats } from "@/core/interface/services/client/IDashboard.Service";
import { IPersonalizationRepository } from "@/core/interface/repositories/IPersonalization.repository";
import { IProgressRepository } from "@/core/interface/repositories/IProgress.repository";
import { ISessionRepository } from "@/core/interface/repositories/ISession.repository";
import { IUserWeeklyChallengeRepository } from "@/core/interface/repositories/IUserWeeklyChallenge.repositoy";
import { IWorkoutPlanRepository } from "@/core/interface/repositories/IWorkoutPlan.repository";

export class DashboardService implements IDashboardService {
  constructor(
    private readonly _personalizationRepo: IPersonalizationRepository,
    private readonly _progressRepo: IProgressRepository,
    private readonly _sessionRepo: ISessionRepository,
    private readonly _userWeeklyChallengeRepo: IUserWeeklyChallengeRepository,
    private readonly _workoutPlanRepo: IWorkoutPlanRepository
  ) {}

  async getClientDashboardStats(clientId: string): Promise<IClientDashboardStats> {
    // Get client personalization data
    const clientPers = await this._personalizationRepo.findByUserId(clientId);
    if (!clientPers) {
      throw new Error("Client not found");
    }
    const clientData = clientPers.data as any;

    // Calculate workouts completed from weekly challenges
    const userChallenges = await this._userWeeklyChallengeRepo.findAll({ user: new Types.ObjectId(clientId) });
    const workoutsCompleted = this.calculateWorkoutsCompleted(userChallenges);

    // Calculate active minutes (estimated based on workout duration and frequency)
    const activeMinutes = this.calculateActiveMinutes(clientData, workoutsCompleted);

    // Calculate calories burned (estimated based on weight, workout intensity, and duration)
    const caloriesBurned = this.calculateCaloriesBurned(clientData, activeMinutes);

    // Calculate current streak from weekly challenges
    const currentStreak = this.calculateCurrentStreak(userChallenges);

    // Get weight progress
    const progress = await this._progressRepo.getLatestEntry(clientId);
    const weightProgress = this.calculateWeightProgress(clientData, progress);

    // Calculate weekly progress
    const weeklyProgress = this.calculateWeeklyProgress(clientData, userChallenges);

    // Get upcoming sessions
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

  private calculateWorkoutsCompleted(userChallenges: any[]): number {
    let totalCompleted = 0;
    
    userChallenges.forEach(challenge => {
      if (challenge.progress && Array.isArray(challenge.progress)) {
        challenge.progress.forEach((day: any) => {
          if (day.completed) {
            totalCompleted++;
          }
        });
      }
    });

    return totalCompleted;
  }

  private calculateActiveMinutes(clientData: any, workoutsCompleted: number): number {
    // Estimate active minutes based on workout duration and frequency
    const workoutDuration = this.parseWorkoutDuration(clientData.userData?.workoutDuration || "30 minutes");
    const daysPerWeek = clientData.userData?.workoutDaysPerWeek || 3;
    
    // Calculate for the last 4 weeks
    const weeks = 4;
    const estimatedMinutesPerWorkout = workoutDuration;
    const totalWorkouts = Math.min(workoutsCompleted, daysPerWeek * weeks);
    
    return totalWorkouts * estimatedMinutesPerWorkout;
  }

  private parseWorkoutDuration(duration: string): number {
    // Parse duration string like "30 minutes", "1 hour", etc.
    const match = duration.match(/(\d+)/);
    if (match) {
      const value = parseInt(match[1]);
      if (duration.includes('hour')) {
        return value * 60;
      }
      return value;
    }
    return 30; // default 30 minutes
  }

  private calculateCaloriesBurned(clientData: any, activeMinutes: number): number {
    // Basic calorie burn calculation: 5-8 calories per minute depending on intensity
    const weight = clientData.userData?.currentWeight || 70; // kg
    const baseCaloriesPerMinute = (weight / 10) * 0.8; // Rough estimation
    return Math.round(activeMinutes * baseCaloriesPerMinute);
  }

  private calculateCurrentStreak(userChallenges: any[]): number {
    if (!userChallenges || userChallenges.length === 0) return 0;

    // Sort challenges by start date (most recent first)
    const sortedChallenges = userChallenges.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check the most recent challenge
    const latestChallenge = sortedChallenges[0];
    if (latestChallenge && latestChallenge.progress) {
      // Count consecutive completed days from the end
      for (let i = latestChallenge.progress.length - 1; i >= 0; i--) {
        const day = latestChallenge.progress[i];
        if (day.completed) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    return currentStreak;
  }

  private calculateWeightProgress(clientData: any, progress: any): { current: number; target: number; lost: number } {
    const currentWeight = clientData.userData?.currentWeight || 0;
    const targetWeight = clientData.userData?.targetWeight || 0;
    
    let lost = 0;
    if (progress && progress.weight) {
      // Calculate weight lost from the latest entry
      lost = Math.max(0, progress.weight - currentWeight);
    }

    return {
      current: currentWeight,
      target: targetWeight,
      lost: lost
    };
  }

  private calculateWeeklyProgress(clientData: any, userChallenges: any[]): { completed: number; total: number } {
    const daysPerWeek = clientData.userData?.workoutDaysPerWeek || 3;
    
    if (!userChallenges || userChallenges.length === 0) {
      return { completed: 0, total: daysPerWeek };
    }

    // Get the current week's progress
    const currentWeek = userChallenges[0]; // Assuming most recent challenge
    if (!currentWeek || !currentWeek.progress) {
      return { completed: 0, total: daysPerWeek };
    }

    const completed = currentWeek.progress.filter((day: any) => day.completed).length;
    return { completed, total: daysPerWeek };
  }

  private async getUpcomingSessions(clientId: string): Promise<number> {
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + 7);

    const upcomingSessions = await this._sessionRepo.findUnFreeSlotsByClient(
      clientId,
      now,
      endOfWeek
    );

    return upcomingSessions ? upcomingSessions.length : 0;
  }
}
