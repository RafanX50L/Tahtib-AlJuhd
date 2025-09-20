import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/http-error.util";
import { HttpStatus } from "../constants/status.constant";
import { HttpResponse } from "../constants/response-message.constant";
import logger from "@/utils/logger.utils";

export const errorHandler = (
    err: HttpError | Error,
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message:string = HttpResponse.SERVER_ERROR;
    if (err instanceof HttpError) {
      logger.error("Errors:", err);
        statusCode = err.statusCode;
        message = err.message;
    }else{
        logger.error("unhandled error:", err);
    }
    if (res.headersSent) {
        return next(err);
    }
    res.status(statusCode).json({error: message});
};