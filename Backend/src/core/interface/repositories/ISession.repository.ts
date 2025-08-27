import { ISession } from "../model/ISession";
import { IBaseRepository } from "./IBase.repository";

export interface ISessionRepository extends IBaseRepository<ISession>{
  // create(session: ISession): Promise<ISession>;
  // findById(id: string): Promise<ISession | null>;
  // update(session: ISession): Promise<ISession>;
  findUnFreeSlotsByTrainer(trainerId: string, fromDate: Date, toDate: Date): Promise<ISession[]>;
  findFreeSlotsByTrainer(trainerId: string, fromDate: Date, toDate: Date): Promise<ISession[]>;
};
