
export interface IBookingService {
    handleCheckoutSession(userId: string, trainerId:string, planId:string): Promise<string>;
    handlePaymentSuccess(event: any): Promise<void>;
}