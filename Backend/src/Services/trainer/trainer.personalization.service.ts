import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { ITrainerPersonalization } from "@/core/interface/model/IPersonalization.model";
import IUser from "@/core/interface/model/IUser.model";
import { ITrainerInterviewRepository } from "@/core/interface/repositories/ITraienrInterview.repository";
import { ITrainerPersonalizationRepository } from "@/core/interface/repositories/ITrainer.personalization.repository";
import { IUserRepository } from "@/core/interface/repositories/IUser.repository";
import { IUserFileRepository } from "@/core/interface/repositories/IUserFile.repository";
import { ITrainerPersonalizationService } from "@/core/interface/services/trainer/ITrainer.Personalization.Service";
import { TrainerDTO, TrainerProfileDTO } from "@/dtos/trainer/TrainerDTO";
import { createHttpError } from "@/utils";
import logger from "@/utils/logger.utils";
import { uploadToS3 } from "@/utils/s3Storage.utils";
import { Request } from "express";
import { Types } from "mongoose";

export class TrainerPersonalizationService
  implements ITrainerPersonalizationService
{
  constructor(
    private readonly _personalizationRepository: ITrainerPersonalizationRepository,
    private readonly _userFileRepository: IUserFileRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _trainerInterviewRepository: ITrainerInterviewRepository
  ) {}
  /** Reserved for Workout plan specific methods */
  _placeholder?: never;

  async submitApplication(userId: string, req: Request): Promise<void> {
    try {
      // Parse the certifications JSON from req.body
      const certifications = JSON.parse(req.body.certifications);
      const proofFiles = req.files["certificationProofs"] || [];

      // Validate the number of proof files matches the expected count
      const expectedProofs = certifications.filter(
        (cert) => cert.hasProof
      ).length;
      if (proofFiles.length !== expectedProofs) {
        throw new Error(
          `Expected ${expectedProofs} proof files, but received ${proofFiles.length}`
        );
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
        const path = await uploadToS3(profilePhoto, "profile-photos");
        const profilePhotoDoc = await this._userFileRepository.create({
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
        const path = await uploadToS3(resume, "resume");
        const resumeDoc = await this._userFileRepository.create({
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
          const path = await uploadToS3(proofFile, "certification-proofs");
          const proofDoc = await this._userFileRepository.create({
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
      const applicationData: ITrainerPersonalization = {
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
          certifications: certifications.map((cert, index) => ({
            name: cert.name,
            issuer: cert.issuer,
            proofFileId:
              certificationProofIds.find((c) => c.certIndex === index)
                ?.proofFileId || null,
          })),
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
        status: "applied" as const, // or another default value as per your business logic
        ratings: [],
        sessions: [],
        chats: [],
      };
      // Save the application data
      const personalization = await this._personalizationRepository.create({
        userId: new Types.ObjectId(userId),
        role: "trainer",
        data: applicationData,
      });

      // Update userId in UserFile documents
      if (profilePhotoId) {
        await this._userFileRepository.update(profilePhotoId, {
          userId: personalization._id,
        });
      }
      if (resumeId) {
        await this._userFileRepository.update(resumeId, {
          userId: personalization._id,
        });
      }
      for (const certProof of certificationProofIds) {
        await this._userFileRepository.update(certProof.proofFileId, {
          userId: personalization._id,
        });
      }

      await this._userRepository.update(userId, {
        personalizationId: personalization.id,
      });

      logger.info("Application Data Saved");
      return;
    } catch (error) {
      console.error("Error processing application:", error);
      throw error;
    }
  }

  async getPendingApplicationDetails(uesrId: string) {
    logger.info("entered for data serviece");
    const { basicInfo, interviewDetailsId } = (
      await this._personalizationRepository.findOne({ userId: uesrId })
    ).data as ITrainerPersonalization;
    const interview =
      await this._trainerInterviewRepository.findById(interviewDetailsId);
    console.log("returnig data", basicInfo, interview);
    return {
      basicInfo,
      interviewDetails: interview
        ? {
            adminId: interview.adminId,
            trainerId: interview.trainerId,
            startTime: interview.startTime,
            endTime: interview.endTime,
            date: interview.date,
            roomId: interview.roomId,
            completed: interview.completed,
            result: interview.result || null,
          }
        : null,
    };

  }

  async getTrainerProfile(userId: string): Promise<TrainerProfileDTO> {
    const trainerId = (await this._userRepository.findById(new Types.ObjectId(userId))).personalizationId;
    const rawTrainerData = await this._personalizationRepository.getTrainerProfileData(trainerId.toString());
    console.log(rawTrainerData);
    if (!rawTrainerData) {
      throw createHttpError(
        HttpStatus.NO_CONTENT,
        HttpResponse.FAILED_TO_GET_PROFILE
      );
    }
    return TrainerDTO.mapToTrainerProfileDto(rawTrainerData);
  }
  async updateProfileData(userId: string, data:Partial<{name:string,location:string,phoneNumber:string}>): Promise<void> {
    // Update name if provided
    if (data.name) {
      await this._userRepository.update(userId, { name: data.name });
    }

    // Fetch user to access personalizationId
    const user = await this._userRepository.findById(new Types.ObjectId(userId)) as IUser;

    if (!user?.personalizationId) {
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
      await this._personalizationRepository.update(user.personalizationId.toString(), updateFields);
    }
  }

  async getSalary(userId: string): Promise<number> {
    const { basicInfo } = (
      await this._personalizationRepository.findOne({ userId: userId })
    ).data as ITrainerPersonalization;
    return basicInfo?.weeklySalary || 0 ;
  }

}
