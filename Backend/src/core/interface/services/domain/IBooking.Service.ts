import Stripe from "stripe";

export interface IBookingService {
    handleCheckoutSession(userId: string, trainerId:string, planId:string): Promise<string>;
    handlePaymentSuccess(event: Stripe.Event): Promise<void>;
}