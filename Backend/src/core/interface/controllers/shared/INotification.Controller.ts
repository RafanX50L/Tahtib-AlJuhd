import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Response } from "express";

export interface INotificationController {
    getNotifications(req: AddedRequest, res: Response, next: NextFunction) : Promise<void>;
    getBasicDetails( req: AddedRequest, res: Response, next: NextFunction) : Promise<void>;
    getLastFiveNotifications(req: AddedRequest, res: Response, next: NextFunction) : Promise<void>; 
    markAsRead(req: AddedRequest, res: Response, next: NextFunction) : Promise<void>;
    markAllAsRead(req: AddedRequest, res: Response, next: NextFunction) : Promise<void>;
    deleteNotification(req: AddedRequest, res: Response, next: NextFunction) : Promise<void>; 
}