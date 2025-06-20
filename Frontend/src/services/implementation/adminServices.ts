import api from "./api";
import { ADMIN_ROUTES } from "@/utils/constant";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const AdminService = {
  getAllClients: async () => {
    try {
      const response = await api.get(ADMIN_ROUTES.GET_ALL_CLIENTS);
      console.log('clients ',response);
      return { data: response.data[0], error: null };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to fetch clients. Please try again.";
      console.log("Error fetching clients:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // updateClinetStatus: async (id: string, status: boolean) => {
  //   console.log("afaskdfjjk");
  //   try {
  //     console.log("afdnasjfkas");
  //     const response = await api.post(ADMIN_ROUTES.UPDATE_CLIENT_STATUS, {
  //       id,
  //       status,
  //     });
  //     console.log("updated serfsdfas", response);
  //     return { data: response.data[0], error: null };
  //   } catch (error) {
  //     const err = error as AxiosError<{ error: string }>;
  //     const errorMessage =
  //       err.response?.data.error ||
  //       "Failed to Update client status. Please try again.";
  //     console.log("Error Update client status:", errorMessage);
  //     toast.error(errorMessage);
  //     throw new Error(errorMessage);
  //   }
  // },

  blockOrUnblockUser : async (id:string) =>{
    try {
      const response = await api.patch(ADMIN_ROUTES.BLOCK_OR_UNBLOCK, { id });
      console.log("updated serfsdfas", response);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to update status. Please try again.";
      console.log("Error update status:", errorMessage);
      toast.error(errorMessage);
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
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getApprovedTrainers: async (page:number) => {
    try {
      console.log("jkdsakfjsadklfjsadkfj");
      const response = await api.get(
        `${ADMIN_ROUTES.GET_APPROVED_TRAINERS}/${page}`
      );
      console.log("response from pending tariners", response.data);
      return response.data
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to fetch trainers. Please try again.";
      console.log("Error fetching trainers:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getPendingTrainers: async (page: number) => {
    try {
      console.log("jkdsakfjsadklfjsadkfj");
      const response = await api.get(
        `${ADMIN_ROUTES.GET_PENDING_TRAINERS}/${page}`
      );
      console.log("response from pending tariners", response.data);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to fetch trainers. Please try again.";
      console.log("Error fetching trainers:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  updateTrainerStatus: async (id: string, status: string) => {
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
        "Failed to Update Trainer status. Please try again.";
      console.log("Error Update Trainer status:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  scheduleInterview: async (
    id: string,
    { date, time }: { date: Date; time: string }
  ) => {
    try {
      const response = await api.post(ADMIN_ROUTES.SCHEDULE_INTERVIEW, {
        id,
        date,
        time,
      });
      console.log("updated serfsdfas", response);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to Schedule interview. Please try again.";
      console.log("Error Scheduling Interview:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  submitInterviewFeedback: async (id: string, feedback: any) => {
    try {
      const response = await api.post(ADMIN_ROUTES.SUBMIT_INTERVIEW_FEEDBACK, {
        id,
        feedback,
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to fetch clients. Please try again.";
      console.log("Error fetching clients:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  approveTrainer: async (id: string,salary:number) => {
    try {
      const response = await api.patch(ADMIN_ROUTES.APPROVE_TRAINER, { id,salary });
      console.log("updated serfsdfas", response);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to Approve Trainer. Please try again.";
      console.log("Error Approve Trainer:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  rejectTrainer: async (id: string) => {
    try {
      const response = await api.patch(ADMIN_ROUTES.REJECT_TRAINER, { id });
      console.log("updated serfsdfas", response);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to Reject Trainer. Please try again.";
      console.log("Error Reject Trainer:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
};
