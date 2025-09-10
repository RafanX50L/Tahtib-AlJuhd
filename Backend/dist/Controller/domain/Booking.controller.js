"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const status_constant_1 = require("../../constants/status.constant");
const stripe_1 = __importDefault(require("stripe"));
const env_config_1 = require("../../config/env.config");
const stripe = new stripe_1.default(env_config_1.env.STRIPE_SECRET_KEY);
const webhookSecret = env_config_1.env.WEBHOOK_SECRET;
class BookingController {
    _bookingService;
    constructor(_bookingService) {
        this._bookingService = _bookingService;
    }
    // async purchasePlan(req: Request, res: Response, next: NextFunction) {
    //   try {
    //     const { clientId, trainerId, planId } = req.body;
    //     const contract = await this._bookingService.purchasePlan(
    //       clientId,
    //       trainerId,
    //       planId
    //     );
    //     res.status(HttpStatus.OK).json(contract);
    //   } catch (err) {
    //     next(err);
    //   }
    // }
    async checkOutSessionHandle(req, res, next) {
        try {
            console.log("etnered here");
            console.log(req.body);
            const { userId, trainerId, planId } = req.body;
            const sessionId = await this._bookingService.handleCheckoutSession(userId, trainerId, planId);
            console.log("sesion", sessionId);
            res.status(status_constant_1.HttpStatus.OK).json({ id: sessionId });
        }
        catch (error) {
            next(error);
        }
    }
    async handlePaymentSucess(req, res, next) {
        try {
            const sig = req.headers["stripe-signature"];
            const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
            await this._bookingService.handlePaymentSuccess(event);
            //  console.error(`⚠️ Webhook error: ${err.message}`);
            res.sendStatus(status_constant_1.HttpStatus.OK);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BookingController = BookingController;
//# sourceMappingURL=Booking.controller.js.map