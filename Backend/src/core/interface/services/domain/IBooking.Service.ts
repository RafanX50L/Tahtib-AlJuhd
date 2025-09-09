
export interface IBookingService {
    // purchasePlan(clientId: string, trainerId: string, planId: string): Promise<string>;
    handleCheckoutSession(userId: string, trainerId:string, planId:string): Promise<string>;
    handlePaymentSucess(event: any): Promise<void>;
}