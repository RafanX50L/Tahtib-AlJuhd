import { IClientRepository } from "../../repositories/interface/IClient.repository";
import { IClientService } from "../interface/IClient.service";
import { HttpResponse } from "../../constants/response-message.constant";
import { createHttpError } from "../../utils";
import { HttpStatus } from "../../constants/status.constant";
import {generateFitnessPlan, generateWorkoutReport} from "../../utils/gemini1.utils";
import { IClientUserData } from "@/models/interface/IPersonalization";
import { IExercise, IWorkoutReport } from "@/models/interface/IWorkout";
// import { writeFile } from "fs";

export class ClientService implements IClientService {
  constructor(private readonly _clientRepository: IClientRepository) {}

  async generateFitnessPlan(userData: any) {
    try {
      // Validate required fields
      const requiredFields: (keyof IClientUserData)[] = [
        "nick_name",
        "age",
        "gender",
        "height",
        "current_weight",
        "target_weight",
        "fitness_goal",
        "current_fitness_level",
        "activity_level",
        "workout_days_perWeek",
        "diet_meals_perDay",
      ];

      for (const field of requiredFields) {
        if (!userData[field]) {
          throw createHttpError(
            HttpStatus.BAD_REQUEST,
            `Missing Required Field: ${field}`
          );
        }
      }
      console.log(userData);

      const plan = await generateFitnessPlan(userData);
      

      await this._clientRepository.SaveWorkoutsDietsPersonalization(
        userData,
        plan
      );

      return HttpResponse.GENERATING_FITNESS_PLAN_SUCCESSFULL;
    } catch (error) {
      console.error("API Error:", error);
      //   res.status(500).json({ error: "Failed to generate fitness plan" });
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_GENERATE_FITNESS_PLAN
      );
    }
  };

  // workouts services 

  getBasicFitnessPlan = async (userId: string) => {
    try {
      const basicPlan = await this._clientRepository.getBasicFitnessPlan(userId);
      return basicPlan;
    } catch (error) {
      console.error("Error fetching basic fitness plan:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_BASIC_FITNESS_PLAN
      );
    }
  };

  getWorkouts = async (userId: string, week: string) => {
    try {
      const workouts = await this._clientRepository.getWorkouts(userId, week);
      return workouts;
    } catch (error) {
      console.error("Error fetching workouts:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WORKOUTS
      );
    }
  };

  getWeekCompletionStatus = async (userId: string) => {
    try {
      const weekCompletionStatus = await this._clientRepository.getWeekCompletionStatus(userId);
      return weekCompletionStatus;
    } catch (error) {
      console.error("Error fetching week completion status:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WORKOUTS
      );
    }
  };

  updateDayCompletionStatus = async (
    userId: string,
    week: string,
    day: string,
    workout: IExercise[]
  ) => {
    try {
      // const workoutReport = await generateWorkoutReport(workout);
      const workoutReport = {
        caloriesBurned: 500, // Example value
        duration: 60, // Example value in minutes
        feedback: "Great job! Keep it up!", // Example feedback
        intensity: "low",
        estimatedDuration: "60 minutes",
        totalExercises: 5,
        totalSets: 15,
      } as IWorkoutReport;
      const updateDay = await this._clientRepository.updateDayCompletion(
        userId,
        workoutReport,
        week,
        day,
      );
      if (!updateDay) {
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          HttpResponse.WORKOUT_NOT_FOUND
        );
      }
      return workoutReport;
    } catch (error) {
      console.error("Error updating day completion status:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WORKOUTS
      );
    }
  };

  getWorkoutReport = async (
    userId: string,
    week: string,
    day: string
  ) => {
    try {
      const workoutReport = await this._clientRepository.getWorkoutReport(
        userId,
        week,
        day
      );
      return workoutReport;
    } catch (error) {
      console.error("Error fetching workout report:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WORKOUT_REPORT
      );
    }
  };

}
