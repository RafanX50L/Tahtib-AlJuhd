import { NextFunction, Request, Response } from 'express';

export interface IClientProgressController {
  addEntry(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCurrentStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
  getGraphData(req: Request, res: Response, next: NextFunction): Promise<void>;
}


