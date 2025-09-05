var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseRepository } from "./base.repository";
import { TrainerInterviewModel } from "../models/TrainerInterview.model";
import { addHours, subHours } from "date-fns";
export class TrainerInterviewRepository extends BaseRepository {
    constructor() {
        super(TrainerInterviewModel);
    }
    // trainerInterview.repository.ts
    checkConflict(adminID, startTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const conflictStart = subHours(startTime, 1);
            const conflictEnd = addHours(startTime, 1);
            const conflict = yield this.model.findOne({
                adminID,
                $or: [
                    {
                        startTime: { $lt: conflictEnd },
                        endTime: { $gt: conflictStart },
                    },
                ],
            });
            return !!conflict;
        });
    }
    updateInterviewResult(trainerId, adminId, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(feedback);
            const updatedData = yield this.model.findOneAndUpdate({ trainerId: trainerId, adminId: adminId }, {
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
        });
    }
}
//# sourceMappingURL=TrainerInterview.repository.js.map