import { IPlan } from "../../model/IPlan";

export interface IPlanService {
    createPlan(plan: IPlan): Promise<IPlan>;
    getPlansByTrainer(trainerId: string): Promise<IPlan[]>;
    getPlanById(id: string): Promise<IPlan | null>;
}