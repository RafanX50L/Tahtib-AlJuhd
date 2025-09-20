interface WeeklyRuleView{
    engagementType: 'full-time' | 'part-time' | 'contract' | 'freelance';
    weeklyRules: {
      [key: string]: {
        startTime: string; 
        endTime: string;
      }[];
    };
    slotLength: number;
    bufferMinutes: number;  
}
export interface ISessionView {
  id: string;
  trainerId: string;
  clientId: string | null;
  startTime: string; // UTC ISO string
  endTime: string; // UTC ISO string
  startTimeLocal?: string; // Local time in HH:mm format
  endTimeLocal?: string; // Local time in HH:mm format
  startDateLocal?: string; // Local date in yyyy-MM-dd format
  endDateLocal?: string; // Local date in yyyy-MM-dd format
  status: "booked" | "free" | "cancelled" | "completed";
  meetingLink: string;
  createdAt: string;
  updatedAt: string;
}



export interface IAvailabilityService {
    setWeeklyRules(trainerId: string, rules: Record<string, unknown>): Promise<void>;
    getFreeSlots(trainerId: string, fromDate: Date, toDate: Date): Promise<ISessionView[]>;
    getWeeklyRules(trainerId: string): Promise<WeeklyRuleView | null | void>;
    getUnFreeSlotsByTrainer(trainerId: string, fromDate: Date, toDate: Date): Promise<ISessionView[]>;
    getUnFreeSlotsByClient(clinetId: string, fromDate: Date, toDate: Date): Promise<ISessionView[]>
}