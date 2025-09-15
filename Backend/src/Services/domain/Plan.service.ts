import { ITrainerPersonalization } from "@/core/interface/model/IPersonalization.model";
import { IPlan } from "@/core/interface/model/IPlan";
import { IPersonalizationRepository } from "@/core/interface/repositories/IPersonalization.repository";
import { IPlanRepository } from "@/core/interface/repositories/IPlanRepository";
import {
  IPlanService,
  IPlanView,
} from "@/core/interface/services/domain/IPlan.Service";
import { PlanDto } from "@/dtos/domain/PlanDTO";
import { Types } from "mongoose";

export class PlanService implements IPlanService {
  constructor(
    private readonly _planRepo: IPlanRepository,
    private readonly _personalizationRepo: IPersonalizationRepository
  ) {}

  async createPlan(plan: IPlan): Promise<void> {
    const trainerPers = await this._personalizationRepo.findByUserId(
      plan.trainerId.toString()
    );
    if (!trainerPers) throw new Error("Trainer not found");
    const trainerData = trainerPers.data as ITrainerPersonalization;
    plan.price =
      (trainerData.basicInfo.weeklySalary + 100) * plan.durationWeeks! - 1;
    plan.isBooked = false;
    const newPlan = await this._planRepo.create(plan);
    await this._personalizationRepo.updateTrainerData(
      plan.trainerId.toString(),
      {
        ...trainerData,
        ...trainerData,
        plans: [...(trainerData.plans || []), newPlan.id!],
      }
    );
    return;
  }

  async getPlansByTrainer(trainerId: string,role): Promise<IPlanView[]> {
    const result = role === 'client' ? (await this._planRepo.findByTrainerId(trainerId)) as IPlan[]: (await this._planRepo.findAll({ trainerId: new Types.ObjectId(trainerId)}) as IPlan[]);
    return  await Promise.all(
      result.map(async (plan) => {
        return await PlanDto.mapToPlanData(plan);
      })
    );
  }

  async getPlanById(id: string): Promise<IPlanView | null> {
    const result = await this._planRepo.findById(new Types.ObjectId(id));
    return await PlanDto.mapToPlanData(result);
  }

  async updatePlan(id: string, updates: Partial<IPlanView>): Promise<void> {
    const existingPlan = await this._planRepo.findById(new Types.ObjectId(id));
    if (!existingPlan) throw new Error("Plan not found");

    await this._planRepo.update(id, updates);
    return;
  }

  async deactivatePlan(id: string): Promise<void> {
    const existingPlan = await this._planRepo.findById(new Types.ObjectId(id));
    if (!existingPlan) throw new Error("Plan not found");

    await this._planRepo.update(id, { isActive: !existingPlan.isActive });
    return;
  }
}
