import mongoose from "mongoose";
import { uploadToS3 } from "@/utils/s3Storage.utils";
import createHttpError from "http-errors";
import { ITrainerService } from "../interface/ITrainer.service";
import { ITrainerRepository } from "@/repositories/interface/ITrainer.repository";
import { TrainerSchema } from "@/models/implementation/trainer/sample";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response-message.constant";

export interface TrainerData {
  role?: "trainer";
  basicInfo: {
    phoneNumber: string;
    location: string;
    timeZone: string;
    dateOfBirth?: Date;
    age?: number;
    gender?: "male" | "female" | "other";
    profilePhotoId?: mongoose.Types.ObjectId;
  };
  professionalSummary: {
    yearsOfExperience: number;
    certifications: Array<{
      name: string;
      issuer: string;
      proofFileId?: mongoose.Types.ObjectId;
    }>;
    specializations: string[];
    coachingType: Array<"one-on-one" | "Group" | "hybrid">;
    platformsUsed?: string[];
  };
  sampleMaterials: {
    demoVideoLink: string;
    portfolioLinks?: string[];
    resumeFileId?: mongoose.Types.ObjectId;
  };
  availability: {
    weeklySlots: Array<{
      day:
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday"
        | "Sunday";
      startTime: string;
      endTime: string;
    }>;
    engagementType: "full-time" | "part-time" | "contract" | "freelance";
  };
  evaluation?: {
    communicationSkills?: number;
    technicalKnowledge?: number;
    coachingStyle?: number;
    confidencePresence?: number;
    brandAlignment?: number;
    equipmentQuality?: number;
    notes?: string;
    evaluatedBy?: mongoose.Types.ObjectId;
    evaluatedAt?: Date;
  };
  status:
    | "applied"
    | "interview_scheduled"
    | "interviewed"
    | "approved"
    | "rejected";
}

export interface CertificationData {
  name: string;
  issuer: string;
  proofFile?: any;
  id: string;
}

export class TrainerService implements ITrainerService {
  constructor(private trainerRepository: ITrainerRepository) {}

  async getPendingApplicationDetails(trainerId: string): Promise<any> {
    const trainerData =
      await this.trainerRepository.getPendingApplicationDetails(trainerId);
    return trainerData;
  }

  async submitApplication(
    files: Express.Multer.File[],
    body: any,
    userId: string
  ): Promise<void> {
    // Validate required fields
    const requiredFields = [
      "phoneNumber",
      "location",
      "timeZone",
      "yearsOfExperience",
      "certifications",
      "specializations",
      "coachingType",
      "demoVideoLink",
      "weeklySlots",
      "engagementType",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createHttpError(400, `Missing required field: ${field}`);
      }
    }

    // // Validate timeZone
    // if (!moment.tz.zone(body.timeZone)) {
    //   throw createHttpError(400, "Invalid time zone");
    // }

    // Validate dateOfBirth
    if (body.dateOfBirth) {
      const dob = new Date(body.dateOfBirth);
      if (dob > new Date()) {
        throw createHttpError(400, "Date of birth cannot be in the future");
      }
    }

    // Parse JSON fields
    let certifications,
      specializations,
      coachingType,
      platformsUsed,
      portfolioLinks,
      weeklySlots;
    try {
      certifications = JSON.parse(body.certifications);
      specializations = JSON.parse(body.specializations);
      coachingType = JSON.parse(body.coachingType);
      platformsUsed = body.platformsUsed
        ? JSON.parse(body.platformsUsed)
        : undefined;
      portfolioLinks = body.portfolioLinks
        ? JSON.parse(body.portfolioLinks).filter((link: string) => link)
        : undefined;
      weeklySlots = JSON.parse(body.weeklySlots);
    } catch (error) {
      throw createHttpError(
        400,
        `Failed to parse JSON fields: ${error.message}`
      );
    }

    // Validate parsed data
    if (
      !Array.isArray(certifications) ||
      !certifications.every((cert: any) => cert.name && cert.issuer)
    ) {
      throw createHttpError(400, "Invalid certifications format");
    }
    if (!Array.isArray(specializations) || !specializations.length) {
      throw createHttpError(400, "Specializations must be a non-empty array");
    }
    if (
      !Array.isArray(coachingType) ||
      !coachingType.every((type: string) =>
        ["One-on-One", "Group", "Hybrid"].includes(type)
      )
    ) {
      throw createHttpError(400, "Invalid coachingType format");
    }
    if (
      !Array.isArray(weeklySlots) ||
      !weeklySlots.every(
        (slot: any) => slot.day && slot.startTime && slot.endTime
      )
    ) {
      throw createHttpError(400, "Invalid weeklySlots format");
    }

    // Initialize trainer data
    const trainerData: TrainerData = {
      role: "trainer",
      basicInfo: {
        phoneNumber: body.phoneNumber,
        location: body.location,
        timeZone: body.timeZone,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        age: body.age ? parseInt(body.age, 10) : undefined,
        gender: body.gender || undefined,
        profilePhotoId: undefined,
      },
      professionalSummary: {
        yearsOfExperience: parseInt(body.yearsOfExperience, 10),
        certifications: certifications.map((cert: any) => ({
          name: cert.name,
          issuer: cert.issuer,
          proofFileId: undefined,
        })),
        specializations,
        coachingType,
        platformsUsed,
      },
      sampleMaterials: {
        demoVideoLink: body.demoVideoLink,
        portfolioLinks,
        resumeFileId: undefined,
      },
      availability: {
        weeklySlots: weeklySlots.map((slot: any) => ({
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
        engagementType: body.engagementType,
      },
      evaluation: undefined,
      status: "applied",
    };

    console.log("Creating trainer personalization for userId:", userId);
    // Create personalization document
    const personalization =
      await this.trainerRepository.createTrainerPersonalization({
        userId,
        role: "trainer",
        data: trainerData,
      });

    // Handle file uploads
    for (const file of files) {
      const fieldName = file.fieldname;
      const fileType = file.mimetype.split("/")[1];
      const folder = fieldName.startsWith("certificationProof")
        ? "certification-proofs"
        : fieldName === "profilePhoto"
          ? "profile-photos"
          : "resumes";

      console.log(`Uploading file: ${file.originalname} to folder: ${folder}`);
      const fileUrl = await uploadToS3(file, folder);

      const trainerFile = await this.trainerRepository.createTrainerFile({
        trainerId: personalization._id.toString(),
        fileName: file.originalname,
        filePath: fileUrl,
        fileType,
      });

      // Use ObjectId directly
      const fileId = new mongoose.Types.ObjectId(trainerFile._id);

      if (fieldName === "profilePhoto") {
        trainerData.basicInfo.profilePhotoId = fileId;
      } else if (fieldName === "resume") {
        trainerData.sampleMaterials.resumeFileId = fileId;
      } else if (fieldName.startsWith("certificationProof_")) {
        const index = parseInt(fieldName.split("_")[1]);
        if (
          index >= 0 &&
          index < trainerData.professionalSummary.certifications.length
        ) {
          trainerData.professionalSummary.certifications[index].proofFileId =
            fileId;
        } else {
          console.warn(`Invalid certification index: ${index}`);
        }
      }
    }

    // Log trainer data before update
    console.log(
      "Trainer data before update:",
      JSON.stringify(trainerData, null, 2)
    );

    // Validate trainerData manually
    const modelName = `Temp_Trainer_Personalization`;
    const TempModel =
      mongoose.models[modelName] || mongoose.model(modelName, TrainerSchema);
    const tempDoc = new TempModel(trainerData);
    try {
      await tempDoc.validate();
      console.log("trainerData validated successfully");
    } catch (validationError) {
      console.error(
        "Manual validation failed:",
        JSON.stringify(validationError, null, 2)
      );
      throw createHttpError(
        400,
        `Invalid trainer data: ${validationError.message}`
      );
    }

    // Update personalization document
    try {
      await this.trainerRepository.updateTrainerPersonalization(
        personalization._id.toString(),
        {
          userId,
          role: "trainer",
          data: trainerData,
        }
      );
    } catch (error) {
      console.error(
        "Failed to update personalization:",
        JSON.stringify(error, null, 2)
      );
      throw createHttpError(
        500,
        `Failed to update personalization: ${error.message}`
      );
    }

    // Create audit log
    await this.trainerRepository.createAuditLog({
      userId,
      action: "create_trainer",
      entityType: "trainer",
      entityId: personalization._id.toString(),
      details: { message: "New trainer application submitted" },
    });
  }

  async getProfileData(userId: string): Promise<TrainerData> {
    const user = await this.trainerRepository.getProfileData(userId);
    if (!user) {
      throw createHttpError(
        HttpStatus.NO_CONTENT,
        HttpResponse.FAILED_TO_GET_PROFILE
      );
    }
    return user;
  }

  async updateProfilePicture(userId: string, file: Express.Multer.File) {
    const signedUrl = await uploadToS3(file, "profile-photos");
    const fileType = file.mimetype.split("/")[1];

    const trainerFile = await this.trainerRepository.createTrainerFile({
      trainerId: userId,
      fileName: file.originalname,
      filePath: signedUrl,
      fileType,
    });

    console.log(fileType, file.originalname, fileType);
    const updated = await this.trainerRepository.updateProfilePicture(
      userId,
      trainerFile._id
    );
    if (!updated) {
      throw new Error("Client not found");
    }
    console.log(signedUrl);

    return { signedUrl };
  }

  async updateTrainerProfile(
    trainerId: string,
    formData: {
      basicInfo: any;
      professionalSummary: any;
      sampleMaterials: any;
      newCertifications: CertificationData[];
      files: any[];
    },
    userId: string
  ): Promise<any> {
    const {
      basicInfo,
      professionalSummary,
      sampleMaterials,
      newCertifications,
      files,
    } = formData;

    console.log("file1", files[0]);
    // Process certifications
    const certificationUpdates = await Promise.all(
      newCertifications.map(async (cert, index) => {
        if (cert.proofFile) {
          const s3Url = await uploadToS3(files[index], "certification-proofs");
          const trainerFile = await this.trainerRepository.createTrainerFile({
            trainerId,
            fileName: cert.proofFile.originalname,
            filePath: s3Url,
            fileType: cert.proofFile.mimetype.split("/")[1],
          });
          return {
            name: cert.name,
            issuer: cert.issuer,
            proofFileId: trainerFile._id,
          };
        }
        return null;
      })
    );

    const validCertifications = certificationUpdates.filter(
      (cert) => cert !== null
    );

    // Fetch existing trainer
    const existingTrainer =
      await this.trainerRepository.findTrainerById(trainerId);
    if (!existingTrainer) {
      throw new Error("Trainer not found");
    }

    console.log("exis", existingTrainer);

    // Parse inputs
    const parsedBasicInfo = JSON.parse(basicInfo);
    parsedBasicInfo.profilePhotoId =
      existingTrainer.data.basicInfo.profilePhotoId; // ✅ use correct key

    const parsedProfessionalSummary = JSON.parse(professionalSummary);
    const parsedSampleMaterials = JSON.parse(sampleMaterials);

    // Merge certifications
    const existingCertifications = [
      ...existingTrainer.data.professionalSummary.certifications,
      ...validCertifications,
    ];

    // Construct update object
    const updateData = {
      data: {
        ...existingTrainer.data,

        // Force update only the changed/merged parts
        basicInfo: {
          ...existingTrainer.data.basicInfo,
          ...parsedBasicInfo,
          profilePhotoId: existingTrainer.data.basicInfo.profilePhotoId, // ensure correct key
        },
        professionalSummary: {
          ...existingTrainer.data.professionalSummary,
          ...parsedProfessionalSummary,
          certifications: existingCertifications,
        },
        sampleMaterials: {
          ...existingTrainer.data.sampleMaterials,
          ...parsedSampleMaterials,
        },

        // availability is retained from existing data
        availability: existingTrainer.data.availability,

        // Optional: ensure role stays correct
        role: "trainer",
      },
    };

    // // Update trainer
    const updatedTrainer = await this.trainerRepository.updateTrainer(
      trainerId,
      updateData
    );
    if (!updatedTrainer) {
      throw new Error("Failed to update trainer");
    }

    // // Create audit log
    // await this.trainerRepository.createAuditLog({
    //   userId,
    //   action: 'update_trainer_profile',
    //   entityType: 'trainer',
    //   entityId: trainerId,
    //   details: {
    //     updatedFields: Object.keys(updateData),
    //     newCertifications: validCertifications.map(({ name, issuer, id }) => ({ name, issuer, id })),
    //   },
    // });

    return updatedTrainer;
  }
}
