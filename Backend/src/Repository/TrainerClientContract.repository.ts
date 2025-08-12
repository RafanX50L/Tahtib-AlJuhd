import { Types } from 'mongoose';
import { BaseRepository } from './base.repository';
import { ITrainerClientContract } from '@/core/interface/model/ITrainerClientContract';
import { ITrainerClientContractRepository } from '@/core/interface/repositories/ITrainerClientContract.repository';
import { TrainerClientContractModel } from '@/models/TrainerClientContract.model';

export class TrainerClientContractRepository extends BaseRepository<ITrainerClientContract> implements ITrainerClientContractRepository {
  
  constructor() {
    super(TrainerClientContractModel);
  }
  // async create(contract: ITrainerClientContract): Promise<ITrainerClientContract> {
  //   const newContract = new TrainerClientContractModel(contract);
  //   return await newContract.save();
  // }

  // async findById(id: string): Promise<ITrainerClientContract | null> {
  //   return await TrainerClientContractModel.findById(id);
  // }

  async findActiveByClientAndTrainer(clientId: string, trainerId: string): Promise<ITrainerClientContract | null> {
    return await this.model.findOne({
      clientId: new Types.ObjectId(clientId),
      trainerId: new Types.ObjectId(trainerId),
      endDate: { $gte: new Date() },
    });
  }

  async decrementSessionsRemaining(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { $inc: { sessionsRemaining: -1 } });
  }

  async incrementSessionsRemaining(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { $inc: { sessionsRemaining: 1 } });
  }
}