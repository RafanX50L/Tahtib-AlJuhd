import { Types } from 'mongoose';
import { BaseRepository } from './base.repository';
import { ISession } from '@/core/interface/model/ISession';
import { ISessionRepository } from '@/core/interface/repositories/ISession.repository';
import { SessionModel } from '@/models/Session.model';

export class SessionRepository extends BaseRepository<ISession> implements ISessionRepository {
  constructor () {
    super(SessionModel);
  }

  async findFreeSlotsByTrainer(trainerId: string, fromDate: Date, toDate: Date): Promise<ISession[]> {
    console.log('Finding free slots for trainer:', trainerId, 'from', fromDate, 'to', toDate);
    const result =  await this.model.find({
      trainerId: new Types.ObjectId(trainerId),
      status: 'free',
      startTime: { $gte: fromDate, $lte: toDate },
    });
    return result;
  }

  async findUnFreeSlotsByTrainer(trainerId: string, fromDate: Date, toDate: Date): Promise<ISession[]> {
    console.log('Finding unfree slots for trainer:', trainerId, 'from', fromDate, 'to', toDate);
    const result = await this.model.find({
      trainerId: new Types.ObjectId(trainerId),
      status: { $nin: ['free', 'cancelled'] },
      startTime: { $gte: fromDate, $lte: toDate },
    });
    return result;
  }
  async findUnFreeSlotsByClient(clinetId: string, fromDate: Date, toDate: Date): Promise<ISession[]> {
    return await this.model.find({
      clientId: new Types.ObjectId(clinetId),
      status: { $nin: ['free', 'cancelled'] },
      startTime: { $gte: fromDate, $lte: toDate },
    });
  }
  
}