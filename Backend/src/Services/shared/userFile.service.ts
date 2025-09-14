import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { IUserFile } from "@/core/interface/model/IUserFile.model";
import { IPersonalizationRepository } from "@/core/interface/repositories/IPersonalization.repository";
import { ITrainerPersonalizationRepository } from "@/core/interface/repositories/ITrainer.personalization.repository";
import { IUserFileRepository } from "@/core/interface/repositories/IUserFile.repository";
import {  IUserFileService } from "@/core/interface/services/shared/IUserFile.Service";
import { createHttpError } from "@/utils";
import { deleteFromS3, generateSignedUrl, uploadToS3 } from "@/utils/s3Storage.utils";
import { Types } from "mongoose";

export class UserFileService implements IUserFileService{
    constructor(
        private readonly _userFileRepository: IUserFileRepository,
        private readonly _personalizationRepository: IPersonalizationRepository,
        private readonly _trainerPersonalizationRepository: ITrainerPersonalizationRepository,
    ){}
    /** Reserved for User File specific methods */
    _placeholder?: never;
    async updateProfilePicture(userId: string, file: Express.Multer.File,role:string):Promise<{signedUrl:string}> {
      const signedUrl = await uploadToS3(file, "profile-photos");

      const existingFile = await this._userFileRepository.findLatestProfilePicture(userId);

      if (existingFile) {
        // Delete from S3
        await deleteFromS3(existingFile.filePath);

        await this._userFileRepository.deleteOne({ _id: existingFile._id });
      }

      const fileData : Partial<IUserFile> = {
        userId: new Types.ObjectId(userId),
        fileName: file.originalname,
        filePath: signedUrl,
        fileType: file.mimetype,
        purpose: "profilePhoto" as const,
        uploadedAt: new Date(),
      };

      
      const fileCreat = await this._userFileRepository.updateProfilePicture(userId, fileData);

      let updated;
      if(role === "trainer"){
        updated =
          await this._trainerPersonalizationRepository.updateProfilePictureId(
            userId,
            new Types.ObjectId(fileCreat.id)
          );
      }else if( role === "client"){
        updated = await this._personalizationRepository.updateProfilePictureId(userId,fileCreat.id);
      }
      if (!updated) {
        throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.USER_NOT_FOUND);
      }
      const url = await generateSignedUrl(signedUrl);

      return { signedUrl:url };
    }
}