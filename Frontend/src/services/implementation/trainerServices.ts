import api from "./api";
import { TRAINER_ROUTES } from "../../utils/constant";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { IPlan } from "@/components/trainer/SetPlan/plan";
import { Slot } from "@/components/trainer/SetAvailability/SetAvailabilityPage";

export const TrainerService = {
  getPendingApplicationDetails: async () => {
    try {
      const response = await api.get(
        TRAINER_ROUTES.GET_PENDING_TRAINER_APPLICATION
      );
      console.log("response form backned", response.data[0]);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      const errorMessage =
        err.response?.data.error ||
        err.response?.data.message ||
        "Failed to submit trainer application";
      console.log("Error submitting trainer application: ", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Service for submitting trainer application
  submitTrainerApplication: async (applicationData: FormData) => {
    try {
      console.log("applicationData: ", applicationData);
      const response = await api.post(
        TRAINER_ROUTES.SUBMIT_TRAINER_APPLICATION,
        applicationData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return { data: response.data, ok: true };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      const errorMessage =
        err.response?.data.error ||
        err.response?.data.message ||
        "Failed to submit trainer application";
      console.log("Error submitting trainer application: ", errorMessage);
      throw new Error(errorMessage);
    }
  },

  getProfileData: async () => {
    try {
      const response = await api.get(TRAINER_ROUTES.GET_PROFILE_DATA);
      console.log("response form backned", response.data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      const errorMessage =
        err.response?.data.error ||
        err.response?.data.message ||
        "Failed to submit trainer application";
      console.log("Error submitting trainer application: ", errorMessage);
      throw new Error(errorMessage);
    }
  },

  updateTrainerProfilePicture: async (formData: any) => {
    try {
      const response = await api.patch(
        TRAINER_ROUTES.UPDATE_TRAINER_PROFILE_PHOTO,
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

  updateTrainerProfile: async(formDataToSend:any) => {
    try {
      const response = await api.patch(
        TRAINER_ROUTES.UPDATE_TRAINER_PROFILE,
        formDataToSend,
      );
      console.log("Updated response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to update uesr profile ";
      console.log("Error updating user Profile : ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getPlans: async (trainerId: string) => {
    try {
      const response = await api.get(`${TRAINER_ROUTES.PLAN}?trainerId=${trainerId}`);
      console.log("Fetched plans response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch plans";
      console.log("Error fetching plans: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  AddnewPlan: async (formData:Partial<IPlan>,trainerId:string) => {
    try {
      const response = await api.post(TRAINER_ROUTES.PLAN, { ...formData, trainerId});
      console.log("Added new plan response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to add new plan";
      console.log("Error adding new plan: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getSlots: async()=>{
    try {
      const response = await api.get(TRAINER_ROUTES.AVAILABILITY);
      console.log("Fetched slots response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch slots";
      console.log("Error fetching slots: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  addSlot: async (formData: Partial<Slot[]>, trainerId: string) => {
    try {
      const response = await api.post(TRAINER_ROUTES.AVAILABILITY, { ...formData, trainerId });
      console.log("Added new slot response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to add new slot";
      console.log("Error adding new slot: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

};
