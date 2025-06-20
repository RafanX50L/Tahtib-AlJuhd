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
import { IWorkoutReport } from "@/models/interface/IWorkout";
import { generateFitnessPlan } from "../../utils/gemini1.utils";
import WeeklyChallenge from "../../models/implementation/WeeklyChallenges.model";
import UserWeeklyChallenge, {
  IUserDayReport,
} from "../../models/implementation/UserWeeklyChallenge.model";
import { PersonalizationData } from "./trainer.repositor";
import { ClientProfile } from "@/controllers/interface/IClient.controller";

export class ClientRepository
  extends UserRepository
  implements IClientRepository
{
  constructor() {
    super();
  }

  async SaveWorkoutsDietsPersonalization(
    userData: IClientUserData,
    workout: any,
    diet: any
  ) {
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
        const workoutPlan = await this.createWorkoutPlan(workout, session);
        const dietPlan = await this.createDietPlan(diet, session);
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
        const workoutPlan = await this.createWorkoutPlan(workout);
        const dietPlan = await this.createDietPlan(diet);
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
      const notes = (data.workouts as any).notes || "No notes available";
      console.log("workouts", workouts);
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
        data.workouts &&
        typeof data.workouts === "object" &&
        !("toHexString" in data.workouts)
          ? (data.workouts as any)
          : null;

      const weekCompletionStatus = {
        week1: true,
        week2: workouts?.week1?.workout_completed || false,
        week3: workouts?.week2?.workout_completed || false,
        week4: workouts?.week3?.workout_completed || false,
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

  async updateDayCompletion(
    userId: string,
    workoutReport: IWorkoutReport,
    week: string,
    day: string
  ) {
    // Update personalization progress
    console.log("week", week, "day", day);
    const PersonalData = await PersonalizationModel.findOneAndUpdate(
      { userId },
      { $inc: { "data.user_data.workout_completed_of_28days": 1 } },
      { new: true, runValidators: true }
    );

    const data = PersonalData?.data as IClientPersonalization;
    const workoutId = data?.workouts;

    if (!workoutId) {
      throw createHttpError(HttpStatus.NOT_FOUND, "Workout ID not found");
    }

    const workoutPlan = await WorkoutPlanModel.findById(workoutId);

    if (!workoutPlan) {
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        HttpResponse.WORKOUT_NOT_FOUND
      );
    }

    // Ensure week and day exist
    const weekObj = (workoutPlan as any)[week];
    if (!weekObj) {
      throw createHttpError(HttpStatus.BAD_REQUEST, `Week '${week}' not found`);
    }

    const dayObj = weekObj[day];
    if (!dayObj) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        `Day '${day}' not found in ${week}`
      );
    }

    if (day === "day7") {
      const weekNumber = parseInt(week.replace("week", ""), 10);
      const userData = data?.user_data as any;
      const nextWeek = await generateFitnessPlan(
        userData,
        weekNumber + 1,
        "workout",
        weekObj
      );
      if (!nextWeek) {
        throw createHttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          HttpResponse.FAILED_TO_GENERATE_NEXT_WEEK_WORKOUT
        );
      }
      // nextWeek has shape: { "weekN": {...}, notes: "..." }
      const nextWeekKey = `week${weekNumber + 1}`;
      if (nextWeek[nextWeekKey]) {
        (workoutPlan as any)[nextWeekKey] = nextWeek[nextWeekKey];
      }
      if (nextWeek.notes) {
        (workoutPlan as any).notes = nextWeek.notes;
      }
      (workoutPlan as any)[`week${weekNumber}`].completed = true;
    }

    // Update the nested fields
    dayObj.completed = true;
    dayObj.report = workoutReport;

    const update = await workoutPlan.save();

    if (!update) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_UPDATE_WEEK_COMPLETION_STATUS
      );
    }

    return update;
  }

  getWorkoutReport = async (
    userId: string,
    week: string,
    day: string
  ): Promise<IWorkoutReport | null> => {
    const PersonalData = await PersonalizationModel.findOne({ userId });
    const data = PersonalData?.data as IClientPersonalization;
    const workoutId = data.workouts;

    if (!workoutId) {
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        HttpResponse.FAILED_TO_FETCH_WORKOUT_REPORT
      );
    }

    const workoutPlan = await WorkoutPlanModel.findById(workoutId);
    if (!workoutPlan) {
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        HttpResponse.FAILED_TO_FETCH_WORKOUT_REPORT
      );
    }

    // Dynamically access the week and day
    const weekData = (workoutPlan as any)[`${week}`];
    if (!weekData) {
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        `Week ${week} data not found`
      );
    }

    const dayData = (workoutPlan as any)?.[week]?.[day];
    if (!dayData) {
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        `Day ${day} data not found in Week ${week}`
      );
    }

    const report = dayData.report;
    if (!report) {
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        `No report found for Week ${week}, Day ${day}`
      );
    }

    return report;
  };

  async getWeeklyChallenges(): Promise<any> {
    try {
      const now = new Date();
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

      // Fetch all three types created today
      const challenges = await WeeklyChallenge.find({
        type: { $in: ["beginner", "intermediate", "advanced"] },
        // startDate: { $gte: startOfToday, $lt: endOfToday },
      });

      // Map them to type
      const result: Record<string, any> = {
        beginner: null,
        intermediate: null,
        advanced: null,
      };

      challenges.forEach((challenge) => {
        result[challenge.type] = challenge;
      });
      console.log("Weekly Challenges:", result);
      return result;
    } catch (error) {
      console.error("Error fetching weekly challenges:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WEEKLY_CHALLENGES
      );
    }
  }

  async getChallengeById(challengeId: string): Promise<any> {
    try {
      console.log("");
      const challenge = await WeeklyChallenge.findById(challengeId);
      if (!challenge) {
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          HttpResponse.FAILED_TO_FETCH_WEEKLY_CHALLENGES
        );
      }
      return challenge;
    } catch (error) {
      console.error("Error fetching challenge by ID:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_WEEKLY_CHALLENGES
      );
    }
  }

  async getUserWeeklyChallenge(
    userId: string,
    challengeId: string
  ): Promise<any> {
    try {
      const userChallenge = await UserWeeklyChallenge.findOne({
        user: new mongoose.Types.ObjectId(userId),
        challenge: new mongoose.Types.ObjectId(challengeId),
      });

      return userChallenge;
    } catch (error) {
      console.error("Error fetching user weekly challenge:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_FETCH_USER_WEEKLY_CHALLENGE
      );
    }
  }

  async joinWeeklyChallenge(userId: string, challengeId: string): Promise<any> {
    try {
      const challenge = await WeeklyChallenge.findById(challengeId);
      if (!challenge) {
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          HttpResponse.FAILED_TO_FETCH_WEEKLY_CHALLENGES
        );
      }

      // Check if user is already entered
      if (
        challenge.enteredUsers.includes(new mongoose.Types.ObjectId(userId))
      ) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          HttpResponse.USER_ALREADY_JOINED_CHALLENGE
        );
      }

      // Add user to enteredUsers array
      challenge.enteredUsers.push(new mongoose.Types.ObjectId(userId));
      await challenge.save();

      const userWeeklyChallenge = await UserWeeklyChallenge.create({
        user: new mongoose.Types.ObjectId(userId),
        challenge: new mongoose.Types.ObjectId(challengeId),
        type: challenge.type,
        startDate: new Date(),
        progress: [],
        score: 0,
      });

      return challenge;
    } catch (error) {
      console.error("Error joining weekly challenge:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_JOIN_WEEKLY_CHALLENGE
      );
    }
  }

  async updateDayCompletionOfWeeklyChallengeStatus(
    userId: string,
    dayIndex: number,
    challengeId: string,
    workoutReport: IWorkoutReport
  ) {
    console.log(
      "userId:",
      userId,
      "dayIndex:",
      dayIndex,
      "challengeId:",
      challengeId,
      "workoutReport:",
      workoutReport
    );
    try {
      const userChallenge = await UserWeeklyChallenge.findOne({
        user: new mongoose.Types.ObjectId(userId),
        challenge: new mongoose.Types.ObjectId(challengeId),
      });

      if (!userChallenge) {
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          HttpResponse.FAILED_TO_FETCH_USER_WEEKLY_CHALLENGE
        );
      }

      // Create a new day report entry
      const newDayReport: IUserDayReport = {
        dayIndex,
        completed: true,
        completedAt: new Date(),
        report: {
          caloriesBurned: workoutReport.caloriesBurned ?? 0,
          feedback: workoutReport.feedback ?? "",
          intensity: workoutReport.intensity ?? "",
          estimatedDuration: workoutReport.estimatedDuration ?? "",
          totalExercises: workoutReport.totalExercises ?? 0,
          totalSets: workoutReport.totalSets ?? 0,
        },
      };

      // Ensure progress array has enough length to accommodate dayIndex
      if (!userChallenge.progress) {
        userChallenge.progress = [];
      }

      // Set the new day report at the specified dayIndex
      userChallenge.progress[dayIndex] = newDayReport;

      await userChallenge.save();

      return userChallenge;
    } catch (error) {
      console.error(
        "Error updating day completion of weekly challenge status:",
        error
      );
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.FAILED_TO_UPDATE_USER_WEEKLY_CHALLENGE
      );
    }
  }

  async getClientProfileData(userId: string) {
    const personalisedData = await this.model.findById(userId).populate({
      path: "personalization",
      model: PersonalizationModel,
    });
    console.log("data", JSON.stringify(personalisedData));
    // Now personalization is the full document, not just ObjectId or string
    const data = (personalisedData.personalization as any)
      ?.data as IClientPersonalization;
    const userData = {
      name: data.user_data.nick_name,
      email: personalisedData.email,
      address: data.user_data.address || null,
      phoneNumber: data.user_data.phoneNumber || null,
      // age: data.user_data.age,
      profilePicture: data.user_data.profilePicture || null,
    };
    return userData;
  }

  async updateProfilePicture(clientId: string, signedUrl: string) {
    const personalData = await PersonalizationModel.findOneAndUpdate(
      { userId: clientId },
      { "data.user_data.profilePicture": signedUrl },
      { upsert: true, new: true }
    );

    if (!personalData) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR
      );
    }

    return personalData;
  }

  async updateClientProfile(userId: string, formdata: ClientProfile) {
    const updatedClient = await this.model.findByIdAndUpdate(
      userId,
      {
        name: formdata.name,
        email: formdata.email,
      },
      { new: true }
    );

    if (!updatedClient) {
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        "Client not found for profile update"
      );
    }

    const updatedPersonalData = await PersonalizationModel.findOneAndUpdate(
      { userId },
      {
        "data.user_data.phoneNumber": formdata.phoneNumber,
        "data.user_data.address": formdata.address,
      },
      { new: true}
    );

    if (!updatedPersonalData) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update personalization data"
      );
    }

          console.log('enterd to repor');

    return {
      client: updatedClient,
      personalization: updatedPersonalData,
    };
  }
}
