"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanController = void 0;
const mongoose_1 = require("mongoose");
const PlanDTO_1 = require("../../dtos/reverse-mapping/domain/PlanDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class PlanController {
    _planService;
    constructor(_planService) {
        this._planService = _planService;
    }
    async createPlan(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = PlanDTO_1.PlanDTO.validateCreatePlanRequest(req.body);
            const plan = {
                trainerId: new mongoose_1.Types.ObjectId(validatedBody.trainerId),
                title: validatedBody.title,
                description: validatedBody.description,
                price: validatedBody.price,
                sessionsPerWeek: validatedBody.sessionsPerWeek,
                durationWeeks: validatedBody.durationWeeks,
                isActive: validatedBody.isActive ?? true,
                isBooked: validatedBody.isBooked ?? false,
            };
            await this._planService.createPlan(plan);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, "Plan created successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    ;
    async getPlansByTrainer(req, res, next) {
        try {
            // Validate and transform request query using DTO
            const validatedQuery = PlanDTO_1.PlanDTO.validateGetPlansByTrainerRequest(req.query);
            const role = req.user.role;
            const plans = await this._planService.getPlansByTrainer(validatedQuery.trainerId, role);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, plans, "Plans retrieved successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    ;
    async updatePlan(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = PlanDTO_1.PlanDTO.validateUpdatePlanRequest(req.body);
            await this._planService.updatePlan(validatedBody.editingPlanId, validatedBody.formData);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, "Plan updated successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    ;
    async deactivatePlan(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = PlanDTO_1.PlanDTO.validateDeactivatePlanRequest(req.body);
            await this._planService.deactivatePlan(validatedBody.editingPlanId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, "Plan deactivated successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    ;
}
exports.PlanController = PlanController;
//# sourceMappingURL=Plan.controller.js.map