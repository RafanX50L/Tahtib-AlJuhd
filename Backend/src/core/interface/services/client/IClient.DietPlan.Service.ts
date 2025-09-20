import { IDietPlan } from "../../model/IDietPlan.model";

export interface IClientDietPlanService {
    getDietPlan(userId:string):Promise<Partial<IDietPlan>>;// here we are passing the partioal data, (not including any sensitive or id _v:0 nothing like that)
}