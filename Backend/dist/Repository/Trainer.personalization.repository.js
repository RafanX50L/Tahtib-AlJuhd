"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerPersonalizationRepository = void 0;
const base_repository_1 = require("./base.repository");
const Personalization_model_1 = require("../models/Personalization.model");
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils");
const status_constant_1 = require("../constants/status.constant");
const response_message_constant_1 = require("../constants/response-message.constant");
class TrainerPersonalizationRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(Personalization_model_1.PersonalizationModel);
    }
    /** Reserved for Workout plan specific methods */
    _placeholder;
    // personalization.repository.ts
    async getTrainerProfileData(id) {
        const profileData = await this.model.aggregate([
            { $match: { _id: new mongoose_1.Types.ObjectId(id) } },
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
    }
    async getApprovedTrainers(page, limit, search) {
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
        const result = await this.model.aggregate(pipeline);
        const data = result[0]?.data || [];
        const totalCount = result[0]?.totalCount[0]?.count || 0;
        return { data, totalCount };
    }
    async getPendingTrainers(page, limit, search) {
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
        const result = await this.model.aggregate(pipeline);
        console.log(result);
        const data = result[0]?.data || [];
        const totalCount = result[0]?.totalCount[0]?.count || 0;
        return { data, totalCount };
    }
    async updateInterviewDetails(trainerId, interviewId) {
        await this.model.findOneAndUpdate({ userId: trainerId }, {
            "data.interviewDetailsId": new mongoose_1.Types.ObjectId(interviewId),
            "data.status": "interview_scheduled",
        });
    }
    async updateTrainerStatus(trainerId, status) {
        return await this.model.updateOne({ userId: trainerId }, {
            $set: {
                "data.status": status,
            },
        }).lean();
    }
    async approveTrainer(trainerId, salary) {
        const updated = await Personalization_model_1.PersonalizationModel.findOneAndUpdate({ userId: trainerId }, {
            $set: {
                "data.status": "approved",
                "data.basicInfo.weeklySalary": salary,
            },
        }, { new: true }).lean();
        if (!updated) {
            (0, utils_1.createHttpError)(status_constant_1.HttpStatus.NOT_FOUND, response_message_constant_1.HttpResponse.FAILED_TO_UPDATE_TRAINER_STATUS);
        }
        return updated;
    }
    async updateProfilePictureId(clientId, id) {
        const personalData = await this.model.findOneAndUpdate({ userId: clientId }, { "data.basicInfo.profilePictureId": id }, { upsert: true, new: true });
        if (!personalData) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, response_message_constant_1.HttpResponse.SERVER_ERROR);
        }
        return personalData;
    }
    async getAvailableTrainer(currentTrainerId, page, limit, search, specialty) {
        const skip = (page - 1) * limit;
        const matchStage = {
            role: "trainer",
            "data.status": "approved"
        };
        if (currentTrainerId) {
            matchStage.userId = { $ne: new mongoose_1.Types.ObjectId(currentTrainerId) };
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
        const [trainers, totalResult] = await Promise.all([
            this.model.aggregate(pipeline),
            this.model.aggregate(countPipeline)
        ]);
        const total = totalResult[0]?.total || 0;
        return {
            trainers,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        };
    }
}
exports.TrainerPersonalizationRepository = TrainerPersonalizationRepository;
;
//# sourceMappingURL=Trainer.personalization.repository.js.map