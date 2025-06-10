import api from "./api";
import { ADMIN_ROUTES } from "@/utils/constant";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const AdminService = {
  getAllClients: async () => {
    try {
      const response = await api.get(ADMIN_ROUTES.GET_ALL_CLIENTS);
      console.log(response)
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to fetch clients. Please try again.";
      console.log("Error fetching clients:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  updateClinetStatus: async (id: string, status: boolean) => {
    console.log("afaskdfjjk");
    try {
      console.log("afdnasjfkas");
      const response = await api.post(ADMIN_ROUTES.UPDATE_CLIENT_STATUS, {
        id,
        status,
      });
      console.log("updated serfsdfas", response);
      return { data: response.data[0], error: null };
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to fetch clients. Please try again.";
      console.log("Error fetching clients:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  getAllTrainers: async () => {
    try {
      const response = await api.get(ADMIN_ROUTES.GET_ALL_TRAINERS);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to fetch trainers. Please try again.";
      console.log("Error fetching trainers:", errorMessage);
      throw new Error(errorMessage);
    }
  },
  updateTrainerStatus: async (id:string,status:string) => {
    try {
      console.log("afdnasjfkas");
      const response = await api.post(ADMIN_ROUTES.UPDATE_TRAINER_STATUS, {
        id,
        status,
      });
      console.log("updated serfsdfas", response);
      return { data: response.data[0], error: null };
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to fetch clients. Please try again.";
      console.log("Error fetching clients:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
