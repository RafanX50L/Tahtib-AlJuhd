import { BaseRepository } from "./base.repository";
import { PersonalizationModel } from "@/models/Personalization.model";
import {
  IAdminPersonalization,
  IClientPersonalization,
  IPersonalization,
  ITrainerPersonalization,
} from "@/core/interface/model/IPersonalization.model";
import { IPersonalizationRepository } from "@/core/interface/repositories/IPersonalization.repository";
import { Types } from "mongoose";
import { createHttpError } from "@/utils";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response-message.constant";
import {  ClientProfileData } from "@/core/interface/services/client/IClient.Personalization.Service";

export class PersonalizationRepository
  extends BaseRepository<IPersonalization>
  implements IPersonalizationRepository
{
  constructor() {
    super(PersonalizationModel);
  }
  // async createPersonalization(
  //   personalizationData: Partial<
  //     IClientPersonalization | ITrainerPersonalization | IAdminPersonalization
  //   >,
  //   userId: string,
  //   userRole: "client" | "trainer" | "admin"
  //   // session?: ClientSession
  // ) {
  //   /**  
  //     Create or update personalization document
  //    */
  //   return (await this.model.findOneAndUpdate(
  //     { userId: userId, role: "client" },
  //     {
  //       $set: {
  //         role: userRole,
  //         data: personalizationData,
  //         updatedAt: new Date(),
  //       },
  //     },
  //     { new: true, upsert: true /*session*/ }
  //   )) as IPersonalization;
  // }

  async updatePersonalizationById(
    id: string,
    personalization:
      | IClientPersonalization
      | ITrainerPersonalization
      | IAdminPersonalization
  ): Promise<IPersonalization | null> {
    return await this.model.findByIdAndUpdate(
      id,
      { personalization },
      { new: true }
    );
  }

  async getPersonalization(userId: string) {
    return this.findOne({ userId });
  }

  async getClientPersonalizationPopulatedProfilePicture(
    userId: string
  ): Promise<IPersonalization> {
    return await this.model
      .findById(new Types.ObjectId(userId))
      .populate("data.userData.profilePictureId");
  }

  async updateProfilePictureId(clientId: string, signedUrl: string) {
    console.log('fndfij');
    const data = await this.model.findOne({userId:clientId});
    console.log('data',data);
    const personalData = await this.model.findOneAndUpdate(
      { userId: clientId },
      { "data.userData.profilePictureId": signedUrl },
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

  async updateClientProfileData(userId: string, formdata: ClientProfileData) {
    return await this.model.findOneAndUpdate(
      { userId: userId },
      { $set: { 'data.userData.phoneNumber': formdata.phoneNumber,'data.userData.address':formdata.address } },
      { new: true } // optional: returns the updated document
    );
  }

  async updateClientWorkoutCompletionCounter(userId:string){
    return await this.model.findOneAndUpdate(
      { userId },
      { $inc: { "data.userData.workoutsCompletedIn28Days": 1 } },
      { new: true, runValidators: true }
    );
  }

}
