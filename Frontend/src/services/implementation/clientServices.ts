import { AxiosError, get } from "axios";
import api from "./api";
import { CLIENT_ROUTES } from "../../utils/constant";
import { toast } from "sonner";

export const ClientService = {
  // service for cleint fitness plan generation

  generateFitnessPlan: async (userData) => {
    try {
      const response = await api.post(
        CLIENT_ROUTES.GENERATE_FITNESS_PLAN,
        userData
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

  getBasicFitnessDetails: async () => {
    try {
      const response = await api.get(CLIENT_ROUTES.GET_BASIC_FITNESS_DETAILS);
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

  updateDayCompletionAndGetWorkoutReport: async (
    workout: any,
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
        `${CLIENT_ROUTES.UPDATE_DAY_COMPLETION_STATUS}`,
        { workout, day: currentDay, week: currentWeek }
      );
      console.log("Updated workout response: ", response.data);
      return { data: response.data };
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
      return response.data;
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
      console.log("Challenge response: ", response.data);
      return { data: response.data };
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

  updateDayCompletionOfWeeklyChallenge: async (
    exercises: any,
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
        `${CLIENT_ROUTES.UPDATE_DAY_COMPLETION_OF_WEEKLY_CHALLENGE_STATUS}`,
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
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch clinet data";
      console.log("Error fetching client data: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  updateClientProfilePicture: async (formData: any) => {
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

  updateClientProfile: async (formData: any) => {
    try {
      const response = await api.patch(CLIENT_ROUTES.UPDATE_CLIENT_PROFILE,formData);
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
};
