"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const status_constant_1 = require("../../constants/status.constant");
const stripe_1 = __importDefault(require("stripe"));
const env_config_1 = require("../../config/env.config");
const BookingDTO_1 = require("../../dtos/reverse-mapping/domain/BookingDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
const stripe = new stripe_1.default(env_config_1.env.STRIPE_SECRET_KEY);
const webhookSecret = env_config_1.env.WEBHOOK_SECRET;
class BookingController {
    _bookingService;
    constructor(_bookingService) {
        this._bookingService = _bookingService;
    }
    async checkOutSessionHandle(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = BookingDTO_1.BookingDTO.validateCheckoutSessionRequest(req.body);
            const sessionId = await this._bookingService.handleCheckoutSession(validatedBody.userId, validatedBody.trainerId, validatedBody.planId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { id: sessionId }, "Checkout session created successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async handlePaymentSucess(req, res, next) {
        try {
            const sig = req.headers["stripe-signature"];
            const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
            await this._bookingService.handlePaymentSuccess(event);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, "Payment processed successfully", status_constant_1.HttpStatus.OK);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.BookingController = BookingController;
//# sourceMappingURL=Booking.controller.js.map