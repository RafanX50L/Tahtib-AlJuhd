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
import { addWeeks } from 'date-fns';
export class BookingService {
    constructor(_contractRepo, _sessionRepo, _chatRepo, _planRepo, _personalizationRepo) {
        this._contractRepo = _contractRepo;
        this._sessionRepo = _sessionRepo;
        this._chatRepo = _chatRepo;
        this._planRepo = _planRepo;
        this._personalizationRepo = _personalizationRepo;
    }
    purchasePlan(clientId, trainerId, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this._planRepo.findById(new Types.ObjectId(planId));
            if (!plan)
                throw new Error('Plan not found');
            const clientPers = yield this._personalizationRepo.findByUserId(clientId);
            if (!clientPers)
                throw new Error('Client not found');
            const clientData = clientPers.data;
            if (clientData.currentTrainerId && clientData.currentTrainerId.toString() !== trainerId) {
                const activeContract = yield this._contractRepo.findActiveByClientAndTrainer(clientId, clientData.currentTrainerId.toString());
                if (activeContract)
                    throw new Error('Client has an active contract with another trainer');
            }
            const startDate = new Date();
            const endDate = addWeeks(startDate, plan.durationWeeks);
            const chat = yield this._chatRepo.create({
                participants: [new Types.ObjectId(trainerId), new Types.ObjectId(clientId)],
                messages: [],
            });
            const contract = {
                trainerId: new Types.ObjectId(trainerId),
                clientId: new Types.ObjectId(clientId),
                planId: new Types.ObjectId(planId),
                startDate,
                endDate,
                sessionsRemaining: plan.sessionsPerWeek * plan.durationWeeks,
                chatId: chat.id,
            };
            const newContract = yield this._contractRepo.create(contract);
            yield this._planRepo.update(plan.id, { isBooked: true });
            yield this._personalizationRepo.updateClientData(clientId, Object.assign(Object.assign({}, clientData), { currentTrainerId: new Types.ObjectId(trainerId), chatsId: [...(clientData.chatsId || []), { trainerId: new Types.ObjectId(trainerId), chatId: chat.id }], contracts: [...(clientData.contracts || []), newContract.id], planStatus: 'Active' }));
            const trainerPers = yield this._personalizationRepo.findByUserId(trainerId);
            if (!trainerPers)
                throw new Error('Trainer not found');
            const trainerData = trainerPers.data;
            yield this._personalizationRepo.updateTrainerData(trainerId, Object.assign(Object.assign({}, trainerData), { chats: [...(trainerData.chats || []), chat.id], contracts: [...(trainerData.contracts || []), newContract.id] }));
            return 'new contract';
            // in the updated version we will asing payment url this returning string is just for now
        });
    }
}
//# sourceMappingURL=Booking.service.js.map