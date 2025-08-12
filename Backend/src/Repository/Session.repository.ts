import { Types } from 'mongoose';
import { BaseRepository } from './base.repository';
import { ISession } from '@/core/interface/model/ISession';
import { ISessionRepository } from '@/core/interface/repositories/ISession.repository';
import { SessionModel } from '@/models/Session.model';

export class SessionRepository extends BaseRepository<ISession> implements ISessionRepository {
  constructor () {
    super(SessionModel);
  }
  // async create(session: ISession): Promise<ISession> {
  //   const newSession = new SessionModel(session);
  //   return await newSession.save();
  // }

  // async findById(id: string): Promise<ISession | null> {
  //   return await SessionModel.findById(id);
  // }

  // async update(session: ISession): Promise<ISession> {
  //   const updatedSession = await SessionModel.findByIdAndUpdate(
  //     session._id,
  //     { $set: session },
  //     { new: true }
  //   );
  //   if (!updatedSession) throw new Error('Session not found');
  //   return updatedSession;
  // }

  async findFreeSlotsByTrainer(trainerId: string, fromDate: Date, toDate: Date): Promise<ISession[]> {
    return await this.model.find({
      trainerId: new Types.ObjectId(trainerId),
      status: 'free',
      startTime: { $gte: fromDate, $lte: toDate },
    });
  }
}