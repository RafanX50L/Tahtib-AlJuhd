var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpResponse } from "../../constants/response-message.constant";
import { HttpStatus } from "../../constants/status.constant";
import { AdminTrainerDTO } from "../../dtos/admin/TrainerDTO";
import { createHttpError } from "../../utils";
import { sendInterviewScheduleEmail, sendTrainerApprovalEmail, sendTrainerRejectionEmail } from "../../utils/send-email.util";
import { Types } from "mongoose";
export class AdminTrainerSerice {
    constructor(_personalizationRepository, _trainerInterviewRepository, _userRepository) {
        this._personalizationRepository = _personalizationRepository;
        this._trainerInterviewRepository = _trainerInterviewRepository;
        this._userRepository = _userRepository;
    }
    getApprovedTrainers(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, totalCount } = yield this._personalizationRepository.getApprovedTrainers(page, limit, search);
            console.log(data, totalCount);
            const mapped = yield Promise.all(data.map((trainer) => AdminTrainerDTO.mapApprovedTrainerToDTO(trainer)));
            console.log(mapped);
            return { data: mapped, totalCount };
        });
    }
    getPendingTrainers(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this._personalizationRepository.getPendingTrainers(page, limit, search);
            console.log(raw.data);
            if (!raw) {
                createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.FAILED_TO_FETCH_PENDING_TRAINERS);
            }
            const transformed = yield AdminTrainerDTO.toTrainerListDTO({
                data: raw.data,
                totalCount: raw.totalCount,
            });
            return transformed;
        });
    }
    // trainerInterview.service.ts
    scheduleInterview(trainerId, adminId, date, time) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                throw createHttpError(400, "Invalid date format received");
            }
            const dateString = parsedDate.toISOString().split("T")[0];
            const startTime = new Date(`${dateString}T${time}`);
            const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1hr duration
            const hasConflict = yield this._trainerInterviewRepository.checkConflict(adminId, startTime);
            if (hasConflict) {
                throw createHttpError(HttpStatus.CONFLICT, "This time overlaps with another scheduled interview.");
            }
            const interviewData = {
                adminId: adminId,
                trainerId: trainerId,
                startTime,
                endTime,
                date: new Date(dateString),
                roomId: "room_" + Math.random().toString(36).substring(2, 10),
                result: null
            };
            console.log('upto here');
            const interview = yield this._trainerInterviewRepository.create(interviewData);
            console.log('upto here3');
            yield this._personalizationRepository.updateInterviewDetails(trainerId, interview.id);
            console.log(trainerId);
            const user = yield this._userRepository.findById(new Types.ObjectId(trainerId));
            console.log(user);
            yield sendInterviewScheduleEmail(user.email, user.name, interview.date, interview.startTime);
            return { success: true, message: "Interview scheduled successfully." };
        });
    }
    submitInterviewFeedback(trainerId, adminId, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._trainerInterviewRepository.updateInterviewResult(trainerId, adminId, feedback);
            if (data === null) {
                throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.FAILED_TO_UPDATE_INTERVIEW_FEEDBACK);
            }
            const updated = yield this._personalizationRepository.updateTrainerStatus(trainerId, "interviewed");
            if (updated == null) {
                throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.FAILED_TO_UPDATE_INTERVIEW_FEEDBACK);
            }
            return { success: true };
        });
    }
    approveTrainer(trainerId, salary) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._personalizationRepository.approveTrainer(trainerId, salary);
            const user = yield this._userRepository.findById(new Types.ObjectId(trainerId));
            yield sendTrainerApprovalEmail(user.email, user.name);
            if (!response || !user) {
                throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.FAILED_TO_UPDATE_TRAINER_STATUS);
            }
            return;
        });
    }
    rejectTrainer(trainerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._personalizationRepository.updateTrainerStatus(trainerId, 'rejected');
            const user = yield this._userRepository.findById(new Types.ObjectId(trainerId));
            yield sendTrainerRejectionEmail(user.email, user.name);
            if (!response || !user) {
                throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.FAILED_TO_UPDATE_TRAINER_STATUS);
            }
            return;
        });
    }
}
//# sourceMappingURL=admin.trainer.service.js.map