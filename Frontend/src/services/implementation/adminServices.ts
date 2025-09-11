import { FeedbackData } from "@/components/admin/TrainerManagment/PendingApplicationsTable";
import api from "./api";
import { ADMIN_ROUTES } from "@/utils/constant";
import { toast } from "sonner";

export const AdminService = {
  getAllClients: async (
    statusFilter: string,
    searchTerm: string,
    page: number,
    limit: number
  ) => {
    try {
      searchTerm = searchTerm.toString();
      console.log("datafasdfa", searchTerm, statusFilter, page, limit);
      const response = await api.get(ADMIN_ROUTES.GET_ALL_CLIENTS, {
        params: {
          page,
          limit,
          search: searchTerm,
          planStatus: statusFilter,
        },
      });
      console.log("clients ", response);
      return { data: response.data.data, error: null };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string }}};
      const errorMessage =
        err?.response?.data?.error ||
        "Failed to fetch clients. Please try again.";
      console.log("Error fetching clients:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getDashboardStats: async () => {
    const res = await api.get(ADMIN_ROUTES.DASHBOARD_STATS);
    return res.data.data as { totalTrainers: number; totalClients: number; activeClients: number; monthlyRevenue: number; pendingTrainerApprovals: number };
  },
  getDashboardRevenue: async (monthsBack = 6) => {
    const res = await api.get(ADMIN_ROUTES.DASHBOARD_REVENUE, { params: { monthsBack } });
    return res.data.data as { labels: string[]; revenue: number[] };
  },
  getDashboardTopTrainers: async (limit = 5) => {
    const res = await api.get(ADMIN_ROUTES.DASHBOARD_TOP_TRAINERS, { params: { limit } });
    return res.data.data as Array<{ trainerId: string; name?: string; revenue: number; clients: number }>;
  },
  getDashboardRecentPayments: async (limit = 10) => {
    const res = await api.get(ADMIN_ROUTES.DASHBOARD_RECENT_PAYMENTS, { params: { limit } });
    return res.data.data as Array<{ id: string; trainerId: string; trainerName: string; clientId: string; clientName: string; amount: number; currency: string; createdAt: string; planTitle?: string }>;
  },

  blockOrUnblockUser: async (id: string) => {
    try {
      const response = await api.patch(`${ADMIN_ROUTES.BLOCK_OR_UNBLOCK}/${id}`);
      console.log("updated serfsdfas", response);
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { error?: string }}};
      const errorMessage =
        err?.response?.data?.error ||
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
      const err = error as { response?: { data?: { error?: string }}};
      const errorMessage =
        err?.response?.data?.error ||
        "Failed to fetch trainers. Please try again.";
      console.log("Error fetching trainers:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

 getApprovedTrainers: async (page: number, limit: number, search: string) => {
  try {
    const response = await api.get(
      `${ADMIN_ROUTES.GET_APPROVED_TRAINERS}?page=${page}&limit=${limit}&search=${search}`
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string }}};
    const errorMessage =
      err?.response?.data?.error || "Failed to fetch trainers. Please try again.";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
},

getPendingTrainers: async (page: number, limit: number, search: string) => {
  try {
    const response = await api.get(
      `${ADMIN_ROUTES.GET_PENDING_TRAINERS}?page=${page}&limit=${limit}&search=${search}`
    );
    return { data: response.data, error: null };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string }}};
    const errorMessage =
      err?.response?.data?.error || "Failed to fetch trainers. Please try again.";
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
      const err = error as { response?: { data?: { error?: string }}};
      const errorMessage =
        err?.response?.data?.error ||
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
      const response = await api.post(
        `${ADMIN_ROUTES.SCHEDULE_INTERVIEW}/id/${id}/date/${date}/time/${time}`
      );
      console.log("updated serfsdfas", response);
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { error?: string }}};
      const errorMessage =
        err?.response?.data?.error ||
        "Failed to Schedule interview. Please try again.";
      console.log("Error Scheduling Interview:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  submitInterviewFeedback: async (id: string, feedback: FeedbackData) => {
    try {
      const response = await api.patch(ADMIN_ROUTES.SUBMIT_INTERVIEW_FEEDBACK, {
        id,
        feedback,
      });
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { error?: string }}};
      const errorMessage =
        err?.response?.data?.error ||
        "Failed to fetch clients. Please try again.";
      console.log("Error fetching clients:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  approveTrainer: async (id: string, salary: number) => {
    try {
      const response = await api.patch(ADMIN_ROUTES.APPROVE_TRAINER, {
        id,
        salary,
      });
      console.log("updated serfsdfas", response);
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { error?: string }}};
      const errorMessage =
        err?.response?.data?.error ||
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
      const err = error as { response?: { data?: { error?: string }}};
      const errorMessage =
        err?.response?.data?.error ||
        "Failed to Reject Trainer. Please try again.";
      console.log("Error Reject Trainer:", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
};
