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
import { TrainerDTO } from "../../dtos/trainer/TrainerDTO";
import { createHttpError } from "../../utils";
import logger from "../../utils/logger.utils";
import { uploadToS3 } from "../../utils/s3Storage.utils";
import { Types } from "mongoose";
export class TrainerPersonalizationService {
    constructor(_personalizationRepository, _userFileRepository, _userRepository, _trainerInterviewRepository) {
        this._personalizationRepository = _personalizationRepository;
        this._userFileRepository = _userFileRepository;
        this._userRepository = _userRepository;
        this._trainerInterviewRepository = _trainerInterviewRepository;
    }
    submitApplication(userId, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Parse the certifications JSON from req.body
                const certifications = JSON.parse(req.body.certifications);
                const proofFiles = req.files["certificationProofs"] || [];
                // Validate the number of proof files matches the expected count
                const expectedProofs = certifications.filter((cert) => cert.hasProof).length;
                if (proofFiles.length !== expectedProofs) {
                    throw new Error(`Expected ${expectedProofs} proof files, but received ${proofFiles.length}`);
                }
                // Extract other files
                const profilePhoto = req.files["profilePhoto"]
                    ? req.files["profilePhoto"][0]
                    : null;
                const resume = req.files["resume"] ? req.files["resume"][0] : null;
                // Save files to UserFile collection and collect their IDs
                let profilePhotoId = null;
                let resumeId = null;
                const certificationProofIds = [];
                // Save profile photo if exists
                if (profilePhoto) {
                    const path = yield uploadToS3(profilePhoto, "profile-photos");
                    const profilePhotoDoc = yield this._userFileRepository.create({
                        userId: new Types.ObjectId(userId), // Will be updated after creating personalization
                        fileName: profilePhoto.originalname,
                        filePath: path,
                        fileType: profilePhoto.mimetype,
                        purpose: "profilePhoto",
                    });
                    profilePhotoId = profilePhotoDoc._id;
                }
                // Save resume if exists
                if (resume) {
                    const path = yield uploadToS3(resume, "resume");
                    const resumeDoc = yield this._userFileRepository.create({
                        userId: new Types.ObjectId(userId), // Will be updated after creating personalization
                        fileName: resume.originalname,
                        filePath: path,
                        fileType: resume.mimetype,
                        purpose: "resume",
                    });
                    resumeId = resumeDoc._id;
                }
                // Save certification proof files and associate with certifications
                let proofIndex = 0;
                for (const cert of certifications) {
                    if (cert.hasProof) {
                        const proofFile = proofFiles[proofIndex];
                        const path = yield uploadToS3(proofFile, "certification-proofs");
                        const proofDoc = yield this._userFileRepository.create({
                            userId: new Types.ObjectId(userId), // Will be updated after creating personalization
                            fileName: proofFile.originalname,
                            filePath: path,
                            fileType: proofFile.mimetype,
                            purpose: "certification",
                        });
                        certificationProofIds.push({
                            certIndex: certifications.indexOf(cert),
                            proofFileId: proofDoc._id,
                        });
                        proofIndex++;
                    }
                }
                // Construct the application data
                const applicationData = {
                    basicInfo: {
                        phoneNumber: req.body.phoneNumber,
                        location: req.body.location,
                        timeZone: req.body.timeZone,
                        dateOfBirth: req.body.dateOfBirth || null,
                        gender: req.body.gender || null,
                        profilePictureId: profilePhotoId,
                    },
                    professionalSummary: {
                        yearsOfExperience: parseInt(req.body.yearsOfExperience),
                        certifications: certifications.map((cert, index) => {
                            var _a;
                            return ({
                                name: cert.name,
                                issuer: cert.issuer,
                                proofFileId: ((_a = certificationProofIds.find((c) => c.certIndex === index)) === null || _a === void 0 ? void 0 : _a.proofFileId) || null,
                            });
                        }),
                        specializations: JSON.parse(req.body.specializations),
                        coachingType: JSON.parse(req.body.coachingType),
                        platformsUsed: req.body.platformsUsed
                            ? JSON.parse(req.body.platformsUsed)
                            : [],
                    },
                    sampleMaterials: {
                        demoVideoLink: req.body.demoVideoLink,
                        portfolioLinks: req.body.portfolioLinks
                            ? JSON.parse(req.body.portfolioLinks)
                            : [],
                        resumeFileId: resumeId,
                    },
                    availability: {
                        weeklyRules: {},
                        slotLength: null,
                        bufferMinutes: null,
                        engagementType: req.body.engagementType,
                    },
                    status: "applied", // or another default value as per your business logic
                    ratings: [],
                    sessions: [],
                    chats: [],
                };
                // Save the application data
                const personalization = yield this._personalizationRepository.create({
                    userId: new Types.ObjectId(userId),
                    role: "trainer",
                    data: applicationData,
                });
                // Update userId in UserFile documents
                if (profilePhotoId) {
                    yield this._userFileRepository.update(profilePhotoId, {
                        userId: personalization._id,
                    });
                }
                if (resumeId) {
                    yield this._userFileRepository.update(resumeId, {
                        userId: personalization._id,
                    });
                }
                for (const certProof of certificationProofIds) {
                    yield this._userFileRepository.update(certProof.proofFileId, {
                        userId: personalization._id,
                    });
                }
                yield this._userRepository.update(userId, {
                    personalizationId: personalization.id,
                });
                logger.info("Application Data Saved");
                return;
            }
            catch (error) {
                console.error("Error processing application:", error);
                throw error;
            }
        });
    }
    getPendingApplicationDetails(uesrId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("entered for data serviece");
            const { basicInfo, interviewDetailsId } = (yield this._personalizationRepository.findOne({ userId: uesrId })).data;
            const interview = yield this._trainerInterviewRepository.findById(interviewDetailsId);
            console.log("returnig data", basicInfo, interview);
            return {
                basicInfo,
                interviewDetails: interview
                    ? {
                        adminId: interview.adminId.toString(),
                        trainerId: interview.trainerId.toString(),
                        startTime: interview.startTime,
                        endTime: interview.endTime,
                        date: interview.date,
                        roomId: interview.roomId,
                        completed: interview.completed,
                        result: interview.result || null,
                    }
                    : null,
            };
        });
    }
    getTrainerProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const trainerId = (yield this._userRepository.findById(new Types.ObjectId(userId))).personalizationId;
            const rawTrainerData = yield this._personalizationRepository.getTrainerProfileData(trainerId.toString());
            console.log(rawTrainerData);
            if (!rawTrainerData) {
                throw createHttpError(HttpStatus.NO_CONTENT, HttpResponse.FAILED_TO_GET_PROFILE);
            }
            return TrainerDTO.mapToTrainerProfileDto(rawTrainerData);
        });
    }
    updateProfileData(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Update name if provided
            if (data.name) {
                yield this._userRepository.update(userId, { name: data.name });
            }
            // Fetch user to access personalizationId
            const user = yield this._userRepository.findById(new Types.ObjectId(userId));
            if (!(user === null || user === void 0 ? void 0 : user.personalizationId)) {
                throw new Error("Personalization ID not found for user.");
            }
            const updateFields = {};
            if (data.phoneNumber) {
                updateFields['data.basicInfo.phoneNumber'] = data.phoneNumber;
            }
            if (data.location) {
                updateFields['data.basicInfo.location'] = data.location;
            }
            if (Object.keys(updateFields).length > 0) {
                yield this._personalizationRepository.update(user.personalizationId.toString(), updateFields);
            }
        });
    }
    getSalary(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { basicInfo } = (yield this._personalizationRepository.findOne({ userId: userId })).data;
            return (basicInfo === null || basicInfo === void 0 ? void 0 : basicInfo.weeklySalary) || 0;
        });
    }
}
//# sourceMappingURL=trainer.personalization.service.js.map