import { IDietPlan } from "@/core/interface/model/IDietPlan.model";
import { IClientPersonalization } from "@/core/interface/model/IPersonalization.model";
import { IDietPlanRepository } from "@/core/interface/repositories/IDietPlan.repository";
import { IPersonalizationRepository } from "@/core/interface/repositories/IPersonalization.repository";
import { IClientDietPlanService } from "@/core/interface/services/client/IClient.DietPlan.Service";

export class ClientDietPlanService implements IClientDietPlanService{
    constructor(
        private readonly _dietPlanRepository: IDietPlanRepository,
        private readonly _PersonalizationRepository: IPersonalizationRepository,
    ) {}

    async getDietPlan(userId:string):Promise<Partial<IDietPlan>>{
        const personalization = await this._PersonalizationRepository.getPersonalization(userId);
        const dietId = (personalization.data as IClientPersonalization).dietPlanId._id;
        const dietPlan = await this._dietPlanRepository.findById(dietId);
        const returnData = {
            mealPlan: dietPlan.mealPlan,
            notes: dietPlan.notes,
            created: dietPlan.createdAt,
            updated: dietPlan.updatedAt
        };
        return returnData;
    }
}