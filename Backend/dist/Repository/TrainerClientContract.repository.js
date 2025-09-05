var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Types } from 'mongoose';
import { BaseRepository } from './base.repository';
import { TrainerClientContractModel } from '../models/TrainerClientContract.model';
export class TrainerClientContractRepository extends BaseRepository {
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
    findActiveContractByClientId(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TrainerClientContractModel.findOne({
                clientId,
                sessionsRemaining: { $gt: 0 },
                endDate: { $gte: new Date() },
            })
                .populate('planId')
                .exec();
        });
    }
    findExpiredContracts(now) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TrainerClientContractModel.find({
                endDate: { $lt: now },
            }).populate("clientId trainerId");
        });
    }
    findActiveContractsByTrainerId(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TrainerClientContractModel.find({
                trainerId: new Types.ObjectId(trainerId),
                endDate: { $gte: new Date() },
            })
                .populate({
                path: 'clientId',
                select: 'name',
                populate: {
                    path: 'personalizationId',
                    select: 'data.userData.nickName data.userData.profilePictureId',
                    match: { role: 'client' },
                },
            })
                .populate('planId', 'title')
                .populate({
                path: 'chatId',
                select: 'messages',
                options: { sort: { 'messages.timestamp': -1 }, limit: 1 },
            })
                .exec();
        });
    }
    findActiveByClientAndTrainer(clientId, trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({
                clientId: new Types.ObjectId(clientId),
                trainerId: new Types.ObjectId(trainerId),
                endDate: { $gte: new Date() },
            });
        });
    }
    decrementSessionsRemaining(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.findByIdAndUpdate(id, { $inc: { sessionsRemaining: -1 } });
        });
    }
    incrementSessionsRemaining(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.findByIdAndUpdate(id, { $inc: { sessionsRemaining: 1 } });
        });
    }
}
//# sourceMappingURL=TrainerClientContract.repository.js.map