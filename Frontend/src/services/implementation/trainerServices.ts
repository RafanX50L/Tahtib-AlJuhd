import api from "./api";
import { TRAINER_ROUTES } from "../../utils/constant";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { IPlan } from "@/components/trainer/SetPlan/plan";
import { WeeklyRulesPayload } from "@/components/trainer/SetAvailability/SetAvailabilityPage";

export type DayWindow = { startTime: string; endTime: string };
export type WeeklyRulesPayloads = {
  trainerId: string;
  rules: WeeklyRulesPayload
};

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

  updateTrainerProfilePicture: async (formData:FormData) => {
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

  updateTrainerProfile: async(formDataToSend:FormData) => {
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

  // plan services
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
  updatePlan: async (editingPlanId: string, formData: Partial<IPlan>) => {
    try {
      const response = await api.put(TRAINER_ROUTES.PLAN, { formData,editingPlanId});
      console.log("Updated plan response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to update plan";
      console.log("Error updating plan: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
  deactivatePlan: async (editingPlanId: string) => {
    try {
      const response = await api.patch(TRAINER_ROUTES.PLAN, { editingPlanId });
      console.log("Deactivated plan response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to deactivate plan";
      console.log("Error deactivating plan: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // availability services
  getSlots: async(trainerId:string, fromDate:string, toDate: string)=>{
    try {
      const response = await api.get(`${TRAINER_ROUTES.AVAILABILITY}/slots?trainerId=${trainerId}&fromDate=${fromDate}&toDate=${toDate}&mode=all`);
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
  setWeeklyRules: async (payload: WeeklyRulesPayloads) => {
    const res = await api.post(`${TRAINER_ROUTES.AVAILABILITY}/rules`, payload);
    return res.data as { message: string };
  },
  getWeeklyRules: async(trainerId: string) => {
    try {
      const response = await api.get(`${TRAINER_ROUTES.AVAILABILITY}/rules`, { params: { trainerId } });
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || 'Failed to fetch weekly rules';
      console.log('Error fetching weekly rules: ', errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getSalary: async () => {
    try {
      const response = await api.get(TRAINER_ROUTES.SALARY);
      console.log("Fetched salary response: ", response.data);
      return { data: response.data.salary };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch salary";
      console.log("Error fetching salary: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await api.get(TRAINER_ROUTES.DASHBOARD_STATS);
      return response.data.data as {
        activeClients: number;
        sessionsToday: number;
        totalRevenueThisMonth: number;
        contractsExpiringSoon: number;
      };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || 'Failed to fetch dashboard stats';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getDashboardTrends: async () => {
    try {
      const response = await api.get(TRAINER_ROUTES.DASHBOARD_TRENDS);
      return response.data.data as {
        labels: string[];
        sessions: number[];
        activeClients: number[];
        newClients: number[];
      };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || 'Failed to fetch dashboard trends';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getDashboardPayments: async (params: { page?: number; limit?: number; status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'all'; search?: string } = {}) => {
    try {
      const response = await api.get(TRAINER_ROUTES.DASHBOARD_PAYMENTS, { params });
      return response.data.data as {
        payments: Array<{ id: string; clientId: string; amount: number; currency: string; paymentStatus: string; createdAt: string }>;
        total: number;
        page: number;
        limit: number;
      };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || 'Failed to fetch payment history';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // trainer client Services

  getClients: async (trainerId: string) => {
    try {
      const response = await api.get(`${TRAINER_ROUTES.CLIENTS}?trainerId=${trainerId}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || 'Failed to fetch clients';
      console.log('Error fetching clients: ', errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getChatMessages: async (chatId: string) => {
    try {
      const response = await api.get(`${TRAINER_ROUTES.CHAT}/${chatId}/messages`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || 'Failed to fetch chat messages';
      console.log('Error fetching chat messages: ', errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

  }

};
