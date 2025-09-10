import { IPaymentCollection } from "@/core/interface/model/IPaymentCollection";

export interface IPaymentView {
  id: string;
  clientId: string;
  trainerId: string;
  planId: string;
  contractId: string;
  amount: number;
  currency: string;
  stripePaymentIntentId: string;
  stripeSessionId: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  companyAccount: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  client?: {
    id: string;
    name: string;
    email: string;
  };
  trainer?: {
    id: string;
    name: string;
    email: string;
  };
  plan?: {
    id: string;
    title: string;
    description: string;
    price: number;
  };
}

export class PaymentDto {
  static async mapToPaymentView(raw: IPaymentCollection): Promise<IPaymentView> {
    return {
      id: raw._id.toString(),
      clientId: raw.clientId.toString(),
      trainerId: raw.trainerId.toString(),
      planId: raw.planId.toString(),
      contractId: raw.contractId.toString(),
      amount: raw.amount,
      currency: raw.currency,
      stripePaymentIntentId: raw.stripePaymentIntentId,
      stripeSessionId: raw.stripeSessionId,
      paymentStatus: raw.paymentStatus,
      paymentMethod: raw.paymentMethod,
      transactionId: raw.transactionId,
      companyAccount: raw.companyAccount,
      createdAt: raw.createdAt.toISOString(),
      updatedAt: raw.updatedAt.toISOString(),
      // Populated fields will be added if they exist
      ...(raw.clientId && typeof raw.clientId === 'object' && {
        client: {
          id: raw.clientId._id?.toString() || raw.clientId.toString(),
          name: (raw.clientId as any).name || 'N/A',
          email: (raw.clientId as any).email || 'N/A',
        }
      }),
      ...(raw.trainerId && typeof raw.trainerId === 'object' && {
        trainer: {
          id: raw.trainerId._id?.toString() || raw.trainerId.toString(),
          name: (raw.trainerId as any).name || 'N/A',
          email: (raw.trainerId as any).email || 'N/A',
        }
      }),
      ...(raw.planId && typeof raw.planId === 'object' && {
        plan: {
          id: raw.planId._id?.toString() || raw.planId.toString(),
          title: (raw.planId as any).title || 'N/A',
          description: (raw.planId as any).description || 'N/A',
          price: (raw.planId as any).price || 0,
        }
      }),
    };
  }

  static async mapToPaymentViewList(payments: IPaymentCollection[]): Promise<IPaymentView[]> {
    return await Promise.all(
      payments.map(async (payment) => {
        return await this.mapToPaymentView(payment);
      })
    );
  }
}
