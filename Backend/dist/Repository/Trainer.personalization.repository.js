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
import { PersonalizationModel } from "../models/Personalization.model";
import { Types } from "mongoose";
import { createHttpError } from "../utils";
import { HttpStatus } from "../constants/status.constant";
import { HttpResponse } from "../constants/response-message.constant";
export class TrainerPersonalizationRepository extends BaseRepository {
    constructor() {
        super(PersonalizationModel);
    }
    // personalization.repository.ts
    getTrainerProfileData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileData = yield this.model.aggregate([
                { $match: { _id: new Types.ObjectId(id) } },
                // Get linked user
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "personalizationId",
                        as: "trainer",
                    },
                },
                { $unwind: "$trainer" },
                // Profile Photo
                {
                    $lookup: {
                        from: "userfiles",
                        localField: "data.basicInfo.profilePictureId",
                        foreignField: "_id",
                        as: "data.basicInfo.profilePhoto",
                    },
                },
                // Resume File
                {
                    $lookup: {
                        from: "userfiles",
                        localField: "data.sampleMaterials.resumeFileId",
                        foreignField: "_id",
                        as: "data.sampleMaterials.resumeFile",
                    },
                },
                // Interview Schedules
                {
                    $lookup: {
                        from: "trainerinterviews",
                        localField: "data.interviewDetailsId",
                        foreignField: "_id",
                        as: "data.interviewDetails",
                    },
                },
                // Certification Proofs
                {
                    $lookup: {
                        from: "userfiles",
                        localField: "data.professionalSummary.certifications.proofFileId",
                        foreignField: "_id",
                        as: "certificationFiles",
                    },
                },
                // Embed proofFile in certification
                {
                    $addFields: {
                        "data.professionalSummary.certifications": {
                            $map: {
                                input: "$data.professionalSummary.certifications",
                                as: "cert",
                                in: {
                                    name: "$$cert.name",
                                    issuer: "$$cert.issuer",
                                    proofFileId: "$$cert.proofFileId",
                                    proofFile: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$certificationFiles",
                                                    as: "file",
                                                    cond: { $eq: ["$$file._id", "$$cert.proofFileId"] },
                                                },
                                            },
                                            0,
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
            ]);
            return profileData[0];
        });
    }
    getApprovedTrainers(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const skip = (page - 1) * limit;
            search = search || "";
            const pipeline = [
                {
                    $match: {
                        role: "trainer",
                        "data.status": "approved",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        let: { userId: "$userId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$userId"] },
                                    name: { $regex: search, $options: "i" },
                                },
                            },
                        ],
                        as: "user",
                    },
                },
                { $unwind: "$user" },
                // 🔹 Lookup profile photo
                {
                    $lookup: {
                        from: "userfiles",
                        localField: "data.basicInfo.profilePictureId",
                        foreignField: "_id",
                        as: "profilePicture",
                    },
                },
                {
                    $unwind: {
                        path: "$profilePicture",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // 🔹 Lookup certification proof files
                {
                    $lookup: {
                        from: "userfiles",
                        localField: "data.professionalSummary.certifications.proofFileId",
                        foreignField: "_id",
                        as: "certificationProof",
                    },
                },
                {
                    $facet: {
                        data: [{ $skip: skip }, { $limit: limit }],
                        totalCount: [{ $count: "count" }],
                    },
                },
            ];
            const result = yield this.model.aggregate(pipeline);
            const data = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
            const totalCount = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.totalCount[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
            return { data, totalCount };
        });
    }
    getPendingTrainers(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const skip = (page - 1) * limit;
            search = search || "";
            const pipeline = [
                {
                    $match: {
                        role: "trainer",
                        "data.status": { $ne: "approved" },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        let: { userId: "$userId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$userId"] },
                                    name: { $regex: search, $options: "i" },
                                },
                            },
                        ],
                        as: "user",
                    },
                },
                { $unwind: "$user" },
                // 🔹 Lookup profile photo
                {
                    $lookup: {
                        from: "userfiles",
                        localField: "data.basicInfo.profilePictureId",
                        foreignField: "_id",
                        as: "profilePicture",
                    },
                },
                {
                    $unwind: {
                        path: "$profilePicture",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // 🔹 Lookup resume file
                {
                    $lookup: {
                        from: "userfiles",
                        localField: "data.sampleMaterials.resumeFileId",
                        foreignField: "_id",
                        as: "resumeFile",
                    },
                },
                {
                    $unwind: {
                        path: "$resumeFile",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // 🔹 Lookup certification proof file
                {
                    $lookup: {
                        from: "userfiles",
                        localField: "data.professionalSummary.certifications.proofFileId",
                        foreignField: "_id",
                        as: "certificationProof",
                    },
                },
                {
                    $lookup: {
                        from: "trainerinterviews",
                        localField: "data.interviewDetailsId",
                        foreignField: "_id",
                        as: "interviewDetails",
                    },
                },
                {
                    $facet: {
                        data: [{ $skip: skip }, { $limit: limit }],
                        totalCount: [{ $count: "count" }],
                    },
                },
            ];
            const result = yield this.model.aggregate(pipeline);
            console.log(result);
            const data = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
            const totalCount = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.totalCount[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
            return { data, totalCount };
        });
    }
    updateInterviewDetails(trainerId, interviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.findOneAndUpdate({ userId: trainerId }, {
                "data.interviewDetailsId": new Types.ObjectId(interviewId),
                "data.status": "interview_scheduled",
            });
        });
    }
    updateTrainerStatus(trainerId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.updateOne({ userId: trainerId }, {
                $set: {
                    "data.status": status,
                },
            }).lean();
        });
    }
    approveTrainer(trainerId, salary) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield PersonalizationModel.findOneAndUpdate({ userId: trainerId }, {
                $set: {
                    "data.status": "approved",
                    "data.basicInfo.weeklySalary": salary,
                },
            }, { new: true }).lean();
            if (!updated) {
                createHttpError(HttpStatus.NOT_FOUND, HttpResponse.FAILED_TO_UPDATE_TRAINER_STATUS);
            }
            return updated;
        });
    }
    updateProfilePictureId(clientId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const personalData = yield this.model.findOneAndUpdate({ userId: clientId }, { "data.basicInfo.profilePictureId": id }, { upsert: true, new: true });
            if (!personalData) {
                throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.SERVER_ERROR);
            }
            return personalData;
        });
    }
    getAvailableTrainer(currentTrainerId, page, limit, search, specialty) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const skip = (page - 1) * limit;
            const matchStage = {
                role: "trainer",
                "data.status": "approved"
            };
            if (currentTrainerId) {
                matchStage.userId = { $ne: new Types.ObjectId(currentTrainerId) };
            }
            const pipeline = [
                { $match: matchStage },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $lookup: {
                        from: "userfiles",
                        localField: "data.basicInfo.profilePictureId",
                        foreignField: "_id",
                        as: "profilePicture"
                    }
                },
                { $unwind: "$user" }
            ];
            // Search filter on user.name (case-insensitive)
            if (search) {
                pipeline.push({
                    $match: {
                        "user.name": { $regex: search, $options: "i" }
                    }
                });
            }
            // Specialty filter on data.professionalSummary.specializations
            if (specialty) {
                pipeline.push({
                    $match: {
                        "data.professionalSummary.specializations": { $in: [specialty] }
                    }
                });
            }
            // // Sort and paginate
            pipeline.push({ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit });
            // Total count for pagination
            const countPipeline = [...pipeline];
            countPipeline.splice(countPipeline.findIndex(stage => "$skip" in stage), countPipeline.length); // remove skip/limit
            countPipeline.splice(countPipeline.findIndex(stage => "$sort" in stage), 1); // remove sort
            countPipeline.push({ $count: "total" });
            const [trainers, totalResult] = yield Promise.all([
                this.model.aggregate(pipeline),
                this.model.aggregate(countPipeline)
            ]);
            const total = ((_a = totalResult[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
            return {
                trainers,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total
            };
        });
    }
}
;
//# sourceMappingURL=Trainer.personalization.repository.js.map