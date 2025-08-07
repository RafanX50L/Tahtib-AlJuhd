import { NextFunction, Request, Response } from "express";

export interface IAdminClinetController{
    placeholder?:never
    getAllClinet(req:Request, res:Response, next:NextFunction):Promise<void>;
}