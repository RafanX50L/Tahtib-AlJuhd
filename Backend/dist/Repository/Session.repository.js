"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepository = void 0;
const mongoose_1 = require("mongoose");
const base_repository_1 = require("./base.repository");
const Session_model_1 = require("../models/Session.model");
class SessionRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(Session_model_1.SessionModel);
    }
    async findFreeSlotsByTrainer(trainerId, fromDate, toDate) {
        console.log('Finding free slots for trainer:', trainerId, 'from', fromDate, 'to', toDate);
        const result = await this.model.find({
            trainerId: new mongoose_1.Types.ObjectId(trainerId),
            status: 'free',
            startTime: { $gte: fromDate, $lte: toDate },
        });
        return result;
    }
    async findUnFreeSlotsByTrainer(trainerId, fromDate, toDate) {
        console.log('Finding unfree slots for trainer:', trainerId, 'from', fromDate, 'to', toDate);
        const result = await this.model.find({
            trainerId: new mongoose_1.Types.ObjectId(trainerId),
            status: { $nin: ['free', 'cancelled'] },
            startTime: { $gte: fromDate, $lte: toDate },
        });
        return result;
    }
    async findUnFreeSlotsByClient(clinetId, fromDate, toDate) {
        console.log('Finding unfree slots for client:', clinetId, 'from', fromDate, 'to', toDate);
        const result = await this.model.find({
            clientId: new mongoose_1.Types.ObjectId(clinetId),
            status: { $nin: ['free', 'cancelled'] },
            startTime: { $gte: fromDate, $lte: toDate },
        });
        return result;
    }
}
exports.SessionRepository = SessionRepository;
//# sourceMappingURL=Session.repository.js.map