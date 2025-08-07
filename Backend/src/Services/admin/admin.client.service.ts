import { IPersonalizationRepository } from "@/core/interface/repositories/IPersonalization.repository";
import { IUserRepository } from "@/core/interface/repositories/IUser.repository";
import { IAdminClientService } from "@/core/interface/services/admin/IAdmin.Clinet.Service";

export class AdminClientService implements IAdminClientService {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _personalizationRepository: IPersonalizationRepository
  ) {}
  placeholder?: never;

  async getAllClinets(statusFilter: string, searchTerm: string, page: number, limit: number) {
    const data =  await this._userRepository.getAllClientFilter(page,limit,statusFilter,searchTerm);
    console.log(data);
    return data;
  }
}