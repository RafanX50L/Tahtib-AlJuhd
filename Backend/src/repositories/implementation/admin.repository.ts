import {
  TrainerInterviewModel,
  TrainerInterviewSchedule,
} from "@/models/implementation/TrainerInterview";
import { IUserModel, UserModel } from "../../models/implementation/user.model";
import { BaseRepository } from "../base.repository";
import { IAdminRepository } from "../interface/IAdmin.respository";
import { addHours, subHours } from "date-fns";
import { PersonalizationModel } from "@/models/implementation/personalization.model";
import { createHttpError } from "@/utils";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response-message.constant";

export class AdminRepository
  extends BaseRepository<IUserModel>
  implements IAdminRepository
{
  constructor() {
    super(UserModel);
  }

  async findAllClientsWithPersonalization() {
    try {
      return await this.model
        .find({ role: "client" })
        .populate("personalization");
    } catch (error) {
      console.error("Error finding clients", error);
      throw new Error("Error finding clients");
    }
  }

  async updateStatusWithId(id: string, status: string) {
    try {
      return await this.model.findByIdAndUpdate(id, {
        $set: { status: status },
      });
    } catch (error) {
      console.error("Error finding clients", error);
      throw new Error("Error finding clients");
    }
  }

  async findAllTrainersWithPersonalization() {
    try {
      // return await this.model.find({role:'trainer'}).populate('personalization');
      return await this.model.find({ role: "trainer" }).populate({
        path: "personalization",
        populate: [
          {
            path: "data.basicInfo.profilePhotoId",
            model: "TrainerFile",
          },
          {
            path: "data.professionalSummary.certifications.proofFileId",
            model: "TrainerFile",
          },
          {
            path: "data.sampleMaterials.resumeFileId",
            model: "TrainerFile",
          },
        ],
      });
    } catch (error) {
      console.error("Error finding clients", error);
      throw new Error("Error finding clients");
    }
  }

  // async updateStatusWithId(id:string,status:boolean){
  //     try{
  //         return await this.model.findByIdAndUpdate(id, { $set: { isBlocked: status } });
  //     }catch(error){
  //         console.error('Error finding clients',error);
  //         throw new Error("Error finding clients");
  //     }
  // }

  async IsBlocked(id: string) {
    try {
      return await this.isBlocked(id);
    } catch (error) {
      console.error("Error finding clients", error);
      throw new Error("Error finding clients");
    }
  }

  async getPendingTrainers(start: number, limit: number) {
    try {
      // return await this.model.find({role:'trainer'}).populate('personalization');
      const pendingTrainers = await this.model.aggregate([
        {
          $match: { role: "trainer" },
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
          $match: {
            "personalization.data.status": { $ne: "approved" },
          },
        },
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
                input:
                  "$personalization.data.professionalSummary.certifications",
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
        { $skip: start },
        { $limit: limit },
      ]);

      // console.log("pending trainers", JSON.stringify(pendingTrainers));

      const user = pendingTrainers.map((trainer) => ({
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
    } catch (error) {
      console.error("Error finding clients", error);
      throw new Error("Error finding clients");
    }
  }
  async getApprovedTrainers(start: number, limit: number) {
    try {
      // return await this.model.find({role:'trainer'}).populate('personalization');
      const approvedTrainers = await this.model.aggregate([
        {
          $match: { role: "trainer" },
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
          $match: {
            "personalization.data.status":  "approved" ,
          },
        },
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
                input:
                  "$personalization.data.professionalSummary.certifications",
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
        { $skip: start },
        { $limit: limit },
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
          profilePhoto: trainer.personalization.data.basicInfo.profilePhoto[0].filePath,
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
    } catch (error) {
      console.error("Error finding clients", error);
      throw new Error("Error finding clients");
    }
  }

  async scheduleInterview(
    trainerID: string,
    adminID: string,
    date: Date | string,
    time: string
  ) {
    try {
      const parsedDate = new Date(date); // Convert string to Date
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format received");
      }

      console.log("date,time", parsedDate, time);

      const dateString = parsedDate.toISOString().split("T")[0];
      const startTime = new Date(`${dateString}T${time}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const conflictStart = subHours(startTime, 1);
      const conflictEnd = addHours(startTime, 1);

      const conflict = await TrainerInterviewModel.findOne({
        adminID,
        $or: [
          {
            startTime: { $lt: conflictEnd },
            endTime: { $gt: conflictStart },
          },
        ],
      });

      if (conflict) {
        throw new Error("This time overlaps with another scheduled interview.");
      }

      const interviewDetails = await TrainerInterviewModel.create({
        adminID,
        trainerID,
        startTime,
        endTime,
        date: new Date(dateString),
        roomID: "room_" + Math.random().toString(36).substring(2, 10),
      });

      const updated = await PersonalizationModel.updateOne(
        { userId: trainerID },
        {
          $set: {
            "data.interviewDetails": interviewDetails._id,
            "data.status": "interview_scheduled",
          },
        }
      );
      console.log("upated", updated);

      return { success: true, message: "Interview scheduled successfully." };
    } catch (error) {
      console.error("Error scheduling interview", error);
      throw new Error("Could not schedule interview.");
    }
  }

  async submitInterviewFeedback(
    trainerId: string,
    adminId: string,
    feedback: TrainerInterviewSchedule["result"]
  ) {
    const updated = await TrainerInterviewModel.updateOne(
      { trainerID: trainerId, adminID: adminId },
      {
        $set: {
          result: feedback,
          completed: true,
        },
      },
      { new: true }
    );

    if (!updated) {
      createHttpError(
        HttpStatus.NO_CONTENT,
        HttpResponse.FAILED_TO_UPDATE_INTERVIEW_FEEDBACK
      );
    }

    await PersonalizationModel.updateOne(
      { userId: trainerId },
      {
        $set: {
          "data.status": "interviewed",
        },
      }
    );

    return { success: true, message: "Feedback Updated Successfull." };
  }
  async approveTrainer(trainerId: string, salary: number) {
    console.log('salary',salary);
    const updated = await PersonalizationModel.updateOne(
      { userId: trainerId },
      {
        $set: {
          "data.status": "approved",
          "data.basicInfo.weeklySalary":salary,
        },
      },
      { new: true }
    );

    if (!updated) {
      createHttpError(
        HttpStatus.NOT_FOUND,
        HttpResponse.FAILED_TO_UPDATE_TRAINER_STATUS
      );
    }

    return { success: true, message: "Feedback Updated Successfull." };
  }
  async rejectTrainer(trainerId: string) {
    const updated = await PersonalizationModel.updateOne(
      { userId: trainerId },
      {
        $set: {
          "data.status": "rejected",
       },
      },
      { new: true }
    );

    if (!updated) {
      createHttpError(
        HttpStatus.NOT_FOUND,
        HttpResponse.FAILED_TO_UPDATE_TRAINER_STATUS
      );
    }

    return { success: true, message: "Feedback Updated Successfull." };
  }
}
