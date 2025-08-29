import { ITrainerClientContract } from "../../model/ITrainerClientContract";

export interface IBookingService {
    purchasePlan(clientId: string, trainerId: string, planId: string): Promise<ITrainerClientContract>;
}