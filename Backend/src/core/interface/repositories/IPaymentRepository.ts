import { IPaymentCollection } from "../model/IPaymentCollection";
import { IBaseRepository } from "./IBase.repository";

export interface IPaymentRepository extends IBaseRepository<IPaymentCollection> {
  findByClientId(clientId: string): Promise<IPaymentCollection[]>;
  findByTrainerId(trainerId: string): Promise<IPaymentCollection[]>;
  findByStripePaymentIntentId(paymentIntentId: string): Promise<IPaymentCollection | null>;
  findByStripeSessionId(sessionId: string): Promise<IPaymentCollection | null>;
  getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<IPaymentCollection[]>;
  getTotalRevenue(): Promise<number>;
  getTotalRevenueByTrainer(trainerId: string): Promise<number>;
}
