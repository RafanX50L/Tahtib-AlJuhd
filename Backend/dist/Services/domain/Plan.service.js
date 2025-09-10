"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanService = void 0;
const PlanDTO_1 = require("../../dtos/domain/PlanDTO");
const mongoose_1 = require("mongoose");
class PlanService {
    _planRepo;
    _personalizationRepo;
    constructor(_planRepo, _personalizationRepo) {
        this._planRepo = _planRepo;
        this._personalizationRepo = _personalizationRepo;
    }
    async createPlan(plan) {
        const trainerPers = await this._personalizationRepo.findByUserId(plan.trainerId.toString());
        if (!trainerPers)
            throw new Error("Trainer not found");
        const trainerData = trainerPers.data;
        plan.price =
            (trainerData.basicInfo.weeklySalary + 100) * plan.durationWeeks - 1;
        plan.isBooked = false;
        const newPlan = await this._planRepo.create(plan);
        await this._personalizationRepo.updateTrainerData(plan.trainerId.toString(), {
            ...trainerData,
            ...trainerData,
            plans: [...(trainerData.plans || []), newPlan.id],
        });
        return;
    }
    async getPlansByTrainer(trainerId) {
        const result = (await this._planRepo.findByTrainerId(trainerId));
        return await Promise.all(result.map(async (plan) => {
            return await PlanDTO_1.PlanDto.mapToPlanData(plan);
        }));
    }
    async getPlanById(id) {
        const result = await this._planRepo.findById(new mongoose_1.Types.ObjectId(id));
        return await PlanDTO_1.PlanDto.mapToPlanData(result);
    }
    async updatePlan(id, updates) {
        const existingPlan = await this._planRepo.findById(new mongoose_1.Types.ObjectId(id));
        if (!existingPlan)
            throw new Error("Plan not found");
        await this._planRepo.update(id, updates);
        return;
    }
    async deactivatePlan(id) {
        const existingPlan = await this._planRepo.findById(new mongoose_1.Types.ObjectId(id));
        if (!existingPlan)
            throw new Error("Plan not found");
        await this._planRepo.update(id, { isActive: !existingPlan.isActive });
        return;
    }
}
exports.PlanService = PlanService;
//# sourceMappingURL=Plan.service.js.map