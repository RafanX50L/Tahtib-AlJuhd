import { IClientUserData } from "@/models/interface/IPersonalization";
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

  // async SaveWorkoutsDietsPersonalization(userData: IClientUserData, plan: any) {
  //   const session = await mongoose.startSession();
  //   session.startTransaction();
  //   try {
  //     const workoutPlan = await this.createWorkoutPlan(
  //       plan.workoutPlan,
  //       session
  //     );
  //     const dietPlan = await this.createDietPlan(plan.dietPlan, session);
  //     const personalization = await this.createPersonalization(
  //       userData,
  //       workoutPlan._id,
  //       dietPlan._id,
  //       session
  //     );
  //     await session.commitTransaction();
  //     return personalization;
  //   } catch (error) {
  //     await session.abortTransaction();
  //     console.log("Error complained:", error);
  //     throw createHttpError(
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       HttpResponse.FAILED_TO_GENERATE_FITNESS_PLAN
  //     );
  //   } finally {
  //     session.endSession();
  //   }
  // }

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
        "Running in standalone mode; transactions are not supported. Proceeding without transactions.",error
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
          workoutPlan._id,
          dietPlan._id,
          session
        );
        const client = await this.updatePersonalizationId(userData.userId,personalization.id);
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
          workoutPlan._id,
          dietPlan._id
        );
        const client = await this.updatePersonalizationId(userData.userId,personalization.id);
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
}
