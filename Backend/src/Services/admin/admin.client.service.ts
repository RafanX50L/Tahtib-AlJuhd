import { IGetAllClientFilterResponse, IUserRepository } from "@/core/interface/repositories/IUser.repository";
import { IAdminClientService } from "@/core/interface/services/admin/IAdmin.Clinet.Service";

export class AdminClientService implements IAdminClientService {
  constructor(
    private readonly _userRepository: IUserRepository,
  ) {}
  placeholder?: never;

  async getAllClients(statusFilter: string, searchTerm: string, page: number, limit: number):Promise<IGetAllClientFilterResponse> {
    const data =  await this._userRepository.getAllClientFilter(page,limit,statusFilter,searchTerm);
    return data;
  }
}