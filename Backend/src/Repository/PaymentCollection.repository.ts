import { IPaymentCollection } from "@/core/interface/model/IPaymentCollection";
import { IPaymentRepository } from "@/core/interface/repositories/IPaymentRepository";
import { PaymentCollection } from "@/models/PaymentCollection.model";
import { BaseRepository } from "./base.repository";
import { Types } from "mongoose";

export class PaymentCollectionRepository extends BaseRepository<IPaymentCollection> implements IPaymentRepository {
  constructor() {
      super(PaymentCollection);
    }

  async findByClientId(clientId: string): Promise<IPaymentCollection[]> {
    return await PaymentCollection.find({ clientId: new Types.ObjectId(clientId) })
      .populate('clientId trainerId planId contractId')
      .sort({ createdAt: -1 });
  }

  async findByTrainerId(trainerId: string): Promise<IPaymentCollection[]> {
    return await PaymentCollection.find({ trainerId: new Types.ObjectId(trainerId) })
      .populate('clientId trainerId planId contractId')
      .sort({ createdAt: -1 });
  }

  async findByStripePaymentIntentId(paymentIntentId: string): Promise<IPaymentCollection | null> {
    return await PaymentCollection.findOne({ stripePaymentIntentId: paymentIntentId })
      .populate('clientId trainerId planId contractId');
  }

  async findByStripeSessionId(sessionId: string): Promise<IPaymentCollection | null> {
    return await PaymentCollection.findOne({ stripeSessionId: sessionId })
      .populate('clientId trainerId planId contractId');
  }

  async getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<IPaymentCollection[]> {
    return await PaymentCollection.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      },
      paymentStatus: 'completed'
    }).populate('clientId trainerId planId contractId').sort({ createdAt: -1 });
  }

  async getTotalRevenue(): Promise<number> {
    const result = await PaymentCollection.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    return result.length > 0 ? result[0].total : 0;
  }

  async getTotalRevenueByTrainer(trainerId: string): Promise<number> {
    const result = await PaymentCollection.aggregate([
      { $match: { trainerId: new Types.ObjectId(trainerId), paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    return result.length > 0 ? result[0].total : 0;
  }
}