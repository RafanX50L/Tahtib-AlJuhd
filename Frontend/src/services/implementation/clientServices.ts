import { AxiosError } from "axios";
import api from "./api";
import { CLIENT_ROUTES } from "../../utils/constant";
import { toast } from "sonner";
import { Types } from "mongoose";
import { Interaction } from "@/components/client/chatBot/types";
import { IExerciseView } from "@/interfaces/client/IWorkout";
import { ClientProfile } from "@/components/client/Profile/Profile";

export interface IClientUserData {
  nickName: string;
  age: number;
  gender: string;
  address?: string;
  phoneNumber?: string;
  profilePictureId?: Types.ObjectId;
  height: number;
  currentWeight: number;
  targetWeight: number;
  fitnessGoal:
    | "build muscle"
    | "lose weight"
    | "get stronger"
    | "improve endurance"
    | "tone body"
    | "increase flexibility";
  currentFitnessLevel: "beginner" | "intermediate" | "advanced" | "athlete";
  activityLevel:
    | "sedentary"
    | "lightly active"
    | "moderately active"
    | "very active";
  equipment: (
    | "body weight"
    | "dumbbells"
    | "resistance bands"
    | "kettlebells"
    | "pull-up bar"
    | "yoga mat"
  )[];
  workoutDuration: string;
  workoutDaysPerWeek: number;
  healthIssues?: string[];
  medicalCondition?: string;
  dietAllergies?: string[];
  dietMealsPerDay:
    | "3 meals"
    | "3 meals + 1 snack"
    | "3 meals + 2 snacks"
    | "6 meals";
  dietPreferences?: string;
  workoutsCompletedIn28Days: number;
}

export const ClientService = {
  // service for cleint fitness plan generation

  generatePersonalization: async (userData: Partial<IClientUserData>) => {
    try {
      const response = await api.post(
        CLIENT_ROUTES.GENERATE_PERSONALIZATION,
        userData,
        { timeout: 60000 }
      );
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to generate fitness plan";
      console.log("Error creating fitness Plan: ", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Services for workouts pages

  getBasicWorkoutDetails: async () => {
    try {
      const response = await api.get(CLIENT_ROUTES.GET_BASIC_WORKOUT_DETAILS);
      console.log("basic finess response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch basic fitness details";
      console.log("Error fetching basic fitness details: ", errorMessage);
      throw new Error(errorMessage);
    }
  },

  getWorkouts: async (week: number) => {
    try {
      const response = await api.get(
        `${CLIENT_ROUTES.GET_CLIENT_WORKOUTS}/${week}`
      );
      console.log("workouts response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch workouts";
      console.log("Error fetching workouts: ", errorMessage);
      throw new Error(errorMessage);
    }
  },

  getWeekCompletionStatus: async () => {
    try {
      const response = await api.get(CLIENT_ROUTES.GET_WEEK_COMPLETION_STATUS);
      console.log("week completion status response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch week completion status";
      console.log("Error fetching week completion status: ", errorMessage);
      throw new Error(errorMessage);
    }
  },

  completeDailyWorkoutAndFetchReport: async (
    workout: IExerciseView[],
    currentDay: string,
    currentWeek: string
  ) => {
    console.log(
      "Updating day completion for workout:",
      workout,
      "currentDay:",
      currentDay,
      "currentWeek:",
      currentWeek
    );
    try {
      const response = await api.patch(
        `${CLIENT_ROUTES.COMPLETE_DAILY_WORKOUT}`,
        { workout, day: currentDay, week: currentWeek }
      );
      console.log("Updated workout response: ", response.data);
      return { data: response.data.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to update day completion";
      console.log("Error updating day completion: ", errorMessage);
      throw new Error(errorMessage);
    }
  },

  getWorkoutReport: async (week: string, day: string) => {
    try {
      console.log("Fetching workout report for week:", week, "day:", day);
      const response = await api.get(
        `${CLIENT_ROUTES.GET_WORKOUT_REPORT}?week=${week}&day=${day}`
      );
      console.log("Workout report response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch workout report";
      console.log("Error fetching workout report: ", errorMessage);
      throw new Error(errorMessage);
    }
  },

  getWeeklyChallenges: async () => {
    try {
      const response = await api.get(CLIENT_ROUTES.GET_WEEKLY_CHALLENGES);
      console.log("Weekly challenges response: ", response.data);
      return response.data.weeklyChallenges;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch weekly challenges";
      console.log("Error fetching weekly challenges: ", errorMessage);
      throw new Error(errorMessage);
    }
  },

  getChallengeById: async (challengeId: string) => {
    try {
      const response = await api.get(
        `${CLIENT_ROUTES.GET_WEEKLY_CHALLENGES}/${challengeId}`
      );
      console.log("Challenge response: ", response.data.challenge);
      return { data: response.data.challenge };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch challenge details";
      console.log("Error fetching challenge details: ", errorMessage);
      throw new Error(errorMessage);
    }
  },

  joinChallenge: async (challengeId: string) => {
    try {
      const response = await api.post(
        `${CLIENT_ROUTES.JOIN_WEEKLY_CHALLENGE}/${challengeId}`
      );
      console.log("Join challenge response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to join challenge";
      console.log("Error joining challenge: ", errorMessage);
      throw new Error(errorMessage);
    }
  },

  markChallengeDayComplete: async (
    exercises: IExerciseView[],
    day: number,
    challengeId: string
  ) => {
    console.log(
      "Updating day completion for weekly challenge:",
      exercises,
      "day:",
      day,
      "challengeId:",
      challengeId
    );
    try {
      const response = await api.patch(
        `${CLIENT_ROUTES.MARK_CHALLENGE_DAY_COMPLETE(challengeId, day)}`,
        { exercises, day, challengeId }
      );
      console.log("Updated day completion response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to update day completion";
      console.log("Error updating day completion: ", errorMessage);
      throw new Error(errorMessage);
    }
  },

  getClientProfileData: async () => {
    try {
      const response = await api.get(CLIENT_ROUTES.GET_CLIENT_PROFILE);
      console.log("response of profile", response.data);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch clinet data";
      console.log("Error fetching client data: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  updateClientProfilePicture: async (formData: FormData) => {
    try {
      const response = await api.patch(
        CLIENT_ROUTES.UPDATE_CLIENT_PROFILE_PHOTO,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Updated day completion response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to update uesr profile Photo";
      console.log("Error updating user Profile Photo: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  updateClientProfile: async (formData: ClientProfile) => {
    try {
      const response = await api.patch(
        CLIENT_ROUTES.UPDATE_CLIENT_PROFILE,
        formData
      );
      console.log("response of profile", response.data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to update clinet data";
      console.log("Error update client data: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // trainer Session Services

  getAvailabeTrainers: async (
    pageNum: number,
    trainersPerPage: number,
    search: string,
    specialty: string
  ) => {
    try {
      const response = await api.get(
        `${CLIENT_ROUTES.GET_AVAILABLE_TRAINERS}?specialty=${encodeURIComponent(specialty)}&page=${pageNum}&limit=${trainersPerPage}&search=${encodeURIComponent(search)}`
      );

      console.log("Available trainers response: ", response);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch trainer data";
      console.log("Error fetch trainer data: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getTrainerById: async (trainerId: string) => {
    try {
      const response = await api.get(`${CLIENT_ROUTES.TRAINER}/${trainerId}`);
      console.log("Trainer details response: ", response.data);
      return response.data.trainerData;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch trainer details";
      console.log("Error fetch trainer details: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  purchasePlan: async (userId: string, trainerId: string, planId: string) => {
    try {
      const response = await api.post("/payment/create-checkout-session", { userId, trainerId, planId });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch current trainer data";
      console.log("Error fetch current trainer data: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getCurrentTrainerPartialData: async () => {
    try {
      const response = await api.get(CLIENT_ROUTES.CURRENT_TRAINER);
      return response.data.trainerData;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch current trainer data";
      console.log("Error fetch current trainer data: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // current Trainer Services

  getCurrentTrainerContract: async () => {
    try {
      const response = await api.get(CLIENT_ROUTES.CURRENT_TRAINER_CONTRACT);
      return response.data.contractData;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch current trainer data";
      console.log("Error fetch current trainer data: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
  getCurrentTrainerMessages: async (chatId: string) => {
    try {
      const response = await api.get(
        `${CLIENT_ROUTES.CURRENT_TRAINER}/${chatId}`
      );
      console.log("chat messages", response);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch current trainer messages";
      console.log("Error fetch current trainer messages: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getSlots: async (trainerId: string, fromDate: string, toDate: string) => {
    try {
      const response = await api.get(
        `${CLIENT_ROUTES.AVAILABILITY}/slots?trainerId=${trainerId}&fromDate=${fromDate}&toDate=${toDate}`
      );
      console.log("Fetched slots response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || "Failed to fetch slots";
      console.log("Error fetching slots: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // diet Plan Services

  getDietPlan: async () => {
    try {
      console.log("");
      const response = await api.get(CLIENT_ROUTES.GET_DIET_PLAN);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch Diet Plan data";
      console.log("Error fetch diet Plan data: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // chat bot service
  createChatBotSession: async (clientId: string, title?: string) => {
    try {
      const response = await api.post(CLIENT_ROUTES.CHAT_BOT_SESSIONS, {
        clientId,
        title,
      });
      return response.data.session;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to create chat bot session";
      console.log("Error creating chat bot session: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getChatBotInteractions: async (sessionId: string) => {
    try {
      console.log("");
      const response = await api.get(
        CLIENT_ROUTES.CHAT_BOT_INTERACTION(sessionId)
      );
      return response.data.interactions;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch chat bot data";
      console.log("Error fetch chat bot data: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getChatBotSessions: async () => {
    try {
      console.log("");
      const response = await api.get(CLIENT_ROUTES.CHAT_BOT_SESSIONS);
      toast.success(response.data.message);
      return response.data.sessions;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch Chat bot data";
      console.log("Error fetch Chat bot data: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  HandleSendMessageToChatBot: async (
    sessionId: string,
    userMessage: Interaction
  ) => {
    try {
      const response = await api.post(
        CLIENT_ROUTES.CHAT_BOT_INTERACTION(sessionId),
        {
          message: userMessage.content,
        },
        { timeout: 60000 }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to send message to chat bot";
      console.log("Error sending message to chat bot: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  DeleteBotChat: async (sessionId: string) => {
    try {
      const response = await api.delete(
        `${CLIENT_ROUTES.CHAT_BOT_SESSIONS}/${sessionId}`
      );
      console.log(response);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to Delete chat bot Session";
      console.log("Error Deleting chat bot Session: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
};
