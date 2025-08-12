import { IPlan } from "../model/IPlan";
import { IBaseRepository } from "./IBase.repository";

export interface IPlanRepository extends IBaseRepository<IPlan>{
  create(plan: IPlan): Promise<IPlan>;
  findByTrainerId(trainerId: string): Promise<IPlan[]>;
  // findById(id: string): Promise<IPlan | null>;
  // Add more methods as needed (e.g., update, delete)
};