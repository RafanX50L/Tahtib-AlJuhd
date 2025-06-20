import api from "./api";
import { TRAINER_ROUTES } from "../../utils/constant";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const TrainerService = {
  getPendingApplicationDetails: async () => {
    try {
      const response = await api.get(
        TRAINER_ROUTES.GET_PENDING_TRAINER_APPLICATION
      );
      console.log("response form backned", response.data[0]);
      return response.data[0];
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
      return response.data[0];
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
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
  }
};
