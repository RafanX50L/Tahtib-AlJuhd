import { IGetAllClientFilterResponse } from "../../repositories/IUser.repository";

export interface IAdminClientService {
    placeholder?: never
    getAllClients(statusFilter:string,searchTerm:string, page:number, limit:number):Promise<IGetAllClientFilterResponse>;
}