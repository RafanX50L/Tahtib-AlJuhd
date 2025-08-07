import { NextFunction, Request, Response } from "express";

export interface IAdminCommonController{
    placeholder?:never;
    blockOrUnblock(req:Request, res:Response, next:NextFunction):Promise<void>;
}