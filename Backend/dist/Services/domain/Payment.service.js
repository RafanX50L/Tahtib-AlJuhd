"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const mongoose_1 = require("mongoose");
const PaymentDTO_1 = require("../../dtos/domain/PaymentDTO");
class PaymentService {
    _paymentRepo;
    constructor(_paymentRepo) {
        this._paymentRepo = _paymentRepo;
    }
    async createPayment(paymentData) {
        const payment = {
            clientId: new mongoose_1.Types.ObjectId(paymentData.clientId),
            trainerId: new mongoose_1.Types.ObjectId(paymentData.trainerId),
            planId: new mongoose_1.Types.ObjectId(paymentData.planId),
            contractId: new mongoose_1.Types.ObjectId(paymentData.contractId),
            amount: paymentData.amount,
            currency: paymentData.currency,
            stripePaymentIntentId: paymentData.stripePaymentIntentId,
            stripeSessionId: paymentData.stripeSessionId,
            paymentStatus: 'completed',
            paymentMethod: paymentData.paymentMethod,
            transactionId: paymentData.transactionId,
            companyAccount: 'company_main_account',
        };
        const newPayment = await this._paymentRepo.create(payment);
        return await PaymentDTO_1.PaymentDto.mapToPaymentView(newPayment);
    }
    async getAllPayments() {
        const payments = await this._paymentRepo.findAll({});
        return await PaymentDTO_1.PaymentDto.mapToPaymentViewList(payments);
    }
    async getPaymentsByClient(clientId) {
        const payments = await this._paymentRepo.findByClientId(clientId);
        return await PaymentDTO_1.PaymentDto.mapToPaymentViewList(payments);
    }
    async getPaymentsByTrainer(trainerId) {
        const payments = await this._paymentRepo.findByTrainerId(trainerId);
        return await PaymentDTO_1.PaymentDto.mapToPaymentViewList(payments);
    }
    async getPaymentById(paymentId) {
        const payment = await this._paymentRepo.findById(new mongoose_1.Types.ObjectId(paymentId));
        if (!payment)
            return null;
        return await PaymentDTO_1.PaymentDto.mapToPaymentView(payment);
    }
    async getPaymentsByDateRange(startDate, endDate) {
        const payments = await this._paymentRepo.getPaymentsByDateRange(startDate, endDate);
        return await PaymentDTO_1.PaymentDto.mapToPaymentViewList(payments);
    }
    async getTotalRevenue() {
        return await this._paymentRepo.getTotalRevenue();
    }
    async getTotalRevenueByTrainer(trainerId) {
        return await this._paymentRepo.getTotalRevenueByTrainer(trainerId);
    }
    async updatePaymentStatus(paymentId, status) {
        const updatedPayment = await this._paymentRepo.update(paymentId, { paymentStatus: status });
        if (!updatedPayment)
            return null;
        return await PaymentDTO_1.PaymentDto.mapToPaymentView(updatedPayment);
    }
    async getPaymentByStripePaymentIntentId(paymentIntentId) {
        const payment = await this._paymentRepo.findByStripePaymentIntentId(paymentIntentId);
        if (!payment)
            return null;
        return await PaymentDTO_1.PaymentDto.mapToPaymentView(payment);
    }
    async getPaymentByStripeSessionId(sessionId) {
        const payment = await this._paymentRepo.findByStripeSessionId(sessionId);
        if (!payment)
            return null;
        return await PaymentDTO_1.PaymentDto.mapToPaymentView(payment);
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=Payment.service.js.map