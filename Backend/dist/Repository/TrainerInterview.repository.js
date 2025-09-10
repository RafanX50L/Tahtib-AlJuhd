"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerInterviewRepository = void 0;
const base_repository_1 = require("./base.repository");
const TrainerInterview_model_1 = require("../models/TrainerInterview.model");
const date_fns_1 = require("date-fns");
class TrainerInterviewRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(TrainerInterview_model_1.TrainerInterviewModel);
    }
    _placeholder;
    // trainerInterview.repository.ts
    async checkConflict(adminID, startTime) {
        const conflictStart = (0, date_fns_1.subHours)(startTime, 1);
        const conflictEnd = (0, date_fns_1.addHours)(startTime, 1);
        const conflict = await this.model.findOne({
            adminID,
            $or: [
                {
                    startTime: { $lt: conflictEnd },
                    endTime: { $gt: conflictStart },
                },
            ],
        });
        return !!conflict;
    }
    async updateInterviewResult(trainerId, adminId, feedback) {
        console.log(feedback);
        const updatedData = await this.model.findOneAndUpdate({ trainerId: trainerId, adminId: adminId }, {
            $set: {
                result: feedback,
                completed: true,
            },
        }, { new: true } // This returns the updated document
        );
        return updatedData;
        // return data;
        // if (!updated) {
        //   createHttpError(
        //     HttpStatus.NO_CONTENT,
        //     HttpResponse.FAILED_TO_UPDATE_INTERVIEW_FEEDBACK
        //   );
        // }
        // await PersonalizationModel.updateOne(
        //   { userId: trainerId },
        //   {
        //     $set: {
        //       "data.status": "interviewed",
        //     },
        //   }
        // );
    }
}
exports.TrainerInterviewRepository = TrainerInterviewRepository;
//# sourceMappingURL=TrainerInterview.repository.js.map