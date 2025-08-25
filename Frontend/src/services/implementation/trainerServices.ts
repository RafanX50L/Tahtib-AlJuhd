import api from "./api";
import { TRAINER_ROUTES } from "../../utils/constant";
import axios from "axios";

type AxiosErrorType = {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
};
import { toast } from "sonner";
import { IPlan } from "@/components/trainer/SetPlan/plan";
import TrainerRotues from "@/routes/TrainerRoutes";

// Define Slot interface locally to avoid import issues
interface Slot {
  _id: string;
  trainerId: string;
  clientId: string | null;
  clientName?: string;
  startTime: string;
  endTime: string;
  status: 'booked' | 'free' | 'cancelled';
  meetingLink: string;
  createdAt: string;
  updatedAt: string;
}

// Types for schedule endpoints
interface TimeSlotPayload {
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
}

interface DaySchedulePayload {
  isAvailable: boolean;
  timeSlots: TimeSlotPayload[];
}

interface WeeklySchedulePayload {
  monday: DaySchedulePayload;
  tuesday: DaySchedulePayload;
  wednesday: DaySchedulePayload;
  thursday: DaySchedulePayload;
  friday: DaySchedulePayload;
  saturday: DaySchedulePayload;
  sunday: DaySchedulePayload;
}

export const TrainerService = {
  getPendingApplicationDetails: async () => {
    try {
      const response = await api.get(
        TRAINER_ROUTES.GET_PENDING_TRAINER_APPLICATION
      );
      console.log("response form backned", response.data[0]);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosErrorType;
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
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
      const err = error as AxiosErrorType;
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
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
      const err = error as AxiosErrorType;
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
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
      const err = error as AxiosErrorType;
      const errorMessage =
        err.response?.data?.error || "Failed to update uesr profile Photo";
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
      const err = error as AxiosErrorType;
      const errorMessage =
        err.response?.data?.error || "Failed to update uesr profile ";
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
      const err = error as AxiosErrorType;
      const errorMessage =
        err.response?.data?.error || "Failed to fetch plans";
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
      const err = error as AxiosErrorType;
      const errorMessage =
        err.response?.data?.error || "Failed to add new plan";
      console.log("Error adding new plan: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getSlots: async(trainerId:string, fromDate:string, toDate: string)=>{
    try {
      const response = await api.get(`${TRAINER_ROUTES.AVAILABILITY}/slots?trainerId=${trainerId}&fromDate=${fromDate}&toDate=${toDate}`);
      console.log("Fetched slots response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosErrorType;
      const errorMessage =
        err.response?.data?.error || "Failed to fetch slots";
      console.log("Error fetching slots: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  addSlot: async (slots: Partial<Slot[]>, trainerId: string) => {
    try {
      console.log("Adding slots: ", slots, " for trainerId: ", trainerId);
      const response = await api.post(TRAINER_ROUTES.AVAILABILITY, { slots, trainerId });
      console.log("Added new slot response: ", response.data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosErrorType;
      const errorMessage =
        err.response?.data?.error || "Failed to add new slot";
      console.log("Error adding new slot: ", errorMessage);
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
      const err = error as AxiosErrorType;
      const errorMessage =
        err.response?.data?.error || "Failed to fetch salary";
      console.log("Error fetching salary: ", errorMessage);
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
      console.error('Error fetching clients:', error);
      throw new Error('Failed to fetch clients');
    }
  },

  getChatMessages: async (chatId: string) => {
    try {
      const response = await api.get(`${TRAINER_ROUTES.CHAT}/${chatId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw new Error('Failed to fetch chat messages');
    }
  },

  setWeeklyAvailability: async (trainerId: string, weeklySchedule: any) => {
    try {
      const response = await api.post(`${TRAINER_ROUTES.AVAILABILITY}/weekly`, {
        trainerId,
        weeklySchedule
      });
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosErrorType;
      const errorMessage =
        err.response?.data?.error || "Failed to set weekly availability";
      console.log("Error setting weekly availability: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // New schedule endpoints
  getTrainerSchedule: async () => {
    try {
      const response = await api.get(TRAINER_ROUTES.SCHEDULE);
      return response.data?.data;
    } catch (error: unknown) {
      const err = error as AxiosErrorType;
      const errorMessage = err.response?.data?.error || "Failed to load schedule";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  updateTrainerSchedule: async (payload: { weeklySchedule: WeeklySchedulePayload; timezone: string }) => {
    try {
      const response = await api.put(TRAINER_ROUTES.SCHEDULE, payload);
      toast.success("Schedule saved");
      return response.data?.data;
    } catch (error: unknown) {
      const err = error as AxiosErrorType;
      const errorMessage = err.response?.data?.error || "Failed to save schedule";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  toggleScheduleActive: async (isActive: boolean) => {
    try {
      const response = await api.patch(`${TRAINER_ROUTES.SCHEDULE}/toggle`, { isActive });
      return response.data?.data;
    } catch (error: unknown) {
      const err = error as AxiosErrorType;
      const errorMessage = err.response?.data?.error || "Failed to update schedule status";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getAvailableSlotsByDate: async (trainerId: string, dateISO: string) => {
    try {
      const response = await api.get(`${TRAINER_ROUTES.SCHEDULE}/${trainerId}/slots`, {
        params: { date: dateISO }
      });
      return response.data?.data;
    } catch (error: unknown) {
      const err = error as AxiosErrorType;
      const errorMessage = err.response?.data?.error || "Failed to fetch available slots";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

};
