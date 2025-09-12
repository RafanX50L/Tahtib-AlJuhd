import {
  IClientPersonalization,
  IPersonalization,
} from "@/core/interface/model/IPersonalization.model";
import { IWorkoutPlan } from "@/core/interface/model/IWorkoutPlan.model";
import { IPersonalizationRepository } from "@/core/interface/repositories/IPersonalization.repository";
import { IWorkoutPlanRepository } from "@/core/interface/repositories/IWorkoutPlan.repository";
import { IClientWorkoutPlanService } from "@/core/interface/services/client/IClient.WorkoutPlan.Service";
import { IExerciseView } from "@/dtos/client/weeklyChallengeDTO";
import { WorkotsDto } from "@/dtos/client/WorkoutsDTO";
import { createHttpError } from "@/utils";
import {
  generateFitnessPlan,
  generateWorkoutReport,
} from "@/utils/gemini1.utils";
import { Types } from "mongoose";

export class ClientWorkoutPlanService implements IClientWorkoutPlanService {
  constructor(
    private readonly _workoutPlanRepository: IWorkoutPlanRepository,
    private readonly _personalizationRepository: IPersonalizationRepository
  ) {}
  /** Reserved for Workout plan specific methods */
  _placeholder?: never;

  async getWorkouts(userId: string, week: string) {
    const personalization =
      (await this._personalizationRepository.getPersonalization(
        userId
      )) as IPersonalization;
    const workoutId = new Types.ObjectId(
      (personalization.data as IClientPersonalization).workoutPlanId
    );
    const workouts = await this._workoutPlanRepository.getWorkouts(workoutId);
    if(workouts[`week${week}`]){
      const workotsDto = await WorkotsDto.mapToWorkoutData(
        workouts[`week${week}`]
      );
      return workotsDto;
    }else{
      return null;
    }
  }

  async completeDailyWorkoutAndFetchReport(
    userId: string,
    week: string,
    day: string,
    workout: IExerciseView[]
  ) {
    const defaultReport = {
      caloriesBurned: 0, 
      duration: 0, 
      feedback: "Great job! Keep it up!", 
      intensity: "low",
      estimatedDuration: "0 minutes",
      totalExercises: 0,
      totalSets: 0,
    };
    const report =
      workout.length === 0
        ? defaultReport
        : await generateWorkoutReport(workout);

    const clientData = (
      (await this._personalizationRepository.updateClientWorkoutCompletionCounter(
        userId
      )) as IPersonalization
    ).data as IClientPersonalization;
    const workoutId = clientData.workoutPlanId;

    if (!workoutId)
      throw createHttpError(400, "No workout plan assigned to user");

    if (day === "day7") {
      console.log("Generating next week plan...");
      const workoutPlan = (await this._workoutPlanRepository.findById(
        workoutId
      )) as IWorkoutPlan;
      const previousWeekWorkouts = workoutPlan[`${week}`]; 
      const currentWeek = parseInt(week.replace("week", ""), 10);
      const nextWeekPlan = await generateFitnessPlan(
        clientData.userData,
        currentWeek + 1,
        "workout",
        previousWeekWorkouts
      );
      await this._workoutPlanRepository.insertNextWeek(
        workoutId,
        `week${currentWeek + 1}`,
        nextWeekPlan[`week${currentWeek + 1}`]
      );
      await this._workoutPlanRepository.markWeekAsCompleted(
        workoutId,
        `week${currentWeek}`
      );
    }

    await this._workoutPlanRepository.markWorkoutDayAsComplete(
      workoutId,
      week,
      day,
      report
    );

    return report;
  }
}
