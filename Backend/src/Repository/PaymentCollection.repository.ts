import { FilterQuery, Types } from "mongoose";
import { IPaymentCollection } from "@/core/interface/model/IPaymentCollection";
import { IPaymentRepository } from "@/core/interface/repositories/IPaymentRepository";
import { PaymentCollection } from "@/models/PaymentCollection.model";
import { BaseRepository } from "./base.repository";

export class PaymentCollectionRepository extends BaseRepository<IPaymentCollection> implements IPaymentRepository {
  constructor() {
      super(PaymentCollection);
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