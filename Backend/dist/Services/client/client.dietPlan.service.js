var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class ClientDietPlanService {
    constructor(_dietPlanRepository, _PersonalizationRepository) {
        this._dietPlanRepository = _dietPlanRepository;
        this._PersonalizationRepository = _PersonalizationRepository;
    }
    getDietPlan(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const personalization = yield this._PersonalizationRepository.getPersonalization(userId);
            const dietId = personalization.data.dietPlanId._id;
            const dietPlan = yield this._dietPlanRepository.findById(dietId);
            console.log('dietplan', dietId);
            const returnData = {
                mealPlan: dietPlan.mealPlan,
                notes: dietPlan.notes,
                created: dietPlan.createdAt,
                updated: dietPlan.updatedAt
            };
            return returnData;
        });
    }
}
//# sourceMappingURL=client.dietPlan.service.js.map