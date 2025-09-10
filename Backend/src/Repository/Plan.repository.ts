import { IPlan } from '@/core/interface/model/IPlan';
import { IPlanRepository } from '@/core/interface/repositories/IPlanRepository';
import { Types } from 'mongoose';
import { BaseRepository } from './base.repository';
import { PlanModel } from '@/models/Plan.model';

export class PlanRepository extends BaseRepository<IPlan> implements IPlanRepository {

  constructor() {
    super(PlanModel);
  }
  async create(plan: IPlan): Promise<IPlan> {
    return await this.model.create(plan);
  }

  async findByTrainerId(trainerId: string): Promise<IPlan[]> {
    return await this.model.find({ trainerId: new Types.ObjectId(trainerId), isActive: true });
  }

  // async findById(id: string): Promise<IPlan | null> {
  //   return await this.model.findById(id);
  // }
}