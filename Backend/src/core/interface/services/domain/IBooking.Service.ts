
export interface IBookingService {
    purchasePlan(clientId: string, trainerId: string, planId: string): Promise<string>;
}