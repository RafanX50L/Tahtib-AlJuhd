"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminTrainerDTO = void 0;
const s3Storage_utils_1 = require("../../utils/s3Storage.utils");
class AdminTrainerDTO {
    static async toTrainerDTO(raw) {
        const basicInfo = raw.data?.basicInfo || {};
        const professional = raw.data?.professionalSummary || {};
        const sample = raw.data?.sampleMaterials || {};
        const availability = raw.data?.availability || {};
        const certifications = await Promise.all((professional.certifications || []).map(async (cert) => {
            const proof = (Array.isArray(raw.certificationProof) ? raw.certificationProof : [raw.certificationProof])
                .find((file) => file._id.toString() === cert.proofFileId?.toString());
            return {
                name: cert.name,
                issuer: cert.issuer,
                filePath: proof?.filePath ? await (0, s3Storage_utils_1.generateSignedUrl)(proof.filePath) : null,
            };
        }));
        return {
            id: raw.user._id.toString(),
            name: raw.user?.name || '',
            email: raw.user?.email || '',
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
            profilePhoto: raw.profilePicture?.filePath ? await (0, s3Storage_utils_1.generateSignedUrl)(raw.profilePicture.filePath) : null,
            resumeFile: raw.resumeFile?.filePath ? await (0, s3Storage_utils_1.generateSignedUrl)(raw.resumeFile.filePath) : null,
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
    }
    static async toTrainerListDTO(payload) {
        const trainers = await Promise.all(payload.data.map((trainer) => this.toTrainerDTO(trainer)));
        return {
            trainers,
            totalCount: payload.totalCount,
        };
    }
    static async mapApprovedTrainerToDTO(raw) {
        const user = raw.user;
        const basicInfo = raw.data?.basicInfo || {};
        const profSummary = raw.data?.professionalSummary || {};
        // Build map of proofFileId => filePath
        const certProofEntries = await Promise.all((raw.certificationProof || []).map(async (file) => [
            file._id?.toString(),
            await (0, s3Storage_utils_1.generateSignedUrl)(file.filePath),
        ]));
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
            profilePhoto: await (0, s3Storage_utils_1.generateSignedUrl)(raw.profilePicture?.filePath) || "",
            specializations: profSummary.specializations || [],
            yearsOfExperience: profSummary.yearsOfExperience || 0,
            weeklySalary: basicInfo.weeklySalary || 0,
            phoneNumber: basicInfo.phoneNumber || "",
            location: basicInfo.location || "",
            certifications,
        };
    }
}
exports.AdminTrainerDTO = AdminTrainerDTO;
//# sourceMappingURL=TrainerDTO.js.map