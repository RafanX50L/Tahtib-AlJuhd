import { ITrainerService } from "@/services/interface/ITrainer.service";
import { ITrainerController } from "../interface/ITrainer.controller";
import {  Response, NextFunction } from "express";
import { createHttpError } from "@/utils";
import { userData } from "@/middleware/verify.token.middleware";

export class TrainerController implements ITrainerController {
  constructor(private _trainerService: ITrainerService) {}

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

      await this._trainerService.submitApplication(req.files as Express.Multer.File[], req.body, userId);

      res
        .status(200)
        .json({ message: "Trainer application submitted successfully" });
    } catch (error) {
      next(error);
    }
  }
}