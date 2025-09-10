"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientDietPlanService = void 0;
class ClientDietPlanService {
    _dietPlanRepository;
    _PersonalizationRepository;
    constructor(_dietPlanRepository, _PersonalizationRepository) {
        this._dietPlanRepository = _dietPlanRepository;
        this._PersonalizationRepository = _PersonalizationRepository;
    }
    async getDietPlan(userId) {
        const personalization = await this._PersonalizationRepository.getPersonalization(userId);
        const dietId = personalization.data.dietPlanId._id;
        const dietPlan = await this._dietPlanRepository.findById(dietId);
        console.log('dietplan', dietId);
        const returnData = {
            mealPlan: dietPlan.mealPlan,
            notes: dietPlan.notes,
            created: dietPlan.createdAt,
            updated: dietPlan.updatedAt
        };
        return returnData;
    }
}
exports.ClientDietPlanService = ClientDietPlanService;
//# sourceMappingURL=client.dietPlan.service.js.map