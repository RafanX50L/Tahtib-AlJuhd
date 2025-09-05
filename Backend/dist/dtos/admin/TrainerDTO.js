var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateSignedUrl } from "../../utils/s3Storage.utils";
export class AdminTrainerDTO {
    static toTrainerDTO(raw) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const basicInfo = ((_a = raw.data) === null || _a === void 0 ? void 0 : _a.basicInfo) || {};
            const professional = ((_b = raw.data) === null || _b === void 0 ? void 0 : _b.professionalSummary) || {};
            const sample = ((_c = raw.data) === null || _c === void 0 ? void 0 : _c.sampleMaterials) || {};
            const availability = ((_d = raw.data) === null || _d === void 0 ? void 0 : _d.availability) || {};
            const certifications = yield Promise.all((professional.certifications || []).map((cert) => __awaiter(this, void 0, void 0, function* () {
                const proof = (Array.isArray(raw.certificationProof) ? raw.certificationProof : [raw.certificationProof])
                    .find((file) => { var _a; return file._id.toString() === ((_a = cert.proofFileId) === null || _a === void 0 ? void 0 : _a.toString()); });
                return {
                    name: cert.name,
                    issuer: cert.issuer,
                    filePath: (proof === null || proof === void 0 ? void 0 : proof.filePath) ? yield generateSignedUrl(proof.filePath) : null,
                };
            })));
            return {
                id: raw.user._id.toString(),
                name: ((_e = raw.user) === null || _e === void 0 ? void 0 : _e.name) || '',
                email: ((_f = raw.user) === null || _f === void 0 ? void 0 : _f.email) || '',
                phoneNumber: basicInfo.phoneNumber || '',
                location: basicInfo.location || '',
                dateOfBirth: basicInfo.dateOfBirth || '',
                gender: basicInfo.gender || '',
                timeZone: basicInfo.timeZone || '',
                yearsOfExperience: professional.yearsOfExperience || 0,
                certifications,
                specializations: professional.specializations || [],
                coachingType: professional.coachingType || [],
                platformsUsed: professional.platformsUsed || [],
                demoVideoLink: sample.demoVideoLink || '',
                portfolioLinks: sample.portfolioLinks || [],
                availability: {
                    weeklySlots: availability.weeklySlots || [],
                    engagementType: availability.engagementType || '',
                },
                profilePhoto: ((_g = raw.profilePicture) === null || _g === void 0 ? void 0 : _g.filePath) ? yield generateSignedUrl(raw.profilePicture.filePath) : null,
                resumeFile: ((_h = raw.resumeFile) === null || _h === void 0 ? void 0 : _h.filePath) ? yield generateSignedUrl(raw.resumeFile.filePath) : null,
                interviewDetails: raw.interviewDetails[0] ? {
                    adminId: raw.interviewDetails[0].adminId,
                    trainerId: raw.interviewDetails[0].trainerId,
                    startTime: raw.interviewDetails[0].startTime,
                    endTime: raw.interviewDetails[0].endTime,
                    date: raw.interviewDetails[0].date,
                    roomId: raw.interviewDetails[0].roomId,
                    completed: raw.interviewDetails[0].completed,
                    result: raw.interviewDetails && raw.interviewDetails[0].result ? {
                        communicationSkills: raw.interviewDetails[0].result.communicationSkills || null,
                        technicalKnowledge: raw.interviewDetails[0].result.technicalKnowledge || null,
                        coachingStyle: raw.interviewDetails[0].result.coachingStyle || null,
                        confidencePresence: raw.interviewDetails[0].result.confidencePresence || null,
                        brandAlignment: raw.interviewDetails[0].result.brandAlignment || null,
                        equipmentQuality: raw.interviewDetails[0].result.equipmentQuality || null,
                        notes: raw.interviewDetails[0].result.notes || null,
                    } : null,
                } : null,
                status: raw.data.status,
            };
        });
    }
    static toTrainerListDTO(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const trainers = yield Promise.all(payload.data.map((trainer) => this.toTrainerDTO(trainer)));
            return {
                trainers,
                totalCount: payload.totalCount,
            };
        });
    }
    static mapApprovedTrainerToDTO(raw) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const user = raw.user;
            const basicInfo = ((_a = raw.data) === null || _a === void 0 ? void 0 : _a.basicInfo) || {};
            const profSummary = ((_b = raw.data) === null || _b === void 0 ? void 0 : _b.professionalSummary) || {};
            // Build map of proofFileId => filePath
            const certProofEntries = yield Promise.all((raw.certificationProof || []).map((file) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                return [
                    (_a = file._id) === null || _a === void 0 ? void 0 : _a.toString(),
                    yield generateSignedUrl(file.filePath),
                ];
            })));
            const certProofMap = new Map(certProofEntries);
            const certifications = (profSummary.certifications || []).map((cert) => ({
                name: cert.name,
                issuer: cert.issuer,
                proofFile: cert.proofFileId
                    ? certProofMap.get(cert.proofFileId.toString())
                    : undefined,
            }));
            return {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                isBlocked: user.isBlocked,
                profilePhoto: (yield generateSignedUrl((_c = raw.profilePicture) === null || _c === void 0 ? void 0 : _c.filePath)) || "",
                specializations: profSummary.specializations || [],
                yearsOfExperience: profSummary.yearsOfExperience || 0,
                weeklySalary: basicInfo.weeklySalary || 0,
                phoneNumber: basicInfo.phoneNumber || "",
                location: basicInfo.location || "",
                certifications,
            };
        });
    }
}
//# sourceMappingURL=TrainerDTO.js.map