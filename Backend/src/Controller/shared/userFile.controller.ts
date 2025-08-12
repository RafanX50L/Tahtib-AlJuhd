import { IUserFileService } from "@/core/interface/services/shared/IUserFile.Service";
import { IUserFileController } from "@/core/interface/controllers/common/IUserFile.controller";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { createHttpError } from "@/utils";
import { NextFunction, Response } from "express";

export class UserFileController implements IUserFileController {
  constructor(
    private readonly _userFileService: IUserFileService
  ) {}
  /** Reserved for Workout plan specific methods */
  _placeholder?: never;
  async updateProfilePicture(
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const file = req.file;
      const role = req.user?.role;

      console.log(req.file);
      if (!file) {
        return next(createHttpError(400, "No file uploaded"));
      }

      const { signedUrl } =
        await this._userFileService.updateProfilePicture(userId, file, role);

      res.status(200).json({
        message: "Profile picture updated successfully",
        profilePicture: signedUrl,
      });
    } catch (error) {
      next(error);
    }
  }
}
