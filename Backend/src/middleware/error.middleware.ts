import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/http-error.util";
import { HttpStatus } from "../constants/status.constant";
import { HttpResponse } from "../constants/response-message.constant";

export const errorHandler = (
    err: HttpError | Error,
    _req: Request,
    res: Response,
    /* eslint-disable-next-line*/
    _next: NextFunction
) => {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message:string = HttpResponse.SERVER_ERROR;

    console.log("Error:", err);
    if (err instanceof HttpError) {
        console.log("Error:", err.statusCode, err.message);
        statusCode = err.statusCode;
        message = err.message;
    }else{
        console.log("unhandled error:", err);
    }
    res.status(statusCode).json({error: message});
};