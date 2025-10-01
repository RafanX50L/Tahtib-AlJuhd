import { ISession } from "../model/ISession";
import { IBaseRepository } from "./IBase.repository";

export interface ISessionRepository extends IBaseRepository<ISession>{
  findUnFreeSlotsByTrainer(trainerId: string, fromDate: Date, toDate: Date): Promise<ISession[]>;
  findFreeSlotsByTrainer(trainerId: string, fromDate: Date, toDate: Date): Promise<ISession[]>;
  findUnFreeSlotsByClient(clinetId: string, fromDate: Date, toDate: Date): Promise<ISession[]>;
  // coutnCancelledDocumentsInAWeek(clientId:string):Promise<number>
};
