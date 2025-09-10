"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDto = void 0;
class PaymentDto {
    static async mapToPaymentView(raw) {
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
                    name: raw.clientId.name || 'N/A',
                    email: raw.clientId.email || 'N/A',
                }
            }),
            ...(raw.trainerId && typeof raw.trainerId === 'object' && {
                trainer: {
                    id: raw.trainerId._id?.toString() || raw.trainerId.toString(),
                    name: raw.trainerId.name || 'N/A',
                    email: raw.trainerId.email || 'N/A',
                }
            }),
            ...(raw.planId && typeof raw.planId === 'object' && {
                plan: {
                    id: raw.planId._id?.toString() || raw.planId.toString(),
                    title: raw.planId.title || 'N/A',
                    description: raw.planId.description || 'N/A',
                    price: raw.planId.price || 0,
                }
            }),
        };
    }
    static async mapToPaymentViewList(payments) {
        return await Promise.all(payments.map(async (payment) => {
            return await this.mapToPaymentView(payment);
        }));
    }
}
exports.PaymentDto = PaymentDto;
//# sourceMappingURL=PaymentDTO.js.map