import { IPaymentCollection } from "@/core/interface/model/IPaymentCollection";
import { IPaymentRepository } from "@/core/interface/repositories/IPaymentRepository";
import { BaseRepository } from "./base.repository";
import { FilterQuery, Types } from "mongoose";
import { PaymentCollection } from "@/models/PaymentCollection.model";

export class PaymentCollectionRepository extends BaseRepository<IPaymentCollection> implements IPaymentRepository {
  constructor() {
      super(PaymentCollection);
    }

  async findByClientId(clientId: string): Promise<IPaymentCollection[]> {
    return await this.model.find({ clientId: new Types.ObjectId(clientId) })
      .populate('clientId trainerId planId contractId')
      .sort({ createdAt: -1 });
  }

  async findByTrainerId(trainerId: string): Promise<IPaymentCollection[]> {
    return await this.model.find({ trainerId: new Types.ObjectId(trainerId) })
      .populate('clientId trainerId planId contractId')
      .sort({ createdAt: -1 });
  }

  async findByStripePaymentIntentId(paymentIntentId: string): Promise<IPaymentCollection | null> {
    return await this.model.findOne({ stripePaymentIntentId: paymentIntentId })
      .populate('clientId trainerId planId contractId');
  }

  async findByStripeSessionId(sessionId: string): Promise<IPaymentCollection | null> {
    return await this.model.findOne({ stripeSessionId: sessionId })
      .populate('clientId trainerId planId contractId');
  }

  async getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<IPaymentCollection[]> {
    return await this.model.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      },
      paymentStatus: 'completed'
    }).populate('clientId trainerId planId contractId').sort({ createdAt: -1 });
  }

  async getTotalRevenue(): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    return result.length > 0 ? result[0].total : 0;
  }

  async getTotalRevenueByTrainer(trainerId: string): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { trainerId: new Types.ObjectId(trainerId), paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    return result.length > 0 ? result[0].total : 0;
  }

  async findPayments(filter: FilterQuery<IPaymentCollection> = {}, skip: number, pageSize: number): Promise<IPaymentCollection[]> {
    return this.model.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);
  }

}