import { createHttpError } from "../utils";
import { userData } from "./verify.token.middleware";
import { HttpResponse } from "../constants/response-message.constant";
import { HttpStatus } from "../constants/status.constant";
import { UserModel } from "../models/implementation/user.model";
import { NextFunction, Response } from "express";

export default  function isBlocked() {
  return async (req: userData, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          "User ID missing in token."
        );
      }

      const user = await UserModel.findById(userId);

      if (user?.isBlocked) {
        return next(
          createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.USER_IS_BLOKED)
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
