// import { ITrainerPersonalization } from "../../model/IPersonalization.model";
import { ISession } from "../../model/ISession";

export interface IAvailabilityService {
    // setAvailability(trainerId: string, slots: ITrainerPersonalization['availability']['weeklySlots']): Promise<void>;
    getFreeSlots(trainerId: string, fromDate: Date, toDate: Date): Promise<ISession[]>;
    getUnFreeSlots(trainerId: string, fromDate: Date, toDate: Date): Promise<ISession[]>;
    getWeeklyRules(trainerId: string): Promise<Record<string, unknown> | null | void>
    setWeeklyRules(trainerId: string, rules: Record<string, unknown>): Promise<void>
}