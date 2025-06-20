import { ClientProfile } from "@/controllers/interface/IClient.controller";
import { IExercise, IWorkoutReport } from "@/models/interface/IWorkout";

export interface IClientService {
  generateFitnessPlan(userData);
  getBasicFitnessPlan(userId: string);
  getWorkouts(userId: string, week: string);
  getWeekCompletionStatus(userId: string);
  updateDayCompletionStatus(
    userId: string,
    week: string,
    day: string,
    workout: IExercise[]
  ): Promise<IWorkoutReport>;
  getWorkoutReport(
    userId: string,
    week: string,
    day: string
  ): Promise<IWorkoutReport | null>;
  getWeeklyChallenges();
  getChallengeById(userId: string, challengeId: string);
  joinWeeklyChallenge(userId: string, challengeId: string);
  updateDayCompletionOfWeeklyChallengeStatus(
     userId: string,
    challengeId: string,
    dayIndex: number,
  );
  getClientProfileData(userId:string);
  updateProfilePicture(userId: string, file: Express.Multer.File);
  updateClientProfile(userId:string,formdata:ClientProfile):Promise<void>;
}
