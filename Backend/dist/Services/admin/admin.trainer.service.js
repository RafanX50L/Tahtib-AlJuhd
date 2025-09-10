"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminTrainerSerice = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
const TrainerDTO_1 = require("../../dtos/admin/TrainerDTO");
const utils_1 = require("../../utils");
const send_email_util_1 = require("../../utils/send-email.util");
const mongoose_1 = require("mongoose");
class AdminTrainerSerice {
    _personalizationRepository;
    _trainerInterviewRepository;
    _userRepository;
    constructor(_personalizationRepository, _trainerInterviewRepository, _userRepository) {
        this._personalizationRepository = _personalizationRepository;
        this._trainerInterviewRepository = _trainerInterviewRepository;
        this._userRepository = _userRepository;
    }
    async getApprovedTrainers(page, limit, search) {
        const { data, totalCount } = await this._personalizationRepository.getApprovedTrainers(page, limit, search);
        console.log(data, totalCount);
        const mapped = await Promise.all(data.map((trainer) => TrainerDTO_1.AdminTrainerDTO.mapApprovedTrainerToDTO(trainer)));
        console.log(mapped);
        return { data: mapped, totalCount };
    }
    async getPendingTrainers(page, limit, search) {
        const raw = await this._personalizationRepository.getPendingTrainers(page, limit, search);
        console.log(raw.data);
        if (!raw) {
            (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, response_message_constant_1.HttpResponse.FAILED_TO_FETCH_PENDING_TRAINERS);
        }
        const transformed = await TrainerDTO_1.AdminTrainerDTO.toTrainerListDTO({
            data: raw.data,
            totalCount: raw.totalCount,
        });
        return transformed;
    }
    // trainerInterview.service.ts
    async scheduleInterview(trainerId, adminId, date, time) {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            throw (0, utils_1.createHttpError)(400, "Invalid date format received");
        }
        const dateString = parsedDate.toISOString().split("T")[0];
        const startTime = new Date(`${dateString}T${time}`);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1hr duration
        const hasConflict = await this._trainerInterviewRepository.checkConflict(adminId, startTime);
        if (hasConflict) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.CONFLICT, "This time overlaps with another scheduled interview.");
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
        const interview = await this._trainerInterviewRepository.create(interviewData);
        console.log('upto here3');
        await this._personalizationRepository.updateInterviewDetails(trainerId, interview.id);
        console.log(trainerId);
        const user = await this._userRepository.findById(new mongoose_1.Types.ObjectId(trainerId));
        console.log(user);
        await (0, send_email_util_1.sendInterviewScheduleEmail)(user.email, user.name, interview.date, interview.startTime);
        return { success: true, message: "Interview scheduled successfully." };
    }
    async submitInterviewFeedback(trainerId, adminId, feedback) {
        const data = await this._trainerInterviewRepository.updateInterviewResult(trainerId, adminId, feedback);
        if (data === null) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, response_message_constant_1.HttpResponse.FAILED_TO_UPDATE_INTERVIEW_FEEDBACK);
        }
        const updated = await this._personalizationRepository.updateTrainerStatus(trainerId, "interviewed");
        if (updated == null) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, response_message_constant_1.HttpResponse.FAILED_TO_UPDATE_INTERVIEW_FEEDBACK);
        }
        return { success: true };
    }
    async approveTrainer(trainerId, salary) {
        const response = await this._personalizationRepository.approveTrainer(trainerId, salary);
        const user = await this._userRepository.findById(new mongoose_1.Types.ObjectId(trainerId));
        await (0, send_email_util_1.sendTrainerApprovalEmail)(user.email, user.name);
        if (!response || !user) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, response_message_constant_1.HttpResponse.FAILED_TO_UPDATE_TRAINER_STATUS);
        }
        return;
    }
    async rejectTrainer(trainerId) {
        const response = await this._personalizationRepository.updateTrainerStatus(trainerId, 'rejected');
        const user = await this._userRepository.findById(new mongoose_1.Types.ObjectId(trainerId));
        await (0, send_email_util_1.sendTrainerRejectionEmail)(user.email, user.name);
        if (!response || !user) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, response_message_constant_1.HttpResponse.FAILED_TO_UPDATE_TRAINER_STATUS);
        }
        return;
    }
}
exports.AdminTrainerSerice = AdminTrainerSerice;
//# sourceMappingURL=admin.trainer.service.js.map