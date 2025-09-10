"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerDTO = void 0;
const s3Storage_utils_1 = require("../../utils/s3Storage.utils");
class TrainerDTO {
    static async mapToTrainerProfileDto(raw) {
        const trainer = raw.trainer;
        const data = raw.data;
        return {
            _id: trainer._id,
            name: trainer.name,
            email: trainer.email,
            evaluation: data?.interviewDetails?.[0]?.result || null,
            basicInfo: {
                phoneNumber: data.basicInfo.phoneNumber,
                location: data.basicInfo.location,
                timeZone: data.basicInfo.timeZone,
                dateOfBirth: data.basicInfo.dateOfBirth,
                age: data.basicInfo.age,
                gender: data.basicInfo.gender,
                profilePhoto: await (0, s3Storage_utils_1.generateSignedUrl)(data.basicInfo.profilePhoto?.[0]?.filePath) || null,
                weeklySalary: data.basicInfo.weeklySalary,
            },
            professionalSummary: {
                yearsOfExperience: data.professionalSummary.yearsOfExperience,
                specializations: data.professionalSummary.specializations,
                coachingType: data.professionalSummary.coachingType,
                platformsUsed: data.professionalSummary.platformsUsed,
                certifications: (data.professionalSummary.certifications || []).map((cert) => ({
                    name: cert.name,
                    issuer: cert.issuer,
                    proofFile: cert.proofFile?.filePath || null,
                })),
            },
            sampleMaterials: {
                demoVideoLink: data.sampleMaterials.demoVideoLink,
                portfolioLinks: data.sampleMaterials.portfolioLinks,
                resumeFile: data.sampleMaterials.resumeFile?.[0]?.filePath || null,
            },
            availability: {
                engagementType: data.availability.engagementType,
            },
        };
    }
}
exports.TrainerDTO = TrainerDTO;
;
//# sourceMappingURL=TrainerDTO.js.map