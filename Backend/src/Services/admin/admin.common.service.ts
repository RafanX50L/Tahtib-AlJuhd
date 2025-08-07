import { IUserRepository } from "@/core/interface/repositories/IUser.repository";
import { IAdminCommonService } from "@/core/interface/services/admin/IAdmin.Common.Service";

export class AdminCommonService implements IAdminCommonService{
    constructor(
        private readonly _userRepository: IUserRepository,
    ) {}
    placeholder?:never;
    async blockOrUnblock(userId: string): Promise<void> {
        await this._userRepository.blockOrUnblockUser(userId);
    }
}