import { ITrainerPersonalization } from "@/core/interface/model/IPersonalization.model";
import { IPlan } from "@/core/interface/model/IPlan";
import { IPersonalizationRepository } from "@/core/interface/repositories/IPersonalization.repository";
import { IPlanRepository } from "@/core/interface/repositories/IPlanRepository";
import { IPlanService } from "@/core/interface/services/domain/IPlan.Service";
import { Types } from "mongoose";

export class PlanService implements IPlanService{

  constructor(
    private readonly _planRepo: IPlanRepository,
    private readonly _personalizationRepo: IPersonalizationRepository
  ) {}

  async createPlan(plan: IPlan): Promise<IPlan> {
    const trainerPers = await this._personalizationRepo.findByUserId(plan.trainerId.toString());
    if (!trainerPers) throw new Error('Trainer not found');
    const trainerData = trainerPers.data as ITrainerPersonalization;
    plan.price = (trainerData.basicInfo.weeklySalary + 100) * plan.durationWeeks! - 1;
    const newPlan = await this._planRepo.create(plan);
    await this._personalizationRepo.updateTrainerData(plan.trainerId.toString(), {
      ...trainerData,
      ...(trainerData),
      plans: [...(trainerData.plans || []), newPlan.id!],
    });
    return newPlan;
  }

  async getPlansByTrainer(trainerId: string): Promise<IPlan[]> {
    return await this._planRepo.findByTrainerId(trainerId);
  }

  async getPlanById(id: string): Promise<IPlan | null> {
    return await this._planRepo.findById(new Types.ObjectId(id));
  }
}