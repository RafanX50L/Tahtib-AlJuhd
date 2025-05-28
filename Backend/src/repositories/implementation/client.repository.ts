import {
  IClientPersonalization,
  IClientUserData,
} from "@/models/interface/IPersonalization";
import { IClientRepository } from "../interface/IClient.repository";
import { WorkoutPlanModel } from "../../models/implementation/workout.model";
import { DietPlanModel } from "../../models/implementation/DietPlan.model";
import { PersonalizationModel } from "../../models/implementation/personalization.model";
import mongoose from "mongoose";
import { createHttpError } from "../../utils";
import { HttpResponse } from "../../constants/response-message.constant";
import { HttpStatus } from "../../constants/status.constant";
import { UserRepository } from "./user.repository";

export class ClientRepository
  extends UserRepository
  implements IClientRepository
{
  constructor() {
    super();
  }

  async SaveWorkoutsDietsPersonalization(userData: IClientUserData, plan: any) {
    // Check if transactions are supported (replica set or sharded cluster)
    let useTransactions = false;
    try {
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().command({ replSetGetStatus: 1 });
        useTransactions = true; // Replica set detected
      }
    } catch (error) {
      console.warn(
        "Running in standalone mode; transactions are not supported. Proceeding without transactions.",
        error
      );
    }

    if (useTransactions) {
      // Use transactions for replica set environments
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const workoutPlan = await this.createWorkoutPlan(
          plan.workoutPlan,
          session
        );
        const dietPlan = await this.createDietPlan(plan.dietPlan, session);
        const personalization = await this.createPersonalization(
          userData,
          workoutPlan._id as mongoose.Types.ObjectId,
          dietPlan._id as mongoose.Types.ObjectId,
          session
        );
        const client = await this.updatePersonalizationId(
          userData.userId,
          personalization.id
        );
        await session.commitTransaction();
        return client;
      } catch (error) {
        await session.abortTransaction();
        console.log("Error :", error);
        throw createHttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          HttpResponse.FAILED_TO_GENERATE_FITNESS_PLAN
        );
      } finally {
        session.endSession();
      }
    } else {
      // Non-transactional fallback for standalone mode
      try {
        const workoutPlan = await this.createWorkoutPlan(plan.workoutPlan);
        const dietPlan = await this.createDietPlan(plan.dietPlan);
        const personalization = await this.createPersonalization(
          userData,
          workoutPlan._id as mongoose.Types.ObjectId,
          dietPlan._id as mongoose.Types.ObjectId
        );
        const client = await this.updatePersonalizationId(
          userData.userId,
          personalization.id
        );
        return client;
      } catch (error) {
        console.log("Error :", error);
        throw createHttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          HttpResponse.FAILED_TO_GENERATE_FITNESS_PLAN
        );
      }
    }
  }

  async createPersonalization(
    userData: IClientUserData,
    workoutId: mongoose.Types.ObjectId,
    dietId: mongoose.Types.ObjectId,
    session?: mongoose.ClientSession
  ) {
    try {
      // Structure the personalization data according to clientPersonalizationSchema
      const personalizationData = {
        planStatus: "Inactive",
        user_data: {
          nick_name: userData.nick_name,
          age: userData.age,
          gender: userData.gender,
          height: userData.height,
          current_weight: userData.current_weight,
          target_weight: userData.target_weight,
          fitness_goal: userData.fitness_goal,
          current_fitness_level: userData.current_fitness_level,
          activity_level: userData.activity_level,
          equipments: userData.equipments || [],
          workout_duration: userData.workout_duration,
          workout_days_perWeek: userData.workout_days_perWeek,
          health_issues: userData.health_issues || null,
          medical_condition: userData.medical_condition || null,
          diet_allergies: userData.diet_allergies || null,
          diet_meals_perDay: userData.diet_meals_perDay,
          diet_preferences: userData.diet_preferences || null,
        },
        workouts: workoutId,
        dietPlan: dietId,
        posts: null,
        progress: null,
        one_to_one: null,
      };

      // Create or update personalization document
      const personalization = await PersonalizationModel.findOneAndUpdate(
        { userId: userData.userId, role: "client" },
        {
          $set: {
            role: "client",
            data: personalizationData,
            updatedAt: new Date(),
          },
        },
        { new: true, upsert: true, session }
      );

      if (!personalization) {
        throw createHttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          HttpResponse.FAILED_TO_CREATE_OR_UPDATE_PERSONALIZATION
        );
      }

      return personalization;
    } catch (error) {
      console.log("Error :", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_CREATE_OR_UPDATE_PERSONALIZATION
      );
    }
  }

  async createWorkoutPlan(workoutPlan: any, session?: mongoose.ClientSession) {
    try {
      const newWorkoutPlan = new WorkoutPlanModel(workoutPlan);
      const savedWorkoutPlan = await newWorkoutPlan.save({ session });
      return savedWorkoutPlan;
    } catch (error) {
      console.log("Error :", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_GENERATE_WORKOUT_PLAN
      );
    }
  }

  async createDietPlan(dietPlan: any, session?: mongoose.ClientSession) {
    try {
      const newDietPlan = new DietPlanModel(dietPlan);
      const savedDietPlan = await newDietPlan.save({ session });
      return savedDietPlan;
    } catch (error) {
      console.log("Error :", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_GENERATE_DIET_PLAN
      );
    }
  }

  async getBasicFitnessPlan(userId: string) {
    try {
      const personalData = await PersonalizationModel.findOne({ userId });
      const userData = personalData?.data as IClientPersonalization;
      console.log("done return basic fitness data");
      return {
        Workout_Duration: userData?.user_data.workout_duration,
        Workout_Days_Per_Week: userData?.user_data.workout_days_perWeek,
        Workout_Completed: userData?.user_data.workout_completed_of_28days,
      };
    } catch (error) {
      console.log("Error fetching basic fitness plan:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_BASIC_FITNESS_PLAN
      );
    }
  }

  async getWorkouts(userId: string, week: string) {
    try {
      const PersonalData = await PersonalizationModel.findOne({ userId })
        .populate({
          path: "data.workouts",
          model: "WorkoutPlan",
        })
        .exec();
      if (!PersonalData) {
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          HttpResponse.FAILED_TO_FETCH_WORKOUTS
        );
      }
      const data = PersonalData?.data as IClientPersonalization;
      const weekNumber = parseInt(week, 10);
      const weeks = `week${weekNumber}`;
      // Ensure workouts is not null and is an object before accessing weeks
      let workouts: any = null;
      if (
        data.workouts &&
        typeof data.workouts === "object" &&
        weeks in data.workouts
      ) {
        workouts = (data.workouts as any)[weeks];
      }
      console.log("Fetched Workouts:", workouts);
      if (!workouts) {
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          HttpResponse.FAILED_TO_FETCH_WORKOUTS
        );
      }
      const notes = (data.workouts as any).notes || "No notes available";
      console.log("feteched notes", notes);
      return {
        workouts,
        notes,
      };
    } catch (error) {
      console.log("Error fetching workouts:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WORKOUTS
      );
    }
  }

  async getWeekCompletionStatus(userId: string) {
    try {
      const PersonalData = await PersonalizationModel.findOne({ userId })
        .populate({ path: "data.workouts", model: "WorkoutPlan" })
        .exec();
      if (!PersonalData) {
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          HttpResponse.FAILED_TO_FETCH_WORKOUTS
        );
      }
      const data = PersonalData?.data as IClientPersonalization;
      if (!data || typeof data !== "object") {
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          HttpResponse.FAILED_TO_FETCH_WORKOUTS
        );
      }
      // Ensure workouts is populated and not just an ObjectId
      const workouts =
        data.workouts && typeof data.workouts === "object" && !("toHexString" in data.workouts)
          ? (data.workouts as any)
          : null;

      const weekCompletionStatus = {
        week1: workouts?.week1?.workout_completed || false,
        week2: workouts?.week2?.workout_completed || false,
        week3: workouts?.week3?.workout_completed || false,
        week4: workouts?.week4?.workout_completed || false,
      };
      return weekCompletionStatus;

    } catch (error) {
      console.log("Error fetching week completion status:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WEEK_COMPLETION_STATUS
      );
    }
  }
}
