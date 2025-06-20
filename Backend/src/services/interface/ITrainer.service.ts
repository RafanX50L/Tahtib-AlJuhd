import { CertificationData, TrainerData } from "../implementation/Trainer.service";

export interface ITrainerService {
  getPendingApplicationDetails(trainerId: string): Promise<any>;
  submitApplication(
    files: Express.Multer.File[],
    body: any,
    userId: string
  ): Promise<void>;
  getProfileData(userId: string): Promise<TrainerData>;
  updateProfilePicture(userId: string, file: Express.Multer.File);
  updateTrainerProfile(
    trainerId: string,
    formData: {
      basicInfo: any;
      professionalSummary: any;
      sampleMaterials: any;
      newCertifications: CertificationData[];
      files: any[];
    },
    userId: string
  ): Promise<any>;
}
