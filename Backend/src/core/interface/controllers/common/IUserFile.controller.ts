import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Response } from "express";

export interface IUserFileController {
  /** Reserved for Workout plan specific methods */
  _placeholder?: never;
  updateProfilePicture(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
