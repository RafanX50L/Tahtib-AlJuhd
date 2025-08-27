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
    createPlan(plan: IPlan): Promise<IPlan>;
    getPlansByTrainer(trainerId: string): Promise<IPlanView[]>;
    getPlanById(id: string): Promise<IPlan | null>;
    updatePlan(id: string, updates: Partial<IPlan>): Promise<IPlanView | null>;
    deactivatePlan(id: string): Promise<IPlan | null>;
}