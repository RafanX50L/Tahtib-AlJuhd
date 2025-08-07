import { ITrainerInterview } from "@/core/interface/model/ITrainerInterview.model";
import { IUserFile } from "@/core/interface/model/IUserFile.model";
import { generateSignedUrl } from "@/utils/s3Storage.utils";
import { Types } from "mongoose";

// Cert interface for better reuse
export interface ICertification {
  name: string;
  issuer: string;
  proofFileId?: Types.ObjectId | string;
}

export interface IRawTrainer {
  _id: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;

  user: {
    _id: Types.ObjectId | string;
    name: string;
    email: string;
  };

  data: {
    basicInfo?: {
      phoneNumber?: string;
      location?: string;
      dateOfBirth?: string;
      gender?: string;
      timeZone?: string;
      profilePictureId?: Types.ObjectId | string;
    };
    professionalSummary?: {
      yearsOfExperience?: number;
      certifications?: ICertification[];
      specializations?: string[];
      coachingType?: string[];
      platformsUsed?: string[];
    };
    sampleMaterials?: {
      resumeFileId?: Types.ObjectId | string;
      demoVideoLink?: string;
      portfolioLinks?: string[];
    };
    availability?: {
      weeklySlots?: {
        day: string;
        startTime: string;
        endTime: string;
      }[];
      engagementType?: string;
    };
    interviewDetailsId: Types.ObjectId
    status:string
  };

  profilePicture?: {
    filePath: string;
  };

  resumeFile?: {
    filePath: string;
  };

  certificationProof?: {
    _id: Types.ObjectId | string;
    filePath: string;
  }[];
  interviewDetails?:ITrainerInterview
}

type TrainerDTO = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  dateOfBirth: string;
  gender: string;
  timeZone: string;
  yearsOfExperience: number;
  certifications: {
    name: string;
    issuer: string;
    filePath: string | null;
  }[];
  specializations: string[];
  coachingType: string[];
  platformsUsed: string[];
  demoVideoLink: string;
  portfolioLinks: string[];
  availability: {
    weeklySlots: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
    engagementType: string;
  };
  profilePhoto: string | null;
  resumeFile: string | null;
  interviewDetails?:Partial<ITrainerInterview>;
  status:string;
};

export interface TrainerCardDTO {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  profilePhoto: string;
  specializations: string[];
  yearsOfExperience: number;
  weeklySalary: number;
  phoneNumber: string;
  location: string;
  certifications: {
    name: string;
    issuer: string;
    proofFile?: string;
  }[];
}


export class AdminTrainerDTO {
  static async toTrainerDTO(raw: IRawTrainer): Promise<TrainerDTO> {
    const basicInfo = raw.data?.basicInfo || {};
    const professional = raw.data?.professionalSummary || {};
    const sample = raw.data?.sampleMaterials || {};
    const availability = raw.data?.availability || {};
    console.log(raw.interviewDetails[0].result);

    const certifications = await Promise.all(
      (professional.certifications || []).map(async (cert) => {
        const proof = (Array.isArray(raw.certificationProof) ? raw.certificationProof : [raw.certificationProof])
          .find((file) => file._id.toString() === cert.proofFileId?.toString());

        return {
          name: cert.name,
          issuer: cert.issuer,
          filePath: proof?.filePath ? await generateSignedUrl(proof.filePath) : null,
        };
      })
    );

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
      profilePhoto: raw.profilePicture?.filePath ? await generateSignedUrl(raw.profilePicture.filePath) : null,
      resumeFile: raw.resumeFile?.filePath ? await generateSignedUrl(raw.resumeFile.filePath) : null,
      interviewDetails: raw.interviewDetails ? {
        adminId: raw.interviewDetails[0].adminId,
        trainerId: raw.interviewDetails[0].trainerId,
        startTime: raw.interviewDetails[0].startTime,
        endTime: raw.interviewDetails[0].endTime,
        date: raw.interviewDetails[0].date,
        roomId: raw.interviewDetails[0].roomId,
        completed: raw.interviewDetails[0].completed,
        result: raw.interviewDetails[0].result ? {
          communicationSkills: raw.interviewDetails[0].result.communicationSkills || null,
          technicalKnowledge: raw.interviewDetails[0].result.technicalKnowledge || null,
          coachingStyle: raw.interviewDetails[0].result.coachingStyle || null,
          confidencePresence: raw.interviewDetails[0].result.confidencePresence || null,
          brandAlignment: raw.interviewDetails[0].result.brandAlignment || null,
          equipmentQuality: raw.interviewDetails[0].result.equipmentQuality || null,
          notes: raw.interviewDetails[0].result.notes || null,
        } :null,
      }:null,
      status: raw.data.status,
    };
  }

  static async toTrainerListDTO(payload: { data: IRawTrainer[]; totalCount: number }) {
    const trainers = await Promise.all(payload.data.map((trainer) => this.toTrainerDTO(trainer)));
    return {
      trainers,
      totalCount: payload.totalCount,
    };
  }
  static async mapApprovedTrainerToDTO(raw): Promise<TrainerCardDTO> {
  const user = raw.user;
  const basicInfo = raw.data?.basicInfo || {};
  const profSummary = raw.data?.professionalSummary || {};

  // Build map of proofFileId => filePath
  const certProofEntries = await Promise.all(
    (raw.certificationProof || []).map(async (file: IUserFile) => [
      file._id?.toString(),
      await generateSignedUrl(file.filePath),
    ])
  );

  const certProofMap = new Map(certProofEntries);


  const certifications = (profSummary.certifications || []).map((cert: ICertification) => ({
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
    profilePhoto: await generateSignedUrl(raw.profilePicture?.filePath) || "",
    specializations: profSummary.specializations || [],
    yearsOfExperience: profSummary.yearsOfExperience || 0,
    weeklySalary: basicInfo.weeklySalary || 0,
    phoneNumber: basicInfo.phoneNumber || "",
    location: basicInfo.location || "",
    certifications,
  };
}

}