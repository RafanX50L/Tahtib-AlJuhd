import api from "./api";
import { TRAINER_ROUTES } from "../../utils/constant";
import { toast } from "sonner";
import { IPlan } from "@/components/trainer/SetPlan/plan";

// Local AxiosError type to avoid version/type mismatches
type AxiosError<T = unknown> = { response?: { data: T } };

export type DayWindow = { startTime: string; endTime: string };
export type WeeklyRulesPayloads = {
  trainerId: string;
  rules: {
    weeklyRules: Record<string, DayWindow[]>;
    slotLength: number;
    bufferMinutes: number;
    timezone?: string;
  }
};

export const TrainerService = {
  getPendingApplicationDetails: async () => {
    try {
      const response = await api.get(
        TRAINER_ROUTES.GET_PENDING_TRAINER_APPLICATION
      );
      // Response received
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      const errorMessage =
        err.response?.data.error ||
        err.response?.data.message ||
        "Failed to submit trainer application";
      // Error handled
      throw new Error(errorMessage);
    }
  },

  // Service for submitting trainer application
  submitTrainerApplication: async (applicationData: FormData) => {
    try {
      // Submitting application
      const response = await api.post(
        TRAINER_ROUTES.SUBMIT_TRAINER_APPLICATION,
        applicationData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return { data: response.data.data, ok: true };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      const errorMessage =
        err.response?.data.error ||
        err.response?.data.message ||
        "Failed to submit trainer application";
      // Error handled
      throw new Error(errorMessage);
    }
  },

  getProfileData: async () => {
    try {
      const response = await api.get(TRAINER_ROUTES.GET_PROFILE_DATA);
      // Profile data received
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      const errorMessage =
        err.response?.data.error ||
        err.response?.data.message ||
        "Failed to submit trainer application";
      // Error handled
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
      // Day completion updated
      return { data: response.data.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to update uesr profile Photo";
      // Error handled
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
      // Profile updated
      return { data: response.data.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to update uesr profile ";
      // Error handled
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // plan services
  getPlans: async (trainerId: string) => {
    try {
      const response = await api.get(`${TRAINER_ROUTES.PLAN}?trainerId=${trainerId}`);
      // Plans fetched
      return { data: response.data.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch plans";
      // Error handled
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  AddnewPlan: async (formData:Partial<IPlan>,trainerId:string) => {
    try {
      const response = await api.post(TRAINER_ROUTES.PLAN, { ...formData, trainerId});
      // Plan added
      return { data: response.data.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to add new plan";
      // Error handled
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
  updatePlan: async (editingPlanId: string, formData: Partial<IPlan>) => {
    try {
      const response = await api.put(TRAINER_ROUTES.PLAN, { formData,editingPlanId});
      // Plan updated
      return { data: response.data.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to update plan";
      // Error handled
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
  deactivatePlan: async (editingPlanId: string) => {
    try {
      const response = await api.patch(TRAINER_ROUTES.PLAN, { editingPlanId });
      // Plan deactivated
      return { data: response.data.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to deactivate plan";
      // Error handled
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // availability services
  getSlots: async(trainerId:string, fromDate:string, toDate: string)=>{
    try {
      const response = await api.get(`${TRAINER_ROUTES.AVAILABILITY}/slots?trainerId=${trainerId}&fromDate=${fromDate}&toDate=${toDate}&mode=all`);
      // Slots fetched
      return { data: response.data.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch slots";
      // Error handled
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
  setWeeklyRules: async (payload: WeeklyRulesPayloads) => {
    const res = await api.post(`${TRAINER_ROUTES.AVAILABILITY}/rules`, payload);
    return res.data.data as { message: string };
  },
  getWeeklyRules: async(trainerId: string) => {
    try {
      const response = await api.get(`${TRAINER_ROUTES.AVAILABILITY}/rules`, { params: { trainerId } });
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || 'Failed to fetch weekly rules';
      // Error handled
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getSalary: async () => {
    try {
      const response = await api.get(TRAINER_ROUTES.SALARY);
      // Salary fetched
      return { data: response.data.data.salary };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to fetch salary";
      // Error handled
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
      return response.data.data.data as {
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
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || 'Failed to fetch clients';
      // Error handled
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getChatMessages: async (chatId: string) => {
    try {
      const response = await api.get(`${TRAINER_ROUTES.CHAT}/${chatId}/messages`);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || 'Failed to fetch chat messages';
      // Error handled
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

  }

};
