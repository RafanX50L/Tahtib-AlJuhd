import { IUserModel, UserModel } from "../../models/implementation/user.model";
import { BaseRepository } from "../base.repository";
import { IAdminRepository } from "../interface/IAdmin.respository";

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

    async updateStatusWithId(id:string,status:boolean){
        try{
            return await this.model.findByIdAndUpdate(id, { $set: { isBlocked: status } });
        }catch(error){
            console.error('Error finding clients',error);
            throw new Error("Error finding clients");
        }
    }
  }

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
      return await this.model.aggregate([
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
            from: "trainerfiles",
            localField:
              "personalization.data.professionalSummary.certifications.proofFileId",
            foreignField: "_id",
            as: "personalization.data.professionalSummary.certifications.proofFile",
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
    } catch (error) {
      console.error("Error finding clients", error);
      throw new Error("Error finding clients");
    }
  }
}
