import { ITrainerClientContract } from "../model/ITrainerClientContract";
import { IBaseRepository } from "./IBase.repository";

export interface ITrainerClientContractRepository extends IBaseRepository<ITrainerClientContract>{
  // create(contract: ITrainerClientContract): Promise<ITrainerClientContract>;
  // findById(id: string): Promise<ITrainerClientContract | null>;
  findActiveByClientAndTrainer(clientId: string, trainerId: string): Promise<ITrainerClientContract | null>;
  decrementSessionsRemaining(id: string): Promise<void>;
  incrementSessionsRemaining(id: string): Promise<void>;
}