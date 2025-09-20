import { IPlan } from "../model/IPlan";
import { IBaseRepository } from "./IBase.repository";

export interface IPlanRepository extends IBaseRepository<IPlan>{
  // create(plan: IPlan): Promise<IPlan>;
  findByTrainerId(trainerId: string): Promise<IPlan[]>;
  countActiveClinetByTrainer(trainerId: string): Promise<number>;
  // findById(id: string): Promise<IPlan | null>;
  // Add more methods as needed (e.g., update, delete)
};