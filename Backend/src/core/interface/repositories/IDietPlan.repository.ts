import { IDietPlan } from "../model/IDietPlan.model";
import { IBaseRepository } from "./IBase.repository";

export interface IDietPlanRepository extends IBaseRepository<IDietPlan> {
  /** Reserved for Diet plan specific methods */
  _placeholder?: never;
}
