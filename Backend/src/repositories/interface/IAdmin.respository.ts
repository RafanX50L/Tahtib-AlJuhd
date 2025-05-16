export interface IAdminRepository {
    findAllClientsWithPersonalization():Promise< any>;
    updateStatusWithId(id:string,status:string):Promise<any>;
    findAllTrainersWithPersonalization():Promise<any>;
    IsBlocked(id:string):Promise<boolean>;
}