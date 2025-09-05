var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class TrainerDTO {
    static mapToTrainerProfileDto(raw) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const trainer = raw.trainer;
            const data = raw.data;
            return {
                _id: trainer._id,
                name: trainer.name,
                email: trainer.email,
                evaluation: ((_b = (_a = data === null || data === void 0 ? void 0 : data.interviewDetails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.result) || null,
                basicInfo: {
                    phoneNumber: data.basicInfo.phoneNumber,
                    location: data.basicInfo.location,
                    timeZone: data.basicInfo.timeZone,
                    dateOfBirth: data.basicInfo.dateOfBirth,
                    age: data.basicInfo.age,
                    gender: data.basicInfo.gender,
                    profilePhoto: ((_d = (_c = data.basicInfo.profilePhoto) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.filePath) || null,
                    weeklySalary: data.basicInfo.weeklySalary,
                },
                professionalSummary: {
                    yearsOfExperience: data.professionalSummary.yearsOfExperience,
                    specializations: data.professionalSummary.specializations,
                    coachingType: data.professionalSummary.coachingType,
                    platformsUsed: data.professionalSummary.platformsUsed,
                    certifications: (data.professionalSummary.certifications || []).map((cert) => {
                        var _a;
                        return ({
                            name: cert.name,
                            issuer: cert.issuer,
                            proofFile: ((_a = cert.proofFile) === null || _a === void 0 ? void 0 : _a.filePath) || null,
                        });
                    }),
                },
                sampleMaterials: {
                    demoVideoLink: data.sampleMaterials.demoVideoLink,
                    portfolioLinks: data.sampleMaterials.portfolioLinks,
                    resumeFile: ((_f = (_e = data.sampleMaterials.resumeFile) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.filePath) || null,
                },
                availability: {
                    engagementType: data.availability.engagementType,
                },
            };
        });
    }
}
;
//# sourceMappingURL=TrainerDTO.js.map