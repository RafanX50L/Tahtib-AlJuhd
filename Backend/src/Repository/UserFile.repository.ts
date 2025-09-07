import { IUserFile } from "@/core/interface/model/IUserFile.model";
import { BaseRepository } from "./base.repository";
import { UserFileModel } from "@/models/UserFile.model";
import { IUserFileRepository } from "@/core/interface/repositories/IUserFile.repository";

export class UserFileRepository
  extends BaseRepository<IUserFile>
  implements IUserFileRepository
{
  constructor() {
    super(UserFileModel);
  }
  async findLatestProfilePicture(userId: string) {
    return await this.model
      .findOne({
        userId: userId,
        purpose: "profilePhoto",
      })
      .sort({ createdAt: -1 });
  }
}
