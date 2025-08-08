import { IDietPlan } from "../../model/IDietPlan.model";

export interface IClientDietPlanService {
    getDietPlan(userId:string):Promise<Partial<IDietPlan>>;
}