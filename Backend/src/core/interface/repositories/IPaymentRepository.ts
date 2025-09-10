import { FilterQuery, Types } from "mongoose";
import { IPaymentCollection } from "../model/IPaymentCollection";
import { IBaseRepository } from "./IBase.repository";

export interface IPaymentRepository extends IBaseRepository<IPaymentCollection> {
  // findById(id: Types.ObjectId): Promise<IPaymentCollection | null>;
  // // create(data: Partial<IPaymentCollection>): Promise<IPaymentCollection>;
  // findAll(filter: FilterQuery<IPaymentCollection>): Promise<IPaymentCollection[]>;
  // findOne(filter: FilterQuery<IPaymentCollection>): Promise<IPaymentCollection | null>;
  // update(id: string, data: Partial<IPaymentCollection>): Promise<IPaymentCollection | null>;
  // deleteOne(filter: FilterQuery<IPaymentCollection>): Promise<void>;
  
  // Payment specific methods
  findByClientId(clientId: string): Promise<IPaymentCollection[]>;
  findByTrainerId(trainerId: string): Promise<IPaymentCollection[]>;
  findByStripePaymentIntentId(paymentIntentId: string): Promise<IPaymentCollection | null>;
  findByStripeSessionId(sessionId: string): Promise<IPaymentCollection | null>;
  getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<IPaymentCollection[]>;
  getTotalRevenue(): Promise<number>;
  getTotalRevenueByTrainer(trainerId: string): Promise<number>;
}
