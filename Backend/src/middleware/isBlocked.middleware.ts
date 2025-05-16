import { createHttpError } from "@/utils";
import { userData } from "./verify.token.middleware";
import { HttpResponse } from "../constants/response-message.constant";
import { HttpStatus } from "../constants/status.constant";
// import { Document, Model, Types } from "mongoose";
import { UserModel } from "../models/implementation/user.model";

export default function isBlocked(req: userData, res: Response, next) {
  const userId = req.user?.id;
  const user = UserModel.findById(userId);

  if (user && user.status === "inactive") {
    createHttpError(HttpStatus.FORBIDDEN, HttpResponse.USER_IS_BLOKED);
  } else {
    next();
  }
}
