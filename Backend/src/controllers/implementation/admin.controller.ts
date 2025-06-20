import { HttpStatus } from "../../constants/status.constant";
import { IAdminController } from "../interface/IAdmin.controller";
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

  async blockOrUnblock(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
      const userId = req.body.id;
      const result = await this.adminService.blockOrUnblock(userId);
      res.status(HttpStatus.OK).json(result);
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

  async getPendingTrainers(req:Request, res:Response, next:NextFunction):Promise<void>{
    try {
      const page = req.params.page;
      console.log('entered to pending tainers');
      const pendingTrainers = await this.adminService.getPendingTrainers(Number(page));
      res.status(HttpStatus.OK).json(pendingTrainers);
    } catch (error) {
      next(error);
    }
  }

  async getApprovedTrainers(req:Request, res:Response, next:NextFunction):Promise<void>{
    try {
      const page = req.params.page;
      console.log('entered to pending tainers');
      const approvedTrainers = await this.adminService.getApprovedTrainers(Number(page));
      res.status(HttpStatus.OK).json(approvedTrainers);
    } catch (error) {
      next(error);
    }
  }

  async scheduleInterview(req:userData, res:Response, next:NextFunction):Promise<void>{
    try {
      const trainerId = req.body.id;
      const adminId = req.user.id;
      const {date,time} = req.body;
      const result = await this.adminService.scheduleInterview(trainerId,adminId,date,time);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
  async submitInterviewFeedback(req:userData, res:Response, next:NextFunction):Promise<void>{
    try {
      const trainerId = req.body.id;
      const adminId = req.user.id;
      const { feedback } = req.body;
      const result = await this.adminService.submitInterviewFeedback(trainerId,adminId,feedback);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
  async approveTrainer(req:Request, res:Response, next:NextFunction):Promise<void>{
    try {
      const trainerId = req.body.id;
      const salary = req.body.salary;
      const result = await this.adminService.approveTrainer(trainerId,salary);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
  async rejectTrainer(req:Request, res:Response, next:NextFunction):Promise<void>{
    try {
      const trainerId = req.body.id;
      const result = await this.adminService.rejectTrainer(trainerId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

}