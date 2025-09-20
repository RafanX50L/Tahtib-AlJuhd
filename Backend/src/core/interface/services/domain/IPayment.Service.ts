import { IPaymentView } from "@/dtos/domain/PaymentDTO";

export interface IPaymentService {
  createPayment(paymentData: {
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
  }): Promise<IPaymentView>;

  getAllPayments(): Promise<IPaymentView[]>;
  
  getPaymentsByClient(clientId: string): Promise<IPaymentView[]>;
  
  getPaymentsByTrainer(trainerId: string): Promise<IPaymentView[]>;
  
  getPaymentById(paymentId: string): Promise<IPaymentView | null>;
  
  getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<IPaymentView[]>;
  
  getTotalRevenue(): Promise<number>;
  
  getTotalRevenueByTrainer(trainerId: string): Promise<number>;
  
  updatePaymentStatus(paymentId: string, status: 'pending' | 'completed' | 'failed' | 'refunded'): Promise<IPaymentView | null>;
  
  getPaymentByStripePaymentIntentId(paymentIntentId: string): Promise<IPaymentView | null>;
  
  getPaymentByStripeSessionId(sessionId: string): Promise<IPaymentView | null>;
}
