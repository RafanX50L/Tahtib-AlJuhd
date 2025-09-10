"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerClientContractRepository = void 0;
const mongoose_1 = require("mongoose");
const base_repository_1 = require("./base.repository");
const TrainerClientContract_model_1 = require("../models/TrainerClientContract.model");
class TrainerClientContractRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(TrainerClientContract_model_1.TrainerClientContractModel);
    }
    // async create(contract: ITrainerClientContract): Promise<ITrainerClientContract> {
    //   const newContract = new TrainerClientContractModel(contract);
    //   return await newContract.save();
    // }
    // async findById(id: string): Promise<ITrainerClientContract | null> {
    //   return await TrainerClientContractModel.findById(id);
    // }
    async findActiveContractByClientId(clientId) {
        return await TrainerClientContract_model_1.TrainerClientContractModel.findOne({
            clientId,
            sessionsRemaining: { $gt: 0 },
            endDate: { $gte: new Date() },
        })
            .populate('planId')
            .exec();
    }
    async findExpiredContracts(now) {
        return await TrainerClientContract_model_1.TrainerClientContractModel.find({
            endDate: { $lt: now },
        }).populate("clientId trainerId");
    }
    async findActiveContractsByTrainerId(trainerId) {
        return await TrainerClientContract_model_1.TrainerClientContractModel.find({
            trainerId: new mongoose_1.Types.ObjectId(trainerId),
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
    }
    async findActiveByClientAndTrainer(clientId, trainerId) {
        return await this.model.findOne({
            clientId: new mongoose_1.Types.ObjectId(clientId),
            trainerId: new mongoose_1.Types.ObjectId(trainerId),
            endDate: { $gte: new Date() },
        });
    }
    async decrementSessionsRemaining(id) {
        await this.model.findByIdAndUpdate(id, { $inc: { sessionsRemaining: -1 } });
    }
    async incrementSessionsRemaining(id) {
        await this.model.findByIdAndUpdate(id, { $inc: { sessionsRemaining: 1 } });
    }
}
exports.TrainerClientContractRepository = TrainerClientContractRepository;
//# sourceMappingURL=TrainerClientContract.repository.js.map