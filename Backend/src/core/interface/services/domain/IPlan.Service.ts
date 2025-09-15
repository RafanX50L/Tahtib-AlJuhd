import { IPlan } from "../../model/IPlan";
export interface IPlanView {
  id?: string;
  trainer: string;
  title: string;
  description: string;
  price: number;
  sessionsPerWeek: number;
  durationWeeks: number;
  isActive: boolean;
  isBooked: boolean;
  createdAt?: string;
}
export interface IPlanService {
    createPlan(plan: IPlan): Promise<void>;
    getPlansByTrainer(trainerId: string, role: string): Promise<IPlanView[]>;
    getPlanById(id: string): Promise<IPlanView | null>;
    updatePlan(id: string, updates: Partial<IPlanView>): Promise<void>;
    deactivatePlan(id: string): Promise<void>;
}