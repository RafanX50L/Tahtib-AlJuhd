import { Request, Response, NextFunction } from "express";

export interface IAdminController {
    getAllClients(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateClientStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllTrainers(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateTrainerStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    
}