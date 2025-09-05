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
import { SessionModel } from '../models/Session.model';
export class SessionRepository extends BaseRepository {
    constructor() {
        super(SessionModel);
    }
    findFreeSlotsByTrainer(trainerId, fromDate, toDate) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Finding free slots for trainer:', trainerId, 'from', fromDate, 'to', toDate);
            const result = yield this.model.find({
                trainerId: new Types.ObjectId(trainerId),
                status: 'free',
                startTime: { $gte: fromDate, $lte: toDate },
            });
            return result;
        });
    }
    findUnFreeSlotsByTrainer(trainerId, fromDate, toDate) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Finding unfree slots for trainer:', trainerId, 'from', fromDate, 'to', toDate);
            const result = yield this.model.find({
                trainerId: new Types.ObjectId(trainerId),
                status: { $nin: ['free', 'cancelled'] },
                startTime: { $gte: fromDate, $lte: toDate },
            });
            return result;
        });
    }
    findUnFreeSlotsByClient(clinetId, fromDate, toDate) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Finding unfree slots for client:', clinetId, 'from', fromDate, 'to', toDate);
            const result = yield this.model.find({
                clientId: new Types.ObjectId(clinetId),
                status: { $nin: ['free', 'cancelled'] },
                startTime: { $gte: fromDate, $lte: toDate },
            });
            return result;
        });
    }
}
//# sourceMappingURL=Session.repository.js.map