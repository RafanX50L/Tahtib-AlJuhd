import { AxiosError } from "axios";
import api from "./api";
import { toast } from "sonner";
import { INotificationView } from "@/components/shared/Notification";

export const NotificationServices = {
  getLastFiveNotifications: async (
    userId: string
  ): Promise<{ data: INotificationView[] }> => {
    try {
      console.log("Fetching last five notifications for user:", userId);
      const response = await api.get("/notifications/last-five", {
        params: { userId },
      });
      return {
        data: response.data.map((n: INotificationView) => ({
          ...n,
          date: new Date(n.date),
        })),
      };
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || "Failed to Delete chat bot Session";
      console.log("Error Deleting chat bot Session: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
  getBasicDetails: async (): Promise<{total: number, read: number}> => {
    try {
      const response = await api.get("/notifications/base-details");
      return response.data
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || "Failed to Delete chat bot Session";
      console.log("Error Deleting chat bot Session: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getNotifications: async ({
    userId,
    page,
    limit,
    search,
    type,
    sort,
  }: {
    userId: string;
    page: number;
    limit: number;
    search?: string;
    type?: string;
    sort?: string;
  }): Promise<{ data: {notifications: INotificationView[]}}> => {
    try {
      console.log("Fetching notifications for user:", userId, { page, limit, search, type, sort });
      const response = await api.get("/notifications", {
        params: { userId, page, limit, search, type, sort },
      });
      console.log('response form noti',response);
      return {
        data: {
          notifications: response.data.map((n: INotificationView) => ({
            ...n,
            date: new Date(n.date),
          })),
        },
      };
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || "Failed to Delete chat bot Session";
      console.log("Error Deleting chat bot Session: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || "Failed to Delete chat bot Session";
      console.log("Error Deleting chat bot Session: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    try {
      await api.patch("/notifications/mark-all-read", { userId });
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || "Failed to Delete chat bot Session";
      console.log("Error Deleting chat bot Session: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    try {
      await api.delete(`/notifications/${notificationId}`);
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || "Failed to Delete chat bot Session";
      console.log("Error Deleting chat bot Session: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  deleteSelected: async (notificationIds: string[]): Promise<void> => {
    try {
      await Promise.all(
        notificationIds.map((id) => api.delete(`/notifications/${id}`))
      );
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || "Failed to Delete chat bot Session";
      console.log("Error Deleting chat bot Session: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
};