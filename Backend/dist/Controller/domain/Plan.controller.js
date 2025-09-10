"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanController = void 0;
const status_constant_1 = require("../../constants/status.constant");
const mongoose_1 = require("mongoose");
class PlanController {
    _planService;
    constructor(_planService) {
        this._planService = _planService;
    }
    async createPlan(req, res, next) {
        try {
            const plan = req.body;
            plan.trainerId = new mongoose_1.Types.ObjectId(plan.trainerId); // Assume auth middleware sets user
            const newPlan = await this._planService.createPlan(plan);
            res.status(status_constant_1.HttpStatus.OK).json(newPlan);
        }
        catch (err) {
            next(err);
        }
    }
    ;
    async getPlansByTrainer(req, res, next) {
        try {
            const trainerId = req.query.trainerId;
            const plans = await this._planService.getPlansByTrainer(trainerId);
            res.status(status_constant_1.HttpStatus.OK).json(plans);
        }
        catch (err) {
            next(err);
        }
    }
    ;
    async updatePlan(req, res, next) {
        try {
            const { editingPlanId, formData } = req.body;
            const updatedPlan = await this._planService.updatePlan(editingPlanId, formData);
            res.status(status_constant_1.HttpStatus.OK).json(updatedPlan);
        }
        catch (err) {
            next(err);
        }
    }
    ;
    async deactivatePlan(req, res, next) {
        try {
            const { editingPlanId } = req.body;
            const updatedPlan = await this._planService.deactivatePlan(editingPlanId);
            res.status(status_constant_1.HttpStatus.OK).json(updatedPlan);
        }
        catch (err) {
            next(err);
        }
    }
    ;
}
exports.PlanController = PlanController;
//# sourceMappingURL=Plan.controller.js.map