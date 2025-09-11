"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const mongoose_1 = require("mongoose");
const date_fns_1 = require("date-fns");
const stripe_1 = __importDefault(require("stripe"));
const env_config_1 = require("../../config/env.config");
const utils_1 = require("../../utils");
const status_constant_1 = require("../../constants/status.constant");
const stripe = new stripe_1.default(env_config_1.env.STRIPE_SECRET_KEY);
const webhookSecret = env_config_1.env.WEBHOOK_SECRET;
class BookingService {
    _contractRepo;
    _sessionRepo;
    _chatRepo;
    _planRepo;
    _personalizationRepo;
    _paymentRepo;
    constructor(_contractRepo, _sessionRepo, _chatRepo, _planRepo, _personalizationRepo, _paymentRepo) {
        this._contractRepo = _contractRepo;
        this._sessionRepo = _sessionRepo;
        this._chatRepo = _chatRepo;
        this._planRepo = _planRepo;
        this._personalizationRepo = _personalizationRepo;
        this._paymentRepo = _paymentRepo;
    }
    async handleCheckoutSession(userId, trainerId, planId) {
        const plan = await this._planRepo.findById(new mongoose_1.Types.ObjectId(planId));
        if (!plan)
            throw new Error("Plan not found");
        const clientPers = await this._personalizationRepo.findByUserId(userId);
        if (!clientPers)
            throw new Error("Client not found");
        const clientData = clientPers.data;
        if (clientData.currentTrainerId && clientData.currentTrainerId.toString() !== trainerId) {
            const activeContract = await this._contractRepo.findActiveByClientAndTrainer(userId, clientData.currentTrainerId.toString());
            if (activeContract)
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.CONFLICT, 'Client has an active contract with another trainer');
        }
        const line_items = [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: plan.title,
                        description: plan.description,
                    },
                    unit_amount: plan.price * 100,
                },
                quantity: 1,
            },
        ];
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: line_items,
            mode: "payment",
            success_url: `http://localhost:5173/trainerSession`,
            cancel_url: `http://localhost:5173/trainer-details/${trainerId}?payment_status=cancelled`,
            metadata: {
                userId: userId || "unknown",
                trainerId: trainerId || "unknown",
                planId: planId || "unknown",
            },
        });
        console.log("Created checkout session:", session.id, "for user:", userId);
        return session.id;
    }
    async handlePaymentSuccess(event) {
        console.log("Handling payment success event:", event);
        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object;
            console.log("✅ Raw PaymentIntent succeeded:", paymentIntent.id);
            // TODO: update MongoDB here (e.g. mark user as paid)
        }
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            console.log("✅ Checkout session completed:", session.id);
            const { userId, trainerId, planId } = session.metadata || {};
            console.log("Metadata:", { userId, trainerId, planId });
            const plan = await this._planRepo.findById(new mongoose_1.Types.ObjectId(planId));
            if (!plan)
                throw new Error("Plan not found");
            const clientPers = await this._personalizationRepo.findByUserId(userId);
            if (!clientPers)
                throw new Error("Client not found");
            const clientData = clientPers.data;
            const startDate = new Date();
            const endDate = (0, date_fns_1.addWeeks)(startDate, plan.durationWeeks);
            const chat = await this._chatRepo.create({
                participants: [
                    new mongoose_1.Types.ObjectId(trainerId),
                    new mongoose_1.Types.ObjectId(userId),
                ],
                messages: [],
            });
            const contract = {
                trainerId: new mongoose_1.Types.ObjectId(trainerId),
                clientId: new mongoose_1.Types.ObjectId(userId),
                planId: new mongoose_1.Types.ObjectId(planId),
                startDate,
                endDate,
                sessionsRemaining: plan.sessionsPerWeek * plan.durationWeeks,
                chatId: chat.id,
            };
            const newContract = await this._contractRepo.create(contract);
            // Save payment information to database
            const paymentData = {
                clientId: new mongoose_1.Types.ObjectId(userId),
                trainerId: new mongoose_1.Types.ObjectId(trainerId),
                planId: new mongoose_1.Types.ObjectId(planId),
                contractId: newContract.id,
                amount: plan.price,
                currency: 'inr',
                paymentStatus: 'completed',
                stripePaymentIntentId: session.payment_intent,
                stripeSessionId: session.id,
                paymentMethod: 'card',
                transactionId: session.payment_intent,
            };
            await this._paymentRepo.create(paymentData);
            console.log("✅ Payment information saved to database");
            await this._planRepo.update(plan.id, { isBooked: true });
            await this._personalizationRepo.updateClientData(userId, {
                ...clientData,
                currentTrainerId: new mongoose_1.Types.ObjectId(trainerId),
                chatsId: [
                    ...(clientData.chatsId || []),
                    { trainerId: new mongoose_1.Types.ObjectId(trainerId), chatId: chat.id },
                ],
                contracts: [...(clientData.contracts || []), newContract.id],
                planStatus: "Active",
            });
            const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
            if (!trainerPers)
                throw new Error("Trainer not found");
            const trainerData = trainerPers.data;
            await this._personalizationRepo.updateTrainerData(trainerId, {
                ...trainerData,
                chats: [...(trainerData.chats || []), chat.id],
                contracts: [...(trainerData.contracts || []), newContract.id],
            });
        }
    }
}
exports.BookingService = BookingService;
//# sourceMappingURL=Booking.service.js.map