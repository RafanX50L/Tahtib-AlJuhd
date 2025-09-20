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

  async findByUserId(userId: string): Promise<IPersonalization | null> {
    return await PersonalizationModel.findOne({ userId: new Types.ObjectId(userId) });
  }

  async updateTrainerData(trainerId: string, updates: Partial<ITrainerPersonalization>): Promise<IPersonalization> {
    const personalization = await PersonalizationModel.findOneAndUpdate(
      { userId: new Types.ObjectId(trainerId), role: 'trainer' },
      { $set: { data: { ...updates } } },
      { new: true }
    );
    if (!personalization) throw new Error('Trainer personalization not found');
    return personalization;
  }

  async updateClientData(clientId: string, updates: Partial<IClientPersonalization>): Promise<IPersonalization> {
    const personalization = await PersonalizationModel.findOneAndUpdate(
      { userId: new Types.ObjectId(clientId), role: 'client' },
      { $set: { data: { ...updates } } },
      { new: true }
    );
    if (!personalization) throw new Error('Client personalization not found');
    return personalization;
  }

}
