import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { ITrainerScheduleController } from "@/core/interface/controllers/domain/ITrainerSchedule.controller";
import { ITrainerScheduleService } from "@/core/interface/services/domain/ITrainerSchedule.service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Response } from "express";

export class TrainerScheduleController implements ITrainerScheduleController {
  constructor(
    private readonly _trainerScheduleService: ITrainerScheduleService
  ) {}

  async createSchedule(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user.id;
      const scheduleData = req.body;

      const schedule = await this._trainerScheduleService.createSchedule(trainerId, scheduleData);

      res.status(HttpStatus.CREATED).json({
        message: "Schedule created successfully",
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSchedule(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user.id;
      const scheduleData = req.body;

      const schedule = await this._trainerScheduleService.updateSchedule(trainerId, scheduleData);

      res.status(HttpStatus.OK).json({
        message: "Schedule updated successfully",
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }

  async getSchedule(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user.id;

      const schedule = await this._trainerScheduleService.getSchedule(trainerId);

      res.status(HttpStatus.OK).json({
        message: HttpResponse.DATA_FETCHING_SUCCESSFULL,
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }

  async getAvailableSlots(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { trainerId } = req.params;
      const { date } = req.query;

      if (!date) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "Date parameter is required"
        });
        return;
      }

      const slots = await this._trainerScheduleService.getAvailableSlots(
        trainerId,
        new Date(date as string)
      );

      res.status(HttpStatus.OK).json({
        message: HttpResponse.DATA_FETCHING_SUCCESSFULL,
        data: slots
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleScheduleActive(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user.id;
      const { isActive } = req.body;

      const schedule = await this._trainerScheduleService.toggleScheduleActive(trainerId, isActive);

      res.status(HttpStatus.OK).json({
        message: `Schedule ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }
}
