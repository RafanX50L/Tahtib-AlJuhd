import { generateSignedUrl } from "@/utils/s3Storage.utils";

export interface TrainerProfileDTO {
  _id: string;
  name: string;
  email: string;
  evaluation: string | null;
  basicInfo: {
    phoneNumber: string;
    location: string;
    timeZone: string;
    dateOfBirth: string;
    age: number;
    gender: string;
    profilePhoto: string;
    weeklySalary: number;
  };
  professionalSummary: {
    yearsOfExperience: number;
    specializations: string[];
    coachingType: string[];
    platformsUsed: string[];
    certifications: {
      name: string;
      issuer: string;
      proofFile?: string;
    }[];
  };
  sampleMaterials: {
    demoVideoLink: string;
    portfolioLinks: string[];
  };
  availability: {
    engagementType: string;
  };
}

export class TrainerDTO{
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
        profilePhoto: data.basicInfo.profilePhoto?.[0]?.filePath 
            ? await generateSignedUrl(data.basicInfo.profilePhoto[0].filePath) 
            : null,
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
};