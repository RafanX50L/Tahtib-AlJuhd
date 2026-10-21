"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityController = void 0;
const AvailabilityDTO_1 = require("../../dtos/reverse-mapping/domain/AvailabilityDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class AvailabilityController {
    _availabilityService;
    constructor(_availabilityService) {
        this._availabilityService = _availabilityService;
    }
    async getFreeSlots(req, res, next) {
        try {
            // Validate and transform request query using DTO
            const validatedQuery = AvailabilityDTO_1.AvailabilityDTO.validateGetFreeSlotsRequest(req.query);
            const slots = await this._availabilityService.getFreeSlots(validatedQuery.trainerId, new Date(validatedQuery.fromDate), new Date(validatedQuery.toDate));
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, slots, "Free slots retrieved successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    ;
    async getUnFreeSlots(req, res, next) {
        try {
            // Validate and transform request query using DTO
            const validatedQuery = AvailabilityDTO_1.AvailabilityDTO.validateGetUnFreeSlotsRequest(req.query);
            const role = req.user?.role;
            let slots;
            if (role === "client") {
                slots = await this._availabilityService.getUnFreeSlotsByClient(req.user.id, new Date(validatedQuery.fromDate), new Date(validatedQuery.toDate));
            }
            else if (role === "trainer") {
                slots = await this._availabilityService.getUnFreeSlotsByTrainer(validatedQuery.trainerId, new Date(validatedQuery.fromDate), new Date(validatedQuery.toDate));
            }
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, slots, "Unfree slots retrieved successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    ;
    async setWeeklyRules(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = AvailabilityDTO_1.AvailabilityDTO.validateSetWeeklyRulesRequest(req.body);
            await this._availabilityService.setWeeklyRules(validatedBody.trainerId, validatedBody.rules);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, "Weekly rules saved successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    ;
    async getWeeklyRules(req, res, next) {
        try {
            // Validate and transform request query using DTO
            const validatedQuery = AvailabilityDTO_1.AvailabilityDTO.validateGetWeeklyRulesRequest(req.query);
            const rules = await this._availabilityService.getWeeklyRules(validatedQuery.trainerId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, rules, "Weekly rules retrieved successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
}
exports.AvailabilityController = AvailabilityController;
//# sourceMappingURL=Availability.Controller.js.map