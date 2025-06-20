import { ITrainerService } from "@/services/interface/ITrainer.service";
import { ITrainerController } from "../interface/ITrainer.controller";
import { Response, NextFunction } from "express";
import { createHttpError } from "@/utils";
import { userData } from "@/middleware/verify.token.middleware";
import { HttpStatus } from "@/constants/status.constant";

export class TrainerController implements ITrainerController {
  constructor(private _trainerService: ITrainerService) {}

  async getPendingApplicationDetails(
    req: userData,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      
      const trainerId = req.user.id;
      if (!trainerId) {
        throw createHttpError(401, "User not authenticated");
      }
      const result = await this._trainerService.getPendingApplicationDetails(trainerId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async submitApplication(
    req: userData,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createHttpError(401, "User not authenticated");
      }

      await this._trainerService.submitApplication(
        req.files as Express.Multer.File[],
        req.body,
        userId
      );

      res
        .status(200)
        .json({ message: "Trainer application submitted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getProfileData(req:userData, res:Response, next:NextFunction):Promise<void>{
    try {
      const userId = req.user.id;
      const result = await this._trainerService.getProfileData(userId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
   async updateProfilePicture(req: userData, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const file = req.file;

      console.log(file);
      if (!file) {
        return next(createHttpError(400, "No file uploaded"));
      }

      const { signedUrl} = await this._trainerService.updateProfilePicture(userId, file);

      res.status(200).json({
        message: "Profile picture updated successfully",
        profilePicture: signedUrl,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfileData(req:userData, res:Response, next:NextFunction): Promise<void>{
    try {
      const userId = req.user.id;
      const { basicInfo, professionalSummary, sampleMaterials } = req.body;
      const files = req.files as Express.Multer.File[];

      // Parse new certifications
      const newCertifications = [];
      files.forEach((file, index) => {
        // console.log('fils',file,req.body.newCertifications[index].name);
        const certName =req.body.newCertifications[index].name;
        const certIssuer = req.body.newCertifications[index].issuer;
        if (certName && certIssuer) {
          newCertifications.push({
            name: certName,
            issuer: certIssuer,
            proofFile: file,
            id: `cert_${Date.now()}_${index}`,
          });
        }
      });

      console.log('basicinfo',basicInfo,professionalSummary,sampleMaterials);
      console.log('certificates',newCertifications);
      const updatedTrainer = await this._trainerService.updateTrainerProfile(
        userId,
        {
          basicInfo,
          professionalSummary,
          sampleMaterials,
          newCertifications,
          files,
        },
        userId
      );
      res.status(HttpStatus.OK).json({success:true});
    } catch (error) {
      next(error);
    }
  }
}
