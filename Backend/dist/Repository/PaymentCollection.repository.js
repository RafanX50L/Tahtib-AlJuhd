"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCollectionRepository = void 0;
const base_repository_1 = require("./base.repository");
const mongoose_1 = require("mongoose");
const PaymentCollection_model_1 = require("../models/PaymentCollection.model");
class PaymentCollectionRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(PaymentCollection_model_1.PaymentCollection);
    }
    async findByClientId(clientId) {
        return await this.model.find({ clientId: new mongoose_1.Types.ObjectId(clientId) })
            .populate('clientId trainerId planId contractId')
            .sort({ createdAt: -1 });
    }
    async findByTrainerId(trainerId) {
        return await this.model.find({ trainerId: new mongoose_1.Types.ObjectId(trainerId) })
            .populate('clientId trainerId planId contractId')
            .sort({ createdAt: -1 });
    }
    async findByStripePaymentIntentId(paymentIntentId) {
        return await this.model.findOne({ stripePaymentIntentId: paymentIntentId })
            .populate('clientId trainerId planId contractId');
    }
    async findByStripeSessionId(sessionId) {
        return await this.model.findOne({ stripeSessionId: sessionId })
            .populate('clientId trainerId planId contractId');
    }
    async getPaymentsByDateRange(startDate, endDate) {
        return await this.model.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            },
            paymentStatus: 'completed'
        }).populate('clientId trainerId planId contractId').sort({ createdAt: -1 });
    }
    async getTotalRevenue() {
        const result = await this.model.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        return result.length > 0 ? result[0].total : 0;
    }
    async getTotalRevenueByTrainer(trainerId) {
        const result = await this.model.aggregate([
            { $match: { trainerId: new mongoose_1.Types.ObjectId(trainerId), paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        return result.length > 0 ? result[0].total : 0;
    }
    async findPayments(filter = {}, skip, pageSize) {
        return this.model.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize);
    }
}
exports.PaymentCollectionRepository = PaymentCollectionRepository;
//# sourceMappingURL=PaymentCollection.repository.js.map