var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PlanDto } from "../../dtos/domain/PlanDTO";
import { Types } from "mongoose";
export class PlanService {
    constructor(_planRepo, _personalizationRepo) {
        this._planRepo = _planRepo;
        this._personalizationRepo = _personalizationRepo;
    }
    createPlan(plan) {
        return __awaiter(this, void 0, void 0, function* () {
            const trainerPers = yield this._personalizationRepo.findByUserId(plan.trainerId.toString());
            if (!trainerPers)
                throw new Error("Trainer not found");
            const trainerData = trainerPers.data;
            plan.price =
                (trainerData.basicInfo.weeklySalary + 100) * plan.durationWeeks - 1;
            plan.isBooked = false;
            const newPlan = yield this._planRepo.create(plan);
            yield this._personalizationRepo.updateTrainerData(plan.trainerId.toString(), Object.assign(Object.assign(Object.assign({}, trainerData), trainerData), { plans: [...(trainerData.plans || []), newPlan.id] }));
            return;
        });
    }
    getPlansByTrainer(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this._planRepo.findByTrainerId(trainerId));
            return yield Promise.all(result.map((plan) => __awaiter(this, void 0, void 0, function* () {
                return yield PlanDto.mapToPlanData(plan);
            })));
        });
    }
    getPlanById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._planRepo.findById(new Types.ObjectId(id));
            return yield PlanDto.mapToPlanData(result);
        });
    }
    updatePlan(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingPlan = yield this._planRepo.findById(new Types.ObjectId(id));
            if (!existingPlan)
                throw new Error("Plan not found");
            yield this._planRepo.update(id, updates);
            return;
        });
    }
    deactivatePlan(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingPlan = yield this._planRepo.findById(new Types.ObjectId(id));
            if (!existingPlan)
                throw new Error("Plan not found");
            yield this._planRepo.update(id, { isActive: !existingPlan.isActive });
            return;
        });
    }
}
//# sourceMappingURL=Plan.service.js.map