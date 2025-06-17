export interface ITrainerService {
  submitApplication(files: Express.Multer.File[], body: any, userId: string): Promise<void>;
}
