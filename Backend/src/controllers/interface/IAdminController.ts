import { Request, Response, NextFunction } from "express";
import { userData } from "@/middleware/verify.token.middleware";

export interface IAdminController {
    getAllClients(req: userData, res: Response, next: NextFunction): Promise<void>;
    updateClientStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllTrainers(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateTrainerStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}