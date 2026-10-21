"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingController = void 0;
const SchedulingDTO_1 = require("../../dtos/reverse-mapping/domain/SchedulingDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class SchedulingController {
    _schedulingService;
    constructor(_schedulingService) {
        this._schedulingService = _schedulingService;
    }
    async getAvailabilityForDate(req, res, next) {
        try {
            // Validate and transform request parameters and query using DTO
            const validatedParams = SchedulingDTO_1.SchedulingDTO.validateGetAvailabilityForDateRequest(req.params, req.query);
            const result = await this._schedulingService.getAvailabilityForDate(validatedParams.trainerId, validatedParams.date, validatedParams.tz);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, result, "Availability retrieved successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async bookSlot(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = SchedulingDTO_1.SchedulingDTO.validateBookSlotRequest(req.body);
            const booking = await this._schedulingService.bookSlot({
                trainerId: validatedBody.trainerId,
                clientId: validatedBody.clientId,
                date: validatedBody.date,
                time: validatedBody.time,
                duration: validatedBody.duration || 60,
                tz: validatedBody.tz,
                contractId: validatedBody.contractId,
            });
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, booking, "Slot booked successfully", 201);
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async cancelBooking(req, res, next) {
        try {
            // Validate and transform request parameters and body using DTO
            const validatedParams = SchedulingDTO_1.SchedulingDTO.validateCancelBookingRequest(req.params, req.body);
            const canceled = await this._schedulingService.cancelBooking(validatedParams.bookingId, validatedParams.clientId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, canceled, "Booking canceled successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async completeBooking(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = SchedulingDTO_1.SchedulingDTO.validateCompleteBookingRequest(req.params);
            await this._schedulingService.completeBooking(validatedParams.bookingId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, "Session completed successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async listBookings(req, res, next) {
        try {
            // Validate and transform request query using DTO
            const validatedQuery = SchedulingDTO_1.SchedulingDTO.validateListBookingsRequest(req.query);
            const bookings = await this._schedulingService.listBookings({
                trainerId: validatedQuery.trainerId,
                clientId: validatedQuery.clientId,
                status: validatedQuery.status
            });
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, bookings, "Bookings retrieved successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
}
exports.SchedulingController = SchedulingController;
//# sourceMappingURL=Scheduling.controller.js.map