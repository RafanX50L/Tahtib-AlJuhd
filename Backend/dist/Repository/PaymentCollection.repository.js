"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCollectionRepository = void 0;
const mongoose_1 = require("mongoose");
const PaymentCollection_model_1 = require("../models/PaymentCollection.model");
const base_repository_1 = require("./base.repository");
class PaymentCollectionRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(PaymentCollection_model_1.PaymentCollection);
    }
    // async findById(id: Types.ObjectId): Promise<IPaymentCollection | null> {
    //   return await PaymentCollection.findById(id).populate('clientId trainerId planId contractId');
    // }
    // // async create(data: Partial<IPaymentCollection>): Promise<IPaymentCollection> {
    // //   const payment = new PaymentCollection(data);
    // //   return await payment.save();
    // // }
    // async findAll(filter: FilterQuery<IPaymentCollection>): Promise<IPaymentCollection[]> {
    //   return await PaymentCollection.find(filter).populate('clientId trainerId planId contractId').sort({ createdAt: -1 });
    // }
    // async findOne(filter: FilterQuery<IPaymentCollection>): Promise<IPaymentCollection | null> {
    //   return await PaymentCollection.findOne(filter).populate('clientId trainerId planId contractId');
    // }
    // async update(id: string, data: Partial<IPaymentCollection>): Promise<IPaymentCollection | null> {
    //   return await PaymentCollection.findByIdAndUpdate(id, data, { new: true }).populate('clientId trainerId planId contractId');
    // }
    // async deleteOne(filter: FilterQuery<IPaymentCollection>): Promise<void> {
    //   await PaymentCollection.deleteOne(filter);
    // }
    async findByClientId(clientId) {
        return await PaymentCollection_model_1.PaymentCollection.find({ clientId: new mongoose_1.Types.ObjectId(clientId) })
            .populate('clientId trainerId planId contractId')
            .sort({ createdAt: -1 });
    }
    async findByTrainerId(trainerId) {
        return await PaymentCollection_model_1.PaymentCollection.find({ trainerId: new mongoose_1.Types.ObjectId(trainerId) })
            .populate('clientId trainerId planId contractId')
            .sort({ createdAt: -1 });
    }
    async findByStripePaymentIntentId(paymentIntentId) {
        return await PaymentCollection_model_1.PaymentCollection.findOne({ stripePaymentIntentId: paymentIntentId })
            .populate('clientId trainerId planId contractId');
    }
    async findByStripeSessionId(sessionId) {
        return await PaymentCollection_model_1.PaymentCollection.findOne({ stripeSessionId: sessionId })
            .populate('clientId trainerId planId contractId');
    }
    async getPaymentsByDateRange(startDate, endDate) {
        return await PaymentCollection_model_1.PaymentCollection.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            },
            paymentStatus: 'completed'
        }).populate('clientId trainerId planId contractId').sort({ createdAt: -1 });
    }
    async getTotalRevenue() {
        const result = await PaymentCollection_model_1.PaymentCollection.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        return result.length > 0 ? result[0].total : 0;
    }
    async getTotalRevenueByTrainer(trainerId) {
        const result = await PaymentCollection_model_1.PaymentCollection.aggregate([
            { $match: { trainerId: new mongoose_1.Types.ObjectId(trainerId), paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        return result.length > 0 ? result[0].total : 0;
    }
}
exports.PaymentCollectionRepository = PaymentCollectionRepository;
//# sourceMappingURL=PaymentCollection.repository.js.map