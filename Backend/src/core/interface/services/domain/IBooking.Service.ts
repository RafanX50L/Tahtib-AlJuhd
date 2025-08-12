import { ISession } from "../../model/ISession";
import { ITrainerClientContract } from "../../model/ITrainerClientContract";

export interface IBookingService {
    purchasePlan(clientId: string, trainerId: string, planId: string): Promise<ITrainerClientContract>;
    bookSlot(clientId: string, sessionId: string): Promise<ISession>;
    cancelSession(sessionId: string): Promise<ISession>;
}