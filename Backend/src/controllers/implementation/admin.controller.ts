import { HttpStatus } from "../../constants/status.constant";
import { IAdminController } from "../interface/IAdminController";
import { IAdminService } from "../../services/interface/IAdmin.service";
import { NextFunction, Response, Request } from "express";
import { userData } from "../../middleware/verify.token.middleware";

export class AdminController implements IAdminController {
  constructor(private adminService: IAdminService) {}

  async getAllClients(
    req: userData,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userid = req.user?.id as string;
      const clients = await this.adminService.getAllClients(userid);
      // console.log(clients);
      res.status(HttpStatus.OK).json([clients]);
    } catch (error) {
      next(error);
    }
  }

  async updateClientStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {id,status} = req.body;
      // console.log(id,status);
      const clients = await this.adminService.updateClientStatus(id,status);
      res.status(HttpStatus.OK).json([clients]);
    } catch (error) {
      next(error);
    }
  }

  async getAllTrainers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainers = await this.adminService.getAllTrainers();
      // console.log(trainers);
      res.status(HttpStatus.OK).json(trainers);
    } catch (error) {
      next(error);
    }
  }

  async updateTrainerStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {id,status} = req.body;
      // console.log(id,status);
      const clients = await this.adminService.updateTrainertatus(id,status);
      res.status(HttpStatus.OK).json([clients]);
    } catch (error) {
      next(error);
    }
  }
}