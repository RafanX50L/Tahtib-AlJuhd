var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpStatus } from '../../constants/status.constant';
import { Types } from 'mongoose';
export class PlanController {
    constructor(_planService) {
        this._planService = _planService;
    }
    createPlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const plan = req.body;
                plan.trainerId = new Types.ObjectId(plan.trainerId); // Assume auth middleware sets user
                const newPlan = yield this._planService.createPlan(plan);
                res.status(HttpStatus.OK).json(newPlan);
            }
            catch (err) {
                next(err);
            }
        });
    }
    ;
    getPlansByTrainer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerId = req.query.trainerId;
                const plans = yield this._planService.getPlansByTrainer(trainerId);
                res.status(HttpStatus.OK).json(plans);
            }
            catch (err) {
                next(err);
            }
        });
    }
    ;
    updatePlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { editingPlanId, formData } = req.body;
                const updatedPlan = yield this._planService.updatePlan(editingPlanId, formData);
                res.status(HttpStatus.OK).json(updatedPlan);
            }
            catch (err) {
                next(err);
            }
        });
    }
    ;
    deactivatePlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { editingPlanId } = req.body;
                const updatedPlan = yield this._planService.deactivatePlan(editingPlanId);
                res.status(HttpStatus.OK).json(updatedPlan);
            }
            catch (err) {
                next(err);
            }
        });
    }
    ;
}
//# sourceMappingURL=Plan.controller.js.map