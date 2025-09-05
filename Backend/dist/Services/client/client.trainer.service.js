var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ClientTrainerDTO } from "../../dtos/client/TrainerDTO";
import { generateSignedUrl } from "../../utils/s3Storage.utils";
import { Types } from "mongoose";
import { differenceInHours } from "date-fns";
import { HttpResponse } from "../../constants/response-message.constant";
export class clientTrainerService {
    constructor(_trainerRepo, _userRepo, _clinetRepo, _planRepo, _contractRepo, _sessionRepo) {
        this._trainerRepo = _trainerRepo;
        this._userRepo = _userRepo;
        this._clinetRepo = _clinetRepo;
        this._planRepo = _planRepo;
        this._contractRepo = _contractRepo;
        this._sessionRepo = _sessionRepo;
    }
    contractExpiration() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const now = new Date();
            const expiredContracts = yield this._contractRepo.findExpiredContracts(now);
            for (const contract of expiredContracts) {
                const personalizationDoc = yield this._clinetRepo.findOne({
                    userId: contract.clientId,
                });
                if (!personalizationDoc)
                    continue;
                const data = personalizationDoc.data;
                if (((_a = data.currentTrainerId) === null || _a === void 0 ? void 0 : _a.toString()) === contract.trainerId.toString()) {
                    data.previousTrainers.push({
                        trainerId: contract.trainerId,
                        startDate: contract.startDate,
                        endDate: contract.endDate,
                    });
                    data.currentTrainerId = null;
                }
                data.planStatus = "Inactive";
                yield personalizationDoc.save();
                console.log(`⚡ Contract expired for client ${contract.clientId}`);
            }
        });
    }
    getAvailableTrainers(userId, page, limit, search, specialty) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const currentTrainerId = ((_a = (yield this._clinetRepo.findOne({ userId: userId })).data.currentTrainerId) === null || _a === void 0 ? void 0 : _a.toString()) || "";
            const result = yield this._trainerRepo.getAvailableTrainer(currentTrainerId, page, limit, search, specialty);
            const mappedResult = yield Promise.all(result.trainers.map((data) => ClientTrainerDTO.mapToTrainerData(data)));
            return {
                mappedResult,
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                total: result.total
            };
        });
    }
    getTrainerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id);
            const user = (yield this._userRepo.findById(new Types.ObjectId(id)));
            const trainer = yield this._trainerRepo.getTrainerProfileData(user.personalizationId.toString());
            const plans = yield this._planRepo.findByTrainerId(id);
            if (!trainer)
                throw new Error('Trainer not found');
            const data = trainer.data;
            return {
                id: id,
                name: user.name,
                email: user.email,
                Specialty: data.professionalSummary.specializations,
                photo: yield generateSignedUrl(data.basicInfo.profilePhoto[0].filePath),
                experience: data.professionalSummary.yearsOfExperience.toString(),
                location: data.basicInfo.location,
                price: data.basicInfo.weeklySalary,
                plans: plans.map(plan => ({
                    _id: plan._id.toString(),
                    name: plan.title, // e.g., "4 Sessions/Month"
                    price: plan.price, // e.g., 500
                    sessionsPerWeek: plan.sessionsPerWeek, // e.g., 4
                    description: plan.description,
                    duration: plan.durationWeeks
                }))
            };
            // return ClientTrainerDTO.mapToTrainerData(trainer);
        });
    }
    getCurrentTrainer(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const currentTrainerId = (yield this._clinetRepo.findOne({ userId: userId })).data.currentTrainerId;
            if (!currentTrainerId)
                throw new Error('No current trainer found for this user');
            const trainer = (yield this._userRepo.findById(currentTrainerId));
            const result = yield this._trainerRepo.getTrainerProfileData(trainer.personalizationId.toString());
            const data = result.data;
            return {
                id: currentTrainerId.toString(),
                name: trainer.name,
                speciality: data.professionalSummary.specializations,
                photo: yield generateSignedUrl((_b = (_a = data.basicInfo) === null || _a === void 0 ? void 0 : _a.profilePhoto[0]) === null || _b === void 0 ? void 0 : _b.filePath),
                experience: data.professionalSummary.yearsOfExperience,
                price: data.basicInfo.weeklySalary,
            };
        });
    }
    getCurrentTrainerContract(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this._contractRepo.findActiveContractByClientId(clientId);
            if (!contract) {
                throw new Error('No active contract found');
            }
            const plan = contract.planId;
            return {
                id: contract.id.toString(),
                chatId: contract.chatId.toString(),
                sessionsRemaining: contract.sessionsRemaining,
                trainerId: contract.trainerId.toString(),
                planName: plan.title || 'Custom Plan',
                endDate: contract.endDate,
            };
        });
    }
    bookSlot(clientId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this._sessionRepo.findById(new Types.ObjectId(sessionId));
            if (!session || session.clientId || session.status !== 'free') {
                throw new Error('Slot not available');
            }
            const contract = yield this._contractRepo.findActiveByClientAndTrainer(clientId, session.trainerId.toString());
            if (!contract || contract.sessionsRemaining <= 0) {
                throw new Error('No remaining sessions in your plan');
            }
            if (contract.endDate < new Date()) {
                throw new Error('Your plan has expired');
            }
            session.clientId = new Types.ObjectId(clientId);
            session.planId = contract.planId;
            session.status = 'booked';
            session.meetingLink = `https://zoom.us/j/${Math.random().toString(36).substring(2, 15)}`;
            yield this._sessionRepo.update(session.id, session);
            yield this._contractRepo.decrementSessionsRemaining(contract._id.toString());
            return HttpResponse.SLOT_BOOKING_SUCCESSFULL;
        });
    }
    cancelSession(clientId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const session = yield this._sessionRepo.findById(new Types.ObjectId(sessionId));
            if (!session) {
                throw new Error('Session not found');
            }
            if (((_a = session.clientId) === null || _a === void 0 ? void 0 : _a.toString()) !== clientId) {
                throw new Error('You can only cancel your own sessions');
            }
            const contract = yield this._contractRepo.findById(session.planId);
            if (!contract) {
                throw new Error('Contract not found');
            }
            const hoursToStart = differenceInHours(session.startTime, new Date());
            if (hoursToStart > 24) {
                session.status = 'cancelled';
                session.clientId = undefined;
                session.planId = undefined;
                session.meetingLink = undefined;
                yield this._contractRepo.incrementSessionsRemaining(contract._id.toString());
            }
            else {
                session.status = 'cancelled';
            }
            yield this._sessionRepo.update(session.id, session);
            return HttpResponse.SLOT_CANCELLING_SUCCESSFULL;
        });
    }
}
;
//# sourceMappingURL=client.trainer.service.js.map