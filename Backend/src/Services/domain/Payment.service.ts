import { Types } from "mongoose";
import { IPaymentRepository } from "@/core/interface/repositories/IPaymentRepository";
import { IPaymentService } from "@/core/interface/services/domain/IPayment.Service";
import { IPaymentView, PaymentDto } from "@/dtos/domain/PaymentDTO";
import { IPaymentCollection } from "@/core/interface/model/IPaymentCollection";

export class PaymentService implements IPaymentService {
  constructor(
    private readonly _paymentRepo: IPaymentRepository
  ) {}

  async createPayment(paymentData: {
    clientId: string;
    trainerId: string;
    planId: string;
    contractId: string;
    amount: number;
    currency: string;
    stripePaymentIntentId: string;
    stripeSessionId: string;
    paymentMethod: string;
    transactionId: string;
  }): Promise<IPaymentView> {
    const payment: Partial<IPaymentCollection> = {
      clientId: new Types.ObjectId(paymentData.clientId),
      trainerId: new Types.ObjectId(paymentData.trainerId),
      planId: new Types.ObjectId(paymentData.planId),
      contractId: new Types.ObjectId(paymentData.contractId),
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
    return await PaymentDto.mapToPaymentView(newPayment);
  }

  async getAllPayments(): Promise<IPaymentView[]> {
    const payments = await this._paymentRepo.findAll({});
    return await PaymentDto.mapToPaymentViewList(payments);
  }

  async getPaymentsByClient(clientId: string): Promise<IPaymentView[]> {
    const payments = await this._paymentRepo.findByClientId(clientId);
    return await PaymentDto.mapToPaymentViewList(payments);
  }

  async getPaymentsByTrainer(trainerId: string): Promise<IPaymentView[]> {
    const payments = await this._paymentRepo.findByTrainerId(trainerId);
    return await PaymentDto.mapToPaymentViewList(payments);
  }

  async getPaymentById(paymentId: string): Promise<IPaymentView | null> {
    const payment = await this._paymentRepo.findById(new Types.ObjectId(paymentId));
    if (!payment) return null;
    return await PaymentDto.mapToPaymentView(payment);
  }

  async getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<IPaymentView[]> {
    const payments = await this._paymentRepo.getPaymentsByDateRange(startDate, endDate);
    return await PaymentDto.mapToPaymentViewList(payments);
  }

  async getTotalRevenue(): Promise<number> {
    return await this._paymentRepo.getTotalRevenue();
  }

  async getTotalRevenueByTrainer(trainerId: string): Promise<number> {
    return await this._paymentRepo.getTotalRevenueByTrainer(trainerId);
  }

  async updatePaymentStatus(paymentId: string, status: 'pending' | 'completed' | 'failed' | 'refunded'): Promise<IPaymentView | null> {
    const updatedPayment = await this._paymentRepo.update(paymentId, { paymentStatus: status });
    if (!updatedPayment) return null;
    return await PaymentDto.mapToPaymentView(updatedPayment);
  }

  async getPaymentByStripePaymentIntentId(paymentIntentId: string): Promise<IPaymentView | null> {
    const payment = await this._paymentRepo.findByStripePaymentIntentId(paymentIntentId);
    if (!payment) return null;
    return await PaymentDto.mapToPaymentView(payment);
  }

  async getPaymentByStripeSessionId(sessionId: string): Promise<IPaymentView | null> {
    const payment = await this._paymentRepo.findByStripeSessionId(sessionId);
    if (!payment) return null;
    return await PaymentDto.mapToPaymentView(payment);
  }
}
