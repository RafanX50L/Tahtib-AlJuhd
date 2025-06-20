import { TrainerData } from "@/services/implementation/Trainer.service";
import { ITrainerRepository } from "../interface/ITrainer.repository";
import { PersonalizationModel } from "@/models/implementation/personalization.model";
import { AuditLog, TrainerFile } from "@/models/implementation/trainer/sample";
import { BaseRepository } from "../base.repository";
import { IUserModel, UserModel } from "@/models/implementation/user.model";
import mongoose, { ObjectId } from "mongoose";

export interface TrainerFileData {
  trainerId: string;
  fileName: string;
  filePath: string;
  fileType: string;
}

export interface AuditLogData {
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  details: { message: string };
}

export interface PersonalizationData {
  userId: string;
  role: "trainer";
  data: TrainerData;
}

import { Types } from "mongoose";
import { createHttpError } from "@/utils";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response-message.constant";
import { c } from "vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";

interface TrainerFile {
  _id: Types.ObjectId;
  filePath: string;
}

interface Certification {
  name: string;
  issuer: string;
  proofFileId: Types.ObjectId | TrainerFile;
}

interface BasicInfo {
  phoneNumber: string;
  location: string;
  timeZone: string;
  dateOfBirth: Date;
  age: number;
  gender: string;
  weeklySalary: number;
  profilePhotoId: Types.ObjectId | TrainerFile;
}

interface SampleMaterials {
  demoVideoLink: string;
  portfolioLinks: string[];
  resumeFileId: Types.ObjectId | TrainerFile;
}

interface InterviewDetails {
  roomID: string;
  date: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  result: string;
}

interface Availability {
  weeklySlots: any[];
  engagementType: string;
}

interface PersonalizationDatas {
  status: string;
  basicInfo: BasicInfo;
  professionalSummary: {
    yearsOfExperience: number;
    specializations: string[];
    coachingType: string;
    platformsUsed: string[];
    certifications: Certification[];
  };
  sampleMaterials: SampleMaterials;
  interviewDetails: Types.ObjectId | InterviewDetails;
  availability: Availability;
}

interface Personalization {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  data: PersonalizationDatas;
}

interface Trainer {
  _id: Types.ObjectId;
  name: string;
  email: string;
  isBlocked: boolean;
  role: string;
  personalization: Types.ObjectId | Personalization;
}

export class TrainerRepository
  extends BaseRepository<IUserModel>
  implements ITrainerRepository
{
  constructor() {
    super(UserModel);
  }

  async getPendingApplicationDetails(trainerId: string): Promise<any> {
    const approvedTrainers = await this.model.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(trainerId) },
      },
      {
        $lookup: {
          from: "personalizations",
          localField: "personalization",
          foreignField: "_id",
          as: "personalization",
        },
      },
      { $unwind: "$personalization" },
      {
        $lookup: {
          from: "trainerfiles",
          localField: "personalization.data.basicInfo.profilePhotoId",
          foreignField: "_id",
          as: "personalization.data.basicInfo.profilePhoto",
        },
      },
      {
        $lookup: {
          from: "schedules",
          localField: "personalization.data.interviewDetails",
          foreignField: "_id",
          as: "personalization.data.interviewDetails",
        },
      },
      {
        $lookup: {
          from: "trainerfiles",
          localField:
            "personalization.data.professionalSummary.certifications.proofFileId",
          foreignField: "_id",
          as: "certificationFiles",
        },
      },
      {
        $addFields: {
          "personalization.data.professionalSummary.certifications": {
            $map: {
              input: "$personalization.data.professionalSummary.certifications",
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
      {
        $lookup: {
          from: "trainerfiles",
          localField: "personalization.data.sampleMaterials.resumeFileId",
          foreignField: "_id",
          as: "personalization.data.sampleMaterials.resumeFile",
        },
      },
    ]);

    // console.log("pending trainers", JSON.stringify(pendingTrainers));

    const user = approvedTrainers.map((trainer) => ({
      _id: trainer._id,
      name: trainer.name,
      email: trainer.email,
      isBlocked: trainer.isBlocked,
      role: trainer.role,
      status: trainer.personalization.data.status,
      createdAt: trainer.personalization.createdAt,
      updatedAt: trainer.personalization.updatedAt,
      interviewDetails: trainer.personalization?.data?.interviewDetails[0]
        ? {
            roomId: trainer.personalization.data.interviewDetails[0].roomID,
            interviewDate:
              trainer.personalization.data.interviewDetails[0].date,
            startTime:
              trainer.personalization.data.interviewDetails[0].startTime,
            endTime: trainer.personalization.data.interviewDetails[0].endTime,
            completed:
              trainer.personalization.data.interviewDetails[0].completed,
            result: trainer.personalization.data.interviewDetails[0].result,
          }
        : null,

      basicInfo: {
        phoneNumber: trainer.personalization.data.basicInfo.phoneNumber,
        location: trainer.personalization.data.basicInfo.location,
        timeZone: trainer.personalization.data.basicInfo.timeZone,
        dateOfBirth: trainer.personalization.data.basicInfo.dateOfBirth,
        age: trainer.personalization.data.basicInfo.age,
        gender: trainer.personalization.data.basicInfo.gender,
        profilePhoto:
          trainer.personalization.data.basicInfo.profilePhoto[0].filePath,
        weeklySalary: trainer.personalization.data.basicInfo.weeklySalary,
      },
      professionalSummary: {
        yearsOfExperience:
          trainer.personalization.data.professionalSummary.yearsOfExperience,
        specializations:
          trainer.personalization.data.professionalSummary.specializations,
        coachingType:
          trainer.personalization.data.professionalSummary.coachingType,
        platformsUsed:
          trainer.personalization.data.professionalSummary.platformsUsed,
        certifications:
          trainer.personalization.data.professionalSummary.certifications.map(
            (cert: {
              name: string;
              issuer: string;
              proofFile: { filePath: string };
            }) => ({
              name: cert.name,
              issuer: cert.issuer,
              proofFile: cert.proofFile?.filePath,
            })
          ),
      },
      sampleMaterials: {
        demoVideoLink:
          trainer.personalization.data.sampleMaterials.demoVideoLink,
        portfolioLinks:
          trainer.personalization.data.sampleMaterials.portfolioLinks,
        resumeFile:
          trainer.personalization.data.sampleMaterials.resumeFile[0].filePath,
      },
      availability: {
        weeklySlots: trainer.personalization.data.availability.weeklySlots,
        engagementType:
          trainer.personalization.data.availability.engagementType,
      },
    }));
    // console.log("user1", user);
    // console.log(
    //   pendingTrainers[0].personalization.data.professionalSummary
    //     .certifications
    // );
    return user;
  }

  async createTrainerPersonalization(data: PersonalizationData): Promise<any> {
    const personalization = new PersonalizationModel(data);
    return await personalization.save();
  }

  async updateTrainerPersonalization(
    id: string,
    data: PersonalizationData
  ): Promise<void> {
    console.log("datgsakdjfasdf", data, data.role);
    const result = await PersonalizationModel.findByIdAndUpdate(id, data, {
      runValidators: true,
      new: true,
    });
    const user = await this.findByIdAndUpdatePersonalization(
      data.userId,
      result?._id
    );
    if (!result && !user) {
      throw new Error("Personalization document not found");
    }
  }

  async createTrainerFile(data: TrainerFileData): Promise<any> {
    const trainerFile = new TrainerFile(data);
    return await trainerFile.save();
  }

  async getProfileData(userId: string) {
    const approvedTrainers = await this.model.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "personalizations",
          localField: "personalization",
          foreignField: "_id",
          as: "personalization",
        },
      },
      { $unwind: "$personalization" },
      {
        $lookup: {
          from: "trainerfiles",
          localField: "personalization.data.basicInfo.profilePhotoId",
          foreignField: "_id",
          as: "personalization.data.basicInfo.profilePhoto",
        },
      },
      {
        $lookup: {
          from: "schedules",
          localField: "personalization.data.interviewDetails",
          foreignField: "_id",
          as: "personalization.data.interviewDetails",
        },
      },
      {
        $lookup: {
          from: "trainerfiles",
          localField:
            "personalization.data.professionalSummary.certifications.proofFileId",
          foreignField: "_id",
          as: "certificationFiles",
        },
      },
      {
        $addFields: {
          "personalization.data.professionalSummary.certifications": {
            $map: {
              input: "$personalization.data.professionalSummary.certifications",
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
      {
        $lookup: {
          from: "trainerfiles",
          localField: "personalization.data.sampleMaterials.resumeFileId",
          foreignField: "_id",
          as: "personalization.data.sampleMaterials.resumeFile",
        },
      },
    ]);

    // console.log("pending trainers", JSON.stringify(pendingTrainers));

    console.log('fdsfasd',approvedTrainers[0].personalization.data.basicInfo);
    const user = approvedTrainers.map((trainer) => ({
      _id: trainer._id,
      name: trainer.name,
      email: trainer.email,
      evaluation:
        trainer?.personalization?.data?.interviewDetails[0]?.result || null,
      basicInfo: {
        phoneNumber: trainer.personalization.data.basicInfo.phoneNumber,
        location: trainer.personalization.data.basicInfo.location,
        timeZone: trainer.personalization.data.basicInfo.timeZone,
        dateOfBirth: trainer.personalization.data.basicInfo.dateOfBirth,
        age: trainer.personalization.data.basicInfo.age,
        gender: trainer.personalization.data.basicInfo.gender,
        profilePhoto:
          trainer.personalization.data.basicInfo.profilePhoto[0].filePath,
        weeklySalary: trainer.personalization.data.basicInfo.weeklySalary,
      },
      professionalSummary: {
        yearsOfExperience:
          trainer.personalization.data.professionalSummary.yearsOfExperience,
        specializations:
          trainer.personalization.data.professionalSummary.specializations,
        coachingType:
          trainer.personalization.data.professionalSummary.coachingType,
        platformsUsed:
          trainer.personalization.data.professionalSummary.platformsUsed,
        certifications:
          trainer.personalization.data.professionalSummary.certifications.map(
            (cert: {
              name: string;
              issuer: string;
              proofFile: { filePath: string };
            }) => ({
              name: cert.name,
              issuer: cert.issuer,
              proofFile: cert.proofFile?.filePath,
            })
          ),
      },
      sampleMaterials: {
        demoVideoLink:
          trainer.personalization.data.sampleMaterials.demoVideoLink,
        portfolioLinks:
          trainer.personalization.data.sampleMaterials.portfolioLinks,
      },
      availability: {
        engagementType:
          trainer.personalization.data.availability.engagementType,
      },
    }));

    return user;
  }

  async updateProfilePicture(clientId: string, PhotoId: string) {
    const personalData = await PersonalizationModel.findOneAndUpdate(
      { userId: clientId },
      { "data.basicInfo.profilePhotoId": PhotoId },
      { upsert: true, new: true }
    );

    if (!personalData) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR
      );
    }

    return personalData;
  }

  async createAuditLog(data: AuditLogData): Promise<void> {
    const auditLog = new AuditLog(data);
    await auditLog.save();
  }

  async findTrainerById(trainerId: string) {
    return PersonalizationModel.findOne({ userId: trainerId }).exec();
  }

  async updateTrainer(trainerId:string, updateData:any){
    const old = await PersonalizationModel.findOne({ userId: trainerId });
    console.log('the old data',  JSON.stringify(old));
     const updated = await PersonalizationModel.findOneAndUpdate(
      {userId:trainerId},
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
    console.log('result',JSON.stringify(updated));
    return updated;
  }
}
