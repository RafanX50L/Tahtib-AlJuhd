import { BaseRepository } from "./base.repository";
import { IDietPlanRepository } from "@/core/interface/repositories/IDietPlan.repository";
import { DietPlanModel } from "@/models/DietPlan.model";
import { IDietPlan } from "@/core/interface/model/IDietPlan.model";

export class DietPlanRepository extends BaseRepository<IDietPlan> implements IDietPlanRepository{
    constructor(){
        super(DietPlanModel);
    }
}