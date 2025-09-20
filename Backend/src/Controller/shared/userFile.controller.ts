import { IUserFileService } from "@/core/interface/services/shared/IUserFile.Service";
import { IUserFileController } from "@/core/interface/controllers/common/IUserFile.controller";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { createHttpError } from "@/utils";
import { NextFunction, Response } from "express";
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

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

      if (!file) {
        return next(createHttpError(400, "No file uploaded"));
      }

      // Validate request using DTO (for consistency with other controllers)

      const { signedUrl } =
        await this._userFileService.updateProfilePicture(userId, file, role);

      ControllerErrorHandler.handleSuccess(res, {
        message: "Profile picture updated successfully",
        profilePicture: signedUrl,
      }, "Profile picture updated successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }
}
