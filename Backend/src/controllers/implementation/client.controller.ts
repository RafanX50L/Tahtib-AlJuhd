import { IClientService } from "../../services/interface/IClient.service";
import { IClientController } from "../interface/IClient.controller";
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response-message.constant";
import { Request, Response, NextFunction } from "express";
import { userData } from "@/middleware/verify.token.middleware";
import { createHttpError } from "@/utils";

export class ClientController implements IClientController {
  constructor(private _clientService: IClientService) {}

  async generateFitnessPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = req.body;
      await this._clientService.generateFitnessPlan(userData);
      res.status(HttpStatus.CREATED).json({
        message: HttpResponse.GENERATING_FITNESS_PLAN_SUCCESSFULL,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBasicFitnessPlan(
    req: userData,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const basicPlan = await this._clientService.getBasicFitnessPlan(userId);
      res.status(HttpStatus.OK).json(basicPlan);
    } catch (error) {
      next(error);
    }
  }

  async getWorkouts(
    req: userData,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const week = req.params.week as string;
      console.log("Week:", week);
      const userId = req.user?.id as string;
      const workouts = await this._clientService.getWorkouts(userId, week);
      res.status(HttpStatus.OK).json(workouts);
    } catch (error) {
      next(error);
    }
  }

  async getWeekCompletionStatus(
    req: userData,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const weekCompletionStatus =
        await this._clientService.getWeekCompletionStatus(userId);
      res.status(HttpStatus.OK).json(weekCompletionStatus);
    } catch (error) {
      next(error);
    }
  }

  async updateDayCompletionStatus(
    req: userData,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const { week, day, workout } = req.body;
      console.log("body", req.body);
      console.log(
        "User ID:",
        userId,
        "Week:",
        week,
        "Day:",
        day,
        "Workout:",
        workout
      );
      if (!week || !day || !workout) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: HttpResponse.INVALID_REQUEST_DATA,
        });
        return;
      }

      const workoutReport = await this._clientService.updateDayCompletionStatus(
        userId,
        week,
        day,
        workout
      );
      res.status(HttpStatus.OK).json(workoutReport);
    } catch (error) {
      next(error);
    }
  }

  async getWorkoutReport(
    req: userData,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const { week, day } = req.query;
      console.log("Week:", week, "Day:", day);
      if (!week || !day) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: HttpResponse.INVALID_REQUEST_DATA,
        });
        return;
      }

      const workoutReport = await this._clientService.getWorkoutReport(
        userId,
        week as string,
        day as string
      );
      res.status(HttpStatus.OK).json(workoutReport);
    } catch (error) {
      next(error);
    }
  }

  async getWeeklyChallenges(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const weeklyChallenges = await this._clientService.getWeeklyChallenges();
      res.status(HttpStatus.OK).json(weeklyChallenges);
    } catch (error) {
      next(error);
    }
  }

  async getChallengeById(
    req: userData,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log('challengeId', req.params.id);
    try {
      const challengeId = req.params.id;
      const userId = req.user?.id as string;
      if (!challengeId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: HttpResponse.INVALID_REQUEST_DATA,
        });
        return;
      }
      const challenge = await this._clientService.getChallengeById(
        userId,
        challengeId
      );
      res.status(HttpStatus.OK).json(challenge);
    } catch (error) {
      next(error);
    }
  }

  async joinWeeklyChallenge(
    req: userData,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const challengeId = req.params.id as string;
      if (!challengeId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: HttpResponse.INVALID_REQUEST_DATA,
        });
        return;
      }
      const result = await this._clientService.joinWeeklyChallenge(
        userId,
        challengeId
      );
      console.log("Join Challenge Result:", result);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateDayCompletionOfWeeklyChallengeStatus(
    req: userData,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const {  day, challengeId } = req.body;
      console.log("body", req.body);
      console.log(
        "User ID:",
        userId,
        "Day:",
        day,
        "Challenge ID:",
        challengeId
      );
      // if ( !day || !challengeId) {
      //   res.status(HttpStatus.BAD_REQUEST).json({
      //     message: HttpResponse.INVALID_REQUEST_DATA,
      //   });
      //   return;
      // }

      console.log("Updating day completion of weekly challenge status");
      const result = await this._clientService.updateDayCompletionOfWeeklyChallengeStatus(
        userId,
        challengeId,
        day,
      );
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

      const { signedUrl} = await this._clientService.updateProfilePicture(userId, file);

      res.status(200).json({
        message: "Profile picture updated successfully",
        profilePicture: signedUrl,
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientProfileData(req:userData, res:Response, next:NextFunction):Promise<void>{
    try {
      const userId = req.user.id;
      const result = await this._clientService.getClientProfileData(userId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateClientProfile(req:userData, res:Response, next:NextFunction):Promise<void>{
    try {
      const userId = req.user.id;
      const formdata = req.body;
      await this._clientService.updateClientProfile(userId,formdata);
      console.log('enterd to controller');
      res.status(HttpStatus.OK).json( {success:true,message: "Updated the Client Profile"});
    } catch (error) {
      next(error);
    }
  }

}
