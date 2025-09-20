import { NextFunction, Request, Response } from "express";

export interface IAdminClientController{
    placeholder?:never
    getAllClient(req:Request, res:Response, next:NextFunction):Promise<void>;
}